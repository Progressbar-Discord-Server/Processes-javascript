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
    .setDescription("Why should this user be warned?")
    .setRequired(true))
,
  async execute(interaction) {
  	const user = interaction.options.getUser("user")
	  const reason = interaction.options.getString("reason")
    const db = interaction.client.db.Warns
	  interaction.reply({ content: `Warned ${user.tag}: ${reason}`})
	  user.send(`You have been warned for: ${reason}`)
    db.create({
      reason: reason,
      ID: 6969,
      Executor: interaction.member.user.tag,
      userID: user.id
    })
    //if (!reason) reason = "No reason provided"
  }
}
