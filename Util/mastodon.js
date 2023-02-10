const { default: axios } = require("axios");
let { mastodon } = require("../config")

async function checkReactionNumber(reaction) {
  reaction = await reaction.fetch()
  let message = reaction.message
  let reactionCount = reaction.count

  if (reaction.users.cache.has(message.author.id)) reactionCount--
  if (reactionCount < 5) return

  let [_, created] = await client.db.Mastodon.findOrCreate({ where: { MessageId: message.id } })

  if (!created) return;

  await sentToMastodon(message)
}

async function sentToMastodon(message) {
  if (message.content.replaceAll("@", "@ ").length > 500) await new Promise((_, reject) => reject(new Error(`Length is more then 500 caracters, this is not yet supported (Message id is ${message.id})`)))

  await axios({
    url: mastodon.server.endsWith("/") ? mastodon.server + "api/v1/statuses" : mastodon.server + "/api/v1/statuses",
    method: "POST",
    headers: {
      Authorization: `Bearer ${mastodon.token}`,
    },
    data: {
      status: message.content.replaceAll("@", "@ ")
    }
  })
}

module.exports = { checkReactionNumber }