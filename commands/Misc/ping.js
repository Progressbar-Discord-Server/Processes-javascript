const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!'),
  async execute(interaction) {
    const replyEmbed = {
      color: Math.floor(Math.random() * 16777215),
      description: `Pong!\nLatency of the bot:${Date.now() - interaction.createdTimestamp}ms`
    }
    await interaction.reply({embeds: [replyEmbed], ephemeral: true})
    replyEmbed.description += `\nRound-trip: ${Date.now() - interaction.createdTimestamp}ms`
    return await interaction.editReply({embeds: [replyEmbed]})
  }
}