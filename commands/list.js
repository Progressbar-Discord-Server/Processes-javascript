const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription("List bans and kicks and warns and stuff")
    .addSubcommand(subcommand => subcommand
      .setName('warns')
      .setDescription('List warns')
      .addUserOption(o => o
        .setName("user")
        .setDescription("The user to list warnings")
        .setRequired(true)))
    .addSubcommand(sc => sc
      .setName("bans")
      .setDescription('List bans')
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list bans (Id)")
        .setRequired(true)))
    .addSubcommand(sc => sc
      .setName("kicks")
      .setDescription("List kicks")
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list kicks (Id)")
        .setRequired(true))),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    if (subcommand == "warns") {
      const user = interaction.options.getMember("user")
      await interaction.deferReply()
      db = interaction.client.db.Cases
      warnDB = await db.findAll({
        where: {
          userID: user.id,
          type: "warn"
        },
        attributes: ['id', 'type', 'userID', 'reason', 'Executor']
      })
      let list = ""
      for (let i = 0; i < warnDB.length; i++){
        list += `${warnDB[i].reason} - *insert date here*\n`
      }
      console.log(list)
      if (list !== "") {
        interaction.followUp({ content: list, ephemeral: true })
      } else {
        interaction.followUp({ content: "There is no warn", ephemeral: true })
      }
    }
  }
}
