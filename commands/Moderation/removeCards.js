const { SlashCommandBuilder, EmbedBuilder, User } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removecards')
    .setDescription("Remove a card to a user.")
    .addUserOption(o => o
      .setName("user")
      .setDescription("The user to remove the card from.")
      .setRequired(true))
    .addStringOption(o => o
      .setName("card")
      .setDescription("What card do you want to remove?")
      .setRequired(true)
      .setChoices({ name: "Browns", value: "Browns" }, { name: "Yellow", value: "Yellow" }, { name: "White", value: "White" }, { name: "Orange", value: "Orange" }, { name: "Red", value: "Red" }, { name: "Black", value: "Black" })),
  async execute(interaction) {
    await interaction.deferReply({ephemeral: true})

    const card = interaction.options.getString("card", true)
    let user = interaction.options.getUser("user", true)
    
    if (user instanceof User) user = await user.fetch()
    
    let [userdb] = await client.db.Cards.findOrCreate({
      where: {userID: user.id}
    })

    await userdb.decrement(card)

    interaction.followUp({embeds: [new EmbedBuilder().setTitle(`Removed a ${card} card to ${user.tag}.`).setColor("#00ff00")]})
  }
}