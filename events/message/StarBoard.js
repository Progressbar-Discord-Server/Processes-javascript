const { starBoardCha } = require('../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'messageReactionAdd',
  on: true,
  async execute(reaction, user) {
    const message = reaction.message;
    if (message.channel.id === starBoardCha || reaction.emoji.name !== '⭐') return;
    let db = reaction.client.db.Star;

    await db.findOrCreate({ where: { messageId: message.id } });

    if (message.author.id === user.id) db.update({StaredItself: true}, {where: { messageId: message.id }});
    let dbInfo = db.findOne({ where: { messageId: message.id } });
    let count = dbInfo.NumberStar + 1;
    db.update({ NumberStar: count }, { where: { messageId: message.id } })

    if (dbInfo.StaredItself) count=count-1;
    if (count !== 1) return;

    if (dbInfo.messageIdBot !== null) {
      const starEmbed = new MessageEmbed()
        .setColor('#337fd5')
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension: 'png', size: 4096 })})
        .setThumbnail()
        .setDescription(`${message.content}`)
        .addField("_ _", `[Click to jump to message!](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`);

      if (message.attachments) {
        message.attachments.forEach(e => {
          console.log(message.attachments.contentType);
          if (message.attachments.contentType === "Image") {
            starEmbed.setImage(e.url);
          };
        });
      };

      let starCha = await message.client.guilds.cache.get('974018133021048882').channels.fetch(starBoardCha);
      starCha.send({ content: `⭐ **${count}** | ${message.channel}`, embeds: [starEmbed] });
    };
  }
};