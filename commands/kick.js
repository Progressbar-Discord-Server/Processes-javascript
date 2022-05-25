const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription("kick a user")
    .addUserOption(o => o
      .setDescription("The user to kick")
      .setName('user')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be kicked?")),
  async execute(interaction) {
    let member = interaction.options.getMember("user")
    let reason = interaction.options.getString("reason")
    const replyEmbed = new MessageEmbed().setColor("#00FF00")
    if (!reason) reason = "No reason provided"

    if (member.kickable) {
      member.kick({ reason: reason })
        .then(() => {
          if (reason !== "No reason provided") {
            replyEmbed.setDescription(`${user.tag} has been kicked with the reason ${reason}`)
          } else if (reason === "No reason provided") {
            replyEmbed.setDescription(`${user.tag} has been kicked`)
          }
        })
      interaction.reply({ embeds: [replyEmbed] })
        .catch(error => {
          console.error(error);
          replyEmbed.setDescription('There was an error while executing this command!');
          interaction.reply({ embeds: [replyEmbed], ephemeral: true });
        });
    }
  }
}