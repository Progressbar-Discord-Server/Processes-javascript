const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription("kick a user")
    .addUserOption(o => o
      .setDescription("The user to kick")
      .setName('user')
      .setRequired(true))
    .addBooleanOption(o => o
      .setName("joke")
      .setDescription("Is this command a joke command?")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be kicked?")
      .setRequired(true)),
  async execute(interaction) {
    let member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason");
    const replyEmbed = new EmbedBuilder().setColor("#00FF00");

    if (member.id === interaction.client.user.id) return interaction.reply("❌ Why would you kick me? 😢");

    if (!joke) {
      if (member.kickable) {
        member.kick({ reason: reason })
          .then(() => {
            if (reason !== "No reason provided") {
              replyEmbed.setDescription(`${user.tag} has been kicked with the reason ${reason}`);
            } else if (reason === "No reason provided") {
              replyEmbed.setDescription(`${user.tag} has been kicked`);
            };
          })
          .catch(error => {
            console.error(error);
            replyEmbed.setDescription('There was an error while executing this command!');
            interaction.reply({ embeds: [replyEmbed], ephemeral: true });
          });
      }
    }
    interaction.reply({ embeds: [replyEmbed] });
  }
}