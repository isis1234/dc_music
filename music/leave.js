module.exports = async (bot, interaction, music) => {
	let msg = music.leave(interaction)
  if(msg){
  	await interaction.reply(msg)
  }else{
  	return
  }
}