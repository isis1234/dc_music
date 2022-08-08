let Music = require("./Music")

module.exports = (bot, BOT_CLIENT_ID, BOT_TOKEN) => {
  const music = new Music()
  bot.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'music') {
      if(!interaction.guildId){ await interaction.reply('你必須先加入伺服器'); return; }
      if(!interaction.member.voice.channel){ await interaction.reply('你必須先加入語音頻道'); return; }
      
      let voice_channel_members = (interaction.member.voice.channel.members).map((x) => { return x.user.id })
      // console.log(voice_channel_members)
      if(!voice_channel_members.find((x) => { return x == BOT_CLIENT_ID })){
        music.join(interaction)
      }

      switch(interaction.options._hoistedOptions[0].name){
        case "queue": await require("./queue")(bot, interaction, music); break;
        case "leave": await require("./leave")(bot, interaction, music); break;
        case "play": await require("./play")(bot, interaction, music); break;
        default: await interaction.reply('Pong!');
      }
    }
  })
}