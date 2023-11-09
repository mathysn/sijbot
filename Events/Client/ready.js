const { Client, ActivityType } = require('discord.js');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`${client.user.username} is now online`);

        const status = await client.user.setPresence({
            status: 'online',
            activities: [{
                type: ActivityType.Custom,
                name: 'custom status',
                state: 'Version 0.1.0'
            }]
        })
    }
};