const { SlashCommandBuilder } = require('@discordjs/builders');
const { extensions } = require('sequelize/types/utils/validator-extras');
const { guildId } = require('../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription("ban a user")
    .addUserOption(o => o
      .setDescription("the user to ban")
      .setName('user')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("why this user should be banned?"))
    .addNumberOption(o => o
      .setName("time")
      .setDescription("how many days this user will be banned")),
  async execute(interaction) {
    let member = interaction.options.getMember("user")
    let reason = interaction.options.getString("reason")
    if (interaction.options.getNumber("time") !== undefined) {let days = interaction.options.getNumber("time")}
    else {let days = null}

    if (member.bannable) member.ban({ days: days, reason: reason }).then(console.log).catch(error => {console.error(error);await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });return});

    else if (!user.bannable) {interaction.reply("I can't ban this member");return}
    if (reason === String) interaction.reply(`${user.tag} has been banned with the reason ${reason}`)
    else if (reason !== String) interaction.reply(`${user.tag} has been banned`)
  },
};