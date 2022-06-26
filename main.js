const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection } = require('discord.js');
const { token } = require('./config.json');

client = new Client({intents: 2, presence: {status: 'idle'}});
client.db = require('./Util/database')

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


client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (!(interaction.replied)) {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    } else {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  }
})

client.login(token);