import { CommandInteraction, Client, ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import { Command } from '../../Command'
import axios from 'axios'
import qs from 'querystring'

import dotenv from 'dotenv'
import { MeteoResponse } from './MeteoResponse'
dotenv.config()

export const MeteoCommand: Command = {
  name: 'meteo',
  description: 'La météo en temps réel',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'ville',
      description: 'Ville',
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)
    const ville = (interaction.options.get('ville')?.value ?? 'Nancy') as string
    try {
      const meteo = (await axios.get<MeteoResponse>('https://api.openweathermap.org/data/2.5/weather?' + qs.stringify({
        appid: process.env.OPENWEATHERMAP_KEY,
        units: 'metric',
        lang: 'fr',
        q: ville
      }))).data

      await interaction.reply({
        embeds: [
          new EmbedBuilder({
            color: 0xa578b2,
            author: {
              name: 'Météo',
              icon_url: 'https://openweathermap.org/img/wn/03d.png',
              url: 'https://openweathermap.org/'
            },
            title: `⛅ Météo à ${ville} : ${capitalizeFirstLetter(meteo.weather[0]?.description ?? '')}`,
            description: 'La météo en temps réel',
            fields: [
              {
                name: 'Température actuelle',
                value: `**${meteo.main.temp.toFixed(2)} °C**`,
                inline: true
              },
              {
                name: 'Température min',
                value: `**${meteo.main.temp_min.toFixed(2)} °C**`,
                inline: true
              },
              {
                name: 'Température max',
                value: `**${meteo.main.temp_max.toFixed(2)} °C**`,
                inline: true
              },
              {
                name: 'Hygrométrie',
                value: `**${meteo.main.humidity} %**`,
                inline: true
              },
              {
                name: 'Pression',
                value: `**${meteo.main.pressure} hPa**`,
                inline: true
              },
              {
                name: 'Vent',
                value: `Vitesse de **${meteo.wind.speed} m/s** orienté de **${meteo.wind.deg}°**`,
                inline: false
              },
              {
                name: 'Lever et coucher de soleil',
                value: `Lever à **${new Date(meteo.sys.sunrise * 1e3).toLocaleTimeString('fr-FR').slice(0, -3)}** et coucher à **${new Date(meteo.sys.sunset * 1e3).toLocaleTimeString('fr-FR').slice(0, -3)}**`
              }
            ],
            footer: {
              text: `Source: openweathermap.org | ${meteo.base}`
            },
            thumbnail: {
              url: `https://openweathermap.org/img/wn/${meteo.weather[0]?.icon}@2x.png`
            },
            timestamp: new Date(meteo.dt * 1e3)
          })
        ],
        ephemeral: true
      })
    } catch (e: any) {
      return await interaction.reply({
        ephemeral: true,
        content: '❌ ' + e.message ?? 'Erreur'
      })
    }
  }
}
