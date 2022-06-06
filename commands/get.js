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
      let nameRole = []
      guildRole.forEach(e => {
        if (e.iconURL()) {
          let icon = e.iconURL({ format: 'png', size: 4096 })
          let name = e.name
          console.log(icon)
          ArrayURL.push(icon)
          console.log(name)
          nameRole.push(name)
        }
      });
      let FormattedURLArray = []

      for (i in ArrayURL) {
        let e = ArrayURL[i]
        let a = nameRole[i]
        FormattedURLArray.push(`${e} for ${a}`)
      }

      let FormattedURLList = FormattedURLArray.join('\n')
      console.log(ArrayURL)
      if (FormattedURLList && FormattedURLList.length > 2000) {
        interaction.followUp("I can't show you the result, too big of a message")
      }
      else if (FormattedURLList) {
        interaction.followUp(FormattedURLList)
      }
      else if (!FormattedURLList) {
        interaction.followUp("There is no role with an icon")
      }
    }
    else if (choice === 'rc') {

    }
  }
}