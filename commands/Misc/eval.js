const { SlashCommandBuilder } = require("discord.js");
const { OwnerId } = require("../../config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Execute Unsigned code")
    .addStringOption(o => o
      .setName("code")
      .setDescription("The code to execute")),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })
    const code = interaction.options.getString("code")
    if (OwnerId instanceof Array) {
      let Use = false
      OwnerId.forEach(e => {
        if (interaction.user.id === e) return Use = true
      })

      if (Use) await new Promise(() => eval(code)).catch(err => {interaction.followUp(`A error occured: \`\`\`${err}\`\`\``).catch(e => {});console.error("Slash Eval Error:\n" + err)})
      else return interaction.followUp("You aren't authorized to execute this")
    }
    else if (OwnerId instanceof String) {
      if (interaction.user.id !== OwnerId) return interaction.followUp("You aren't authorized to execute this")
      else await new Promise(eval(code)).catch(console.error)
    }
  }
}