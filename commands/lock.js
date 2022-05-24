const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId } = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription("lock a channel")
    .addChannelOption(o => o
      .setName("channel")
      .setDescription("The channel to lock")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this channel be locked?")),
  async execute(interaction) {
    let channel = interaction.options.getChannel("channel");
    let reason = interaction.options.getString("reason")

    if (!reason) reason = "No reason provided"

    if (channel.type === "GUILD_NEWS") {
      interaction.reply("No");
      return
    } else if (channel.type === "GUILD_TEXT") {
      channel.permissionOverwrites.edit(guildId, {
        SEND_MESSAGES: false,
        SEND_MESSAGES_IN_THREADS: false,
        CREATE_PUBLIC_THREADS: false,
        CREATE_PRIVATE_THREADS: false,
      }, { reason: reason, type: 0 })

      interaction.reply("Channel locked")
    }
  }
}