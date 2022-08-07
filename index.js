require("dotenv").config()
const ytdl = require('ytdl-core')
const Discord = require('discord.js')
const Music = require("./Music")

const TOKEN = process.env.BOT_TOKEN
const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID

const { Client, GatewayIntentBits } = require('discord.js');
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
bot.login(TOKEN)

// Init Command
require("./init")(bot, Discord.Routes, Discord.REST, BOT_CLIENT_ID, TOKEN)

bot.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
  }
});
