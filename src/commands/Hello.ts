import { CommandInteraction, Client, ApplicationCommandType } from 'discord.js'
import { Command } from '../Command'

export const Hello: Command = {
  name: 'salut',
  description: 'Dire bonjour',
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = 'Salut tout le monde !'

    await interaction.followUp({
      ephemeral: true,
      content
    })
  }
}
