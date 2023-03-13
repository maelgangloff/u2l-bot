import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, Attachment } from 'discord.js'
import { Command } from '../../Command'
import { Annuaire, decryptData, Item } from 'univ-lorraine-api'

export const AnnuaireCommand: Command = {
  name: 'annuaire',
  description: "Rechercher qualqu'un dans l'annuaire",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'nom',
      description: 'Nom/Prénom/Téléphone',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'vacataire',
      description: 'Inclure les vacataires',
      type: ApplicationCommandOptionType.Boolean,
      required: false
    }
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const valeur = interaction.options.get('nom')?.value as string
      const withVac = (interaction.options.get('vacataire')?.value as boolean | undefined) ?? false

      const results = await Annuaire.getLdapSearch(valeur, undefined, withVac)
      const items = results.items as Item[]
      const activite = items.length === 1 ? await Annuaire.getActivite(items[0].empid) : null
      const photo = items.length === 1 ? (await Annuaire.getPhoto(items[0].empid)).url : null

      await interaction.followUp({
        embeds: [
          new EmbedBuilder({
            color: 0x0099FF,
            author: {
              name: 'Annuaire',
              icon_url: 'https://multi.univ-lorraine.fr/img/annuaire.png',
              url: 'https://annuaire-web.univ-lorraine.fr/'
            },
            title: '📖 Annuaire',
            description: "L'annuaire de l'Université de Lorraine",
            fields: items.length === 1
              ? [
                  {
                    name: 'Nom',
                    value: items[0].displayName,
                    inline: true
                  },
                  {
                    name: 'Courriel',
                    value: decryptData(items[0].mail) ?? 'Pas de courriel',
                    inline: true
                  },
                  {
                    name: 'Téléphone',
                    value: decryptData(items[0].telephone) ?? 'Pas de téléphone',
                    inline: true
                  },
                  {
                    name: 'Fonction',
                    value: items[0].bcShortLabel,
                    inline: true
                  },
                  {
                    name: 'Affectation',
                    value: items[0].affectation,
                    inline: true
                  },
                  {
                    name: 'Activité principale',
                    value: activite?.text ?? '---',
                    inline: true
                  }
                ]
              : items.map(item => ({
                name: item.displayName,
                value: item.affectation
              })),
            url: items.length === 1 ? decryptData(items[0].urlLink) ?? '' : '',
            footer: {
              text: 'Source: annuaire-web.univ-lorraine.fr'
            },
            thumbnail: photo
              ? {
                  url: 'attachment://photo.jpg'
                }
              : undefined,
            timestamp: new Date()
          })
        ],
        files: photo
          ? [
              {
                attachment: Buffer.from(photo.split(',')[1] as string, 'base64'),
                name: 'photo.jpg'
              }
            ]
          : []
      })
    } catch (e: any) {
      return await interaction.followUp({
        ephemeral: true,
        content: '❌ Erreur...' + e.message
      })
    }
  }
}
