const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder } = require ('discord.js');
const { request } = require('undici');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("urban")
        .setDescription("Get a definition")
        .addStringOption(option => option
            .setName("term")
            .setDescription("What do you want the definition of?")
            .setRequired(true)),
    async execute(interaction) {
        const term = interaction.options.getString('term');
        const query = new URLSearchParams({ term });

        const urbanResult = await request(` https://api.urbandictionary.com/v0/define?${query}`);
        const { list } = await urbanResult.body.json();

        if(!list.length) {
            return interaction.editReply(`No results found for **${term}**.`);
        }

        interaction.editReply(`**${term}**: ${list[0].definition}`);
    }
};