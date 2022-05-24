const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription("set a slowmode in a channel")
    .addChannelOption(o => o
      .setName("channel")
      .setDescription("What channel do you want to apply slowmode to?")
      .setRequired(true))
    .addStringOption(o => o
      .setName('unit')
      .setDescription('the unit of time')
      .setRequired(true)
      .addChoices({ name: 'seconds', value: 'seconds' }, { name: 'minutes', value: 'minutes' }, { name: 'hours', value: 'hours' }))
    .addIntegerOption(o => o
      .setName("duration")
      .setDescription('the duration')
      .setRequired(true))
    .addStringOption(o => o
      .setName("reason")
      .setDescription("Why do you want to set a slowmode in this channel?")),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const unit = interaction.options.getString('unit');
    const RealLen = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason');
    const replyEmbed = new MessageEmbed()
    let length = RealLen;
    
    if (channel.available) {

      if (unit == "seconds") length = Math.floor(length * 1000);
      else if (unit == "minutes") length = Math.floor(length * 60 * 1000);
      else if (unit == "hours") length = Math.floor(length * 60 * 60 * 1000);

      if (channel.isText) {
        channel.setRateLimitPerUser(length, reason);
        replyEmbed.setDescription(`Set **${RealLen} ${unit}** slowmode in ${channel} for "**${reason}**"`)
        replyEmbed.setColor("#00FF00")
        interaction.reply({embeds:[replyEmbed]})
      }
      else if (!channel.isText) {
        replyEmbed.setDescription(`The specified channel (<#${channel.id}>) isn't a text channel,  I can't set a slowmode there.`)
        replyEmbed.setColor("#FF0000")
        interaction.reply({ embeds: [replyEmbed], ephemeral: true })
      }
    }
    else if (!channel.available) {
      replyEmbed.setColor("#FF0000")
      replyEmbed.setDescription("It seems Discord is having problems, please go to https://discordstatus.com/ to see \"when\" it will be fixed")
      interaction.reply({ embeds: [replyEmbed] , ephemeral: true})
    }
  }
}
