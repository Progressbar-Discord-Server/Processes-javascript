const { GuildMember } = require('discord.js');
const { AtSomeone } = require('../../config.json') || false;

module.exports = {
  message: '@someone',
  async execute(message) {
    if (AtSomeone) {
      let memberList = await message.guild.members.fetch({ force: true });
      let member = memberList.random();

      if (!(member instanceof GuildMember)) {
        await message.guild.members.fetch(member);
      }
      
      console.log(member)
      message.channel.send(`<@${member.user.id}>`);
    }
  }
}