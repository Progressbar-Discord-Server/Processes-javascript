const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId } = require('../config.json')

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
      .setDescription("why this user should be unbanned?")),
  async execute(interaction) {
    let user = interaction.options.getUser("user")
    let reason = interaction.options.getString("reason")
    await guilds.cache.get(guildId).members.unban(user)
    if (reason === String) interaction.reply(`${user.tag} has been unbanned with the reason ${reason}`)
    else if (reason !== String) interaction.reply(`${user.tag} has been unbanned`)
  },
};