const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription(`Timeout a member for up to 28 days.`)
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
			.setRequired(true))
		.addStringOption(o => o
			.setName("reason")
			.setDescription('Why should this user be timed out?')),
	async execute(interaction) {
		const member = interaction.options.getMember('user')
		const RealLen = interaction.options.getInteger('duration')
		let length = interaction.options.getInteger('duration')
		const unit = interaction.options.getString('unit')
		let reason = interaction.options.getString('reason') || "No reason provided"
		const replyEmbed = new MessageEmbed();

		if (member.id = clientId) {
			if (!reason)return interaction.reply(`Timed out undefined for ${RealLen} ${unit}`)
			else if (reason) return interaction.reply(`Timed out undefined for ${RealLen} ${unit} for **${reason}.**`)}

		if (unit == "seconds") {
			length = Math.floor(length * 1000)
		} else if (unit == "minutes") {
			length = Math.floor(length * 60 * 1000)
		} else if (unit == "hours") {
			length = Math.floor(length * 60 * 60 * 1000)
		} else if (unit == "days") {
			length = Math.floor(length * 24 * 60 * 60 * 1000)
		}

		if (length > 2.419e+9) {
			replyEmbed.setColor("#FF0000")
			replyEmbed.setDescription(`**I cannot timeout ${user.tag} for that long! You provided a time longer than 28 days!**`)
			await interaction.reply({embeds:[replyEmbed]})
		}
		else {
			member.timeout(length, reason + " | Timeout by " + interaction.member.user.tag)
			.then(async () => {
				replyEmbed.setDescription(`Timed out ${member} for **${RealLen} ${unit}** for **"${reason}".**`)
				replyEmbed.setColor("#00FF00")
				await interaction.reply({embeds:[replyEmbed]})
			})
			.catch(async error => {
				console.log(error)
				replyEmbed.setDescription(`**I cannot timeout ${member.tag}! They have staff permissions!**`)
				replyEmbed.setColor("#FF0000")
				await interaction.reply({embeds: [replyEmbed], ephemeral: true})
			})
		}
	},
};
