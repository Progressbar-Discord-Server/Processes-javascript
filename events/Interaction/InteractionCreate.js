module.exports = {
  name: 'interactionCreate',
  on: true,
  async execute(interaction) {
    if (interaction.type == 2) {
      if (interaction.commandType == 1) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await command.execute(interaction).catch(async err => {
          console.error(err)
          await interaction.reply({ content: `There was an error while executing this command!\n\`\`\`${err} \`\`\``, ephemeral: true }).catch(await interaction.followUp({ content: `There was an error while executing this command!\n\`\`\` ${err} \`\`\``, ephemeral: true }).catch(e => { interaction.editReply({ content: `There was an error while executing this command!\n\`\`\` ${err} \`\`\``, ephemeral: true }).catch(e => { }) }));
        });
      }
      else if (interaction.commandType == 2 || interaction.commandType == 3) {
        const contextMenu = client.contextMenu.get(interaction.commandName);
        if (!contextMenu) return;

        await contextMenu.execute(interaction).catch(async err => {
          console.error(err)
          await interaction.reply({ content: `There was an error while executing this context menu!\n\`\`\`${err} \`\`\``, ephemeral: true }).catch(await interaction.followUp({ content: `There was an error while executing this context menu!\n\`\`\` ${err} \`\`\``, ephemeral: true }).catch(e => { interaction.editReply({ content: `There was an error while executing this context menu!\n\`\`\` ${err} \`\`\``, ephemeral: true }).catch(e => { }) }));
        });
      }
    }
    else if (interaction.type == 3) {
      if (interaction.isSelectMenu) {
        if (interaction.customId !== "role-selector") return;
        await interaction.deferReply({ ephemeral: true })
        await interaction.member.fetch();
        const roles = interaction.member.roles;

        let response = []
        for (let roleId of interaction.values) {
          const role = await interaction.guild.roles.fetch(roleId);
          if (role) {
            if (roles.cache.has(role.id)) {
              await roles.remove(role)
              response.push(`Removed ${role.name}`)
            }
            else if (!roles.cache.has(role.id)) {
              await roles.add(role)
              response.push(`Added ${role.name}`)
            }
          }
          else if (!role) {
            console.log(`${roleId} doesn't exist`)
          }
        }
        interaction.followUp(response.join("\n"))
      }
    }
  }
}