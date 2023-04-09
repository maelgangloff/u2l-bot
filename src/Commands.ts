import { Command } from './Command'
import { Help } from './commands/Help'
import { AffluenceBU } from './commands/mULti/AffluenceBU'
import { CurrentUser } from './commands/mULti/CurrentUser'
import dotenv from 'dotenv'
import { CrousMenu } from './commands/mULti/CrousMenu'
import { Factuel } from './commands/mULti/Factuel'
import { AnnuaireCommand } from './commands/Annuaire/Annuaire'
import { ProchainsPassages } from './commands/Stan/ProchainsPassages'
import { MeteoCommand } from './commands/Meteo/Meteo'
dotenv.config()

const CommandLoginRequired: Command[] = [CurrentUser]
const CommandLoginNotRequired: Command[] = [Help, AffluenceBU, CrousMenu, Factuel, AnnuaireCommand, ProchainsPassages]

const commandes: Command[] = CommandLoginNotRequired
if (process.env.U2L_USERNAME && process.env.U2L_PASSWORD) commandes.push(...CommandLoginRequired)
if (process.env.OPENWEATHERMAP_KEY) commandes.push(MeteoCommand)

export const Commands = commandes
