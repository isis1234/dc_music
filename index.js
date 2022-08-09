require("dotenv").config()
const { Client, GatewayIntentBits } = require('discord.js')

const TOKEN = process.env.BOT_TOKEN
const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID

const bot = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates ] })
bot.login(TOKEN)
  .then((x) => {
    console.log(`${bot.user.username}#${bot.user.discriminator} started`)
  })

// Init Command
require("./init")(bot, BOT_CLIENT_ID, TOKEN)

// Command /ping listener
require("./ping")(bot, BOT_CLIENT_ID, TOKEN)

// Command /music listener
require("./music")(bot, BOT_CLIENT_ID, TOKEN)