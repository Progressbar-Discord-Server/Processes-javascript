const { User, GuildMember, EmbedBuilder, escapeMarkdown } = require('discord.js')
const { logCha } = require('../config.js')

async function ban(interaction, member, reason = "No reason provided", joke = false, db, catcherror = console.error(err)) {
  const guild = interaction.guild
  let fetch = false

  if (!(member instanceof GuildMember)) {
    await guild.members.fetch(member).then(e => { fetch = true; member = e }).catch(() => { member = null })
  }

  const dmEmbed = new EmbedBuilder()
    .setColor("#f04a47")
    .setDescription(`**You have been banned from ${guild.name} for**: ${reason}`);
  const replyEmbed = new EmbedBuilder()
    .setColor("#43b582")
    .setDescription(`**${escapeMarkdown(getName(interaction.options.getUser("member").id, member.user, fetch))} has been banned for:** ${reason}`);
  const logEmbed = new EmbedBuilder()
    .setDescription("Ban")
    .setColor("#f04a47")
    .addFields(
      { name: "**User**", value: escapeMarkdown(getName(interaction.options.getUser("member").id, member.user, fetch)), inline: true },
      { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
      { name: "**Reason**", value: reason, inline: true }
    );

  if (getName(interaction.options.getUser("member").id, member.user, fetch) === interaction.user.id) return interaction.followUp("Why do you want to ban yourself?")
  if (getName(interaction.options.getUser("member").id, member.user, fetch) === interaction.client.user.id) return interaction.followUp("❌ Why would you ban me? 😢")

  if (member.bannable) {
    await member.user.send({ embeds: [dmEmbed] }).catch(e => console.error(`Couldn't message ${member.user.tag} (ban)`))

    if (!joke) {
      await guild.members.ban(member.user, { reason: reason }).catch((err) => {
        catcherror()
        return interaction.followUp("Couldn't ban that user")
      })

      db.create({
        Executor: interaction.user.id,
        userID: getName(interaction.options.getUser("member").id, member.user, fetch),
        reason: reason,
        type: "ban",
      });

      let logChannel = await interaction.client.channels.fetch(logCha).catch(e => { })
      if (logChannel) await logChannel.send({ embeds: [logEmbed] }).catch(console.error)
    }
  }
  interaction.followUp({ embeds: [replyEmbed] }).catch(console.error)
}

async function kick(interaction, member, reason = "No reason provided", joke = false, db) {
  const guild = interaction.guild
  let fetch = false

  if (!(member instanceof GuildMember)) {
    guild.members.fetch(member).then(e => { fetch = true; member = e }).catch(() => { member = null })
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

  if (getName(interaction.options.getUser("member").id, member.user, fetch) === interaction.user.id) return interaction.followUp("Why do you want to kick yourself?")
  if (getName(interaction.options.getUser("member").id, member.user, fetch) === interaction.client.user.id) return interaction.followUp("❌ Why would you kick me? 😢")

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
        userID: getName(interaction.options.getUser("member").id, member.user, fetch),
        reason: reason,
        type: "kick",
      });

      let logChannel = await interaction.client.channels.fetch(logCha).catch(e => { })
      if (logChannel) await logChannel.send({ embeds: [logEmbed] })
    }
  }
  interaction.followUp({ embeds: [replyEmbed] })
}

