const { showLink } = require('../../config.json')
const { ProcessDOS } = require('../../Util/Dos.js')
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'ready',
  on: false,
  async execute(client) {
    client.db.Cases.sync();
    client.db.Star.sync();
    
    let guilds = await client.guilds.fetch()
  
    guilds.forEach(async guild => {
      let guildFetched = await guild.fetch()
      await guildFetched.channels.fetch()
      console.log(`Channels of ${guildFetched.name} loaded (${guildFetched.id})`)
    });
    if (showLink) {
      console.log(client.generateInvite({
        permissions: PermissionsBitField.All,
        scopes: ["applications.commands", "bot"]
      }))
    }
  
    console.log(`Login as ${client.user.tag}`);
    ProcessDOS(client)
  }
};