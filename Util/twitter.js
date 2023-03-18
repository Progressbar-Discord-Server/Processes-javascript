const { twitter } = require("../config.js");

const twitterClient = new (require('twitter-api-v2')).TwitterApi({
  appKey: twitter.app.key,
  appSecret: twitter.app.secret,
  accessToken: twitter.access.token,
  accessSecret: twitter.access.secret
});

async function sendTweet(reaction) {
  reaction = await reaction.fetch();
  let message = reaction.message
  let reactionCount = reaction.count

  if (reaction.users.cache.has(message.author.id)) reactionCount--;
  if (reactionCount < 3) return;

  let [_, created] = await client.db.Mastodon.findOrCreate({ where: { MessageId: message.id } })
  if (!created) return;

  if (message.content.length > 280) throw new Error(`Length is more then 280 caracters, this is not yet supported (Twitter) (Message id is ${message.id})`)
  twitterClient.v2.tweet(message.content)
}

module.exports = { sendTweet }