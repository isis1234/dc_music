module.exports = async (bot, interaction, music) => {
  let msg = ""
  switch(interaction.options._hoistedOptions[0].value){
    case "pause": msg = await music.pause(interaction); break;
    case "resume": msg = await music.resume(interaction); break;
    case "skip": msg = await music.skip(interaction); break;
    case "list": msg = await music.nowQueue(interaction); break;
    case "leave": msg = await music.leave(interaction); break;
    default: await interaction.reply("Input value")
  }
  await interaction.reply(msg)
}