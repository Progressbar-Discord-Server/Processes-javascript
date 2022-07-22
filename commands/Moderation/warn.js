const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

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
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const joke = interaction.options.getBoolean("joke");
    const db = interaction.client.db.Cases;
    const replyEmbed = new EmbedBuilder().setColor("#00FF00");
    const dmEmbed = new EmbedBuilder().setColor("#FF0000");

    if (user.id = interaction.client.id) return interaction.reply("I just deleted my own warn <:troll:869197146786766849>");

    replyEmbed.setDescription(`Warned ${user.tag}: ${reason}`);
    dmEmbed.setDescription(`You have been warned for: ${reason}`);

    interaction.reply({ embeds: [replyEmbed] });
    user.send({ embeds: [dmEmbed] });

    if (!joke) {
      db.create({
        type: "warn",
        reason: reason,
        Executor: interaction.member.user.tag,
        userID: user.id
      });
    };
  }
};