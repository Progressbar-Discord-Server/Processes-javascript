const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, MessageType } = require("discord.js")
const { starBoardEmoji, guildMainId } = require("../config.json")

function StarboardAdd(reaction) {
  if (reaction.message.guildId !== guildMainId) return
  starBoardEmoji.forEach(async e => {
    if (reaction.emoji.name === e.emoji && e.ChaId) await brainAdd(reaction, e)
  })
}

function StarboardRemove(reaction) {
  starBoardEmoji.forEach(async e => {
    if (reaction.emoji.name === e.emoji && e.ChaId) await brainRemove(reaction, e)
  })
}

async function brainAdd(reaction, setting) {
  const message = reaction.message
  let rcount = reaction.count
  const db = reaction.client.db.Star

  let ChaThd
  if (setting.thread && setting.ThdId) ChaThd = await (await reaction.client.channels.fetch(setting.ChaId)).threads.fetch(setting.ThdId)
  else ChaThd = await reaction.client.channels.fetch(setting.ChaId)

  if (reaction.users.cache.has(message.author.id)) rcount--

  const dbData = await db.findOne({ where: { messageId: message.id, emoji: setting.emoji } })

  if (rcount >= 5 && !dbData) {
    let mesDate = new Date(message.createdTimestamp)
    let now = new Date()
    let diffTime = Math.abs(now.getTime - mesDate.getTime)
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays >= 20) return;

    const starEmbed = await createEmbed(message)
    const buttons = await createButton(message)

    ChaThd.send({ content: `${setting.emoji} **${rcount}** | <#${message.channel.id}>`, embeds: starEmbed, components: buttons })
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
    const starEmbed = await createEmbed(message)
    const buttons = await createButton(message)

    ChaThd.messages.fetch(dbData.messageIdBot)
      .then((e) => {
        e.edit({ content: `${setting.emoji} **${rcount}** | <#${message.channel.id}>`, embeds: starEmbed, components: buttons })
      })
  }
}

async function brainRemove(reaction, setting) {
  const message = reaction.message
  let rcount = reaction.count
  const db = reaction.client.db.Star

  if (reaction.users.cache.has(message.author.id)) rcount -= 1

  const dbData = await db.findOne({ where: { messageId: message.id, emoji: setting.emoji } })
  if (!dbData) return

  let ChaThd
  if (setting.thread && setting.ThdId) ChaThd = await (await reaction.client.channels.fetch(setting.ChaId)).threads.fetch(setting.ThdId)
  else ChaThd = await reaction.client.channels.fetch(setting.ChaId)

  const starEmbed = await createEmbed(message)
  const buttons = await createButton(message)

  ChaThd.messages.fetch(dbData.messageIdBot)
    .then(e => {
      e.edit({ content: `${setting.emoji} **${rcount}**  | <#${message.channel.id}>`, embeds: starEmbed, components: buttons })
    })
}

async function createEmbed(MainMessage) {
  const avatar = MainMessage.author.avatarURL({ extension: "png", size: 4096 })

  const embed = new EmbedBuilder()
    .setAuthor({ name: (MainMessage.author.tag.endsWith("#0000") ? MainMessage.author.tag.slice(0, -5) : MainMessage.author.tag), iconURL: typeof avatar === "string" ? avatar : undefined })
    .setColor(Math.floor(Math.random() * 16777215).toString(16))
    .setTimestamp(new Date());

  if (MainMessage.content) embed.setDescription(MainMessage.content)
  else if (MainMessage.embeds[0]) {
    let yesnt = true
    MainMessage.embeds.forEach(e => { if (e.description && yesnt) { embed.setDescription(e.description); yesnt = false } })
  }

  if (MainMessage.attachments.size) embed.setImage(MainMessage.attachments.first().url)

  if (MainMessage.type === MessageType.Reply) {
    await MainMessage.fetchReference().then(reference => {
      if (reference.content) embed.setFields({ name: "Replied to:", value: reference.content })
      else if (reference.embeds[0]) {
        let yesnt = true
        reference.embeds.forEach(e => { if (e.description && yesnt) { embed.setFields({ name: "Replied to:", value: e.description }); yesnt = false } })
      }
    })
  }

  return [embed]
}

async function createButton(message) {
  let buttons = [new ActionRowBuilder()
    .addComponents(new ButtonBuilder()
      .setLabel("Original Message")
      .setStyle("Link")
      .setURL(message.url)
    )]

  if (message.type === MessageType.Reply) {
    await message.fetchReference().then(reference => buttons.push(new ActionRowBuilder()
      .addComponents(new ButtonBuilder()
        .setLabel("Reply Message")
        .setStyle("Link")
        .setURL(reference.url)
      )))
  }
  return buttons
}

module.exports = { StarboardAdd, StarboardRemove }