const { Client, Partials } = require('discord.js');
const { GetJsFile } = require('./Util/GetJSFile.js');

client = new Client({ intents: 34306, presence: { status: 'idle' }, partials: [Partials.Channel, Partials.Message, Partials.Reaction]});
client.db = require('./Util/database');

GetJsFile(client);

client.login(require('./config.json').token);