const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription("ban a user")
    .addUserOption(o => o
      .setDescription("The user to ban")
      .setName('user')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this user be banned?"))
    .addNumberOption(o => o
      .setName("time")
      .setDescription("How long to ban this user?")),
  async execute(interaction) {
    let member = await interaction.client.users.fetch(interaction.options.getMember("user"))
    let reason = interaction.options.getString("reason")
    const db = interaction.client.db.Bans
    if (!reason) reason = "No reason provided"

    if (interaction.options.getNumber("time") !== undefined) {let days = interaction.options.getNumber("time")}
    else {let days = null}
    
    if (member.bannable) await member.ban({ days: days, reason: reason }).then(console.log).catch(error => {console.error(error);interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });return});

    else if (!user.bannable) {interaction.reply("I can't ban this member");return}
    if (reason === String) interaction.reply(`${user.tag} has been banned with the reason ${reason}`)
    else if (reason !== String) interaction.reply(`${user.tag} has been banned`)
    db.create({
      reason: reason,
      Executor: interaction.member.user.tag,
      userID: user.id
    })
  },
};