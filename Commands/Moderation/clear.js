const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a specific number of messages from a member or a channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option => option
        .setName("amount")
        .setDescription("Amount of messages to clear")
        .setRequired(true)
        )
    .addUserOption(option => option
        .setName("target")
        .setDescription("Select a member to clear their messages")
        .setRequired(false)
        ),
        async execute(interaction) {
            await interaction.deferReply({ ephemeral: true });
            const {channel, options} = interaction;
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return await interaction.editReply({content: "You must have the Manage Messages permission to run this command!"});
            }

            const amount = options.getInteger('amount');
            const target = options.getUser('target');

            const messages = await channel.messages.fetch({
                limit: amount + 1
            });
            
            if (target) {
                let i = 0;
                const filtered = [];

                (await messages).filter((msg) => {
                    if(msg.author.id === target.id && amount > i) {
                        filtered.push(msg);
                        i++;
                    }
                });

                await channel.bulkDelete(filtered).then(messages => {
                    interaction.editReply({ content: `Successfully deleted ${messages.size} messages from ${target}.` });
                });
            } else {
                await channel.bulkDelete(amount, true).then(messages => {
                    interaction.editReply({ content: `Successfully deleted ${messages.size} messages from the channel.` });
                });
            }
        }
}