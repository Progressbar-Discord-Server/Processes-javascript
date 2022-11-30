const { ContextMenuCommandBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, codeBlock } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Edit Bot Message')
    .setType(3),
  async execute(interaction) {
    const message = interaction.targetMessage
    
    await message.fetch()
    await message.channel.fetch()
    if (message.author.id !== interaction.client.user.id) return interaction.reply({content: `This isn't a bot message, please chose a message from myself, <@${interaction.client.user.id}>`, ephemeral: true});
    await interaction.showModal(new ModalBuilder().setCustomId("edit-message").setTitle("Edit Message").addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder()
    .setCustomId("message")
    .setLabel("message")
    .setValue(message.content)
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true))));
    interaction.awaitModalSubmit({time: 1_000_000}).then(e => {
      message.edit(e.fields.getField("message").value)
      .then(() => e.reply({content: "Done", ephemeral: true}))
      .catch(err => {e.client.debugCha.send({content: `An error occured: ${codeBlock(err)} for editing a bot message`, ephemeral: true});e.reply({content: `An Error Occured: ${codeBlock(err)}`})})
    })
  }
}