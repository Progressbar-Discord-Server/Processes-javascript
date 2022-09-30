module.exports = {
  name: "messageCreate",
  on: true,
  async execute(messages) {
    if (messages.partial) {await messages.fetch().catch(e => {console.error("A partial message couldn't get fetch.")})}
    if (messages.author.id === client.user.id) return;
    
    client.messages.forEach(e => { if (e.code) e.code(messages).catch(console.error) })

    const message = client.messages.get(messages.content);
    if (!message || message?.onlyCode) return;

    message.execute(messages).catch(console.error);
  }
}