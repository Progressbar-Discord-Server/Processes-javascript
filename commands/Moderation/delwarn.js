const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delogs')
    .setDescription("Delete a case")
    .addNumberOption(o => o
      .setName("case")
      .setDescription("Which case need to be deleted?")
      .setRequired(true)),
  async execute(interaction) {
    let id = interaction.options.getNumber("case")
    if (!id) return interaction.reply({ content: "I need a case id!", ephemeral: true })
    interaction.deferReply({ ephemeral: true })
    
    await interaction.client.db.Cases.destroy({ where: { id: id } })

    const embed = new EmbedBuilder()
      .setName("Deleted")
      .setDescription(`Case ${id} deleted`)
      .setTimestamp(new Date());
    
    interaction.followUp({embeds: [embed]})  
  }
}