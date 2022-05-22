const { SlashCommandBuilder } = require('@discordjs/builders')

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
    let length = RealLen;

    if (channel.available) {

      if (unit == "seconds") length = Math.floor(length * 1000);
      else if (unit == "minutes") length = Math.floor(length * 60 * 1000);
      else if (unit == "hours") length = Math.floor(length * 60 * 60 * 1000);

      if (channel.isText) {
        channel.setRateLimitPerUser(length, reason);
        interaction.reply(`Set **${RealLen} ${unit}** slowmode in ${channel} for "**${reason}**"`)
      }
      else if (!channel.isText) interaction.reply({ content: `The specified channel (<#${channel.id}>) isn't a text channel,  I can't set a slowmode there.`, ephemeral: true })
    }
    else if (!channel.available) {
      interaction.reply({ content: "It seems Discord is having problems, please go to https://discordstatus.com/ to see \"when\" it will be fixed", ephemeral: true})
    }
  }
}
