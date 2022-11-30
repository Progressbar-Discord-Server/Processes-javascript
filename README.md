# Processes Discord Bot 

This is a moderation bot for the [Progressbar95 Fan Server](https://discord.gg/HWFYmwsFX9). 

## Setting up

This bot is made with the Node.js runtime. 

1. Install Node.js 17.
2. Download the latest release [here](https://github.com/Progressbar-Discord-Server/Processes/releases)
3. Copy `config.json.template` to `config.json` and fill in the variables.
4. Run `npm i` to install the required modules.
5. Register the slash commands with `node deploy-commands.js`.
6. Start the bot with `node .`. The database will automatically be created for you.
7. Invite the bot with the link the console send (Only if "showLink" variable in config.json is true)