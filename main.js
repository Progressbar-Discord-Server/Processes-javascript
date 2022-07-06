const { Client, Collection } = require('discord.js');
const { GetCommandFile, GetMessageFile, GetEventFile } = require('./Util/GetJSFile.js')
const { token, clientId } = require('./config.json');

client = new Client({ intents: 34306, presence: { status: 'idle' }});
client.db = require('./Util/database');

// initiation of all slash commands
client.commands = new Collection();

GetCommandFile(client.commands);
console.log("  All Commands have been loaded");

client.messages = new Collection();

GetMessageFile(client.messages);
console.log("  All Messages has been loaded");

GetEventFile(client)
console.log('  All Events has been loaded')

console.log(`https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=1644971949567&scope=bot%20applications.commands`);

client.login(token);