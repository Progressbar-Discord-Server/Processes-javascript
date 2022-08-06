const fs = require('node:fs')

async function GetCommandFile(Where) {
  const Folder = fs.readdirSync(`${__dirname}/../commands`)
  let special = "┌"

  for (const folder of Folder) {
    const commandFiles = fs.readdirSync(`${__dirname}/../commands/${folder}`).filter(file => file.endsWith(".js"));
    console.log(` ${special} Next commands are loading from "${folder}"`);
    special = "├"

    for (const file of commandFiles) {
      try {
        const command = require(`${__dirname}/../commands/${folder}/${file}`);
        Where.set(command.data.name, command);
        console.log(` │   Command "${command.data.name}" has been loaded`);
      } catch (err) {
        console.error(err);
      };
    };
  };
};

async function GetMessageFile(Where) {
  const Folder = fs.readdirSync(`${__dirname}/../messages`)
  let special = "┌"

  for (const folder of Folder) {
    const messagesFiles = fs.readdirSync(`${__dirname}/../messages/${folder}`).filter(file => file.endsWith(".js"));
    console.log(` ${special} Next messages are loading from "${folder}"`);
    special = "├"

    for (const file of messagesFiles) {
      try {
        const message = require(`${__dirname}/../messages/${folder}/${file}`);
        Where.set(message.message, message);
        console.log(` │   Message "${message.message}" has been loaded`);
      } catch (err) {
        console.error(err);
      };
    };
  };
};

async function GetEventFile(client) {
  const Folder = fs.readdirSync(`${__dirname}/../events`);
  let special = "┌"

  for (const folder of Folder) {
    const eventFiles = fs.readdirSync(`${__dirname}/../events/${folder}`).filter(file => file.endsWith(".js"));
    console.log(` ${special} Next Events are loading from "${folder}"`);
    special = "├"

    for (const file of eventFiles) {
      try {
        const event = require(`${__dirname}/../events/${folder}/${file}`);
        if (event.on) {
          client.on(event.name, event.execute);
        }
        else if (!event.on) {
          client.once(event.name, event.execute);
        };
        console.log(` │   Event ${event.name} has been loaded`)
      } catch (err) {
        console.error(err);
      };
    };
  };
};

async function GetJsFile() {
  // initiation of all slash commands
  client.commands = new Collection();
  console.log(' Initialization of / commands')
  GetCommandFile(client.commands);
  console.log(" └ All Commands have been loaded");

  console.log('Initialization of messages')
  client.messages = new Collection();
  GetMessageFile(client.messages);
  console.log("  All Messages has been loaded");

  console.log('Initialization of events')
  GetEventFile(client)
  console.log('  All Events has been loaded')
}

module.exports = { GetCommandFile, GetMessageFile, GetEventFile }