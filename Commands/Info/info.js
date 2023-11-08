const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder } = require ('discord.js');
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
        if(interaction.options.getSubcommand() === 'user') {
            const user = await interaction.options.getUser('target').fetch(true);
            // console.log(user);

            const userinfoEmbed = new EmbedBuilder()
                .setColor(0x5DCA6E)
                .setTitle(`${user.displayName}'s info`)
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    { name: 'ID', value: user.id, inline: true },
                    { name: 'Username', value: user.tag, inline: true },
                    { name: 'Display Name', value: user.displayName, inline: true },
                )
            interaction.reply({
                embeds: [userinfoEmbed]
            });
        }
    }
};