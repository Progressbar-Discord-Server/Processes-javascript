const { redditCha, redditTalkCha } = require("../../config.json")

module.exports = {
  message: "reddit",
  onlyCode: true,
  async code(messages) {
    await messages.fetch()
    if (messages.channel.id === redditCha && messages.embeds[0]?.title) {
      this.execute(messages);
    }
  },
  async execute(messages) {
    await (await messages.client.channels.fetch(redditTalkCha)).threads.create({name: messages.embeds[0].title})
  }
}