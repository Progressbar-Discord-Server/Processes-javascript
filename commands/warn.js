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
    .addBooleanOption(o => o
      .setName("joke")
      .setDescription("Is this command a joke?"))
  ,
  async execute(interaction) {
    const user = interaction.options.getUser("user")
    const reason = interaction.options.getString("reason")
    const joke = interaction.options.getBoolean("joke")
    const db = interaction.client.db.Cases
    const replyEmbed = new MessageEmbed().setColor("#00FF00")
    const dmEmbed = new MessageEmbed().setColor("#FF0000")

    replyEmbed.setDescription(`Warned ${user.tag}: ${reason}`)
    dmEmbed.setDescription(`You have been warned for: ${reason}`)

    interaction.reply({ embeds: [replyEmbed] })
    user.send({ embeds: [dmEmbed] })

    if (!joke) {
      db.create({
        type: "warn",
        reason: reason,
        Executor: interaction.member.user.tag,
        userID: user.id
      })
    }
  }
}
