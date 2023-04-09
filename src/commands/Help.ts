import { CommandInteraction, Client, ApplicationCommandType } from 'discord.js'
import { Command } from '../Command'

export const Help: Command = {
  name: 'help',
  description: 'Infos sur U2L Bot',
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = `Salut toi !
Je suis **U2L Bot**, un bot Discord permettant d'accéder à certaines ressources (de l'Université de Lorraine).

Pour intéragir avec moi, tu peux utiliser les slash commands:
- **/bu** : Affluence des Bibliothèques 📚
- **/ru** : Menus des Résto U' du Crous Lorraine 🍔
- **/annuaire** : Infos sur un personnel dans l'Annuaire 📖
- **/stan** : Prochains passages du réseau Stan 🚌
- **/meteo** : La météo en temps réel ⛅

Développé avec amour par <@357508678783336459> maelgangloff#1907
Ce bot est open-source: https://github.com/maelgangloff/u2l-bot`
    await interaction.reply({
      ephemeral: true,
      content
    })
  }
}
