const { ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("User Info")
    .setType(2),
  async execute(interaction) {
    const member = interaction.targetMember

    await interaction.guild.members.fetch(member)
    await interaction.client.users.fetch(member.user)
    
    let roles = []
    member.roles.cache.forEach(e => {
      if (e.name !== "@everyone") roles.push(`<@${e.id}>`)
    })
    
    interaction.reply({
      ephemeral: true, embeds: [new EmbedBuilder()
        .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ extension: "png", size: 4096 }) })
        .setDescription(`<@${member.user.id}>`)
        .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
        .addFields(
          {name: "**Joined**", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:d>`, inline: true },
          {name: "**Registered**", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:d>`, inline: true },
          {name: `**Roles [${member.roles.cache.size - 1}]**`, value: roles.join(", ") ? roles.join(", ") : "*none*"},
        )
      ]
    })
  }
}