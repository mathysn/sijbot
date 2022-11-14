const { Client, GatewayIntentBits, Partials } = require('discord.js');

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const { loadEvents } = require('./Handlers/eventHandler');

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember]
});

client.config = require('./config.json');

client.login(client.config.token).then(() => {
    loadEvents(client);
});