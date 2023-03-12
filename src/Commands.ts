import { Command } from './Command'
import { Hello } from './commands/Hello'
import { AffluenceBU } from './commands/mULti/AffluenceBU'
import { CurrentUser } from './commands/mULti/CurrentUser'
import dotenv from 'dotenv'
import { CrousMenu } from './commands/mULti/CrousMenu'
import { Factuel } from './commands/mULti/Factuel'
dotenv.config()

const CommandLoginRequired: Command[] = [CurrentUser]
const CommandLoginNotRequired: Command[] = [Hello, AffluenceBU, CrousMenu, Factuel]

const withAuth = process.env.U2L_USERNAME && process.env.U2L_PASSWORD
export const Commands: Command[] = withAuth ? [...CommandLoginNotRequired, ...CommandLoginRequired] : CommandLoginNotRequired
