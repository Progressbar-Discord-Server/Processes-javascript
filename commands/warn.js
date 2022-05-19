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
	const user = interaction.options.getUser("user")
	const reason = interaction.options.getString("reason")
    //interaction.reply({ content: "This command is not out yet!", ephemeral: true})
	interaction.reply({ content: `Warned ${user.tag}: ${reason}`})
	user.send(`You have been warned for: ${reason}`)
    //if (!reason) reason = "No reason provided"
  }
}
