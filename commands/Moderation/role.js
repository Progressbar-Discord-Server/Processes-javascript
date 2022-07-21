const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Give role to users')
    .addSubcommand(sc => sc
      .setName('give')
      .setDescription('Give a role to a user')
      .addUserOption(o => o
        .setName('user')
        .setDescription("The user to which give the role")
        .setRequired(true))
      .addRoleOption(o => o
        .setName('role')
        .setDescription("The role to give to the user")
        .setRequired(true)))
    .addSubcommand(sc => sc
      .setName('remove')
      .setDescription("Remove a role from a user")
      .addUserOption(o => o
        .setName("user")
        .setDescription('The user to remove the role')
        .setRequired(true))
      .addRoleOption(o => o
        .setName('role')
        .setDescription("The role to remove from the user")
        .setRequired(true)))
    .addSubcommand(sc => sc
      .setName('create')
      .setDescription('Create a role')
      .addStringOption(o => o
        .setName('name')
        .setDescription("The name of the role")
        .setRequired(true))
      .addStringOption(o => o
        .setName('color')
        .setDescription("The color of the role (in base 16, #ffffff, without the #)")
        .setMinLength(6)
        .setMaxLength(6)))
    .addSubcommand(sc => sc
      .setName('edit')
      .setDescription("Edit a role")
      .addRoleOption(o => o
        .setName('role')
        .setDescription("The role to edit")
        .setRequired(true))
      .addStringOption(o => o
        .setName('name')
        .setDescription('The new name of the role'))
      .addStringOption(o => o
        .setName('color')
        .setDescription('The new color of the role')
        .setMaxLength(6)
        .setMinLength(6))),
  async execute(interaction) {
    const sc = interaction.options.getSubcommand()
    
    if (sc === "give") {
      const user = interaction.options.getMember('user');
      const role = interaction.options.getRole('role');

      user.roles.add(role);
    }
    else if (sc === "remove") {
      const user = interaction.options.getMember('user');
      const role = interaction.options.getRole('role');

      user.roles.remove(role);
    }
    else if (sc === "create") {
      const name = interaction.options.getString('name');
      const color = '#' + interaction.options.getString('color');

      if (name && color !== '#null') interaction.guild.roles.create({ name: name, color: color });
      else if (name && color === '#null') interaction.guild.roles.create({ name: name })
    }
    else if (sc === "edit") {
      const role = interaction.options.getRole('role');
      const name = interaction.options.getString('name');
      const color = '#' + interaction.options.getString('color');

      if (name && color !== '#null') interaction.guild.roles.edit(role, { name: name, color: color });
      else if (name && color === '#null') interaction.guild.roles.edit(role, { name: name });
      else if (!name && color !== '#null') interaction.guild.roles.edit(role, { color: color })
    };
  }
};