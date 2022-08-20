const fs = require('node:fs')
const { Collection } = require('discord.js');

async function GetContextMenuFiles(Where, printAndOther = true) {
  for (const type of fs.readdirSync(`${__dirname}/../context menu`)) {
    let special = "┌"

    for (const folder of fs.readdirSync(`${__dirname}/../context menu/${type}`)) {
      if (printAndOther) console.log(` ${special} Next Context Menu are loading from "${folder}"`);
      special = "├"
    
      for (const file of fs.readdirSync(`${__dirname}/../context menu/${type}/${folder}`).filter(file => file.endsWith(".js"))) {
        try {
          const contextMenu = require(`${__dirname}/../context menu/${type}/${folder}/${file}`);
          Where.set(contextMenu.data.name, contextMenu);
          if (printAndOther) console.log(` │   Context Menu "${contextMenu.data.name}" has been loaded`);
        } catch (err) {
          console.error(err);
        };
      };
    };
  };
};

async function GetCommandFiles(Where, printAndOther = true) {
  let special = "┌"

  for (const folder of fs.readdirSync(`${__dirname}/../commands`)) {
    if (printAndOther) console.log(` ${special} Next commands are loading from "${folder}"`);
    special = "├"

    for (const file of fs.readdirSync(`${__dirname}/../commands/${folder}`).filter(file => file.endsWith(".js"))) {
      try {
        const command = require(`${__dirname}/../commands/${folder}/${file}`);
        Where.set(command.data.name, command);
        if (printAndOther) console.log(` │   Command "${command.data.name}" has been loaded`);
      } catch (err) {
        console.error(err);
      };
    };
  };
};

async function GetMessageFiles(Where, printAndOther = true) {
  let special = "┌"

  for (const folder of fs.readdirSync(`${__dirname}/../messages`)) {
    if (printAndOther) console.log(` ${special} Next messages are loading from "${folder}"`);
    special = "├"

    for (const file of fs.readdirSync(`${__dirname}/../messages/${folder}`).filter(file => file.endsWith(".js"))) {
      try {
        const message = require(`${__dirname}/../messages/${folder}/${file}`);
        Where.set(message.message, message);
        if (printAndOther) console.log(` │   Message "${message.message}" has been loaded`);
      } catch (err) {
        console.error(err);
      };
    };
  };
};

async function GetEventFiles(client, printAndOther = true) {
  let special = "┌"

  for (const folder of fs.readdirSync(`${__dirname}/../events`)) {
    if (printAndOther) console.log(` ${special} Next Events are loading from "${folder}"`);
    special = "├"

    for (const file of fs.readdirSync(`${__dirname}/../events/${folder}`).filter(file => file.endsWith(".js"))) {
      try {
        const event = require(`${__dirname}/../events/${folder}/${file}`);
        if (event.on) {
          client.on(event.name, event.execute);
        }
        else if (!event.on) {
          client.once(event.name, event.execute);
        };
        if (printAndOther) console.log(` │   Event ${event.name} has been loaded`)
      } catch (err) {
        console.error(err);
      };
    };
  };
};

async function GetJsFile(client) {
  // initiation of all slash commands
  client.commands = new Collection();
  console.log(' Initialisation of / commands')
  GetCommandFiles(client.commands);
  console.log(" └ All Commands have been loaded");

  console.log('Initialisation of messages')
  client.messages = new Collection();
  GetMessageFiles(client.messages);
  console.log(" └ All Messages has been loaded");

  console.log("Initialisation of Context Menu");
  client.contextMenu = new Collection();
  GetContextMenuFiles(client.contextMenu);
  console.log(" └ All Context Menu has been loaded")

  console.log('Initialisation of Events')
  GetEventFiles(client)
  console.log(' └ All Events has been loaded')
};

async function ReloadJsFile(client) {
  client.commands = new Collection();
  client.messages = new Collection();
  client.contextMenu = new Collection();
  
  Object.keys(require.cache).forEach(key => delete require.cache[key])

  await GetCommandFiles(client.commands, false);
  await GetMessageFiles(client.messages, false);
  await GetContextMenuFiles(client.contextMenu, false);
}

module.exports = { GetJsFile, ReloadJsFile };