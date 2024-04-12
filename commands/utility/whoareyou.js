const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whoareyou')
		.setDescription('Greets User and Says Who Made It'),
	async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Greetings!")
            .setDescription("I am **Server Bot**. I was made by Eugene S. Alonzo, a 4th-year BS Computer Science student of ISAT U, and Rodolfo T. Bolivar III, a 4th-year BS Computer Science student of CPU.")
            .setColor(0xAFE1AF);
		const embed2 = new EmbedBuilder()
			.setTitle("Command Success")
			.setDescription("WhoAreYou Command Successfully Sent")
			.setColor(0xAFE1AF);
		await interaction.reply({embeds:[embed2]});
		await interaction.guild.channels.cache.get('1215128157217234975').send({embeds:[embed]});
	},
};