const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildId } = require("../config.json")
const { MessageEmbed } = require('discord.js');

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
    const replyEmbed = new MessageEmbed()
    if (!reason) reason = "No reason provided"
    
    channel.permissionOverwrites.edit(guildId, {
      SEND_MESSAGES: false,
      SEND_MESSAGES_IN_THREADS: false,
      CREATE_PUBLIC_THREADS: false,
      CREATE_PRIVATE_THREADS: false,
    }, {reason: reason, type: 0})
    replyEmbed.setColor("#00FF00")
    replyEmbed.setDescription("Channel locked")
    interaction.reply({embeds:[replyEmbed]})
  } 
}