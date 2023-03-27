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
    },
    {
      name: 'autre',
      description: 'Voir les passages des autres lignes',
      type: ApplicationCommandOptionType.Boolean,
      required: false
    }
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const nomLigne = interaction.options.get('ligne')?.value as string
      const nomArret = interaction.options.get('arret')?.value as string
      const autresPassages = interaction.options.get('autre')?.value ? true : false

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
            title: '🚏 ' + arret.libelle + (!autresPassages ? (' | Ligne ' + ligne.numlignepublic) : ''),
            description: 'Les prochains passages du réseau de transport STAN',
            fields: (await Stan.getProchainsPassages(autresPassages ? ({osmid: arret.osmid}) : arret)).sort((p1, p2) => p1.temps_min-p2.temps_min).map(passage => ({
              name: `${passage.temps_min === 0 ? '🚍' : (passage.arret.ligne?.numlignepublic === 'T3' ? '🚎' : '🚌')} Ligne ${passage.arret.ligne?.numlignepublic} >> ${passage.direction}`,
              value: passage.temps_min === 0 ? '**Arrivée imminente**' : `Temps: **${Math.trunc(passage.temps_min / 60) === 0 ? '' : (Math.trunc(passage.temps_min / 60) + ' h ')}${passage.temps_min % 60} min${passage.temps_theorique ? ' (théorique)' : ''}**`
            })),
            thumbnail: {
              url: !autresPassages ? ('https://www.reseau-stan.com/typo3conf/ext/kg_package/Resources/Public/images/pictolignes/' + ligne.numlignepublic + '.png') : 'https://www.reseau-stan.com/typo3conf/ext/kg_package/Resources/Public/images/stan.png'
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
