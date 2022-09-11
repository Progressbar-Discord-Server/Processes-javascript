const { Message } = require("discord.js");
const { EmbedBuilder } = require("discord.js")
const { starBoardCha } = require("../config.json")

async function StarboardAdd(reaction) {
  if (reaction.emoji.name !== "⭐") return;
  const message = reaction.message
  let rcount = reaction.count
  const db = reaction.client.db.Star

  //if (reaction.users.cache.has(message.author.id)) rcount -= 1

  const dbData = await db.findOne({ where: { messageId: message.id } })

  if (rcount >= 1 && !dbData) {
    const starEmbed = createEmbed(message)
    reaction.client.channels.cache.get(starBoardCha).send({ content: `**${rcount}**⭐ | <#${message.channel.id}>`, embeds: [starEmbed] })
      .then(async ownmessage => {
        await db.create({
          messageId: message.id,
          messageIdBot: ownmessage.id
        })
      })
      .catch(console.error)
  }
  else if (dbData) {
    const starEmbed = createEmbed(message)
    reaction.client.channels.cache.get(starBoardCha).messages.fetch(dbData.messageIdBot)
      .then(e => {
        e.edit({ content: `**${rcount}**⭐ | <#${message.channel.id}>`, embeds: [starEmbed] })
      })
  }
}

async function StarboardRemove(reaction) {
  const message = reaction.message
  let rcount = reaction.count
  const db = reaction.client.db.Star

  if (reaction.users.cache.has(message.author.id)) rcount -= 1

  const dbData = await db.findOne({ where: { messageId: message.id } })
  if (!dbData) return

  const avatar = reaction.message.author.avatarURL({ extension: "png", size: 4096 })
  const starEmbed = createEmbed(message)

  reaction.client.channels.cache.get(starBoardCha).messages.fetch(dbData.messageIdBot)
    .then(e => {
      e.edit({ content: `**${rcount}** ⭐ | <#${message.channel.id}>`, embeds: [starEmbed] })
    })

}

function createEmbed(message) {
  const avatar = message.author.avatarURL({ extension: "png", size: 4096 })

  const embed = new EmbedBuilder()
    .setAuthor({ name: message.author.tag, iconURL: typeof avatar === "string" ? avatar : undefined })
    .setColor("#337fd5")
    .setTimestamp(new Date())
    .addFields(
      { name: "_ _", value: `[Click to jump to message!](${message.url})` }
    )

  if (message.content) embed.setDescription(message.content)
  else if (!message.content && message.embeds[0].description) embed.setDescription(message.embeds[0].description)

  if (message.attachments.size) embed.setImage(message.attachments.first().url)

  return embed
}

module.exports = { StarboardAdd, StarboardRemove }