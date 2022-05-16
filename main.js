const { Client } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const dotenv = require('dotenv');
dotenv.config();

const promote = new SlashCommandBuilder()
  .setName("promote")
  .setDescription("promote a user")
  .setDescriptionLocalization('fr', "promouvoir un utilisateur")
  .addUserOption(o => o
    .setDescription("the user to promote")
    .setDescriptionLocalization('fr', "l'utilisateur a promouvoir")
    .setName("user"))
  .addStringOption(o => o
    .setDescription("why would you promote this user?")
    .setDescriptionLocalization('fr', "pourquoi voulez-vous promouvoir cette utilisateur?")
    .setName("reason"));

client = new Client({intents: 0});

client.once('ready', async () => {

  await client.guilds.cache.get('861413126393954314').commands.fetch();
  
  // client.application.commands.create(data);
  // client.guilds.cache.get('861413126393954314').commands.create(data);

  console.log("Login as ???");
})


client.on("interactionCreate", interaction => {
  if (interaction.isCommand()) {
    if (interaction.commandName === 'promote') {
      let user = interaction.options.getUser('user')
      let reason = interaction.options.getString('reason')

    }
    if (interaction.commandName === 'demote') {
      let user = interaction.options.getUser('user')
      let reason = interaction.options.getString('reason')

    }
    if (interaction.commandName === 'warn') {
      let user = interaction.options.getUser('user')
      let reason = interaction.options.getString('reason')

    }
    if (interaction.commandName === 'warnings') {
      let user = interaction.options.getUser('user')
      
    }
    if (interaction.commandName === 'kick') {
      let user = interaction.options.getUser('user')
      let reason = interaction.options.getString('reason')
      
    }
    if (interaction.commandName === 'ban') {
      let user = interaction.options.getUser('user')
      let reason = interaction.options.getString('reason')

    }
    if (interaction.commandName === 'unban') {
      let user = interaction.options.getUser('user')
      let reason = interaction.options.getString('reason')

    }

  }
})

client.login(process.env.TOKEN);