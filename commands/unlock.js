const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId } = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
  .setName('unlock')
  .setDescription("unlock a channel")
  .addChannelOption(o => o
    .setName("channel")
    .setDescription("the channel to lock")
    .setRequired(true))
  .addStringOption(o => o
    .setName("reason")
    .setDescription("Why should this channel be unlocked?")),
  async execute(interaction) {
    let channel = interaction.options.getChannel("channel"); 
    let reason = interaction.options.getString("reason")

    if (!reason) reason = "No reason provided"

    channel.permissionOverwrites.edit(guildId, {
      SEND_MESSAGES: true,
      SEND_MESSAGES_IN_THREADS: true,
      CREATE_PUBLIC_THREADS: true,
      CREATE_PRIVATE_THREADS: true,
    }, {reason: reason, type: 0})

    interaction.reply("Channel unlocked")
  } 
}