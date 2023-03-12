import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder } from 'discord.js'
import { Command } from '../../Command'
import { Multi } from 'univ-lorraine-api'


export const Factuel: Command = {
  name: 'factuel',
  description: "L'info de l'Université de Lorraine",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const news = await Multi.getFactuel()
      await interaction.followUp({
        embeds: [
          new EmbedBuilder({
            color: 0x0099FF,
            author: {
              name: 'mULti',
              icon_url: 'https://multi.univ-lorraine.fr/img/ul-logo-mini.png',
              url: 'https://multi.univ-lorraine.fr/home'
            },
            title: `🔔 FactUeL`,
            description: "L'info de l'Université de Lorraine",
            fields: news.map(n => ({name: n.title, value: `${n.description} | ${n.date.split('T')[0]}`})),
            footer: {
              text: 'Source: multi.univ-lorraine.fr'
            },
            timestamp: new Date()
          })
        ]
      })
    } catch (e) {
      return await interaction.followUp({
        ephemeral: true,
        content: '❌ Erreur...'
      })
    }
  }
}
