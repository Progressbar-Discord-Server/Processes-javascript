const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription('Create a text channel')
    .addStringOption(o => o
      .setName('name')
      .setDescription("The name of the channel you want to create")),
  async execute(interaction) {
    let server = interaction.guild;
    let name = interaction.options.getString('name');
    try {
     server.createChannel(name, "text");
    }
    catch (err) {
      interaction.reply(`\`${err}\``)
    }
  }
}
