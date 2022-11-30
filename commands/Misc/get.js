const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { PasteeDevKey } = require('../../config.json');
const axios = require('axios').default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription("Get something")
    .addSubcommandGroup(scg => scg.setName("role")
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
            { name: '4096', value: 4096 },
            { name: '2048', value: 2048 },
            { name: '1024', value: 1024 },
            { name: '600', value: 600 },
            { name: '512', value: 512 },
            { name: '300', value: 300 },
            { name: '256', value: 256 },
            { name: '128', value: 128 },
            { name: '96', value: 96 },
            { name: '64', value: 64 },
            { name: '56', value: 56 },
            { name: '32', value: 32 },
            { name: '16', value: 16 }
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
    .addSubcommandGroup(scg => scg.setName("guild")
      .setDescription("Get information about the guild")
      .addSubcommand(sc => sc
        .setName("description")
        .setDescription("Get the description of the server"))
      .addSubcommand(sc => sc
        .setName("name")
        .setDescription("Why would you?"))
      .addSubcommand(sc => sc
        .setName("features")
        .setDescription("See the server's features")
        .addStringOption(o => o
          .setName("invite")
          .setDescription("If you have an invite, you can give it, we'll send the features back"))))
    .addSubcommand(sc => sc.setName("emojis")
      .setDescription("Getting all emojis of a server")
      .addBooleanOption(o => o
        .setName('name')
        .setDescription('If you also want to get the name of the emojis (default: true)')))
    .addSubcommand(sc => sc.setName('stickers')
      .setDescription('Getting all stickers of a server')
      .addBooleanOption(o => o
        .setName('name')
        .setDescription('If you also want to get the name of the stickers (default: true)'))),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const sc = interaction.options.getSubcommand(true)

    switch (interaction.options.getSubcommandGroup()) {
      case "role": {
        switch (sc) {
          case "name": {
            const guildRoles = await interaction.guild.roles.fetch();

            let ArrName = [];
            guildRoles.forEach(e => {
              if (e.name !== "@everyone") ArrName.push(e.name);
            });

            if (ArrName.length) {
              await sendAsPaste(ArrName.join("\n"), interaction)
            }
            else if (!ArrName.length) interaction.followUp("Why does not even a single role exist?");
            break
          }
          case "icon": {
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
              if (name) sendAsPaste(ArrayURL.join("\n"), interaction)
              else if (!name) sendAsPaste(ArrayURL.join(""), interaction)
            }
            else if (!ArrayURL.length) interaction.followUp("No role found with an icon");
            break
          }
          case 'color': {
            const guildRoles = await interaction.guild.roles.fetch();
            const hex = interaction.options.getBoolean("hex");
            let ArrColor = [];

            guildRoles.forEach(e => {
              let color
              if (hex) color = e.hexColor; else color = e.color;

              if (hex && color !== '#000000' || !hex && color !== 0) ArrColor.push(`${color} for ${e.name}`);
            });

            if (ArrColor.length) sendAsPaste(ArrColor.join("\n"), interaction);
            else if (!ArrColor.length) interaction.followUp("No role found to have color");
            break
          }
        }
        break
      }
      case "guild": {
        switch (sc) {
          case "description": {
            await interaction.guild.fetch()
            return interaction.followUp(`The description of this server is \`${interaction.guild.description}\``)
          }
          case "name": {
            await interaction.guild.fetch()
            return interaction.followUp(`The name of this server is \`${interaction.guild.name}\``)
          }
          case "features": {
            if (!interaction.options.getString("invite")) {
              await interaction.guild.fetch()
              return interaction.followUp({ content: `${interaction.guild.name} has ${interaction.guild.features.length} features: \n${codeBlock(interaction.guild.features.join("\n"))}` })
            }
            else if (interaction.options.getString("invite")) {
              interaction.client.fetchInvite(interaction.options.getString("invite"))
                .then(e => {
                  interaction.followUp({ content: `${e.guild.name} has ${e.guild.features.length} features: \n${codeBlock(e.guild.features.join("\n"))}` })
                }).catch(err => interaction.followUp(`There was an error while executing this command!\n\`\`\`${err} \`\`\``))
            }
            break
          }
        }
        break
      }
      default: {
        switch (sc) {
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
              if (name) await sendAsPaste(emojiArr.join("\n"), interaction);
              else if (!name) await sendAsPaste(emojiArr.join(' '), interaction);
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
              if (name) sendAsPaste(stickersArr.join("\n"), interaction);
              else if (!name) sendAsPaste(stickersArr.join(' '), interaction)
            }
            else if (!stickersArr.length) interaction.followUp("No stickers found");
            break
          };
        }
        break
      }
    }
  }
}

async function sendAsPaste(data, interaction) {
  axios.post("https://api.paste.ee/v1/pastes", {
    key: PasteeDevKey,
    sections: [
      {name: "Processes Data", contents: data}
    ]
  })
    .then(r => {
      if (r.data.success) interaction.followUp({ content: r.data.link })
      else if (r.data.success) {
        console.error(r.data); 
        interaction.followUp("An error ocurred, Pls, check console")
      }
    })
    .catch(e => {
      if (e.response) {
        interaction.followUp({ content: `ERROR: \`${e.response.status}, ${e.response.data.errors[0].message}\`` })
      }
    });
}