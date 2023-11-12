const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badges')
        .setDescription('Get the user count for each profile badge'),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        let badges =  [];
        let counts = {};

        const staff = '<:DiscordStaff:1172305755228090419>';
        const partner = '<:Partner:1172305764703010828>';
        const moderator = '<:CertifiedModerator:1172305754334699540>';
        const hypesquad = '<:Hypesquad:1172305759690833920>';
        const bravery = '<:Bravery:1172305749754531840>';
        const brilliance = '<:Brilliance:1172305751084122264>';
        const balance = '<:Balance:1172305747976126505>';
        const bughunter1 = '<:BugHunter1:1172305753101566135>';
        const bughunter2 = '<:BugHunter2:1172305761725071431>';
        const activedeveloper = '<:ActiveDeveloper:1172305746730438727>';
        const verifieddeveloper = '<:VerifiedBotDeveloper:1172305768482082946>';
        const earlysupporter = '<:EarlySupporter:1172305758436728944>';
        const verifiedbot = '<:VerifiedBot:1172306134451892294>';

        for(const member of interaction.guild.members.cache.values()) {
            const user = await client.users.fetch(member.user.id);
            badges = badges.concat(user.flags?.toArray());
        }

        for(const badge of badges) {
            if(counts[badge]) {
                counts[badge]++;
            } else {
                counts[badge] = 1;
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0x5DCA6E)
            .setTitle(`🔰 | Badges - ${interaction.guild.name}`)
            .setDescription(`${staff} **${counts['Staff'] || 0}**
                             ${partner} **${counts['Partner'] || 0}**
                             ${moderator} **${counts['CertifiedModerator'] || 0}**
                             ${bughunter1} **${counts['BugHunterLevel1'] || 0}**
                             ${bughunter2} **${counts['BugHunterLevel2'] || 0}**
                             ${hypesquad} **${counts['Hypesquad'] || 0}**
                             ${activedeveloper} **${counts['ActiveDeveloper'] || 0}**
                             ${verifieddeveloper} **${counts['VerifiedDeveloper'] || 0}**
                             ${earlysupporter} **${counts['PremiumEarlySupporter'] || 0}**
                             ${balance} **${counts['HypeSquadOnlineHouse3'] || 0}**
                             ${brilliance} **${counts['HypeSquadOnlineHouse2'] || 0}**
                             ${bravery} **${counts['HypeSquadOnlineHouse1'] || 0}**
                             ${verifiedbot} **${counts['VerifiedBot'] || 0}**`)
            .setFooter({ text: `${interaction.guild.memberCount} members`})

        await interaction.editReply({ embeds: [embed] });
    }
}