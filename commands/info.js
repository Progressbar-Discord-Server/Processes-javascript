const { SlashCommandBuilder } = require("@discordjs/builders")
const { GuildMember, MessageEmbed } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get information about something")
    .addSubcommand(sc => sc
      .setName("server")
      .setDescription("Get Information about the server"))
    .addSubcommand(sc => sc
      .setName("user")
      .setDescription("Get information about a user")
      .addUserOption(o => o
        .setName("user")
        .setDescription("The user to get information")
        .setRequired(true))),
  async execute(interaction) {
    const sc = interaction.options.getSubcommand()
    const replyEmbed = new MessageEmbed()
    
    if (sc === "user") {
      const member = interaction.options.getMember("user")

      if (!(member instanceof GuildMember)) {
        await interaction.guild.members.fetch(member)
      }

      replyEmbed.setColor("")
    }
    else if (sc === "server") {
      const guild = interaction.guild;
      await guild.fetch()

      let owner = await guild.fetchOwner()
      let threads = await guild.channels.fetchActiveThreads()
      let voiceCollection = await guild.channels.fetch()
      let v = 0
      for (vc in voiceCollection) {
        if (vc.type === 2) {
          v=v+1
        }
      }

      let member = await guild.members.fetch()


      if (guild.iconURL) {replyEmbed.setThumbnail(guild.iconURL({ format: "png", size: 4096 }))}
      replyEmbed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
      replyEmbed.addFields(
        {name: "**Owner**", value: owner.user.tag, inline: true},
        {name: "**Active Treads**", value: threads.threads.size, inline: true},
        {name: "**Text channels**", value: guild.channels.channelCountWithoutThreads, inline: true},
        {name: "**Voice channels**", value: 5},
        {name: "**Members**", value: member.size, inline: true},     
        {name: "**Roles**", value: 5, inline: true},
      );

      await interaction.reply({ embeds: [replyEmbed], ephemeral: true});
    }
  }
}