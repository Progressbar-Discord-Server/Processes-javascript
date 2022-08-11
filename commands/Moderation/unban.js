const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription("unban a user")
    .addUserOption(o => o
      .setDescription("the user to unban")
      .setName('user')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be unbanned?")),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";
    const replyEmbed = new EmbedBuilder();
    const guild = interaction.guild

    await guild.bans.remove(user, reason);
    
    if (reason === String) {
      replyEmbed.setColor("#00FF00");
      replyEmbed.setDescription(`**${user.tag} has been unbanned with the reason:** ${reason}`);
    }
    else if (reason !== String) {
      replyEmbed.setDescription(`**${user.tag} has been unbanned**`);
      replyEmbed.setColor("#00FF00");
    }
    interaction.reply({embeds:[replyEmbed]});
  },
};