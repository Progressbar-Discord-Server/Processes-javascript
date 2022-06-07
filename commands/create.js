const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription('Create a text channel')
    .setStringOption(o => o
      .setName('name')
      .setDescription("The name of the channel you want to create")),
  async execute(interaction) {
    let server = interaction.guild;
    let name = interaction.options.getString('name');
    
    server.createChannel(name, "text");
  }
}
