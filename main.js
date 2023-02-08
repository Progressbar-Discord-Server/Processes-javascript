const { Client, Partials } = require('discord.js');

client = new Client({ intents: 34306, presence: { status: 'idle' }, partials: [Partials.Channel, Partials.Message, Partials.Reaction]});
client.db = require('./Util/database');

require('./Util/GetJSFile.js').GetJsFile(client);

client.login(require('./config.js').token);