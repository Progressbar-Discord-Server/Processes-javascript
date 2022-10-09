const { codeBlock } = require('discord.js');
const { ContextMenuCommandInteraction } = require('discord.js');
const { ContextMenuCommandBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Edit Bot Message')
    .setType(3),
  async execute(interaction) {
    if (interaction.targetMessage.author.id !== interaction.client.user.id) return;
    await interaction.targetMessage.fetch()
    await interaction.showModal(new ModalBuilder().setCustomId("edit-message").setTitle("Edit Message").addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder()
    .setCustomId("message")
    .setLabel("message")
    .setValue(interaction.targetMessage.content)
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true))));
    interaction.awaitModalSubmit({time: 1_000_000}).then(e => {
      interaction.targetMessage.edit(e.fields.getField("message").value)
      .then(() => e.reply({content: "Done", ephemeral: true}))
      .catch(err => {e.reply({content: `An error occured: ${codeBlock(err)}`, ephemeral: true})})
    })
  }
}