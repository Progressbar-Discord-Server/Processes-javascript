const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId, beta } = require('./config.js');

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

  for (const folder of fs.readdirSync(`${__dirname}/context menu`)) {
    for (const file of fs.readdirSync(`${__dirname}/context menu/${folder}`).filter(file => file.endsWith(".js"))) {
      try {
        const contextmenu = require(`${__dirname}/context menu/${folder}/${file}`);
        contextMenu.push(contextmenu.data.toJSON());
      } catch (err) {
        console.error(err);
      }
    }
  }


  const all = [];
  commands.forEach(e => { if (!beta && e.name !== "test" || beta) all.push(e) })
  contextMenu.forEach(e => all.push(e));
  send(all, token, clientId)
}

async function send(commands, token, clientId) {
  const rest = new REST({ version: '10' }).setToken(token);

  console.log(`Started refreshing ${commands.length} interaction commands.`);
  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands },
  ).catch(e => { console.error(e) });
  console.log(`Successfully reloaded ${commands.length} interaction commands.`);
};


module.exports = { send }