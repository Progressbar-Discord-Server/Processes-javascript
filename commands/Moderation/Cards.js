const { SlashCommandBuilder, EmbedBuilder, GuildMember } = require("discord.js")
const { AutoModCards, addCard, removeCard } = require("../../Util/Cards.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cards')
    .setDescription("See and modify cards of a user")
    .addSubcommand(sc => sc
      .setName("add")
      .setDescription("Add a card to a specific user")
      .addUserOption(o => o
        .setName("user")
        .setDescription("The user to add the card from.")
        .setRequired(true))
      .addStringOption(o => o
        .setName("card")
        .setDescription("What card do you want to add?")
        .setRequired(true)
        .setChoices({ name: "Browns", value: "Browns" }, { name: "White", value: "White" }, { name: "Yellow", value: "Yellow" }, { name: "Orange", value: "Orange" }, { name: "Red", value: "Red" }, { name: "Black", value: "Black" })))
    .addSubcommand(sc => sc
      .setName('remove')
      .setDescription("Remove a card to a user.")
      .addUserOption(o => o
        .setName("user")
        .setDescription("The user to remove the card from.")
        .setRequired(true))
      .addStringOption(o => o
        .setName("card")
        .setDescription("What card do you want to remove?")
        .setRequired(true)
        .setChoices({ name: "Browns", value: "Browns" }, { name: "White", value: "White" }, { name: "Yellow", value: "Yellow" }, { name: "Orange", value: "Orange" }, { name: "Red", value: "Red" }, { name: "Black", value: "Black" })))
    .addSubcommandGroup(scg => scg
      .setName("list")
      .setDescription("List cards.")
      .addSubcommand(sc => sc
        .setName("all")
        .setDescription("List the user that got some cards")
        .addIntegerOption(o => o
          .setName("page")
          .setDescription("Which page do you want to read")
          .setRequired(true)))
      .addSubcommand(sc => sc
        .setName('user')
        .setDescription("List the cards of a user.")
        .addUserOption(o => o
          .setName("user")
          .setDescription("The user to list cards from.")
          .setRequired(true)))),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })

    switch ((interaction.options.getSubcommandGroup() ? interaction.options.getSubcommandGroup() + " " : "") + interaction.options.getSubcommand(true)) {
      case "add": {
        const card = interaction.options.getString("card", true)
        let member = interaction.options.getMember("user", true)

        if (!(member instanceof GuildMember)) {
          try {
            interaction.guild.members.fetch(member)
          }
          catch {
            return await interaction.followUp("You can't add a card to someone that isn't in the server!")
          }
        }

        let user = member.user

        if (!(member instanceof GuildMember)) { [member, user] = await Promise.all(member.fetch(), user.fetch()) }

        let [cardDB] = await client.db.Cards.findOrCreate({
          where: { userID: user.id }
        })

        await addCard(cardDB, card)
        cardDB.dataValues[card] += 1

        AutoModCards(interaction, cardDB, member).catch(console.error)

        interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`Added a ${card} card to ${user.tag}.`).setColor("#00ff00")] })
        break;
      }
      case "remove": {
        const card = interaction.options.getString("card", true)
        let member = interaction.options.getMember("user", true)

        if (!(member instanceof GuildMember)) {
          try {
            interaction.guild.members.fetch(member)
          }
          catch {
            return interaction.followUp("You can't add a card to someone that isn't in the server!")
          }
        }

        let user = member.user

        if (!(member instanceof GuildMember)) { [member, user] = await Promise.all(member.fetch(), user.fetch()) }

        let [cardDB] = await client.db.Cards.findOrCreate({
          where: { userID: user.id }
        })

        await removeCard(cardDB, card)

        interaction.followUp({ embeds: [new EmbedBuilder().setTitle(`Removed a ${card} card to ${user.tag}.`).setColor("#00ff00")] })
        break;
      }
      case "list user": {
        let member = interaction.options.getMember("user", true)
        let user = member.user

        if (!(member instanceof GuildMember)) { [member, user] = await Promise.all(member.fetch(), user.fetch()) }

        let cards = await client.db.Cards.findOne({
          where: {
            userID: user.id,
          }
        })

        if (cards == null) return interaction.followUp({ embeds: [new EmbedBuilder().setTitle("This user doesn't have any cards!").setColor("#ff0000")], ephemeral: true })

        const replyEmbed = new EmbedBuilder()
          .setAuthor({ name: user.tag, iconURL: user.avatarURL({ extension: "png", size: 4096 }) })
          .setColor("#00ff00")
          .setDescription(`🟫 **Browns**: ${cards.dataValues.Browns}\n⬜ **White**: ${cards.dataValues.White}\n🟨 **Yellow**: ${cards.dataValues.Yellow}\n🟧 **Orange**: ${cards.dataValues.Orange}\n🟥 **Red** : ${cards.dataValues.Red}\n⬛ **Black**: ${cards.dataValues.Black}\n`)

        interaction.followUp({ embeds: [replyEmbed], ephemeral: true })
        break;
      }
      case "list all": {
        let arr = [];
        let page = interaction.options.getInteger("page") * 10;

        (await client.db.Cards.findAll({
          attributes: ["userID"]
        })).forEach(e => arr.push(e.dataValues.userID));

        if (page / 10 < Math.ceil(arr.length / 10)) {
          let userID = []
          for (let i = page - 10; i < page; i++) {
            if (arr[i] != undefined) userID.push(arr[i])
          }
        }
        else if (page / 10 > Math.ceil(arr.length / 10)) {
          return interaction.followUp({embeds: [new EmbedBuilder().setColor("#ff0000").setDescription(`**There is only ${Math.ceil(arr.length / 10)} pages! How do you want me to load you page ${page / 10}?**`)]})
        }

        interaction.followUp({ embeds: [new EmbedBuilder().setDescription(("<@" + userID.join(">\n<@")) + ">").setFooter({ text: `Page ${page / 10} of ${Math.ceil(arr.length / 10)}` })] })
        break;
      }
    }
  }
}