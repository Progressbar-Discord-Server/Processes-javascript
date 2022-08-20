const { ModalSubmitInteraction } = require("discord.js");
const { ContextMenuCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { ban } = require("../../../Util/Moderation");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Ban")
    .setType(2),
  async execute(interaction) {
    if (interaction.targetMember.bannable) {
      interaction.showModal(new ModalBuilder().setCustomId("ban-contextmenu").setTitle("Reason").addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("The reason of this ban")
        .setStyle(TextInputStyle.Short)
        .setRequired(true))));
      interaction.awaitModalSubmit({ time: 75_000 }).then(async e => {
        await e.deferReply(); await e.deleteReply()
        ban(interaction, interaction.targetMember, e.fields.getTextInputValue("reason"), undefined, e.client.db.Cases)
      }).catch(err => { console.error(err); interaction.editReply({content: `There was an error while executing this context menu!\n\`\`\`${err} \`\`\``}).catch(e => {})});
    }
  }
}