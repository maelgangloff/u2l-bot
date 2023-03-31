import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import { Command } from '../../Command'
import { Stan } from 'stan-api'
import { Passage } from 'stan-api/types/Ligne/Passage'
import { Arret } from 'stan-api/types/Ligne/Arret'

export const ProchainsPassages: Command = {
  name: 'stan',
  description: 'Les prochains passages du réseau STAN',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'arret',
      description: "Le nom d'un arrêt (Place de Londres, ...)",
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'ligne',
      description: "Le nom d'une ligne (T2, T3, Corol, ...)",
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const nomLigne = interaction.options.get('ligne')?.value as string | undefined
      const nomArret = interaction.options.get('arret')?.value as string

      let arret: (Partial<Arret> & {osmid: string, libelle: string}) | undefined
      if (nomLigne !== undefined) {
        const ligne = (await Stan.getLignes()).find(l => l.numlignepublic.trim().toLowerCase() === nomLigne.trim().toLowerCase())
        if (!ligne) throw new Error("Aucune ligne correspondante n'a été trouvée.")

        arret = (await Stan.getArrets(ligne)).find(a => a.libelle.toLowerCase().includes(nomArret.toLowerCase()))
      } else {
        const arrets = await Stan.getArretOsmid(nomArret)
        if (!arrets.length) throw new Error('Pas de résultat pour cette recherche.')
        arret = arrets[0]
      }
      if (!arret) throw new Error("Aucun arrêt correspondant n'a été trouvé.")

      arret = arret.osmid.startsWith('stop_area') ? { ...arret, osmid: arret.osmid } : arret

      const passages = (await Stan.getProchainsPassages(arret)).sort((p1, p2) => p1.temps_min - p2.temps_min).reduce((rv: {[key: string]: Passage[]}, p: Passage) => {
        const ligne = p.arret.ligne?.numlignepublic as string
        (rv[ligne] = rv[ligne] || []).push(p)
        return rv
      }, {}) as {[key: string]: Passage[]}

      if (Object.keys(passages).length === 0) throw new Error("Aucun prochain passage n'est prévu.")

      await interaction.followUp({
        embeds: await Promise.all(Object.entries(passages).map(async ([key, val]) => new EmbedBuilder({
          color: 0x03bacf,
          author: {
            name: 'Stan',
            icon_url: 'https://www.reseau-stan.com/fileadmin/user_upload/store-icon.png',
            url: 'https://www.reseau-stan.com'
          },
          title: '🚏 ' + arret?.libelle + ' | Ligne ' + key,
          description: 'Les prochains passages du réseau de transport STAN',
          fields: val.map(passage => ({
            name: `${passage.temps_min === 0 ? '🚍' : (passage.arret.ligne?.numlignepublic === 'T3' ? '🚎' : '🚌')} ${passage.direction}`,
            value: passage.temps_min === 0 ? '**Arrivée imminente**' : `Temps: **${Math.trunc(passage.temps_min / 60) === 0 ? '' : (Math.trunc(passage.temps_min / 60) + ' h ')}${passage.temps_min % 60} min${passage.temps_theorique ? ' (théorique)' : ''}**`
          })),
          thumbnail: {
            url: 'https://www.reseau-stan.com/typo3conf/ext/kg_package/Resources/Public/images/pictolignes/' + key + '.png'
          },
          footer: {
            text: 'Source: www.reseau-stan.com'
          },
          timestamp: new Date()
        })))
      })
    } catch (e: any) {
      return await interaction.followUp({
        ephemeral: true,
        content: '❌ ' + e.message ?? 'Erreur'
      })
    }
  }
}
