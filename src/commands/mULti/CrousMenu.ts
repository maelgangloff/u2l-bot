import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { Multi } from 'univ-lorraine-api'
import { Command } from '../../Command'
import restos from './restos.json'

export const CrousMenu: Command = {
  name: 'ru',
  description: "Les menus des Restos U'",
  options: [
    {
      name: 'ru',
      required: true,
      description: "Le Resto U'",
      type: ApplicationCommandOptionType.String,
      choices: restos
    },
    {
      name: 'time',
      required: false,
      description: 'Midi/Soir',
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: 'Midi',
          value: 'MIDI'
        },
        {
          name: 'Soir',
          value: 'SOIR'
        }
      ]
    },
    {
      name: 'date',
      required: false,
      description: 'Date',
      type: ApplicationCommandOptionType.String
    }
  ],
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const ru = interaction.options.get('ru')?.value
      const date = new Date((interaction.options.get('date')?.value ?? Date.now()) as string|number)
      const time = (interaction.options.get('time')?.value ?? (new Date().getHours() <= 14 ? 'MIDI' : 'SOIR')) as string

      const resto = (await Multi.getCROUSmenu()).find(resto => resto.title === ru)
      if (!resto) throw new Error("Ce RU n'existe pas.")
      const dateFormatted = date.toISOString().split('T')[0]
      const menu = resto.menus.find(menu => menu.date === dateFormatted)
      if (!menu) throw new Error(`Pas de menu disponible pour le ${new Date(dateFormatted).toLocaleDateString('fr')}.`)
      const meal = menu.meal.find(meal => meal.name.toUpperCase() === time)
      if (!meal) throw new Error(`Pas de menu disponible pour le ${time.toLowerCase()}.`)

      await interaction.reply({
        embeds: [new EmbedBuilder({
          color: 0xe4010b,
          author: {
            name: 'mULti',
            icon_url: 'https://multi.univ-lorraine.fr/img/crous.png',
            url: 'https://multi.univ-lorraine.fr/crous'
          },
          thumbnail: {
            url: resto.thumbnail_url
          },
          title: `🍔 ${resto.title} | ${date.toLocaleDateString('fr')} le ${meal.name.toUpperCase()}`,
          description: resto.short_desc,
          fields: meal.foodcategory.map(fc => ({ name: fc.name, value: fc.dishes.map(d => d.name).join(' - ') })),
          footer: {
            text: 'Source: multi.univ-lorraine.fr'
          },
          timestamp: new Date()
        })]
      })
    } catch (e: any) {
      await interaction.reply({
        ephemeral: true,
        content: '❌ ' + e.message ?? 'Erreur'
      })
    }
  }
}
