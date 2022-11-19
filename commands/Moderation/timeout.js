const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { timeout } = require("../../Util/Moderation.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription(`Timeout a member for up to 28 days.`)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption(o => o
			.setName("user")
			.setDescription("The user to timeout")
			.setRequired(true))
		.addStringOption(o => o
			.setName('unit')
			.setDescription('In which unit is the duration?')
			.setRequired(true)
			.addChoices({ name: 'seconds', value: 'seconds' }, { name: 'minutes', value: 'minutes' }, { name: 'hours', value: 'hours' }, { name: 'days', value: 'days' }))
		.addIntegerOption(o => o
			.setName("duration")
			.setDescription('How long should this user be timed out for? (max 28 days)')
			.setMaxValue(60)
			.setMinValue(1)
			.setRequired(true))
		.addBooleanOption(o => o
			.setName("joke")
			.setDescription("Is this supposed to be a joke?")
			.setRequired(true))
		.addStringOption(o => o
			.setName("reason")
			.setDescription('Why should this user be timed out?')),
	async execute(interaction) {
		await interaction.deferReply()
		timeout(interaction, interaction.options.getMember('user', true), interaction.options.getString('reason'), interaction.options.getString('unit', true), interaction.options.getInteger('duration', true), interaction.options.getBoolean('joke', true), interaction.client.db.Cases)
	},
};
