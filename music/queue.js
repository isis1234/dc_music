module.exports = async (bot, interaction, music) => {
  await interaction.reply(music.nowQueue(interaction))
}