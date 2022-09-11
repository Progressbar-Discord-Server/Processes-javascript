const { StarboardAdd } = require('../../Util/Starboard.js');
const { starBoard } = require("../../config.json")

module.exports = {
  name: 'messageReactionAdd',
  on: true,
  async execute(reaction) {
    if (!reaction.partial) {
      if (starBoard) StarboardAdd(reaction)
    }
    else if (reaction.partial) {
      reaction.fetch().then(e => {
          if (starBoard) StarboardAdd(e)
      })
    }
  }
};