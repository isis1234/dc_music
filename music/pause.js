module.exports = async (bot, interaction, music) => {
  let msg = null
  console.log(interaction.options._hoistedOptions[0])
  if(interaction.options._hoistedOptions[0].value == "pause"){
  	msg = await music.pause(interaction)
  }else{
  	msg = await music.resume(interaction)
  }

  if(msg){
    await interaction.reply(msg)
  }else{
    return
  }
}