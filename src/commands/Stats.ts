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

      const totalUsage = (await queryApi.collectRows<{result: string, table: number, _value: number}>(`from(bucket: "${INFLUXDB_BUCKET}") |> range(start: 0)
      |> filter(fn: (r) => r["_measurement"] == "U2L_BOT__COMMAND_USED")
      |> count() |> group() |> unique(column: "command") |> sum()`))[0]._value

      const localUsage = (await queryApi.collectRows<any>(`from(bucket: "${INFLUXDB_BUCKET}") |> range(start: 0)
      |> filter(fn: (r) => r["_measurement"] == "U2L_BOT__COMMAND_USED")
      |> filter(fn: (r) => r["_value"] == "${interaction.guildId}")
      |> count()
      |> group()
      |> sum()`))[0]?._value as number | undefined

      const fields = []
      if (totalUsage) fields.push({ name: ':mouse_three_button: Intéractions totales', value: `**${totalUsage}**`, inline: true })
      if (localUsage) fields.push({ name: ':mouse_three_button: Intéractions sur ce serveur', value: `**${localUsage}**`, inline: true })

      await interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder({
            color: 0xd30971,
            author: {
              name: 'U2L Bot',
              icon_url: 'https://multi.univ-lorraine.fr/img/ul-logo-mini.png',
              url: 'https://github.com/maelgangloff/u2l-bot'
            },
            title: ':chart_with_upwards_trend: Statistiques',
            description: "Les statistiques d'utilisation du Bot",
            fields,
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
