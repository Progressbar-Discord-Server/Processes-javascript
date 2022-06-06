const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription("Get something")
    .addStringOption(o => o
      .setName('what')
      .setDescription("What do you want to get?")
      .addChoices({ name: 'Role Icon', value: 'ri' }, { name: 'Role Color', value: 'rc' })
      .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const choice = interaction.options.getString("what")
    const guildRole = await interaction.guild.roles.fetch()

    if (choice === "ri") {
      let ArrayURL = []
      guildRole.forEach(e => {
        if (e.iconURL()) {
          let icon = e.iconURL({ format: 'png', size: 4096 })
          let name = e.name
          ArrayURL.push(`${icon} for ${name}\n`)
        }
      });

      if (ArrayURL && ArrayURL.length > 2000) {
        interaction.followUp("I can't show you the result, too big of a message")
      }
      else if (ArrayURL) {
        interaction.followUp(ArrayURL)
      }
      else if (!ArrayURL) {
        interaction.followUp("There is no role with an icon")
      }
    }
    else if (choice === 'rc') {
      let ArrColor = []
      
      guildRole.forEach(e => {
        let color = e.color
        let name = e.name
        ArrColor.push(`${color} for ${name}`)
      })
      interaction.followUp(ArrColor.join('\n'))
    }
  }
}