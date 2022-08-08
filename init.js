const { SlashCommandBuilder, Routes, REST } = require('discord.js')

module.exports = (bot, BOT_CLIENT_ID, BOT_TOKEN) => {
  try{
    bot.on("ready", async () => {
      console.log(`${bot.user.tag} restarted.`)
      const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
      
      console.log('Started refreshing application (/) commands.')
      const Guilds = bot.guilds.cache.map((guild) => {
        return {
          id: guild.id,
          name: guild.name
        }
      })
      for(let i=0; i<Guilds.length; i++){
        await rest.put(
          Routes.applicationGuildCommands(BOT_CLIENT_ID.toString(), (Guilds[i].id).toString()), 
          { body: command_builder() 
        })
      }
      console.log('Successfully reloaded application (/) commands.')
    })
  }catch(error){
    console.error(error)
  }
}

function command_builder(){
 let cmds = []
  
  // /ping
  cmds.push(new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
  )
  
  // /music
  cmds.push(new SlashCommandBuilder()
    .setName('music')
    .setDescription('Music bot')
    
    //play
    .addStringOption((option) =>{
      return option.setName('play')
        .setDescription('YouTube url')
        .setRequired(false)
    })
    
    //pause = pause/resume
    .addStringOption((option) =>{
      return option.setName('pause')
        .setDescription('pause/resume?')
        .addChoices(
          { name: 'pause', value: "pause" },
          { name: 'resume', value: "resume" },
        )
    })

    //queue
    .addBooleanOption((option) =>{
      return option.setName('queue')
        .setDescription('input anythings')
        .setRequired(false)
    })

    //skip
    .addIntegerOption((option) =>{
      return option.setName('skip')
        .setDescription('input queue number')
        .setRequired(false)
    })

    //top
    .addIntegerOption((option) =>{
      return option.setName('top')
        .setDescription('skip 1st and play selected song')
        .setRequired(false)
    })

    //top
    .addBooleanOption((option) =>{
      return option.setName('leave')
        .setDescription("Disconnect voice channel")
        .setRequired(false)
    })
  )
  // console.log(cmds[1])
  return cmds
}