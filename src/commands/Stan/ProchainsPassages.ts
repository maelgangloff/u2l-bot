import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import { Command } from '../../Command'
import { Stan } from 'stan-api'

export const ProchainsPassages: Command = {
  name: 'stan',
  description: 'Les prochains passages du réseau STAN',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'ligne',
      description: "Le nom d'une ligne (T2, T3, Corol, ...)",
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'arret',
      description: "Le nom d'un arrêt (Place de Londres, ...)",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const nomLigne = interaction.options.get('ligne')?.value as string
      const nomArret = interaction.options.get('arret')?.value as string

      const ligne = (await Stan.getLignes()).find(l => l.numlignepublic.trim().toLowerCase() === nomLigne.trim().toLowerCase())
      if (!ligne) throw new Error("Aucune ligne correspondante n'a été trouvée.")

      const arret = (await Stan.getArrets(ligne)).find(a => a.libelle.toLowerCase().includes(nomArret.toLowerCase()))
      if (!arret) throw new Error("Aucun arrêt correspondant n'a été trouvé.")

      await interaction.followUp({
        embeds: [
          new EmbedBuilder({
            color: 0x00aeca,
            author: {
              name: 'Stan',
              icon_url: 'https://www.reseau-stan.com/fileadmin/user_upload/store-icon.png',
              url: 'https://www.reseau-stan.com'
            },
            title: '🚌 ' + arret.libelle,
            description: 'Les prochains passages du réseau de transport STAN',
            fields: (await Stan.getProchainsPassages(arret as any)).map(passage => ({
              name: passage.direction,
              value: `Temps: ${Math.trunc(passage.temps_min / 60) === 0 ? '' : (Math.trunc(passage.temps_min / 60) + ' H')}${passage.temps_min % 60} min`
            })),
            thumbnail: {
              url: 'https://www.reseau-stan.com/typo3conf/ext/kg_package/Resources/Public/images/pictolignes/' + ligne.numlignepublic + '.png'
            },
            footer: {
              text: 'Source: www.reseau-stan.com'
            },
            timestamp: new Date()
          })
        ]
      })
    } catch (e: any) {
      return await interaction.followUp({
        ephemeral: true,
        content: '❌ ' + e.message ?? 'Erreur'
      })
    }
  }
}
