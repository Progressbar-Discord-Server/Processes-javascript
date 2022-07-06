const { starBoardCha } = require('../../config.json')
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'messageReactionAdd',
  on: true,
  async execute(reaction, user) {
    const message = reaction.message;
    let count = reaction.count;
    if (message.author.id === user.id) count=count-1;
    if (message.channel.id === starBoardCha || reaction.emoji.name !== '⭐' || count !== 1) return;
    
    const starEmbed = new MessageEmbed()
    .setColor('#337fd5')
    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({extension: 'png', size: 4096})})
    .setThumbnail()
    .setDescription(`${message.content}`)
    .addField("_ _", `[https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}](Click to jump to message!)`)
    
    let starCha = await message.client.guilds.cache.get('974018133021048882').channels.fetch(starBoardCha)
    starCha.send({ content: `⭐ **${reaction.count}** | ${message.channel}`, embeds: [starEmbed] })
  }
}