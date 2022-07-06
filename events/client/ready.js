module.exports = {
  name: 'ready',
  on: false,
  async execute() {
    client.db.Cases.sync();
    let guilds = await client.guilds.fetch()
  
    guilds.forEach(async guild => {
      let guildFetched = await guild.fetch()
      await guildFetched.channels.fetch()
      console.log(`Channels of ${guildFetched.name} loaded (${guildFetched.id})`)
    });
  
    console.log(`Login as ${client.user.tag}`);
  }
}