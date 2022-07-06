module.exports = {
  name: '',
  on: true,
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
  
    if (!command) return;
  
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      try {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      } catch {
        await interaction.followUp('There was an error while executing this command!');
      };
    };
  }
}