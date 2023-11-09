const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badges')
        .setDescription('Get the badges of an user')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The user you want to check the badges of')),
    async execute(interaction) {
        const { options } = interaction;
        await interaction.deferReply();

        let user = options.getUser('target') || interaction.user;
        let member = await interaction.guild.members.cache.get(user.id);
        let flags = user.flags.toArray();

        let badges = [];
        let extraBadges = [];

        await Promise.all(flags.map(async badge => {

            if(badge === 'Staff') badges.push('<:DiscordStaff:1172305755228090419>');
            if(badge === 'Partner') badges.push('<:Partner:1172305764703010828>');
            if(badge === 'CertifiedModerator') badges.push('<:CertifiedModerator:1172305754334699540>');
            if(badge === 'Hypesquad') badges.push('<:Hypesquad:1172305759690833920>');
            if(badge === 'HypeSquadOnlineHouse1') badges.push('<:Bravery:1172305749754531840>');
            if(badge === 'HypeSquadOnlineHouse2') badges.push('<:Brilliance:1172305751084122264>');
            if(badge === 'HypeSquadOnlineHouse3') badges.push('<:Balance:1172305747976126505>');
            if(badge === 'BugHunterLevel1') badges.push('<:BugHunter1:1172305753101566135>');
            if(badge === 'BugHunterLevel2') badges.push('<:BugHunter2:1172305761725071431>');
            if(badge === 'ActiveDeveloper') badges.push('<:ActiveDeveloper:1172305746730438727>');
            if(badge === 'VerifiedDeveloper') badges.push('<:VerifiedBotDeveloper:1172305768482082946>');
            if(badge === 'PremiumEarlySupporter') badges.push('<:EarlySupporter:1172305758436728944>');
            if(badge === 'VerifiedBot') badges.push('<:VerifiedBot:1172306134451892294>');
        }));

        const userData = await fetch(`https://japi.rest/discord/v1/user/${user.id}`);
        const { data } = await userData.join(); // FIXME: check whats wrong: https://www.youtube.com/watch?v=Ay4ZUFSQIWs

        if(data.public_flags_array) {
            await Promise.all(data.public_flags_array.map(async badge => {
                if(badge === 'NITRO') badges.push('<:Nitro:1172306079439405207>');
            }));

            if(user.bot) {
                const botFetch = await fetch(`https://discord.com/api/v10/applications/${user.id}/rpc`);

                let json = await botFetch.json();
                let flagsBot = json.flags;

                const gateways = { APPLICATION_COMMAND_BADGE: 1 << 23 };

                const arrayFlags = [];

                for(let i in gateways) {
                    const bit = gateways[i];
                    if((flagsBot & bit) === bit) arrayFlags.push(i);
                }

                if(arrayFlags.includes('APPLICATION_COMMAND_BADGE')) {
                    badges.push('<:SlashCommands:1172306110229794848>');
                }
            }

            if(!user.discriminator || user.discriminator === 0 || user.tag === `${user.username}#0`) {
                badges.push('<:Knownas:1172306046535094355>');
            }

            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`${user.username}'s badges`)
                .setDescription(`${badges.join(' ') || `**No badges found**`}`)

            await interaction.editReply({
                embeds: [embed]
            });
        }
    }
}