async function warn(interaction, user, reason, joke = false, db) {
  let crash = false

  if (!(user instanceof User)) {
    await interaction.client.users.fetch(user).catch(() => { crash = true })
  }

  if (crash) {
    const errorEmbed = new EmbedBuilder()
      .setDescription("You can't warn someone that isn't in the server.")
      .setColor("#ff0000")
    return interaction.followUp({ embeds: [errorEmbed] })
  }

  const avatar = await user.avatarURL({ extention: 'png', size: 4096 })
  const dmEmbed = new EmbedBuilder()
    .setColor("#f04a47")
    .setDescription(`**You have been warned from ${interaction.guild.name} for**: ${reason}`);
  const replyEmbed = new EmbedBuilder()
    .setColor("#43b582")
    .setDescription(`**${escapeMarkdown(user.tag)} has been warned for:** ${reason}`);
  const logEmbed = new EmbedBuilder()
    .setAuthor({ name: `Case idk | Warn | ${user.tag} | ${user.id}`, iconURL: (avatar ? avatar : undefined) })
    .setColor("#f04a47")
    .setTimestamp(new Date())
    .addFields(
      { name: "**User**", value: escapeMarkdown(user.tag), inline: true },
      { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
      { name: "**Reason**", value: reason, inline: true }
    );

  if (user.id === interaction.client.user.id) return interaction.followUp("I just deleted my own warn <:trollface:990669002999201852>")

  if (!joke) {
    const dbcr = await db.create({
      type: "warn",
      reason: reason,
      Executor: interaction.user.tag,
      userID: user.id
    });

    logEmbed.setAuthor({ name: `Case ${dbcr.id} | Warn | ${user.tag} | ${user.id}`, iconURL: (avatar ? avatar : undefined) })

    let logChannel = await interaction.client.channels.fetch(logCha).catch(e => { })
    if (logChannel) await logChannel.send({ embeds: [logEmbed] })
  };

  await user.send({ embeds: [dmEmbed] }).catch(e => { console.error(`Couldn't message ${user.tag} (warn)`) })
  await interaction.followUp({ embeds: [replyEmbed] })
}

async function timeout(interaction, member, reason = "No reason provided", unit, RealLen, joke = false, db) {
  let length = RealLen;
  let crash = false

  if (!(member instanceof GuildMember)) {
    member = await interaction.guild.members.fetch(member).catch(() => { crash = true })
  }

  if (crash) {
    const errorEmbed = new EmbedBuilder()
      .setDescription("You can't timeout someone that isn't in the server.")
      .setColor("#ff0000")
    return interaction.followUp({ embeds: [errorEmbed] })
  }

  const replyEmbed = new EmbedBuilder()
    .setColor("#43b582")
  const avatar = await member.user.avatarURL({ extention: 'png', size: 4096 })
  const logEmbed = new EmbedBuilder()
    .setAuthor({ name: `Case idk | Timeout | ${member.user.tag} | ${getName(interaction.options.getUser("member").id, member.user, fetch)}`, iconURL: (avatar ? avatar : undefined) })
    .setColor("#f04a47")
    .setTimestamp(new Date())
    .addFields(
      { name: "**User**", value: escapeMarkdown(member.user.tag), inline: true },
      { name: "**Moderator**", value: escapeMarkdown(interaction.user.tag), inline: true },
      { name: "**Reason**", value: reason, inline: true }
    );


  if (reason !== "No reason provided") {
    replyEmbed.setDescription(`**${escapeMarkdown(member.user.tag)} has been timed out for ${RealLen} ${unit} for "${reason}".**`);
  }
  else if (reason === "No reason provided") {
    replyEmbed.setDescription(`**${escapeMarkdown(member.user.tag)} has been timed out for ${RealLen} ${unit}.**`)
  }

  if (getName(interaction.options.getUser("member").id, member.user, fetch) === interaction.client.user.id) {
    if (reason === "No reason provided") {
      replyEmbed.setDescription(`Timed out undefined for ${RealLen} ${unit}`)
      return interaction.followUp({ embeds: [replyEmbed] });
    }
    else if (reason !== "No reason provided") {
      replyEmbed.setDescription(`Timed out undefined for ${RealLen} ${unit} for **${reason}.**`)
      return interaction.followUp({ embeds: [replyEmbed] })
    }
  };

  if (joke) {
    return interaction.followUp({ embeds: [replyEmbed] })
  }

  switch (unit) {
    case "seconds": { length = Math.floor(length * 1000); break }
    case "minutes": { length = Math.floor(length * 60 * 1000); break }
    case "hours": { length = Math.floor(length * 60 * 60 * 1000); break }
    case "days": { length = Math.floor(length * 24 * 60 * 60 * 1000); break }
  }

  if (length > 2.4192e+9) {
    replyEmbed.setColor("#FF0000");
    replyEmbed.setDescription(`**I cannot timeout ${escapeMarkdown(member.user.tag)} for *that* long! You provided a time longer than 28 days!**`);
    return interaction.followUp({ embeds: [replyEmbed] });
  }
  else if (length <= 2.4192e+9) {
    if (!joke) {
      member.timeout(length, reason + "| Timeout by" + interaction.user.tag).then(async () => {
        let dbcr = await db.create({
          type: "timeout",
          reason: reason,
          Executor: interaction.user.tag,
          userID: getName(interaction.options.getUser("member").id, member.user, fetch)
        })

        logEmbed.setAuthor({ name: `Case ${dbcr.id} | Timeout | ${member.user.tag} | ${getName(interaction.options.getUser("member").id, member.user, fetch)}`, iconURL: (avatar ? avatar : undefined) })

        let logChannel = await interaction.client.channels.fetch(logCha).catch(e => { })
        if (logChannel) await logChannel.send({ embeds: [logEmbed] })
        await interaction.followUp({ embeds: [replyEmbed] })
      }).catch(err => { console.error(err); replyEmbed.setDescription(`Couldn't timeout ${escapeMarkdown(member.user.tag)}: \`\`\`${err}\`\`\``); replyEmbed.setColor("#ff0000"); return interaction.followUp({ embeds: [replyEmbed] }) })
    }
  }
}

function getName(id, user, fetch) {
  if (!fetch) return id
  return user.tags
}

module.exports = { ban, kick, warn, timeout }