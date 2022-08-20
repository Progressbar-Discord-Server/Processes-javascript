const { SlashCommandBuilder } = require('discord.js');
const { kick } = require("../../Util/Moderation.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription("kick a user")
    .addUserOption(o => o
      .setDescription("The user to kick")
      .setName('user')
      .setRequired(true))
    .addBooleanOption(o => o
      .setName("joke")
      .setDescription("Is this command a joke command?")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be kicked?")
      .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    kick(interaction, interaction.options.getMember("user", true), interaction.options.getString("reason"), interaction.options.getBoolean("joke", true), interaction.client.db.Cases)
  }
}