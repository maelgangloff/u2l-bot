import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import { Command } from '../../Command'
import { Multi } from 'univ-lorraine-api'

export const Factuel: Command = {
  name: 'factuel',
  description: "L'info de l'Université de Lorraine",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'nombre',
      description: "Nombre d'articles à afficher",
      type: ApplicationCommandOptionType.Integer,
      min_value: 1,
      required: false
    }
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const length = (interaction.options.get('nombre')?.value ?? 3) as number

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
            title: '🔔 FactUeL',
            description: "L'info de l'Université de Lorraine",
            fields: news.map(n => ({ name: n.title, value: `${n.description} | ${n.date.split('T')[0]}` })).slice(0, length),
            footer: {
              text: 'Source: multi.univ-lorraine.fr'
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
