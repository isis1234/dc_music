module.exports = async (bot, interaction, music) => {
  let msg = await music.play(interaction)
  if(msg){
  	await interaction.reply(msg)
  }else{
  	return
  }
}