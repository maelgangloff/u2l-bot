import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { BU, Multi } from 'univ-lorraine-api'
import { Command } from '../../Command'

export const AffluenceBU: Command = {
  name: 'bu',
  description: 'Affluences en BU',
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
      await interaction.reply({
        embeds: [
          new EmbedBuilder({
            color: 0x52adc4,
            author: {
              name: 'mULti',
              icon_url: 'https://multi.univ-lorraine.fr/img/affluences.png',
              url: 'https://multi.univ-lorraine.fr/affluences'
            },
            title: `📚 ${affluence.site_name}`,
            description: 'Affluences en BU',
            fields: [
              {
                name: "Taux d'occupation:",
                value: affluence.progress !== -1 ? `**${affluence.progress}%**` : '**Indisponible**',
                inline: true
              },
              {
                name: 'État:',
                value: affluence.current_state.localized_state,
                inline: true
              }
            ],
            footer: {
              text: 'Source: webapi.affluences.com'
            },
            timestamp: new Date()
          })
        ],
        ephemeral: true
      })
    } catch (e: any) {
      await interaction.reply({
        ephemeral: true,
        content: '❌ ' + e.message ?? 'Erreur'
      })
    }
  }
}
