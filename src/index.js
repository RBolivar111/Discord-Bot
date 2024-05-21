const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, EmbedBuilder , Collection, Events, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

//For Slash Commands
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const processedMessages = new Set();
const sentMessages = new Set();

client.on('ready', () => {
    console.log(`${client.user.tag} is online. Waiting for command.`);

    scheduleMessages();
});

//Interaction For Slash Commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login('[BOT TOKEN GOES HERE]');
var Filter = require('bad-words'),
    filter = new Filter();

function scheduleMessages() {
    setInterval(() => {
        const currentTime = new Date().toLocaleTimeString('en-US', {
            timeZone: 'Asia/Manila',
            hour12: false,
        });
        const date = new Date();
        const min = date.getMinutes();
        const channel = client.channels.cache.get('1215128157217234975'); 
        const scheduledMessages = [
            { time: '09:00', content: 'Good morning, everyone! \nHave a productive day ahead!' },
            { time: '10:30', content: 'Take a break, **you\'re not a robot!**' },
            { time: '12:00', content: 'REMINDER:\n**Don\'t forget to eat your lunch!**' },
            { time: '17:00', content: 'Goodbye everyone, be safe!' },
        ];

        //Sends Goodnight Message Every Weekday at 10pm
        if (isWeekday(new Date().getDay())) {
            scheduledMessages.push({ time: '22:00', content: 'Good night! Sleep tight.' });
        }

        let allMessagesSent = true; 

        //Used to send messages that are stored in the array scheduledMessages
        for (const { time, content } of scheduledMessages) {
            if (isTimeWithinRange(currentTime, time, addMinutes(time, 1)) && !sentMessages.has(content)) {
                sendAsBot(channel, content, 0xFFFF80);
                sentMessages.add(content);
                allMessagesSent = false; 
            }
        }

        // Clear sent messages only if all messages have been sent
        if (allMessagesSent && min == "00") {
            sentMessages.clear();
        }

        //Sends General Meeting Reminder Every Monday at 9am
        if (new Date().getDay() === 1) {
            if (isTimeWithinRange(currentTime, '09:00', '09:01') && !sentMessages.has('meeting')) {
                sendAsBot(channel, '**REMINDER:** \nGeneral meeting today! 📢', 0xFFFF80);
                sendRandomInspirationalQuote(channel);
                sentMessages.add('meeting');
            }
        }

        //Sends Weekender Quote Every Friday at 5pm
        if (new Date().getDay() === 5) {
            if (isTimeWithinRange(currentTime, '17:00', '17:01') && !sentMessages.has('weekender')) {
                sendWeekenderQuotes(channel);
                sentMessages.add('weekender');
            }
        }

        //Sends Inspirational Message Every Monday, Wednesday, and Friday at 12nn
        if (['1', '3', '5'].includes(new Date().getDay().toString()) && isTimeWithinRange(currentTime, '12:00', '12:01')
        && !sentMessages.has('inspirational')) {
            sendRandomInspirationalMessage(channel);
            sentMessages.add('inspirational');
        }
        
                //Sends A News Article Every Weekday at 1pm
        if (isWeekday(new Date().getDay())) {
            if(isTimeWithinRange(currentTime, '13:00', '13:01') && !sentMessages.has('news')){
                console.log("Sending News Article...")
                sendNewsArticle(channel);
                sentMessages.add('news');
            }
        }

    }, 60000); // Check every minute
}

function isTimeWithinRange(currentTime, startTime, endTime) {
    const currentMinutes = convertTimeToMinutes(currentTime);
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

function convertTimeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function sendAsBot(channel, content, color) {
    if (channel) {
        const embed = new EmbedBuilder()
            .setDescription(content)
            .setColor(color);

        channel.send({ embeds: [embed] })
            .then(() => console.log('Message sent successfully'))
            .catch(error => console.error('Error sending message:', error));
    }
}

function sendRandomInspirationalQuote(channel) {
    axios.get('https://api.quotable.io/random')
        .then((response) => {
            const quote = response.data.content;
            quote = filter.clean(quote);
            sendAsBot(channel, `**Inspirational Quote:**\n ${quote}`, 0xAA4A44);
        })
        .catch((error) => {
            console.error('Error fetching inspirational quote:', error.message);
        });
}

function sendWeekenderQuotes(channel) {
    axios.get('https://api.quotable.io/quotes?tags=weekend')
        .then((response) => {
            const quotes = response.data.results;
            quotes = filter.clean(quotes);
            quotes.forEach((quote) => {
                sendAsBot(channel, `**Weekender Quote:**\n ${quote.content}`, 0xAA4A44);
            });
        })
        .catch((error) => {
            console.error('Error fetching weekender quotes:', error.message);
        });
}

function sendRandomInspirationalMessage(channel) {
    axios.get('https://api.quotable.io/random')
        .then((response) => {
            const message = response.data.content;
            sendAsBot(channel, `**Inspirational Message:**\n ${message}`, 0xAA4A44);
        })
        .catch((error) => {
            console.error('Error fetching inspirational message:', error.message);
        });
}

async function sendNewsArticle(channel) {
    try{        
        //API used from newsapi.org (await makes it so that it can properly load and get the info we need but might take longer for it to send an article)
        //Randomly picks from the 10 most recent results from the query
        let articleNum = Math.floor(Math.random() * 10);
        const response = await axios.get('https://newsapi.org/v2/everything?q=marketing&apiKey=9c6dc5ac03c34dbb9ad98feeea940a3a')
        console.log("News Article Received")
        const webURL = response.data.articles;
        const link = webURL[articleNum].url;
        //Prevents removed article links from being used.
        if(link == "https://removed.com"){
            sendNewsArticle(channel);
        }
        channel.send(link)
        console.log("News Article Successfully Sent")
         
    } catch(err){
        console.log(err);
    }
}

function addMinutes(time, minutes) {
    const [hours, originalMinutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + originalMinutes + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

function isWeekday(day) {
    // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    return day >= 1 && day <= 5;
}
