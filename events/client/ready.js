const { showLink } = require('../../config.json')

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
    if (showLink) {
      console.log(`https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=1644971949567&scope=bot%20applications.commands`);
    }
  
    console.log(`Login as ${client.user.tag}`);
  }
}