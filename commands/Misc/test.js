const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");

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
        )
      )
    ),
  async execute(interaction) {
    interaction.reply({ content: "Okay", ephemeral: true })
    await interaction.channel.send({
      embeds: [new EmbedBuilder().setTitle("Roles!").setDescription("Chose your roles here!").setColor("#e30b0b")],
      components: [
        new ActionRowBuilder()
        .addComponents(new SelectMenuBuilder()
        .setCustomId("role-selector")
        .setPlaceholder("Nothing selected")
        .setMinValues(1)
        .setMaxValues(10)
        .addOptions(
          { label: "Chaotic", description: "Access to chaos channel", value: "974018133054591035", emoji: "🔥" },
          { label: "Poller", description: "Get pinged for polls", value: "974018133071388715", emoji: "🗳️" },
          { label: "New Beta", description: "Get pinged for new betas", value: "974018133071388717", emoji: "🆕" },
          { label: "New Update", description: "Get pinged for new updates", value: "974018133071388716", emoji: "🆙" },
          { label: "Announcements", description: "Get pinged for announcements", value: "974018133071388714", emoji: "📣" },
          { label: "Wiki Announcements", description: "Get pinged for wiki announcements", value: "974018133071388713", emoji: "📘" },
          { label: "Serious View", description: "Access to serious channel", value: "974018133071388718", emoji: "😐" },
          { label: "Bot", description: "No role in that server to use it", value: "null", emoji: "🤖" },
          { label: "Archive View", description: "Access #the-great-archive", value: "974018133071388719", emoji: "🏛️" },
          { label: "ProgressCLI95", description: "Get pinged for updates on ProgressCLI95", value: "974018133037809676" }
          )
          )
        ]
      });
      interaction.channel.send({
        embeds: [new EmbedBuilder().setTitle("Colors!").setDescription("Get colors here!").setColor("#13b42d")],
        components: [
          new ActionRowBuilder()
            .addComponents(new SelectMenuBuilder()
              .setCustomId("role-selector")
              .setPlaceholder("Nothing selected")
              .addOptions(
                { label: "lean", value: "974018133184626745", emoji: "🟣" },
                { label: "A random shade of Magenta fraxxtal found on color.adobe.com", value: "974018133184626742", emoji: "🟪" },
                { label: "Dangerous Red", value: "974018133184626740", emoji: "🔴" },
                { label: "Pantone 448 C", value: "974018133167845413", emoji: "🟤" },
                { label: "Soft Furret", value: "974018133167845410", emoji: "🟫" },
                { label: "Corrupted Orange", value: "974018133167845406", emoji: "🟠" },
                { label: "Arch User!", value: "974018133209796618", emoji: "🟡" },
                { label: "Tea Green", value: "974018133151084602", emoji: "🟢" },
                { label: "Winning Green", value: "974018133151084600", emoji: "🟩" },
                { label: "Wallpaper", value: "974018133071388720", emoji: "🔵" },
                { label: "2000", value: "974018133151084594", emoji: "🟦" },
                { label: "Bluuuu", value: "974018133134282781", emoji: "🔷" },
              )
            )
        ]
      });
  }
}