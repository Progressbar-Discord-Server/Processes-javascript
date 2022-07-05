const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('./config.json');
const fs = require('node:fs');

const commands = [];
const commandFolders = fs.readdirSync(`${__dirname}/commands`);

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`${__dirname}/commands/${folder}`).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
   try {
      const command = require(`${__dirname}/commands/${folder}/${file}`);
      commands.push(command.data.toJSON());
   } catch (err) {
      console.error(err);
    }
  }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		if (guildId instanceof Array) {
			guildId.forEach(async guild => {
      	await rest.put(
			  	Routes.applicationGuildCommands(clientId, guild),
			  	{ body: commands },
		  	);
			}
		)}
		else {
			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			)
		}
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
