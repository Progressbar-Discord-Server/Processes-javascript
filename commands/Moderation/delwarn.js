const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delogs')
    .setDescription("Delete a case")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addNumberOption(o => o
      .setName("case")
      .setDescription("Which case need to be deleted?")
      .setRequired(true)),
  async execute(interaction) {
    let id = interaction.options.getNumber("case", true)
    await interaction.deferReply({ ephemeral: true })
    
    await interaction.client.db.Cases.destroy({ where: { id: id } })

    const embed = new EmbedBuilder()
      .setName("Deleted")
      .setDescription(`Case ${id} deleted`)
      .setTimestamp(new Date());
    
    interaction.followUp({embeds: [embed]})  
  }
}