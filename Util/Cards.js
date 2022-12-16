const { GuildMember } = require("discord.js");
const { AutoMod, PunishmentRole } = require("../config.json");
const { timeout, ban } = require("./Moderation.js")

function catcherror(err) {
  console.error(err)
}

async function AutoModCards(interaction, cardDB, member) {
  if (!AutoMod) return;
  let cards = cardDB.dataValues

  if (cards.Red == 1 && cards.Yellow == 1) {
    ban(interaction, member, "AutoMod, 1 Black card", false, interaction.client.db.Cases, catcherror)
    cards.Black = 1
    cards.Red = 0
    cards.Yellow = 0
  }
  else if (cards.Orange == 1 && cards.Browns == 1) {
    ban(interaction, member, "AutoMod, 1 Red card: [Appeal here](https://pb95discord.cf/appeal)", false, interaction.client.db.Cases, catcherror)
    cards.Red = 1
    cards.Yellow = 0
    cards.Browns = 0
  }
  else if (cards.Yellow == 1 && cards.Browns == 1) {
    await member.roles.add(JailRole).catch(catcherror)
    cards.Orange = 1
    cards.Yellow = 0
    cards.Browns = 0
  }
  else if (cards.White == 1 && cards.Browns == 1) {
    await timeout(interaction, member, "AutoMod, 1 White card", "days", 1, false, interaction.client.db.Cases).catch(catcherror)
    cards.Yellow = 1
    cards.White = 0
    cards.Browns = 0
  }
  else if (cards.Browns == 2) {
    await member.roles.add(PunishmentRole).catch(catcherror)
    cards.White = 1
    cards.Browns = 0
  }
  cardDB.dataValues = cards
  cardDB.save()
}

async function addCard(db, card) {
  await db.increment(card)
}

async function removeCard(db, card) {
  await db.decrement(card)
}

module.exports = {AutoModCards, addCard, removeCard}