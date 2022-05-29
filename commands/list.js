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
      list = await db.findAll({
        where: {
          userID: user.id,
          type: "warn"
        }, 
        attributes: ['id', 'type', 'userID', 'reason', 'Executor']
      })
      list = list[0].dataValues.toString()
      console.log(list)
      if (list !== []) {
        interaction.followUp({content: list, ephemeral: true})
      } else {
        interaction.followUp({content: "There is no warn", ephemeral: true})
      }
		}
	}
}
