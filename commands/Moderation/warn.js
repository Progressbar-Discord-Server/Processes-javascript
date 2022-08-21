const { SlashCommandBuilder } = require('discord.js');
const { warn } = require('../../Util/Moderation.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription("warn a user")
    .addUserOption(o => o
      .setName("user")
      .setDescription("the user to warn")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be warned?")
      .setRequired(true))
    .addBooleanOption(o => o
      .setName("joke")
      .setDescription("Is this command a joke?")),
  async execute(interaction) {
    await interaction.deferReply()
    warn(interaction, interaction.options.getUser("user", true), interaction.options.getString("reason", true), interaction.options.getBoolean("joke", true), interaction.client.db.Cases)
  }
};