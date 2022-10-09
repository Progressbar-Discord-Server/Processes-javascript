const { GuildMember } = require('discord.js');
const { AtSomeone } = require('../../config.json') || false;


async function randomMember(memberList) {
  let member = memberList.random();
  
  if (!(member instanceof GuildMember)) {
    await message.guild.members.fetch(member);
  }
  return member
}
module.exports = {
  message: '@someone',
  onlyCode: false,
  async execute(message) {
    if (!AtSomeone) return;
    let memberList = await message.guild.members.fetch({ force: true });
    let member = await randomMember(memberList)
    
    while (member.user.bot) {
      member = await randomMember(memberList)
    }

    console.log(`${message.author.tag} has used @someone and ping ${member.user.tag}`)
    message.channel.send(`<@${member.user.id}>`).then(e => {e.delete()})
  }
};