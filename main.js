const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection } = require('discord.js');
const { add } = require('./event/messageReact.js');
const { token } = require('./config.json');

// intent 1024 allow to see messageReactionAdd and Remove events
client = new Client({intents: 1024, partials: ['MESSAGE', 'REACTION', 'USER'], presence: {status: 'idle'}});

client.db = require('./Util/database');

// initiation of all slash commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  client.db.Cases.sync()
  console.log(`Login as ${client.user.tag}`);
})

client.on("messageReactionAdd", async (reaction, user) => {

  try {
    add(reaction, user);
  } 
  catch (err) {
    console.error(err);
  }
})

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
})

client.login(token);