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
    if (!reason) reason = "No reason provided"

    if (unit == "minutes") length = Math.floor(length * 60)
    else if (unit == "hours") length = Math.floor(length * 60 * 60)
    
    if (length > 21600) {
      return interaction.reply("You set the slowmode to more then 6 hours, it's imposible for me to execute that...")
    }
    
    if (channel.type === "GUILD_TEXT") {
      channel.setRateLimitPerUser(length, reason);
      replyEmbed.setDescription(`Set **${RealLen} ${unit}** slowmode in ${channel} for "**${reason}**"`)
      replyEmbed.setColor("#00FF00")
      if (reason === "No reason provided") replyEmbed.setDescription(`Set **${RealLen} ${unit}** slowmode in ${channel}`)
      else if (reason !== "No reason provided") replyEmbed.setDescription(`Set **${RealLen} ${unit}** slowmode in ${channel} for "**${reason}**"`)
      interaction.reply(`Set **${RealLen} ${unit}** slowmode in ${channel} for "**${reason}**"`)
    } else if (channel.type === "GUILD_NEWS") {
      replyEmbed.setDescription("No")
      interaction.reply({embed: [replyEmbed]})
    } else if (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS") {
      replyEmbed.setDescription(`The specified channel (<#${channel.id}>) isn't a text channel,  I can't set a slowmode there.`)
      replyEmbed.setColor("#FF0000")
      interaction.reply({ embeds: [replyEmbed], ephemeral: true })
    }
    }
}
