import { CommandInteraction, Client, ApplicationCommandType } from 'discord.js'
import { Command } from '../../Command'
import { Utilisateur, Service } from 'univ-lorraine-api'

import dotenv from 'dotenv'
dotenv.config()

const { U2L_USERNAME, U2L_PASSWORD } = process.env

export const CurrentUser: Command = {
  name: 'current-user',
  description: 'Utilisateur connecté',
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const service = Service.MULTI
      const user = await Utilisateur.serviceValidate(service, await new Utilisateur(U2L_USERNAME ?? '', U2L_PASSWORD ?? '').getTicket(service))
      await interaction.followUp({
        ephemeral: false,
        content: `Connecté en tant que: **${user['cas:attributes']['cas:displayname']} <${user['cas:attributes']['cas:mail']}>**`
      })
    } catch (e) {
      return await interaction.followUp({
        ephemeral: true,
        content: '❌ Erreur...'
      })
    }
  }
}
