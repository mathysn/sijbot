const { EmbedBuilder, SlashCommandBuilder } = require ('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get info about an user or the server")
        .addSubcommand(user => user
            .setName("user")
            .setDescription("Get the information about an user")
            .addUserOption(option => option
                .setName("target")
                .setDescription("Select the user")
                .setRequired(true))),
    async execute(interaction) {
        const { options } = interaction;
        if(options.getSubcommand() === 'user') {
            await interaction.deferReply();

            const user = await options.getUser('target').fetch(true) || interaction.user;
            const flags = user.flags.toArray();
            const member = await interaction.guild.members.cache.get(user.id);

            let badges = [];

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
            const { data } = await userData.join();

            if(data.public_flags_array) {
                await Promise.all(data.public_flags_array.map(async badge => {
                    if (badge === 'NITRO') badges.push('<:Nitro:1172306079439405207>');
                }));

                if (user.bot) {
                    const botFetch = await fetch(`https://discord.com/api/v10/applications/${user.id}/rpc`);

                    let json = await botFetch.json();
                    let flagsBot = json.flags;

                    const gateways = {APPLICATION_COMMAND_BADGE: 1 << 23};

                    const arrayFlags = [];

                    for (let i in gateways) {
                        const bit = gateways[i];
                        if ((flagsBot & bit) === bit) arrayFlags.push(i);
                    }

                    if (arrayFlags.includes('APPLICATION_COMMAND_BADGE')) {
                        badges.push('<:SlashCommands:1172306110229794848>');
                    }
                }

                if (!user.discriminator || user.discriminator === 0 || user.tag === `${user.username}#0`) {
                    badges.push('<:Knownas:1172306046535094355>');
                }
            }

            const userinfoEmbed = new EmbedBuilder()
                .setColor(0x5DCA6E)
                .setTitle('💡 | User Info')
                .setDescription(`Information about ${user.toString()}`)
                .setThumbnail(user.displayAvatarURL())
                .setImage(user.bannerURL({ dynamic: true, size: 1024 }))
                .addFields(
                    { name: 'General', value: `ID: \`${user.id}\`\nUsername: \`${user.username}\`\nDisplay Name: \`${user.displayName}\``},
                    { name: 'Events', value: `Registered Date: \`${moment(user.createdAt).format('MMM DD, YYYY | h:mm A')}\`\nJoined Date: \`${moment(member.joinedAt).format('MMM DD, YYYY | h:mm A')}\``},
                    { name: 'Badges', value: badges.join(' ') },
                    // { name: 'ID', value: user.id },
                    // { name: 'Username', value: user.username, inline: true },
                    // { name: 'Display Name', value: user.displayName, inline: true },
                    // { name: 'Created At', value: moment(user.createdAt).format('ll'), inline: true },
                    // { name: 'Joined At', value: moment(member.joinedAt).format('ll'), inline: true },
                )
            interaction.editReply({
                embeds: [userinfoEmbed]
            });
        }
    }
};