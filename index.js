require("dotenv").config()
const { Client, GatewayIntentBits } = require('discord.js')

const TOKEN = process.env.BOT_TOKEN
const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
bot.login(TOKEN)

// Init Command
require("./init")(bot, BOT_CLIENT_ID, TOKEN)

// Command /ping listener
require("./ping")(bot, BOT_CLIENT_ID, TOKEN)

// Command /ping listener
// require("./music")(bot, BOT_CLIENT_ID, TOKEN)

bot.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'music') {
    console.log(interaction.member.voice, "@@@")
    if(!interaction.guildId){ await interaction.reply('你必須先加入伺服器'); return; }
    if(!interaction.member.voice.channel){ await interaction.reply('你必須先加入語音頻道'); return; }

    switch(interaction.options._hoistedOptions[0].name){
      case "queue": await interaction.reply('queue!'); break;
      default: await interaction.reply('Pong!');
    }
  }
})