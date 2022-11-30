const { StarboardRemove } = require("../../Util/Starboard.js");
const { starBoard } = require("../../config.json")

module.exports = {
  name: 'messageReactionRemove',
  on: true,
  async execute(reaction) {
    if (!reaction.partial) {
      if (starBoard) StarboardRemove(reaction)
    }
    else if (reaction.partial) {
      reaction.fetch().then(e => {
        if (starBoard) StarboardRemove(e)
      }).catch(console.error)
    }
  }
}