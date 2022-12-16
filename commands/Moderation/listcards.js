const { SlashCommandBuilder, EmbedBuilder, User } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listcards')
    .setDescription("List the cards of a user.")
    .addUserOption(o => o
      .setName("user")
      .setDescription("The user to list cards from.")
      .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })
    const user = interaction.options.getUser("user")

    if (!(user instanceof User)) user = await user.fetch()

    let cards = await client.db.Cards.findOne({
      where: {
        userID: user.id,
      }
    })

    if (cards == null) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("This user doesn't have any cards!").setColor("#ff0000")], ephemeral: true })

    let Allcards = Object.keys(cards.dataValues).filter(e => { if (e === "userID") return; else return e })

    const replyEmbed = new EmbedBuilder()
      .setAuthor({ name: user.tag, iconURL: user.avatarURL({ extension: "png", size: 4096 }) })
      .setColor("#00ff00")
      .setDescription(`🟫 **Browns**: ${cards.dataValues.Browns}\n⬜ **White**: ${cards.dataValues.White}\n🟨 **Yellow**: ${cards.dataValues.Yellow}\n🟧 **Orange**: ${cards.dataValues.Orange}\n🟥 **Red** : ${cards.dataValues.Red}\n⬛ **Black**: ${cards.dataValues.Black}\n`)

    return interaction.followUp({ embeds: [replyEmbed], ephemeral: true })
  }
}