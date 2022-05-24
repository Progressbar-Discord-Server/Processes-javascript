const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId } = require("../config.json")
const { MessageEmbed } = require('discord.js');

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
    const replyEmbed = new MessageEmbed().setColor("#00FF00")
    const dmEmbed = new MessageEmbed().setColor("#FF0000")
    replyEmbed.setDescription(`Warned ${user.tag}: ${reason}`)
    dmEmbed.setDescription(`You have been warned for: ${reason}`)
	  interaction.reply({ embeds: [replyEmbed]})
	  user.send({ embeds: [dmEmbed]})
    db.create({
      reason: reason,
      Executor: interaction.member.user.tag,
      userID: user.id
    })
    //if (!reason) reason = "No reason provided"
  }
}
