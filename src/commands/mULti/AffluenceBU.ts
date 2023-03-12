import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { BU, Multi } from 'univ-lorraine-api'
import { Command } from '../../Command'

export const AffluenceBU: Command = {
  name: 'affluence-bu',
  description: "Infos sur l'occupation d'une BU",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'bu',
      required: true,
      description: 'Le nom de la BU',
      type: ApplicationCommandOptionType.String,
      choices: Object.keys(BU).map(name => ({ name, value: BU[name as keyof typeof BU] }))
    }
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const bu = interaction.options.get('bu')?.value as BU
      const affluence = await Multi.getAffluenceBU(bu)
      await interaction.followUp({
        embeds: [
          new EmbedBuilder({
            color: 0x0099FF,
            author: {
              name: 'mULti',
              icon_url: 'https://multi.univ-lorraine.fr/img/affluences.png',
              url: 'https://multi.univ-lorraine.fr/affluences'
            },
            title: `📚 ${affluence.site_name}`,
            description: "Taux d'occupation de la BU",
            fields: [
              {
                name: 'État actuel:',
                value: affluence.current_state.localized_state,
                inline: true
              }
            ],
            footer: {
              text: 'Source: webapi.affluences.com'
            },
            timestamp: new Date()
          })
        ]
      })
    } catch (e) {
      await interaction.followUp({
        ephemeral: true,
        content: '❌ Erreur...'
      })
    }
  }
}
