const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js")
const { starBoardEmoji } = require("../config.json")

function StarboardAdd(reaction) {
  starBoardEmoji.forEach(async e => {
    if (reaction.emoji.name === e.emoji) await brainAdd(reaction, e)
  })
}

function StarboardRemove(reaction) {
  starBoardEmoji.forEach(async e => {
    if (reaction.emoji.name === e.emoji) await brainRemove(reaction, e)
  })
}

async function brainAdd(reaction, setting) {
  const message = reaction.message
  let rcount = reaction.count
  const db = reaction.client.db.Star

  let ChaThd
  if (setting.thread) {
    ChaThd = await reaction.client.channels.cache.get(setting.ChaId).threads.fetch()
    ChaThd = ChaThd.threads.get(setting.ThdId)
  }
  else ChaThd = reaction.client.channels.cache.get(setting.ChaId)

  if (reaction.users.cache.has(message.author.id)) rcount--

  const dbData = await db.findOne({ where: { messageId: message.id, emoji: setting.emoji } })

  if (rcount >= 1 && !dbData) {
    const starEmbed = createEmbed(message)
    const button = createButton(message.url)

    ChaThd.send({ content: `${setting.emoji} **${rcount}** | <#${message.channel.id}>`, embeds: [starEmbed], components: [button] })
      .then(async ownmessage => {
        await db.create({
          messageId: message.id,
          messageIdBot: ownmessage.id,
          emoji: setting.emoji
        })
      })
      .catch(console.error)
  }
  else if (dbData) {
    const starEmbed = createEmbed(message)
    const button = createButton(message.url)

    ChaThd.messages.fetch(dbData.messageIdBot)
      .then((e) => {
        e.edit({ content: `${setting.emoji} **${rcount}** | <#${message.channel.id}>`, embeds: [starEmbed], components: [button] })
      })
  }
}

async function brainRemove(reaction, setting) {
  const message = reaction.message
  let rcount = reaction.count
  const db = reaction.client.db.Star

  if (reaction.users.cache.has(message.author.id)) rcount -= 1

  let ChaThd
  if (setting.thread) ChaThd = await reaction.client.channels.cache.get(setting.ChaId).threads.fetch(setting.ThdId)
  else ChaThd = reaction.client.channels.cache.get(setting.ChaId)

  const dbData = await db.findOne({ where: { messageId: message.id } })
  if (!dbData) return

  const starEmbed = createEmbed(message)
  const button = createButton(message.url)

  ChaThd.messages.fetch(dbData.messageIdBot)
    .then(e => {
      e.edit({ content: `${setting.emoji} **${rcount}**  | <#${message.channel.id}>`, embeds: [starEmbed], components: [button] })
    })
}

function createEmbed(message) {
  const avatar = message.author.avatarURL({ extension: "png", size: 4096 })

  const embed = new EmbedBuilder()
    .setAuthor({ name: message.author.tag, iconURL: typeof avatar === "string" ? avatar : undefined })
    .setColor(Math.floor(Math.random() * 16777215).toString(16))
    .setTimestamp(new Date());

  let yesnt = true

  if (message.content) embed.setDescription(message.content)
  else {
    message.embeds.forEach(e => {
      if (e.description && yesnt) { embed.setDescription(e.description); yesnt = false }
    })
  }

  if (message.attachments.size) embed.setImage(message.attachments.first().url)

  return embed
}

function createButton(url) {
  return new ActionRowBuilder()
    .addComponents(new ButtonBuilder()
      .setLabel("Original Message")
      .setStyle("Link")
      .setURL(url)
    )
}

module.exports = { StarboardAdd, StarboardRemove }