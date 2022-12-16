const { SlashCommandBuilder, EmbedBuilder, GuildMember } = require("discord.js")
const { AutoModCards, addCard } = require("../../Util/Cards.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcards')
    .setDescription("Adds a card to a user.")
    .addUserOption(o => o
      .setName("user")
      .setDescription("The user to add the card from.")
      .setRequired(true))
    .addStringOption(o => o
      .setName("card")
      .setDescription("What card do you want to add?")
      .setRequired(true)
      .setChoices({ name: "Browns", value: "Browns" }, { name: "Yellow", value: "Yellow" }, { name: "White", value: "White" }, { name: "Orange", value: "Orange" }, { name: "Red", value: "Red" }, { name: "Black", value: "Black" })),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })

    const card = interaction.options.getString("card", true)
    let member = interaction.options.getMember("user", true)
    let user = member.user

    if (!(member instanceof GuildMember)) {
      member = await member.fetch()
      user = await user.fetch()
    }

    let [cardDB] = await client.db.Cards.findOrCreate({
      where: { userID: user.id }
    })

    await addCard(cardDB, card)
    
    AutoModCards(interaction, cardDB, member)
    
    interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`Added a ${card} card to ${user.tag}.`).setColor("#00ff00")] })
  }
}