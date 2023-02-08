const { ChannelType } = require('discord.js')

module.exports = {
  message: "CrossPost",
  onlyCode: true,
  async code(messages) {
    await messages.fetch()
    if (messages.author.id === "282286160494067712" && messages.channel.type === ChannelType.GuildAnnouncement) {
      this.execute(messages);
    }
  },
  async execute(messages) {
    messages.crosspost()
      .then((message) => {
        console.log(`Crossposted a message (${message.id})`);
      }).catch(console.error);
  }
}