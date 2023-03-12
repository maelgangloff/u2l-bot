import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { Multi } from 'univ-lorraine-api'
import { Command } from '../../Command'

export const CrousMenu: Command = {
  name: 'crous-menu',
  description: "Les menus des Restos U'",
  options: [
    {
      name: 'ru',
      required: true,
      description: "Le Resto U'",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: 'Brabois',
          value: '(S)pace Brabois'
        },
        {
          name: 'Cours Léopold',
          value: "Resto U' Cours Léopold"
        },
        {
          name: 'Médreville',
          value: "Resto U' Médreville"
        },
        {
          name: 'Saurupt',
          value: "Resto U' Saurupt"
        },
        {
          name: 'Stanislas-Meurthe',
          value: "Resto U' Stanislas-Meurthe"
        },
        {
          name: 'Vélodrome',
          value: "Resto U' Vélodrome"
        },
        {
          name: 'Bridoux',
          value: "Resto U' Bridoux"
        },
        {
          name: 'Rimbaud',
          value: "Market' Rimbaud"
        },
        {
          name: 'Technopôle',
          value: "Resto U' Technopôle"
        },
        {
          name: 'Verlaine',
          value: "Resto U' Verlaine"
        },
        {
          name: 'Campus Fibres',
          value: "Resto U' Campus Fibres"
        },
        {
          name: 'La Louvière',
          value: "Resto U' La Louvière"
        },
        {
          name: 'Jean Monnet',
          value: "Resto U' Jean Monnet"
        },
        {
          name: 'Cormontaigne',
          value: "Resto U' Cormontaigne"
        },
        {
          name: "Metz'In",
          value: "Resto U' Metz'In"
        },
        {
          name: 'Artem',
          value: '(S)pace Artem'
        },
        {
          name: 'CentraleSupélec',
          value: "Resto U' CentraleSupélec"
        },
        {
          name: "Charle'Miam",
          value: "Cafet' Charle'Miam"
        },
        {
          name: 'Boudonville',
          value: "Market' Boudonville"
        }
      ]
    },
    {
      name: 'time',
      required: true,
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
      const date = interaction.options.get('date')?.value as string|undefined
      const time = interaction.options.get('time')?.value as string ?? ''

      const resto = (await Multi.getCROUSmenu()).find(resto => resto.title === ru)
      if (!resto) throw new Error("Ce RU n'existe pas.")
      const menu = resto.menus.find(menu => menu.date === new Date(date || Date.now()).toISOString().split('T')[0])
      if (!menu) throw new Error('Pas de menu à cette date.')
      const meal = menu.meal.find(meal => meal.name.toUpperCase() === time)
      if (!meal) throw new Error('Pas de menu à cette heure.')

      await interaction.followUp({
        embeds: [new EmbedBuilder({
          color: 0x0099FF,
          author: {
            name: 'mULti',
            icon_url: 'https://multi.univ-lorraine.fr/img/crous.png',
            url: 'https://multi.univ-lorraine.fr/crous'
          },
          title: `${resto.title} | ${menu.date} ${meal.name}`,
          description: resto.short_desc,
          fields: meal.foodcategory.map(fc => ({ name: fc.name, value: fc.dishes.map(d => d.name).join(' - ') })),
          footer: {
            text: 'Source: multi.univ-lorraine.fr'
          },
          timestamp: new Date()
        })]
      })
    } catch (e: any) {
      await interaction.followUp({
        ephemeral: true,
        content: '❌ ' + e.message ?? 'Erreur'
      })
    }
  }
}
