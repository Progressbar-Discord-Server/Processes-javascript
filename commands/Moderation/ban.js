const { SlashCommandBuilder, EmbedBuilder, GuildMember } = require('discord.js');
const { logCha } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .addUserOption(o =>o
      .setDescription("The member to ban")
      .setName("member")
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why should this member be banned?")
      .setRequired(true))
    .addBooleanOption(o => o
      .setName("joke")
      .setDescription("Is this command a joke command?")
      .setRequired(true))
    .addNumberOption(o => o
      .setName("time").setDescription("How long to ban this member?")),
  async execute(interaction) {
    await interaction.deferReply();
    const member = interaction.options.getMember("member", true);
    const guild = interaction.guild;
    const db = interaction.client.db.Cases;
    const reason = interaction.options.getString("reason", true);
    const days = interaction.options.getNumber("time") || 0;
    const joke = interaction.options.getBoolean("joke", true);
    
    if (!(member instanceof GuildMember)) {
      await guild.members.fetch(member);
    }

    const user = member.user;

    if (member.bannable) {
      if (user.id === interaction.user.id) {
        return interaction.followUp("Why do you want to ban yourself?");
      }
      if (user.id === interaction.client.user.id) return interaction.followUp("❌ Why would you ban me? 😢");

      const dmEmbed = new EmbedBuilder()
        .setColor("#f04a47")
        .setDescription(`You have been banned for: ${reason}`);
      const replyEmbed = new EmbedBuilder()
        .setColor("#43b582")
        .setDescription(
          `**${user.tag} has been banned for:** ${reason}`
        );
      const logEmbed = new EmbedBuilder()
        .setColor("#f04a47")
        .addFields(
          { name: "**User**", value: `${member}`, inline: true },
          {
            name: "**Moderator**",
            value: `${interaction.member}`,
            inline: true,
          },
          { name: "**Reason**", value: `${reason}`, inline: true }
        );

      await user.send({ embeds: [dmEmbed] });

      if (!joke) {
        await member.ban({ days: days, reason: reason });
        db.create({
          Executor: interaction.user.id,
          userID: user.id,
          reason: reason,
          type: "ban",
        });
        let logChannel = await guild.channels.fetch(logCha);
        logChannel.send({ embeds: [logEmbed] });
      }

      await interaction.followUp({ embeds: [replyEmbed] });
    } else return interaction.followUp("Erf, i can't do that");
  },
};
