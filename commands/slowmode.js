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
    let reason = interaction.options.getString('reason');
    let length = RealLen;

    if (!reason) reason = "No reason provided"

    if (unit == "minutes") length = Math.floor(length * 60)
    else if (unit == "hours") length = Math.floor(length * 60 * 60)

    if (length > 21600) {
      return interaction.reply("You set the slowmode to more then 6 hours, it's imposible for me to execute that...")
    }
    
    if (channel.type === "GUILD_TEXT") {
      channel.setRateLimitPerUser(length, reason);
      if (reason === "No reason provided") interaction.reply(`Set **${RealLen} ${unit}** slowmode in ${channel}`)
      else if (reason !== "No reason provided") interaction.reply(`Set **${RealLen} ${unit}** slowmode in ${channel} for "**${reason}**"`)
    } else if (channel.type === "GUILD_NEWS") {
      interaction.reply("No")
    } else if (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS") interaction.reply({ content: `The specified channel (<#${channel.id}>) isn't a text channel,  I can't set a slowmode there.`, ephemeral: true })
    }
}
