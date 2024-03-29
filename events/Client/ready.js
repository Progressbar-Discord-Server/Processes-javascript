const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { showLink, debugCha } = require('../../config.js');
const { ProcessDOS } = require('../../Util/Dos.js');

module.exports = {
  name: 'ready',
  on: false,
  async execute(client) {
    const base = require(`./ready.js`).base
    base(client).then(async client => client.debugCha = await client.channels.fetch(debugCha))
  },
  async base(client) {
    for (let e of Object.keys(client.db)) {
      client.db[e].sync();
    }

    console.log(`Login as ${client.user.tag}`);

    let guilds = await client.guilds.fetch()

    guilds.forEach(async guild => {
      let guildFetched = await guild.fetch()
      await guildFetched.members.fetchMe()
      let channels = await guildFetched.channels.fetch()
      channels.forEach(async channel => {
        await channel.fetch().then(async e => {
          if (e.threads && e.permissionsFor(client.id).has(PermissionsBitField.Flags.ReadMessageHistory)) {
            await Promise.all([e.threads.fetchActive(), e.threads.fetchArchived()]).catch(() => { })
          }
        }).catch(() => { })
      })
      console.log(`Channels of ${guildFetched.name} loaded (${guildFetched.id})`)
    })


    if (showLink) {
      console.log(client.generateInvite({
        permissions: PermissionsBitField.All,
        scopes: ["applications.commands", "bot"]
      }))
    }

    ProcessDOS(client)

    // Errors handler
    process.on("uncaughtException", async err => {
      console.error(err)
      if (client.debugCha) client.debugCha.send({
        embeds: [new EmbedBuilder({
          author: { name: "Error", iconURL: "https://raw.githubusercontent.com/abrahammurciano/discord-lumberjack/main/images/error.png" },
          description: "UncaughtException",
          fields: [
            {
              name: "Error",
              value: `${err}\n\n${err.message}`,
              inline: true
            },
            {
              name: "From",
              value: `${err.stack}`,
              inline: true
            }
          ]
        })]
      }).catch(() => { })
    });

    process.on("unhandledRejection", async err => {
      console.error(err)
      let stack = ""
      let message = ""
      if (err instanceof Error) {
        if (err.message === "Received one or more errors") return;
        stack = err.stack
        message = err.message
      }
      else stack = err
      if (!client.debugCha) return

      const { AxiosError } = require('axios');
      if (err instanceof AxiosError) {
        return client.debugChat.send({
          embeds: [new EmbedBuilder({
            author: { name: "Error", iconURL: "https://raw.githubusercontent.com/abrahammurciano/discord-lumberjack/main/images/error.png" },
            description: "UnhandledRejection",
            fields: [
              {
                name: "Error",
                value: `${err}\n\n${message}`,
                inline: true
              },
              {
                name: "From",
                value: `${stack}`,
                inline: true
              }]
          })]
        })
      }
      client.debugCha.send({
        embeds: [new EmbedBuilder({
          author: { name: "Error", iconURL: "https://raw.githubusercontent.com/abrahammurciano/discord-lumberjack/main/images/error.png" },
          description: "UnhandledRejection",
          fields: [
            {
              name: "Error",
              value: `${err}\n\n${message}`,
              inline: true
            },
            {
              name: "From",
              value: `${stack}`,
              inline: true
            }]
        })]
      }).catch(() => { })
    });
    return client
  }
};