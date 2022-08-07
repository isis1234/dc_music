require("dotenv").config()
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];


(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN)

    await rest.put(Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.DC_GUILD_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();