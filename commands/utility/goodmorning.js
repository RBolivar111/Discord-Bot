const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('goodmorning')
		.setDescription('Greets User with a Good Morning'),
	async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Good Morning!")
            .setDescription("Today is a good day!")
            .setColor(0xAFE1AF);
		const embed2 = new EmbedBuilder()
			.setTitle("Command Success")
			.setDescription("GoodMorning Command Successfully Sent")
			.setColor(0xAFE1AF);
		await interaction.reply({embeds:[embed2]});
		await interaction.guild.channels.cache.get('1215128157217234975').send({embeds:[embed]});
	},
};