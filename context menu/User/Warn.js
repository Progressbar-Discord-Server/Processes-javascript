const { ContextMenuCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const { warn } = require('../../Util/Moderation')

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Warn")
    .setType(2),
  async execute(interaction) {
    interaction.showModal(new ModalBuilder().setCustomId("warn-contextmenu").setTitle("Reason").addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("The reason of this warn")
      .setStyle(TextInputStyle.Short)
      .setRequired(true))));
    interaction.awaitModalSubmit({ time: 75_000 }).then(e => {
      e.deferReply()
      warn(e, interaction.targetUser, e.fields.getTextInputValue("reason"), undefined, interaction.client.db.Cases)
    }).catch(err => { console.error(err); interaction.editReply({content: `There was an error while executing this context menu!\n\`\`\`${err} \`\`\``}).catch(e => {})});
  }
}