const { redditCha, reddit } = require("../../config.json")

module.exports = {
  message: "reddit",
  onlyCode: true,
  async code(messages) {
    await messages.fetch()
    if (messages.channel.id === redditCha && messages.embeds[0]?.title && reddit) {
      this.execute(messages);
    }
  },
  async execute(messages) {
    messages.startThread({name: messages.embeds[0].title})
  }
}