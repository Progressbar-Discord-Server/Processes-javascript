const { SlashCommandBuilder, User, Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription("List bans and kicks and warns and stuff")
    .addSubcommand(sc => sc
      .setName('warns')
      .setDescription('List warns')
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list warnings (Id)")))
    .addSubcommand(sc => sc
      .setName("bans")
      .setDescription('List bans')
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list bans (Id)")))
    .addSubcommand(sc => sc
      .setName("kicks")
      .setDescription("List kicks")
      .addStringOption(o => o
        .setName("user")
        .setDescription("The user to list kicks (Id)"))),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "warns") {
      await interaction.deferReply({ ephemeral: true });
      let IdUser = interaction.options.getString("user");
      let UserExecutor = interaction.user;
      
      if (IdUser) {
        let permV = await interaction.guild.members.fetch(UserExecutor);
        if (!permV.permissions.FLAGS.has(Permissions.FLAGS.KICK_MEMBERS)) {
          return interaction.reply("I'm sorry Dave, but i'm afraied i can't do that\nYou do not have the permission to do that");
        };
      }
      else if (!IdUser) {
        IdUser = interaction.user.id;
      };

      db = interaction.client.db.Cases
      warnDB = await db.findAll({
        where: {
          userID: IdUser,
          type: "warn"
        },
        attributes: ['id', 'type', 'userID', 'reason', 'Executor']
      });
      let list = "";
      for (let i = 0; i < warnDB.length; i++) {
        list += `${warnDB[i].reason} - *insert date here*\n`;
      }
      console.log(list);
      if (list !== "") {
        interaction.followUp({ content: list });
      }
      else if (list === "") {
        interaction.followUp({ content: "There is no warn" });
      };
    }
    else if (subcommand === "bans") {
      await interaction.deferReply({ ephemeral: true });
      let IdUser = interaction.options.getString("user");
      
      if (IdUser) {
        let permV = await interaction.guild.members.fetch(UserExecutor);
        if (!permV.permissions.FLAGS.has(Permissions.FLAGS.BAN_MEMBERS)) {
          return interaction.reply("I'm sorry Dave, but i'm afraied i can't do that\nYou do not have the permission to do that");
        };
      }
      else if (!IdUser) {
        IdUser = interaction.user.id;
      };

      db = interaction.client.db.Cases
      banDB = await db.findAll({
        where: {
          userID: IdUser,
          type: "bans"
        },
        attributes: ['id', 'type', 'userID', 'reason', 'Executor']
      });
      let list = "";

      for (let i = 0; i < warnDB.length; i++) {
        list += `${warnDB[i].reason} - *insert date here*\n`;
      }
      console.log(list);
      if (list !== "") {
        interaction.followUp({ content: list });
      }
      else if (list === "") {
        interaction.followUp({ content: "There is no bans" });
      };
    }
    else if (subcommand === "kicks") {
      await interaction.deferReply({ ephemeral: true });
      let IdUser = interaction.options.getString("user");

      if (IdUser) {
        let permV = await interaction.guild.members.fetch(UserExecutor);
        if (!permV.permissions.FLAGS.has(Permissions.FLAGS.KICK_MEMBERS)) {
          return interaction.reply("I'm sorry Dave, but i'm afraied i can't do that\nYou do not have the permission to do that");
        }
      }
      else if (!IdUser) {
        IdUser = interaction.user.id;
      };

      db = interaction.client.db.Cases
      banDB = await db.findAll({
        where: {
          userID: IdUser,
          type: "kick"
        },
        attributes: ['id', 'type', 'userID', 'reason', 'Executor']
      });
      let list = "";

      for (let i = 0; i < warnDB.length; i++) {
        list += `${warnDB[i].reason} - *insert date here*\n`;
      }
      console.log(list);
      if (list !== "") {
        interaction.followUp({ content: list });
      }
      else if (list === "") {
        interaction.followUp({ content: "There is no kicks" });
      };
    };
  }
};
