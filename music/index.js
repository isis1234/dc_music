let Music = require("./Music")

module.exports = (bot, BOT_CLIENT_ID, BOT_TOKEN) => {
  bot.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'music') {
    	if(!interaction.guildId){ await interaction.reply('你必須先加入伺服器'); return; }
    	if(!interaction.member.voice.channel){ await interaction.reply('你必須先加入語音頻道'); return; }
      console.log(interaction.member.voice.channel, "@@@")

      switch(interaction.options._hoistedOptions[0].name){
      	case "queue": await require("./queue")(bot, interaction, Music); break;
      	default: await interaction.reply('Pong!');
      }
    }
  })
}