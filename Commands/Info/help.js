const { ComponentType, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get a list of all the commands."),
    async execute(interaction) {
        const emojis = {
            info: '📄',
            moderation: '🔰',
            general: '🧭',
            fun: '🎉'
        };

        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder))
        ];

        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: cmd.data.description || "There is no description for this command"
                };
            });

            return {
                directory: formatString(dir),
                commands: getCommands
            };
        });

        const helpEmbed = new EmbedBuilder()
            .setColor(0x5DCA6E)
            .setDescription("Please choose a category in the dropdown menu.");

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("help-menu")
                    .setPlaceholder("Please select a category")
                    .setDisabled(state)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Commands from the ${cmd.directory} category.`,
                                emoji: emojis[cmd.directory.toLowerCase() || null]
                            };
                        })
                    )
            )
        ];

        const initialMessage = await interaction.reply({
            embeds: [helpEmbed],
            components: components(false)
        });

        const filter = (interaction) => interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.SelectMenu
        });

        collector.on("collect", (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
                .setColor(0x5DCA6E)
                .setTitle(`${emojis[directory.toLowerCase() || null]} ${formatString(directory)}`)
                .setDescription(`All commands from the **${formatString(directory)}** category`)
                .addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `\`${cmd.name}\``,
                            value: cmd.description,
                            inline: true
                        };
                    })
                );

                interaction.update({embeds: [categoryEmbed]});
        });

        collector.on("end", () => {
            initialMessage.edit({components: components(true)});
        });
    }
};