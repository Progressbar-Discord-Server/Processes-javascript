const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription("ban a member")
    .addUserOption(o => o
      .setDescription("The member to ban")
      .setName('member')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this member be banned?")
      .setRequired(true))
    .addNumberOption(o => o
      .setName("time")
      .setDescription("How long to ban this member?")),
  async execute(interaction) {
    const member = interaction.options.getMember("member")
    const guild = interaction.guild
    const db = interaction.client.db.Cases
    const reason = interaction.options.getString("reason") || "No reason provided"
    const days = interaction.options.getNumber("time") || 0
    if (!(member instanceof GuildMember)) {
      await guild.members.fetch(member)
    }
    const dmEmbed = new MessageEmbed()
      .setColor("#FF0000")
      .setDescription(`You have been banned for: ${reason}`)
    await member.user.send({ embeds: [dmEmbed] })
    await member.ban({ days: days, reason: reason })
    const replyEmbed = new MessageEmbed()
      .setColor("#00FF00")
      .setDescription(`**${member.user.tag} has been banned for:** ${reason}`)
    await interaction.reply({ embeds: [replyEmbed] })
    db.create({
      Executor: interaction.member.user.id,
      userID: member.user.id,
      reason: reason,
      type: "ban"
    })
  }
};