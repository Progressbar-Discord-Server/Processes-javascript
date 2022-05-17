const { SlashCommandBuilder } = require('@discordjs/builders')
const { guildId } = require('../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription("kick a user")
    .addUserOption(o => o
      .setDescription("the user to kick")
      .setName('user')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("why this user should be kicked?")),
  async execute(interaction) {
    let member = interaction.options.getMember("user")
    let reason = interaction.options.getString("reason")

    if (member.kickable) member.kick({ reason: reason }).then(console.log).catch(error => {console.error(error);await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });return});
    
    if (reason === String) interaction.reply(`${user.tag} has been banned with the reason ${reason}`)
    else if (reason !== String) interaction.reply(`${user.tag} has been banned`)
  }
}