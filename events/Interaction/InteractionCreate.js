const { InteractionType } = require('discord.js')

module.exports = {
  name: 'interactionCreate',
  on: true,
  async execute(interaction) {
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.commands.get(interaction.commandName);
  
    if (!command) return;
  
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      try {
        await interaction.reply({ content: `There was an error while executing this command!\n\`\`\`${err} \`\`\``, ephemeral: true });
      } catch {
        try {
         await interaction.followUp({content: `There was an error while executing this command!\n\`\`\` ${err} \`\`\``, ephemeral: true});
        } catch {}
      };
    };
  }
}