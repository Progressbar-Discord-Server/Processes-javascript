const { ChannelType } = require('discord.js')

module.exports = {
  message: "CrossPost",
  async code(messages) {
    await messages.fetch()
    if (messages.author === "282286160494067712" && messages.channel.type === ChannelType.GuildNews) {
      this.execute(messages);
    }
  },
  async execute(messages) {
    messages.crosspost()
      .then((message) => {
        console.log(`Crossposted ${message.content.slice(4)}`);
      }).catch(console.error);
  }
}