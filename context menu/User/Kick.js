const { ContextMenuCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const { kick } = require('../../Util/Moderation')

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Kick")
    .setType(2),
  async execute(interaction) {
    if (interaction.targetMember.kickable) {
      interaction.showModal(new ModalBuilder().setCustomId("kick-contextmenu").setTitle("Reason").addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("The reason of this kick")
        .setStyle(TextInputStyle.Short)
        .setRequired(true))));
      interaction.awaitModalSubmit({ time: 75_000 }).then(e => {
        e.deferReply()
        kick(e, interaction.targetMember, e.fields.getTextInputValue("reason"), undefined, interaction.client.db.Cases)
      }).catch(err => { console.error(err); interaction.editReply({content: `There was an error while executing this context menu!\n\`\`\`${err} \`\`\``, ephemeral: true}).catch(e => {})});
    } else interaction.reply({content: `${escapeMarkdown(interaction.targetMember.user.tag)} can't be banned!`, ephemeral: true})
  }
}