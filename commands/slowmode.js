const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription("set a slowmode to a channel")
    .addChannelOption(o => o
      .setName("channel")
      .setDescription("what channel do you want the slowmode to be?")
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
      .setDescription("why do you want to slowmode this channel?")),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const unit = interaction.options.getString('unit');
    const RealLen = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason');
    let length = RealLen;

    if (unit == "seconds") length = Math.floor(length * 1000);
    else if (unit == "minutes") length = Math.floor(length * 60 * 1000);
	  else if (unit == "hours") length = Math.floor(length * 60 * 60 * 1000);
    
    if (channel.isText) channel.setRateLimitPerUser(length, reason);
    interaction.reply(`${channel} has been slowmode for **${RealLen} ${unit}** for "**${reason}**"`)
  }
}
