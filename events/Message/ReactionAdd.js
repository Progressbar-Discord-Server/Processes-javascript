const { StarboardAdd } = require('../../Util/Starboard.js');
const { starBoard, mastodon, twitter } = require("../../config.js");
const { checkReactionNumber } = require('../../Util/mastodon.js');
const { sendTweet } = require('../../Util/twitter.js');

module.exports = {
  name: 'messageReactionAdd',
  on: true,
  async execute(reaction) {
    if (!reaction.partial) {
      if (starBoard) StarboardAdd(reaction)
      if (mastodon.enable && reaction.emoji.name == "🔁") checkReactionNumber(reaction)
      if (twitter.enable && reaction.emoji.name == "🔁") sendTweet(reaction);
    }
    else if (reaction.partial) {
      reaction.fetch().then(e => {
        if (starBoard) StarboardAdd(e)
        if (mastodon.enable && reaction.emoji.name == "🔁") checkReactionNumber(e)
        if (twitter.enable && reaction.emoji.name == "🔁") sendTweet(e)
      }).catch(console.error)
    }
  }
}