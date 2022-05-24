# Progressbar Ruler Discord Bot 

This is a moderation bot for the Progressbar95 Fan Discord Server. 

## Setting up

This bot is made with the Node.js runtime. 

1. Install Node.js 17 and Git.
2. Run `git clone https://github.com/5jiji/Progressbar-Ruler`.
3. Copy `config.json.template` to `config.json` and fill in the variables.
4. Run `npm i` to install the required modules.
5. Invite the bot with this link: `https://discord.com/oauth2/authorize?client_id=[ClientID]&permissions=8&scope=bot%20applications.commands` (replace `[ClientID]` with the bot's ID)
6. Register the slash commands with `node deploy-commands.js`.
7. Start the bot with `node .`. The database will automatically be created for you.