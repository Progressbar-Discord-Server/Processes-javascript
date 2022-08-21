const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command to test things")
    .addSubcommandGroup(scg => scg
      .setName("message")
      .setDescription("Send a message")
      .addSubcommand(sc => sc
        .setName("simple")
        .setDescription("Send a simple message")
        .addStringOption(o => o
          .setName("content")
          .setDescription("the content of the message")
          .setRequired(true)
        )
        .addBooleanOption(o => o
          .setName("ephemeral?")
          .setDescription("Is the message hidden from eveyone?")
          .setRequired(true)
        )
      )
    ),
  async execute(interaction) {
    const sc = interaction.option.getSubcommand()
    
    switch (sc) {
      case "simple": {
        interaction.reply({ content: interaction.option.getString("content"), ephemeral: interaction.option.getBoolean("ephemeral") })
      }

    }
  }
}