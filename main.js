const { Client } = require('discord.js');
const { GetJsFile } = require('./Util/GetJSFile.js')
const { token } = require('./config.json');

client = new Client({ intents: 34306, presence: { status: 'idle' }});
client.db = require('./Util/database');

GetJsFile(client)

client.login(token);