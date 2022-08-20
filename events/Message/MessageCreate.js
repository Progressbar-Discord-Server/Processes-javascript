module.exports = {
  name: "messageCreate",
  on: true,
  async execute(messages) {
    if (messages.author.id === client.user.id) return;
    
    client.messages.forEach(e => { if (e.code) e.code(messages).catch(console.error) })

    const message = client.messages.get(messages.content);
    if (!message) return;

    await message.execute(messages).catch(console.error);
  }
}