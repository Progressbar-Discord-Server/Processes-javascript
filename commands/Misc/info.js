const { SlashCommandBuilder, GuildMember, EmbedBuilder } = require("discord.js");

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
    await interaction.deferReply({ ephemeral: true })

    switch (interaction.options.getSubcommand(true)) {
      case "user": {
        const member = interaction.options.getMember("user");

        if (!(member instanceof GuildMember)) {
          await interaction.guild.members.fetch(member);
        };

        let roles = []
        member.roles.cache.forEach(e => {
          if (e.name !== "@everyone") roles.push(`<@&${e.id}>`)
        })

        const avatar = member.user.avatarURL({ extension: "png", size: 4096 })

        interaction.followUp({
          embeds: [new EmbedBuilder()
            .setAuthor({ name: member.user.tag, iconURL: (avatar ? avatar : undefined) })
            .setDescription(`<@${member.user.id}>`)
            .setColor(Math.floor(Math.random() * 16777215))
            .addFields(
              { name: "**Joined**", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`, inline: true },
              { name: "**Registered**", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:f> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)`, inline: true },
              { name: `**Roles [${member.roles.cache.size - 1}]**`, value: roles.join(", ") ? roles.join(", ") : "*none*" },
            )
          ]
        });
        break
      }
      case "server": {
        await interaction.guild.fetch()

        const replyEmbed = new EmbedBuilder().setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ extension: 'png', size: 4096 }) }).setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`).setFooter({ text: `Id: ${interaction.guild.id}` }).setTimestamp(interaction.guild.createdAt)

        let owner = await interaction.guild.fetchOwner()

        let roleCount = 0
        await interaction.guild.roles.fetch().then(e => {
          e.forEach(i => {
            if (i.name === "@everyone") return
            roleCount++
          })
        })

        let emojiCount = 0
        await interaction.guild.emojis.fetch().then(e => {
          e.forEach(i => {
            emojiCount++
          })
        })

        let stickerCont = 0
        await interaction.guild.stickers.fetch().then(e => {
          e.forEach(i => {
            stickerCont++
          })
        })

        replyEmbed.setFields(
          { name: "Owner", value: `${owner.user.tag}`, inline: true },
          { name: "Roles", value: `${roleCount}`, inline: true },
          { name: "Members", value: `${interaction.guild.memberCount}`, inline: true },
          { name: "Emojis", value: `${emojiCount}`, inline: true },
          { name: "Stickers", value: `${stickerCont}`, inline: true },
          { name: "Rules", value: `<#${interaction.guild.rulesChannelId}>`, inline: true }
        )
        interaction.followUp({ embeds: [replyEmbed] })
        break
      }
    }
  }
}