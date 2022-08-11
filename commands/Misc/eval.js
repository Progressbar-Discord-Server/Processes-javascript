const { SlashCommandBuilder } = require("discord.js");
const { OwnerId } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Execute Unsigned code")
    .addStringOption(o => o
      .setName("code")
      .setDescription("The code to execute")),
  async execute(interaction) {
    interaction.deferReply({ ephemeral: true })
    const code = interaction.options.getString("code")
    if (OwnerId instanceof Array) {
      let Use = false
      OwnerId.forEach(e => {
        if (interaction.user.id === e) return Use = true
      })
      if (Use) await eval(console.log(code))
    }
    else if (OwnerId instanceof String) {
      if (interaction.user.id !== OwnerId) return interaction.reply("You aren't authorized to execute this")
      else await eval(console.log(code))
    }
    await interaction.fetchReply()
    if (interaction.replied === false) {
      interaction.followUp("Unsigned code executed.")
    }
  }
}