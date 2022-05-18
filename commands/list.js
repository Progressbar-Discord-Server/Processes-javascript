const { SlashCommandBuilder } = require('@discordjs/builders')
const { guildId } = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
      .setName('list')
      .setDescription("List bans and kicks and warns and stuff")
      .addSubcommand(subcommand => subcommand
            .setName('warns')
            .setDescription('list warns')
            )
}