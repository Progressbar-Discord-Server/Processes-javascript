
async function add(reaction, user) {
  console.log("add function executed")
  if (user.id === user.client.id) return;

  reaction.message.channel.send(`you reacted with ${reaction.emoji}`)
}

async function remove(reaction, user) {
  console.log("remove function executed")
  if (user.id === user.client.id) return;

  reaction.message.channel.send(`you deleted ${reaction.emoji}`)
}

module.exports = {add, remove}