const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription("Get something")
    .addStringOption(o => o
      .setName('what')
      .setDescription("What do you want to get?")
      .setRequired(true)
      .addChoices({ name: 'Role Icon', value: 'ri' }, { name: 'Role Color', value: 'rc' })),
  async execute(interaction) {
    const choice = interaction.options.getString("what")
    const guildRole = await interaction.guild.role.fetch()

    if (choice = "ri") {
      let array = []
      guildRole.forEach(e => {
        array.push(e.iconURL({format: 'png', size: 4096}))
      });
      interaction.reply(array)
    }
  }
}