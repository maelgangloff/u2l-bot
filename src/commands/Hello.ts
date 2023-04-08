import { CommandInteraction, Client, ApplicationCommandType } from 'discord.js'
import { Command } from '../Command'

export const Hello: Command = {
  name: 'salut',
  description: 'Dire bonjour',
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = `Salut toi !
Je suis **U2L-Bot**, un bot discord permettant d'accéder à certaines ressources de l'Université de Lorraine.

Pour intéragir avec moi, tu peux utiliser les slash commands:
  - **/bu**: S'informer sur l'affluence des Bibliothèques 📚
  - **/ru**: Consulter les menus des Résto U' du Crous Lorraine :tropical_drink:
  - **/annuaire**: Rechercher un personnel dans l'Annuaire 📖
  - **/stan**: Les prochains passages du réseau Stan 🚌

Conçu avec amour par maelgangloff#1907
Ce bot est open-source: https://github.com/maelgangloff/u2l-bot
`
    await interaction.followUp({
      ephemeral: true,
      content
    })
  }
}
