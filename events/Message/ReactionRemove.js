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
      if (reaction.message.id != undefined &&
        reaction.count != undefined &&
        reaction.emoji.name != undefined &&
        reaction.message.content != undefined &&
        reaction.message.author.id != undefined) {
        if (starBoard) StarboardRemove(reaction)
      }
    }
  }
}