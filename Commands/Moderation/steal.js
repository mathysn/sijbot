const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steal')
        .setDescription('Adds a given emoji to the server')
        .addStringOption(option => option
            .setName('emoji')
            .setDescription('The emoji you would like to add to the server')
            .setRequired(true))
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name you want to give to that emoji')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
            return await interaction.editReply({content: "You must have the Manage Emojis & Stickers permission to run this command!"});
        }

        let emoji = interaction.options.getString('emoji')?.trim();
        const name = interaction.options.getString('name');

        if(emoji.startsWith("<") && emoji.endsWith(">")) {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                .then(image => {
                    if(image) return "gif"
                    else return "png"
                }).catch(err => {
                    return "png"
                });
            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
        }

        if(!emoji.startsWith("http") || !emoji.startsWith("https")) {
            return await interaction.editReply({ content: "You cannot steal default emojis." });
        }

        interaction.guild.emojis.create({ attachment: emoji, name: name})
            .then(emoji => {
                return interaction.editReply({ content: `Added ${emoji} with name \`${name}\`` });
            }).catch(err => {
                interaction.editReply({ content: "You cannot add this emoji because you have reach this server's emoji limit." });
        });
    }
}