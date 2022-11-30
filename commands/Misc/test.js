const { CommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command to test things")
    .addSubcommandGroup(scg => scg
      .setName("message")
      .setDescription("Send a message")
      .addSubcommand(sc => sc
        .setName("simple")
        .setDescription("Send a simple message")
        .addStringOption(o => o
          .setName("content")
          .setDescription("the content of the message")
          .setRequired(true)
        )
        .addBooleanOption(o => o
          .setName("ephemeral")
          .setDescription("Is the message hidden from eveyone?")
          .setRequired(true)
        )
      )
    ),
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case "simple": {
        interaction.reply({ content: interaction.options.getString("content"), ephemeral: interaction.options.getBoolean("ephemeral") })
        break
      }
      case "other": {
        const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require("discord.js");
        const mes = client.channels.cache.get("990334296801820692").send(
          {
            embeds: [
              new EmbedBuilder()
                .setTitle("Roles!")
                .setDescription("Chose your roles here!")
                .setColor("#ff0000")
            ],
            components: [
              new ActionRowBuilder()
                .addComponents(
                  new SelectMenuBuilder()
                    .setCustomId("role-selector")
                    .setPlaceholder("Nothing selected")
                    .setMinValues(1)
                    .setMaxValues(10)
                    .addOptions(
                      { value: '990334254573551646', label: 'Chaotic', emoji: { name: '🔥' }, description: 'Access to chaos channel' },
                      { value: '990334249875939438', label: 'Poller', emoji: { name: '🗳️' }, description: 'Get pinged for polls' },
                      { value: '990334247061586012', label: 'New Beta', emoji: { name: '🆕' }, description: 'Get pinged for new betas' },
                      { value: '990334248416333846', label: 'New Update', emoji: { name: '🆙' }, description: 'Get pinged for new updates' },
                      { value: '990334250974838794', label: 'Announcements', emoji: { name: '📣' }, description: 'Get pinged for announcements' },
                      { value: '990334251801120849', label: 'Wiki Announcements', emoji: { name: '📘' }, description: 'Get pinged for wiki announcements' },
                      { value: '990334246038175805', label: 'Serious View', emoji: { name: '😐' }, description: 'Access to serious channel' },
                      { value: '990334277545762826', label: 'Bot', emoji: { name: '🤖' }, description: 'Get pinged for bot updates' },
                      { value: '990334245119606915', label: 'Archive View', emoji: { name: '🏛️' }, description: 'Access #the-great-archive where all channel are archived' },
                      { value: '1018241973959790753', label: "Giveaway", emoji: { name: "🎁" }, description: "Get ping for Giveaways!"}
                    )
                )
            ]
          }
        );
      }
    }
  }
}