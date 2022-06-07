const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageAttachment } = require('discord.js')
const { CreateAndWrite, ReadFile } = require('../Util/someFun.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription("Get something")
    .addSubcommand(sc => sc
      .setName('role icon')
      .setDescription("Getting All Icons of All Roles"))
      .addStringOption(o => o
        .setName("format")
        .setDescription("In what format do you want the icons?")
        .setRequired(true)
        .addChoices({name: 'webp',value: 'webp'}, {name: 'png', value: 'png'}, {name: 'jpg', value: 'jpg'}, {name: 'jpeg', value: 'jpeg'}))
        .addNumberOption(o => o
          .setName('size')
          .setDescription('At what size do you want the icon to be? (pixel)')
          .setRequired(true))
          .addChoices({name: '16',value: 16},{name: '32',value: 32},{name: '56',value: 56},{name: '64',value: 64},{name: '96',value: 96},{name: '128',value: 128},{name: '256',value: 256},{name: '300',value: 300},{name: '512',value: 512},{name: '600',value: 600},{name: '1024',value: 1024},{name: '2048',value: 2048},{name: '4096',value: 4096})
    .addSubcommand(sc => sc
      .setName('Role Color')
      .setDescription("Getting All Colors of All Roles")),
  async execute(interaction) {
    await interaction.deferReply()
    const choice = interaction.options.getString("what")
    const guildRole = await interaction.guild.roles.fetch()

    if (choice === "ri") {
      const format = interaction.options.getString("format")
      const size = interaction.options.getNumber("size")
      let ArrayURL = []

      guildRole.forEach(e => {
        if (e.iconURL()) {
          let icon = e.iconURL({ format: format, size: size })
          let name = e.name
          ArrayURL.push(`${icon} for ${name}\n`)
        }
      });

      if (ArrayURL) {
        console.log(ArrayURL)
        CreateAndWrite('/Tmp/log.txt', ArrayURL.toString())
        const file = new MessageAttachment(ReadFile('Tmp/log.txt'), 'result.txt')
        interaction.followUp({files: [file]})
      }
      else if (!ArrayURL) {
        interaction.followUp("There is no role with an icon")
      }
    }
    else if (choice === 'rc') {
      let ArrColor = []
      
      guildRole.forEach(e => {
        let color = e.color
        console.log('color is equal to ', color)
        let name = e.name
        if (color !== '0') ArrColor.push(`${color} for ${name}\n`)
      })
      if (ArrColor) {
        console.log(ArrColor)
        CreateAndWrite('/Tmp/log.txt', ArrColor.toString())
        const file = new MessageAttachment(ReadFile('Tmp/log.txt'), 'result.txt')
        interaction.followUp({ files: [file]})
      }
      else if (!ArrColor) {
        interaction.followUp("No role have color")
      }
    }
  }
}