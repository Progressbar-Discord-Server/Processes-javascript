const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription('Create a text channel')
    .addStringOption(o => o
      .setName('name')
      .setDescription("The name of the channel you want to create")),
  async execute(interaction) {
    /*
    let server = interaction.guild;
    let name = interaction.options.getString('name');
    
    try {
      server.channels.create(name, "text");
    }
    catch (err) {
      interaction.reply(`\`${err}\``);
    }
    finally {
      interaction.reply("No error!");
    }
    */
   interaction.reply("This command is *not* necessary, as it will just create a channel, if you want it, delete the \\\\* and \\*\\ that are on the create.js file in the commands directory")
  }
}