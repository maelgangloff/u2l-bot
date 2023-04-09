import { CommandInteraction, Client, Interaction } from 'discord.js'
import { Commands } from '../Commands'

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

  console.log(`${Date.now()},${interaction.guild?.id},${interaction.user?.id},${interaction.user?.tag}`)
}
