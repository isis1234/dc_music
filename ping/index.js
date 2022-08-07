module.exports = (bot, BOT_CLIENT_ID, BOT_TOKEN) => {
  bot.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!')
    }
  })
}