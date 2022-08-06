const { Client, Collection } = require('discord.js');
const { GetCommandFile, GetMessageFile, GetEventFile } = require('./Util/GetJSFile.js')
const { token } = require('./config.json');

client = new Client({ intents: 34306, presence: { status: 'idle' }});
client.db = require('./Util/database');

// initiation of all slash commands
client.commands = new Collection();
console.log('Initialization of / commands')
GetCommandFile(client.commands);
console.log(" └ All Commands have been loaded");

console.log('Initialization of messages')
client.messages = new Collection();
GetMessageFile(client.messages);
console.log(" └ All Messages has been loaded");

console.log('Initialization of events')
GetEventFile(client)
console.log(' └ All Events has been loaded')

client.login(token);