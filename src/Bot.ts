import { ActivityType, Client } from 'discord.js'
import interactionCreate from './listeners/InteractionCreate'
import ready from './listeners/ready'
import dotenv from 'dotenv'

dotenv.config()

console.log('Bot is starting...')

const client = new Client({
  intents: [],
  presence: {
    status: 'online',
    activities: [{ name: 'vous observer...', type: ActivityType.Playing }]
  }
})

ready(client)
interactionCreate(client)

client.login(process.env.DISCORD_BOT_TOKEN)
