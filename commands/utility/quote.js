const { SlashCommandBuilder, EmbedBuilder, quote} = require('discord.js');
const axios = require('axios');
var Filter = require('bad-words'),
filter = new Filter();
async function sendRandomInspirationalQuote() {
    try{
        const response = await axios.get('https://api.quotable.io/random')
        var quote = JSON.stringify(response.data.content)
        quote = filter.clean(quote);
        return quote;
    } catch(err){
        console.log(err);
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Sends the user a random inspirational quote'),
	async execute(interaction) {
        const message = await sendRandomInspirationalQuote();
        const embed = new EmbedBuilder()
            .setDescription(`**Inspirational Quote:**\n ${message}`)
            .setColor(0xAFE1AF);
		const embed2 = new EmbedBuilder()
			.setTitle("Command Success")
			.setDescription("Quote Command Successfully Sent")
			.setColor(0xAFE1AF);
		await interaction.reply({embeds:[embed2]});
		await interaction.guild.channels.cache.get('1215128157217234975').send({embeds:[embed]});
	},
};