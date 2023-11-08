const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder } = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .addSubcommand(user => user
                .setName("user")
                .setDescription("Get the information about an user")
                .addUserOption(option => option
                    .setName("target")
                    .setRequired(true))),
    async execute(interaction) {
        if(interaction.commandName === 'user') {
            const user = interaction.options.getUser('user');
            const { userInfo } = user.fetch();
            
            const urbanEmbed = new EmbedBuilder()
                                .setColor(0x5DCA6E)
                                .setTitle(`${user}'s info`)
                                .addFields(
                                    { name: 'Name', value: list[0].definition, inline: true },
                                    { name: 'Example', value: list[0].example },
                                    { name: 'Likes', value: `${list[0].thumbs_up} 👍`, inline: true },
                                    { name: 'Dislikes', value: `${list[0].thumbs_down} 👎`, inline: true },
                                )
                                .setFooter({text: `Sent by ${list[0].author} on ${moment(list[0].written_on).format("MM/DD/YYYY, h:mm:ss a")}`})
            interaction.reply({
                embeds: [urbanEmbed]
            });
        }
    }
};