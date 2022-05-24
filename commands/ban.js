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
    let member = await interaction.client.users.fetch(interaction.options.getMember("user"))
    let reason = interaction.options.getString("reason")
    const db = interaction.client.db.Bans
    const replyEmbed = new MessageEmbed
    if (!reason) reason = "No reason provided"

    if (interaction.options.getNumber("time") !== undefined) {let days = interaction.options.getNumber("time")}
    else {let days = null}
    
    if (member.bannable) await member.ban({ days: days, reason: reason }).then(console.log).catch(error => {console.error(error);interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });return});

    else if (!member.bannable) {
      replyEmbed.setDescription("I can't ban this member")
      replyEmbed.setColor("#FF0000")
      return
    }
    if (reason === String) {
      replyEmbed.setDescription(`${user.tag} has been banned with the reason ${reason}`)
      replyEmbed.setColor("#00FF00")
    }
    else if (reason !== String) {
      replyEmbed.setDescription(`${user.tag} has been banned`)
      replyEmbed.setColor("#00FF00")
    }
    interaction.reply({embeds:[replyEmbed]})
    db.create({
      reason: reason,
      Executor: interaction.member.user.tag,
      userID: user.id
    })
  },
};