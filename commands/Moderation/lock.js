const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ChannelType } = require('discord-api-types/v10');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription("Lock a channel")
    .addChannelOption(o => o
      .setName("channel")
      .setDescription("The channel to lock")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true))
    .addRoleOption(o => o
      .setName('role')
      .setDescription("The role to lock access, can be @eveyone")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this channel be locked?")),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const reason = interaction.options.getString("reason") || "No reason provided";
    const role = interaction.options.getRole('role', true)

    channel.permissionOverwrites.edit(role.id, {
      SEND_MESSAGES: false,
      SEND_MESSAGES_IN_THREADS: false,
      CREATE_PUBLIC_THREADS: false,
      CREATE_PRIVATE_THREADS: false,
    }, { reason: reason, type: 0 });
    
    const replyEmbed = new EmbedBuilder()
      .setColor("#00FF00")
      .setDescription("Channel locked");
    
      interaction.reply({ embeds: [replyEmbed] });
  }
}