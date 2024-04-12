const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('message')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')),
	async execute(interaction) {
        let msg = interaction.options.getString('input');
        const embed = new EmbedBuilder()
            .setTitle("Message")
            .setDescription(msg)
            .setColor(0xAFE1AF);
		const embed2 = new EmbedBuilder()
			.setTitle("Command Success")
			.setDescription("Message Command Successfully Sent")
			.setColor(0xAFE1AF);
		await interaction.reply({embeds:[embed2]});
		await interaction.guild.channels.cache.get('1215128157217234975').send({embeds:[embed]});
	},
};