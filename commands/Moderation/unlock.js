const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ChannelType } = require('discord-api-types/v10')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription("Unlock a channel")
    .addChannelOption(o => o
      .setName("channel")
      .setDescription("The channel to lock")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this channel be unlocked?")),
  async execute(interaction) {
    const replyEmbed = new MessageEmbed()
    let channel = interaction.options.getChannel("channel");
    let reason = interaction.options.getString("reason") || "No reason provided";

    channel.permissionOverwrites.edit(interaction.guildId, {
      SEND_MESSAGES: true,
      SEND_MESSAGES_IN_THREADS: true,
      CREATE_PUBLIC_THREADS: true,
      CREATE_PRIVATE_THREADS: true,
    }, { reason: reason, type: 0 })
      .setDescription("Channel unlocked")
      .setColor("#00FF00");
    interaction.reply({ embeds: [replyEmbed] });
  }
}