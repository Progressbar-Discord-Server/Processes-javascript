const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ban } = require("../../Util/Moderation.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o =>o
      .setDescription("The member to ban")
      .setName("member")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this member be banned?")
      .setRequired(true))
    .addBooleanOption(o => o
      .setName("joke")
      .setDescription("Is this command a joke command?")
      .setRequired(true))
    .addNumberOption(o => o
      .setName("time").setDescription("How long to ban this member?")),
  async execute(interaction) {
    await interaction.deferReply();
    await ban(interaction, interaction.options.getMember("member", true), interaction.options.getString("reason", true), interaction.options.getBoolean("joke", true), interaction.client.db.Cases).catch(console.error)
  },
};
