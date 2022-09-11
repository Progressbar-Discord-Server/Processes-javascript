const { User, GuildMember, EmbedBuilder, escapeMarkdown } = require('discord.js')
const { logCha } = require('../config.json')

async function ban(interaction, member, reason = "No reason provided", joke = false, db) {
  const guild = interaction.guild

  if (!(member instanceof GuildMember)) {
    await guild.members.fetch(member)
  }

  const dmEmbed = new EmbedBuilder()
    .setColor("#f04a47")
    .setDescription(`**You have been banned from ${guild.name} for**: ${reason}`);
  const replyEmbed = new EmbedBuilder()
    .setColor("#43b582")
    .setDescription(`**${escapeMarkdown(member.user.tag)} has been banned for:** ${reason}`);
  const logEmbed = new EmbedBuilder()
    .setDescription("Ban")
    .setColor("#f04a47")
    .addFields(
      { name: "**User**", value: escapeMarkdown(member.user.tag), inline: true },
      { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
      { name: "**Reason**", value: reason, inline: true }
    );

  if (member.user.id === interaction.user.id) return interaction.followUp("Why do you want to ban yourself?")
  if (member.user.id === interaction.client.user.id) return interaction.followUp("❌ Why would you ban me? 😢")

  if (member.bannable) {
    await member.user.send({ embeds: [dmEmbed] }).catch(e => console.error(`Couldn't message ${member.user.tag} (ban)`))

    if (!joke) {
      try {
        guild.members.ban(member.user, { reason: reason });
      } catch (err) {
        console.error(err)
        return interaction.followUp("Couldn't ban that user")
      }

      db.create({
        Executor: interaction.user.id,
        userID: member.user.id,
        reason: reason,
        type: "ban",
      });

      let logChannel = await interaction.guild.channels.fetch(logCha)
      await logChannel.send({ embeds: [logEmbed] }).catch(console.error)
    }
  }
  interaction.followUp({ embeds: [replyEmbed] }).catch(console.error)
}

async function kick(interaction, member, reason = "No reason provided", joke = false, db) {
  const guild = interaction.guild

  if (!(member instanceof GuildMember)) {
    guild.members.fetch(member)
  }

  const dmEmbed = new EmbedBuilder()
    .setColor("#f04a47")
    .setDescription(`**You have been kicked from ${guild.name} for**: ${reason}`);
  const replyEmbed = new EmbedBuilder()
    .setColor("#43b582")
    .setDescription(`**${escapeMarkdown(member.user.tag)} has been kicked for:** ${reason}`);
  const logEmbed = new EmbedBuilder()
    .setDescription("Kick")
    .setColor("#f04a47")
    .addFields(
      { name: "**User**", value: escapeMarkdown(member.user.tag), inline: true },
      { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
      { name: "**Reason**", value: reason, inline: true }
    );

  if (member.user.id === interaction.user.id) return interaction.followUp("Why do you want to kick yourself?")
  if (member.user.id === interaction.client.user.id) return interaction.followUp("❌ Why would you kick me? 😢")
  
  if (member.kickable) {

    await member.user.send({ embeds: [dmEmbed] }).catch(e => { console.error(`Couldn't message ${member.user.tag} (kick)`) })

    if (!joke) {
      try {
        guild.members.kick(member.user, { reason: reason });
      } catch (err) {
        console.error(err)
        return interaction.followUp("Couldn't kick that user.")
      }

      db.create({
        Executor: interaction.user.id,
        userID: member.user.id,
        reason: reason,
        type: "kick",
      });

      let logChannel = await interaction.guild.channels.fetch(logCha)
      await logChannel.send({ embeds: [logEmbed] })
    }
  }
  interaction.followUp({ embeds: [replyEmbed] })
}

async function warn(interaction, user, reason, joke = false, db) {
  if (!(user instanceof User)) {
    interaction.client.users.fetch(user)
  }

  const dmEmbed = new EmbedBuilder()
    .setColor("#f04a47")
    .setDescription(`**You have been warned from ${interaction.guild.name} for**: ${reason}`);
  const replyEmbed = new EmbedBuilder()
    .setColor("#43b582")
    .setDescription(`**${escapeMarkdown(user.tag)} has been warned for:** ${reason}`);
  const logEmbed = new EmbedBuilder()
    .setDescription("Warn")
    .setColor("#f04a47")
    .addFields(
      { name: "**User**", value: escapeMarkdown(user.tag), inline: true },
      { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
      { name: "**Reason**", value: reason, inline: true }
    );

  if (user.id === interaction.client.user.id) return interaction.followUp("I just deleted my own warn <:trollface:990669002999201852>")

  if (!joke) {
    db.create({
      type: "warn",
      reason: reason,
      Executor: interaction.user.tag,
      userID: user.id
    });

    let logChannel = await interaction.guild.channels.fetch(logCha)
    await logChannel.send({ embeds: [logEmbed] })
  };

  await user.send({ embeds: [dmEmbed] }).catch(e => { console.error(`Couldn't message ${user.tag} (warn)`) })
  await interaction.followUp({ embeds: [replyEmbed] })
}

async function timeout(interaction, member, reason, unit, RealLen, joke = false, db) {
  let length = RealLen;

  if (!(member instanceof GuildMember)) {
    await interaction.guild.member.fetch(member)
  }

  if (member.id === interaction.client.user.id) {
    if (!reason || reason === "No reason provided") return interaction.followUp(`Timed out undefined for ${RealLen} ${unit}`);
    else if (reason || reason !== "No reason provided") return interaction.followUp(`Timed out undefined for ${RealLen} ${unit} for **${reason}.**`)
  };

  switch (unit) {
    case "seconds": length = Math.floor(length * 1000);
    case "minutes": length = Math.floor(length * 60 * 1000);
    case "hours": length = Math.floor(length * 60 * 60 * 1000);
    case "days": length = Math.floor(length * 24 * 60 * 60 * 1000);
  }

  if (length > 2.419e+9) {
    replyEmbed.setColor("#FF0000");
    replyEmbed.setDescription(`**I cannot timeout ${escapeMarkdown(member.user.tag)} for *that* long! You provided a time longer than 28 days!**`);
    await interaction.followUp({ embeds: [replyEmbed] });
  }
  else if (length < 2.419e+9) {
    if (!joke) {
      await member.timeout(length, reason + "| Timeout by" + interaction.user.tag).then(() => {
        db.create({
          type: "timeout",
          reason: reason,
          Executor: interaction.user.tag,
          userID: member.user.id
        })
      }).catch(err => { console.error(err); return interaction.followUp(`Couldn't timeout ${escapeMarkdown(member.user.tag)}: \`\`\`${err}\`\`\``) })
    }
    replyEmbed

  }
}

module.exports = { ban, kick, warn, timeout }