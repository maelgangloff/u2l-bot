import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder } from 'discord.js'
import { Command } from '../Command'

export const Help: Command = {
  name: 'help',
  description: "Mode d'emploi de U2L Bot",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    await interaction.reply({
      ephemeral: true,
      embeds: [
        new EmbedBuilder({
          author: {
            name: 'U2L Bot',
            icon_url: 'https://multi.univ-lorraine.fr/img/ul-logo-mini.png',
            url: 'https://github.com/maelgangloff/u2l-bot'
          },
          title: "Mode d'emploi",
          description: '',
          fields: [
            {
              name: '',
              value: `Salut toi !
Je suis **U2L Bot**, un bot Discord permettant d'accéder à certaines ressources (de l'Université de Lorraine).

Pour intéragir avec moi, tu peux utiliser les slash commands:`
            },
            { name: '', value: '📚  **/bu** : Affluence des Bibliothèques' },
            { name: '', value: "🍔  **/ru** : Menus des Résto U' du Crous Lorraine" },
            { name: '', value: "📖  **/annuaire** : Infos sur un personnel dans l'Annuaire" },
            { name: '', value: '🚌  **/stan** : Prochains passages du réseau Stan' },
            { name: '', value: '⛅  **/meteo** : La météo en temps réel' },
            { name: '', value: "😃  **/help** : Afficher l'aide" },
            {
              name: '', value: `Développé avec amour ❤️ par <@357508678783336459> maelgangloff#1907
            Ce bot est open-source: <https://github.com/maelgangloff/u2l-bot>`
            }
          ]
        })
      ]
    })
  }
}
