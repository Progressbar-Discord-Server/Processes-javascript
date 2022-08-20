const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId, guildId, beta } = require('./config.json');

if (require.main === module) {
	const fs = require('node:fs');
	const commands = [];

	for (const folder of fs.readdirSync(`${__dirname}/commands`)) {
		for (const file of fs.readdirSync(`${__dirname}/commands/${folder}`).filter(file => file.endsWith(".js"))) {
			try {
				const command = require(`${__dirname}/commands/${folder}/${file}`);
				commands.push(command.data.toJSON());
			} catch (err) {
				console.error(err);
			}
		}
	}

	const contextMenu = [];

	for (const type of fs.readdirSync(`${__dirname}/context menu`)) {
		for (const folder of fs.readdirSync(`${__dirname}/context menu/${type}`)) {
			for (const file of fs.readdirSync(`${__dirname}/context menu/${type}/${folder}`).filter(file => file.endsWith(".js"))) {
				try {
					const contextmenu = require(`${__dirname}/context menu/${type}/${folder}/${file}`);
					contextMenu.push(contextmenu.data.toJSON());
				} catch (err) {
					console.error(err);
				}
			}
		}
	}

	const all = [];
	commands.forEach(e => { if (!beta && e.name !== "test" || beta) all.push(e) })
	contextMenu.forEach(e => all.push(e));
	send(all, token, guildId, clientId)
}

async function send(all, token, guildId, clientId) {
	const rest = new REST({ version: '10' }).setToken(token);
	try {
		console.log('Started refreshing application (/) commands.');
		if (guildId instanceof Array) {
			guildId.forEach(async guild => {
				await rest.put(
					Routes.applicationGuildCommands(clientId, guild),
					{ body: all },
				).catch(e => { console.error(e) });
			}
			)
		}
		else {
			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: all },
			).catch(e => { console.error(e) })
		}
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
};


module.exports = { send }