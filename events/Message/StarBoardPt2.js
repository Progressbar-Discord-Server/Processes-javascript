const {starBoard} = require("../../config.json");

module.exports = {
  name: 'messageReactionRemove',
  on: true,
  async execute(reaction, user) {
    if (!starBoard) return;
    if (reaction.emoji.name !== '⭐') return;

    const db = reaction.client.db.Star;
    const message = reaction.message;
    let dbInfo = db.findOne({ where: { messageId: message.id }});

    if (message.author.id === user.id) return db.update({StaredItself: false}, {where: { messageId: message.id }});
    
    let count = dbInfo.NumberStar-1;
    db.update({ NumberStar: count }, {where: {messageId: message.id}})
  }
};