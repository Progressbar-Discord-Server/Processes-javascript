const { catcherror, Cards: { AutoMod, PunishmentRole, JailRole } } = require("../config.js");
const { timeout, ban } = require("./Moderation.js")

if (catcherror == undefined) function catcherror(err) { console.error(err) }

async function AutoModCards(interaction, cardDB, member) {
  if (!AutoMod) return;
  let cards = cardDB.dataValues

  member = await interaction.guild.members.fetch({user: member, force: true})

  if (cards.Red == 1 && cards.Orange == 1) {
    await ban(interaction, member, "AutoMod, 1 Black card", false, interaction.client.db.Cases, false).catch(catcherror)
    await cardDB.increment(Black)
    await cardDB.decrement(["Red", "Orange"])
  }
  else if (cards.Orange == 1 && cards.Browns == 1) {
    await ban(interaction, member, "AutoMod, 1 Red card, You can Appeal [here](https://pb95discord.cf/appeal)", false, interaction.client.db.Cases, false).catch(catcherror)
    await cardDB.increment("Red")
    await cardDB.decrement(["Orange", "Browns"])
  }
  else if (cards.Yellow == 1 && cards.Browns == 1) {
    if (!member.roles.cache.has(JailRole)) await member.roles.add(JailRole, "AutoMod, 1 Orange card.").catch(catcherror)
    await cardDB.increment("Orange")
    await cardDB.decrement(["Yellow", "Browns"])
  }
  else if (cards.White == 1 && cards.Browns == 1) {
    await timeout(interaction, member, "AutoMod, 1 Yellow card", "days", 1, false, interaction.client.db.Cases, false).catch(catcherror)
    await cardDB.increment("Yellow")
    await cardDB.decrement(["White", "Browns"])
  }
  else if (cards.Browns == 2) {
    if (!member.roles.cache.has(PunishmentRole)) await member.roles.add(PunishmentRole, "AutoMod, 1 White card.").catch(catcherror)
    await cardDB.increment("White")
    await cardDB.decrement("Browns", { by: 2 })
  }
}

async function addCard(db, card) {
  await db.increment(card)
}

async function removeCard(db, card) {
  await db.decrement(card)
}

module.exports = { AutoModCards, addCard, removeCard }