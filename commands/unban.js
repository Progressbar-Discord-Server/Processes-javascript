const { SlashCommandBuilder } = require('@discordjs/builders');

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
    let member = interaction.options.getMember("user");
    let reason = interaction.options.getString("reason");
    const replyEmbed = new MessageEmbed()
    if (!reason) reason = "No reason provided"

    await member.unban();
    
    if (reason === String) {
      replyEmbed.setColor("#00FF00")
      replyEmbed.setDescription(`${user.tag} has been unbanned with the reason ${reason}`)
    }
    else if (reason !== String) {
      replyEmbed.setDescription(`${user.tag} has been unbanned`);
      replyEmbed.setColor("#00FF00")
    }

    interaction.reply({embeds:[replyEmbed]});

  },
};