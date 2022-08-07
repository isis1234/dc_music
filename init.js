const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
]

module.exports = (bot, Routes, REST, BOT_CLIENT_ID, BOT_TOKEN) => {
  try{
    bot.on("ready", async () => {
        console.log(`${bot.user.tag} restarted.`)
        const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
        
        console.log('Started refreshing application (/) commands.')
        const Guilds = bot.guilds.cache.map(guild => guild.id)
        for(let i=0; i<Guilds.length; i++){
          await rest.put(Routes.applicationGuildCommands(BOT_CLIENT_ID.toString(), Guilds[i].toString()), { body: commands });
        }
        console.log('Successfully reloaded application (/) commands.')
    })
  }catch(error){
    console.error(error)
  }
}