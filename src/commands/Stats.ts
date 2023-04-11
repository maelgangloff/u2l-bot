import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder } from 'discord.js'
import { Command } from '../Command'
import { InfluxDB } from '@influxdata/influxdb-client'

const {
  INFLUXDB_TOKEN,
  INFLUXDB_URL,
  INFLUXDB_ORG,
  INFLUXDB_BUCKET
} = process.env

export const StatsCommand: Command = {
  name: 'stats',
  description: "Statistiques d'utilisation du Bot",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const queryApi = new InfluxDB({
        url: INFLUXDB_URL as string,
        token: INFLUXDB_TOKEN as string
      }).getQueryApi(INFLUXDB_ORG as string)

      const query = `from(bucket: "${INFLUXDB_BUCKET}") |> range(start: 0)
|> filter(fn: (r) => r["_measurement"] == "U2L_BOT__COMMAND_USED")
|> count() |> group() |> unique(column: "command") |> sum()`

      const totalUsage = (await queryApi.collectRows<{result: string, table: number, _value: number}>(query))[0]._value

      await interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder({
            color: 0xd30971,
            author: {
              name: 'Stats',
              icon_url: 'https://multi.univ-lorraine.fr/img/ul-logo-mini.png',
              url: 'https://github.com/maelgangloff/u2l-bot'
            },
            title: ':chart_with_upwards_trend: Statistiques',
            description: "Les statistiques d'utilisation du Bot",
            fields: [
              { name: ':mouse_three_button: Intéractions', value: `**${totalUsage}**`, inline: true }
            ],
            footer: {
              text: 'Source: Base de données InfluxDB'
            },
            timestamp: new Date()
          })
        ]
      })
    } catch (e: any) {
      return await interaction.reply({
        ephemeral: true,
        content: '❌ ' + e.message ?? 'Erreur'
      })
    }
  }
}
