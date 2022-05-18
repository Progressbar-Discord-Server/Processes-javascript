const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId } = require("../config.json")

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
    .setDescription("why this user should be warn?")),
  async execute(interaction) {
    interaction.reply({ content: "This command is not out yet!", ephemeral: true})

    //if (!reason) reason = "No reason provided"
  }
}