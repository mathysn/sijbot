const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder } = require ('discord.js');
const { request } = require('undici');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("urban")
        .setDescription("Get the definition of a word")
        .addStringOption(option => option
            .setName("term")
            .setDescription("What do you want the definition of?")
            .setRequired(true)),
    async execute(interaction) {
        const term = interaction.options.getString('term');
        const query = new URLSearchParams({ term });

        const urbanResult = await request(` https://api.urbandictionary.com/v0/define?term=${term}`);
        const { list } = await urbanResult.body.json();

        if(!list.length) {
            return interaction.reply(`No results found for **${term}**.`);
        }
        
        const urbanEmbed = new EmbedBuilder()
                            .setColor(0x5DCA6E)
                            .setTitle(`🤓 | ${term}`)
                            .addFields(
                                { name: 'Definition', value: list[0].definition },
                                { name: 'Example', value: list[0].example },
                                { name: 'Likes', value: `${list[0].thumbs_up} 👍`, inline: true },
                                { name: 'Dislikes', value: `${list[0].thumbs_down} 👎`, inline: true },
                            )
                            .setFooter({text: `Sent by ${list[0].author} on ${moment(list[0].written_on).format("MM/DD/YYYY, h:mm:ss A")}`})
        interaction.reply({
            embeds: [urbanEmbed]
        });
    }
};