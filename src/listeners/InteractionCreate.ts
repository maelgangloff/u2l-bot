import { CommandInteraction, Client, Interaction } from 'discord.js'
import { Commands } from '../Commands'
import dotenv from 'dotenv'
import { InfluxDB, Point } from '@influxdata/influxdb-client'

dotenv.config()

const {
  INFLUXDB_TOKEN,
  INFLUXDB_URL,
  INFLUXDB_ORG,
  INFLUXDB_BUCKET
} = process.env

export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction)
    }
  })
}

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  const slashCommand = Commands.find(c => c.name === interaction.commandName)
  if (!slashCommand) {
    interaction.reply({ content: '❌ Une erreur est survenue...' })
    return
  }
  slashCommand.run(client, interaction)
  const pointData = {
    commandName: interaction.commandName,
    guildID: interaction.guild?.id,
    userID: interaction.user.id,
    userTag: interaction.user.tag,
    channelID: interaction.channelId,
    applicationID: interaction.applicationId,
    timestamp: interaction.createdTimestamp
  }
  console.log(`LOG(${pointData.applicationID}/${pointData.commandName}): ${pointData.timestamp},${pointData.guildID},${pointData.userID},${pointData.userTag},${pointData.channelID}`)

  if (INFLUXDB_TOKEN && INFLUXDB_URL && INFLUXDB_ORG && INFLUXDB_BUCKET && !['stats', 'help'].includes(pointData.commandName)) {
    try {
      const writeApi = new InfluxDB({
        url: INFLUXDB_URL,
        token: INFLUXDB_TOKEN
      }).getWriteApi(INFLUXDB_ORG, INFLUXDB_BUCKET)

      writeApi.writePoint(new Point('U2L_BOT__COMMAND_USED')
        .stringField('guild', pointData.guildID)
        .stringField('user_id', pointData.userID)
        .stringField('user_tag', pointData.userTag)
        .stringField('channel_id', pointData.channelID)
        .tag('command', pointData.commandName)
        .tag('application_id', pointData.applicationID)
        .timestamp(new Date(pointData.timestamp))
      )
      await writeApi.close()
    } catch (e) {
      console.error('ERRROR(DB): Erreur lors de la communication avec la DB.')
    }
  }
}
