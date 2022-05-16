const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription("ban a user")
    .addUserOption(o => o
      .setDescription("the user to ban")
      .setName('user')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("why this user should be banned?")),
  async execute(interaction) {
      await interaction.reply("lol")
  },
};