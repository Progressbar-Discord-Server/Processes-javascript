const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription("ban a user")
    .addUserOption(o => o
      .setDescription("The user to ban")
      .setName('user')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be banned?"))
    .addNumberOption(o => o
      .setName("time")
      .setDescription("How long to ban this user?")),
  async execute(interaction) {
    let user = interaction.options.getUser("user")
    let member = await interaction.client.users.fetch(interaction.options.getMember("user"))
    let reason = interaction.options.getString("reason")
    const db = interaction.client.db.Bans
    let days = interaction.options.getNumber("time")
    const replyEmbed = new MessageEmbed()
    if (!reason) reason = "No reason provided"
    if (!days) days = 0

    await member.ban({ days: days, reason: reason })
      .then(() => {
        if (reason === "No reason provided") {
          replyEmbed.setDescription(`${user.tag} has been banned`)
          replyEmbed.setColor("#00FF00")
        } else if (reason !== "No reaqon provided") {
          replyEmbed.setDescription(`${user.tag} has been banned with the reason ${reason}`)
          replyEmbed.setColor("#00FF00")
        }
      })
      .catch(error => {
        console.error(error)
        replyEmbed.setDescription('There was an error while executing this command!')
        replyEmbed.setColor("#FF0000")
      })
    if (replyEmbed.description === "There was an error while executing this command!") {
      interaction.reply({ embeds: [replyEmbed], ephemeral: true })
    } else if (replyEmbed.description === `${user.tag} has been banned` || replyEmbed.description === `${user.tag} has been banned with the reason ${reason}`) {
      interaction.reply({ embeds: [replyEmbed] })
    }
    db.create({
      reason: reason,
      Executor: interaction.member.user.tag,
      userID: user.id
    })
  },
};