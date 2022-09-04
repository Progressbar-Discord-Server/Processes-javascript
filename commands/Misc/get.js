const { SlashCommandBuilder } = require('discord.js');
const { PastebinDevKey } = require('../../config.json');
const axios = require('axios').default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription("Get something")
    .addSubcommandGroup(scg => scg
      .setName("role")
      .setDescription("Getting info about roles")
      .addSubcommand(sc => sc
        .setName('name')
        .setDescription('Getting all role name'))
      .addSubcommand(sc => sc
        .setName('icon')
        .setDescription("Getting all icons of all roles")
        .addStringOption(o => o
          .setName("format")
          .setDescription("In what format do you want the icons?")
          .addChoices(
            { name: 'webp', value: 'webp' },
            { name: 'png', value: 'png' },
            { name: 'jpg', value: 'jpg' },
            { name: 'jpeg', value: 'jpeg' }
          )
          .setRequired(true))
        .addNumberOption(o => o
          .setName('size')
          .setDescription('At what size do you want the icon to be? (pixel)')
          .addChoices(
            { name: '16', value: 16 },
            { name: '32', value: 32 },
            { name: '56', value: 56 },
            { name: '64', value: 64 },
            { name: '96', value: 96 },
            { name: '128', value: 128 },
            { name: '256', value: 256 },
            { name: '300', value: 300 },
            { name: '512', value: 512 },
            { name: '600', value: 600 },
            { name: '1024', value: 1024 },
            { name: '2048', value: 2048 },
            { name: '4096', value: 4096 }
          )
          .setRequired(true))
        .addBooleanOption(o => o
          .setName('name')
          .setDescription('If you also want to get the name of the role (default: true)')))
      .addSubcommand(sc => sc
        .setName('color')
        .setDescription("Getting all Colors of all roles")
        .addBooleanOption(o => o
          .setName("hex")
          .setDescription("Do you want to get a hex value?")
          .setRequired(true))))
    .addSubcommandGroup(scg => scg
      .setName("guild")
      .setDescription("Get information about the guild")
      .addSubcommand(sc => sc
        .setName("description")
        .setDescription("Get the description of the server"))
      .addSubcommand(sc => sc
        .setName("name")
        .setDescription("Why would you?")))
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

    switch (interaction.options.getSubcommand()) {
      case /*role*/ "name": {
        const guildRoles = await interaction.guild.roles.fetch();

        let ArrName = [];
        guildRoles.forEach(e => {
          if (e.name !== "@everyone") ArrName.push(e.name);
        });

        if (ArrName.length) {
          await sendAsPastebin(ArrName.join("\n"), interaction)
        }
        else if (!ArrName.length) interaction.followUp("Why does not even a single role exist?");
        break
      }
      case /*role*/ "icon": {
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

        if (ArrayURL.length) {
          if (name) sendAsPastebin(ArrayURL.join("\n"), interaction)
          else if (!name) sendAsPastebin(ArrayURL.join(""), interaction)
        }
        else if (!ArrayURL.length) interaction.followUp("No role found with an icon");
        break
      }
      case /*role*/ 'color': {
        const guildRoles = await interaction.guild.roles.fetch();
        const hex = interaction.options.getBoolean("hex");
        let ArrColor = [];

        guildRoles.forEach(e => {
          let color
          if (hex) color = e.hexColor; else color = e.color;

          if (hex && color !== '#000000' || !hex && color !== 0) ArrColor.push(`${color} for ${e.name}`);
        });

        if (ArrColor.length) sendAsPastebin(ArrColor.join("\n"), interaction);
        else if (!ArrColor.length) interaction.followUp("No role found to have color");
        break
      }
      case /*guild*/ "description": {
        await interaction.guild.fetch()
        return interaction.followUp(`The description of this server is \`${interaction.guild.description}\``)
      }
      case /*guild*/ "name": {
        await interaction.guild.fetch()
        return interaction.followUp(`The name of this server is \`${interaction.guild.name}\``)
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
          if (name) sendAsPastebin(emojiArr.join("\n"), interaction);
          else if (!name) sendAsPastebin(emojiArr.join(' '), interaction);
        }
        else if (!emojiArr.length) interaction.followUp({ content: "No emoji found" })
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
          if (name) sendAsPastebin(stickersArr.join("\n"), interaction);
          else if (!name) sendAsPastebin(stickersArr.join(' '), interaction)
        }
        else if (!stickersArr.length) interaction.followUp("No stickers found");
        break
      };
    }
  }
}

async function sendAsPastebin(data, interaction) {
  axios.post("https://pastebin.com/api/api_post.php", {
    data: `api_dev_key=${PastebinDevKey}&api_option=paste&api_paste_private=1&api_paste_code=${data}&api_paste_expire_date=10M`
  })
    .then(r => {
      interaction.followUp({ content: r.data })
    })
    .catch(e => {
      if (e.response) {
        interaction.followUp({ content: `ERROR: \`${e.response.status}, ${e.response.data}\`` })
      }
    });
}