const { Client, EmbedBuilder } = require('discord.js');
const { GetJsFile } = require('./Util/GetJSFile.js')
const { token, debugCha } = require('./config.json');

client = new Client({ intents: 34306, presence: { status: 'idle' }});
client.db = require('./Util/database');

GetJsFile(client)

client.login(token);

process.on("uncaughtException", async (err, origin) => {
   console.error(err)
  if (await client.channels.fetch(debugCha)) (await client.channels.fetch(debugCha)).send({embeds: [new EmbedBuilder().setAuthor({name: "Error", iconURL: "https://raw.githubusercontent.com/abrahammurciano/discord-lumberjack/main/images/error.png"}).setDescription("UncaughtException").setFields({name: "Error", value: err, inline: true},{name: "From", value: origin, inline: true})]}).catch(() => {})
});

process.on("unhandledRejection", async (err, promise) => {
  console.error(err)
  if (await client.channels.fetch(debugCha)) (await client.channels.fetch(debugCha)).send({embeds: [new EmbedBuilder().setAuthor({name: "Error", iconURL: "https://raw.githubusercontent.com/abrahammurciano/discord-lumberjack/main/images/error.png"}).setDescription("UnhandledRejection").setFields({name: "Error", value: err, inline: true}, {name: "From", value: promise, inline: true})]}).catch(() => {})
});