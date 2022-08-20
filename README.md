# Processes Discord Bot 

This is a moderation bot for the [Progressbar95 Fan Server](https://discord.gg/HWFYmwsFX9). 

## Setting up

This bot is made with the Node.js runtime. 

1. Install Node.js 17.
2. Download the latest release [here](https://github.com/Progressbar-Discord-Server/Processes/releases)
2. Copy `config.json.template` to `config.json` and fill in the variables.
3. Run `npm i` to install the required modules.
4. Register the slash commands with `node deploy-commands.js`.
5. Start the bot with `node .`. The database will automatically be created for you.
6. Invite the bot with the link the console send