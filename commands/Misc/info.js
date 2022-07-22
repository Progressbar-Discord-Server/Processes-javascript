const { SlashCommandBuilder } = require("@discordjs/builders")
const { GuildMember, EmbedBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get information about something")
    .addSubcommand(sc => sc
      .setName("server")
      .setDescription("Get Information about the server")),
    /*.addSubcommand(sc => sc
      .setName("user")
      .setDescription("Get information about a user")
      .addUserOption(o => o
        .setName("user")
        .setDescription("The user to get information")
        .setRequired(true))),*/
  async execute(interaction) {
    const sc = interaction.options.getSubcommand();
    const replyEmbed = new EmbedBuilder();
    
    if (sc === "user") {
      const member = interaction.options.getMember("user");
      
      if (!(member instanceof GuildMember)) {
        await interaction.guild.members.fetch(member);
      };
      
      let Avatar = member.displayAvatarURL({extension: "png",size: 4096});

      replyEmbed.setAuthor({name: member.user.tag, iconURL: Avatar});
      replyEmbed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
      replyEmbed.setThumbnail(Avatar);
    }
    else if (sc === "server") {
      const guild = interaction.guild;
      await guild.fetch();
      
      let owner = await guild.fetchOwner();
      let threads = await guild.channels.fetchActiveThreads();
      let channelCollection = await guild.channels.fetch();
      let member = await guild.members.fetch();
      
      let voice = 0;
      let text = 0;
      channelCollection.forEach(e => {
        if (e.type === "GUILD_VOICE") {
          voice=voice+1;
        }
        else if (e.type === "GUILD_TEXT") {
          text=text+1;
        };
      })

      let emoji = await guild.emojis.fetch();
      let emojiCount = 0;
      emoji.forEach(e => {
        emojiCount=emojiCount+1;
      })

      let roles = await guild.roles.fetch();
      let rolesCount = 0;
      roles.forEach(e => {
        rolesCount=rolesCount+1
      })
      
      let date = new Date(guild.createdAt);

      let icon = guild.iconURL;
      if (icon) {replyEmbed.setThumbnail(guild.iconURL({ format: "png", size: 4096 }))};
      replyEmbed.setAuthor({name: `${guild.name}`, iconURL: icon});
      replyEmbed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
      replyEmbed.addFields(
        {name: "**Owner**", value: `${owner.user.tag}`, inline: true},
        {name: "**Active threads**", value: `${threads.threads.size}`, inline: true},
        {name: "**Text channels**", value: `${text}`, inline: true},
        {name: "**Voice channels**", value: `${voice}`, inline: true},
        {name: "**Members**", value: `${member.size}`, inline: true},
        {name: "**Roles**", value: `${rolesCount}`, inline: true},
        {name: "**Created at**", value: `<t:${Math.floor(date.getTime()/1000)}:d>`, inline:true},
        {name: "**N° Emojis**", value: `${emojiCount}`, inline: true},
        {name: "ID", value: `${guild.id}`, inline: true},
      );

      await interaction.reply({ embeds: [replyEmbed], ephemeral: true});
    };
  }
}