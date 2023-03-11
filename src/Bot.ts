import { Client } from 'discord.js'
import interactionCreate from './listeners/InteractionCreate'
import ready from './listeners/ready'
import dotenv from 'dotenv'

dotenv.config()

console.log('Bot is starting...')

const client = new Client({
  intents: []
})

ready(client)
interactionCreate(client)

client.login(process.env.DISCORD_BOT_TOKEN)
