const { CreateAndWrite } = require('../../Util/someFun.js')
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')
// const http = require("node:http")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription("Get something")
    .addSubcommand(sc => sc
      .setName('rname')
      .setDescription('Getting all role name'))
    .addSubcommand(sc => sc
      .setName('ricon')
      .setDescription("Getting all icons of all roles")
      .addStringOption(o => o
        .setName("format")
        .setDescription("In what format do you want the icons?")
        .addChoices({ name: 'webp', value: 'webp' }, { name: 'png', value: 'png' }, { name: 'jpg', value: 'jpg' }, { name: 'jpeg', value: 'jpeg' })
        .setRequired(true))
      .addNumberOption(o => o
        .setName('size')
        .setDescription('At what size do you want the icon to be? (pixel)')
        .addChoices({ name: '16', value: 16 }, { name: '32', value: 32 }, { name: '56', value: 56 }, { name: '64', value: 64 }, { name: '96', value: 96 }, { name: '128', value: 128 }, { name: '256', value: 256 }, { name: '300', value: 300 }, { name: '512', value: 512 }, { name: '600', value: 600 }, { name: '1024', value: 1024 }, { name: '2048', value: 2048 }, { name: '4096', value: 4096 })
        .setRequired(true))
      .addBooleanOption(o => o
        .setName('name')
        .setDescription('If you also want to get the name of the role (default: true)')))
    .addSubcommand(sc => sc
      .setName('rcolor')
      .setDescription("Getting all Colors of all roles")
      .addBooleanOption(o => o
        .setName("hex")
        .setDescription("Do you want to get a hex value?")
        .setRequired(true)))
    .addSubcommand(sc => sc
      .setName("emojis")
      .setDescription("Getting all emojis of a server")
      .addBooleanOption(o => o
        .setName('name')
        .setDescription('If you also want to get the name of the emojis (default: true)')))
    .addSubcommand(sc => sc
      .setName('stickers')
      .setDescription('Getting all stickers of a server')
      .addBooleanOption(o => o
        .setName('name')
        .setDescription('If you also want to get the name of the stickers (default: true)'))),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const sc = interaction.options.getSubcommand();

    switch (sc) {
      case "rname": {
        const guildRoles = await interaction.guild.roles.fetch();

        let ArrName = [];
        guildRoles.forEach(e => {
          if (e.name !== "@everyone") ArrName.push(e.name);
        });

        if (ArrName.length) {
          CreateAndWrite('/Tmp/log.txt', ArrName.join("\n"));
          interaction.followUp({ files: [new AttachmentBuilder('/Tmp/log.txt', 'result.txt')] });
        }
        else if (!ArrName.length) interaction.followUp("Why does not even a single role exist?");
        break
      }
      case "ricon": {
        const guildRoles = await interaction.guild.roles.fetch();
        const format = interaction.options.getString("format");
        const size = interaction.options.getNumber("size");
        let name = interaction.options.getBoolean('name');
        if (name === null) name = true;
        let ArrayURL = [];

        guildRoles.forEach(e => {
          if (e.iconURL()) {
            if (name) ArrayURL.push(`${e.iconURL({ format: format, size: size })} for ${e.name}`);
            else if (!name) ArrayURL.push(`${e.iconURL({ format: format, size: size })}`);
          };
        });

        console.log(ArrayURL)
        if (ArrayURL.length) {
          if (name) await CreateAndWrite('/Tmp/log.txt', ArrayURL.join("\n"));
          else if (!name) await CreateAndWrite('/Tmp/log.txt', ArrayURL.join(' '));
          interaction.followUp({ files: [new AttachmentBuilder('/Tmp/log.txt', 'result.txt')] });
        }
        else if (!ArrayURL.length) interaction.followUp("No role found with an icon");
        break
      }
      case 'rcolor': {
        const guildRoles = await interaction.guild.roles.fetch();
        const hex = interaction.options.getBoolean("hex");
        let ArrColor = [];

        guildRoles.forEach(e => {
          let color
          if (hex) color = e.hexColor; else color = e.color;

          if (hex && color !== '#000000' || !hex && color !== 0) ArrColor.push(`${color} for ${e.name}`);
        });

        if (ArrColor.length) {
          CreateAndWrite('/Tmp/log.txt', ArrColor.join("\n"));
          interaction.followUp({ files: [new AttachmentBuilder('/Tmp/log.txt', 'result.txt')] });
        }
        else if (!ArrColor.length) interaction.followUp("No role found to have color");
        break
      }
      case "emojis": {
        await interaction.guild.fetch();
        let emojis = await interaction.guild.emojis.fetch();
        let name = interaction.options.getBoolean('name');
        if (name === null) name = true;
        let emojiArr = [];

        emojis.forEach(e => {
          if (name) emojiArr.push(`${e.url} for ${e.name}`);
          else if (!name) emojiArr.push(`${e.url}`);
        });

        if (emojiArr.length) {
          if (name) CreateAndWrite('/Tmp/log.txt', emojiArr.join("\n"));
          else if (!name) CreateAndWrite('/Tmp/log.txt', emojiArr.join(' '));

          interaction.followUp({ files: [new AttachmentBuilder('/Tmp/log.txt', 'result.txt')] });
        }
        else if (!emojiArr.length) interaction.followUp("No emojis found");
        break
      }
      case "stickers": {
        await interaction.guild.fetch();
        let stickers = await interaction.guild.stickers.fetch();
        let name = interaction.options.getBoolean('name');
        if (name === null) name = true;
        let stickersArr = [];

        stickers.forEach(e => {
          if (name) stickersArr.push(`${e.url} for ${e.name}`);
          else if (!name) stickersArr.push(`${e.url}`);
        });


        if (stickersArr.length) {
          if (name) CreateAndWrite('/Tmp/log.txt', stickersArr.join("\n"));
          else if (!name) CreateAndWrite('Tmp/log.txt', stickersArr.join(' '))

          interaction.followUp({ files: [new AttachmentBuilder('/Tmp/log.txt', 'result.txt')] });
        }
        else if (!stickersArr.length) interaction.followUp("No stickers found");
        break
      };
    }
  }
}