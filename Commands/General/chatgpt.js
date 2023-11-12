const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports =  {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Ask ChatGPT a question')
        .addStringOption(option => option
            .setName('prompt')
            .setDescription('Prompt for the AI')
            .setRequired(true)),
    async execute(interaction) {
        const { options } = interaction;
        const prompt = options.getString('prompt');

        await interaction.reply({ content: `Loading your response. This might take a moment...` });

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        await page.goto('https://chat-app-f2d296.zapier.app/');

        const textBoxSelector = 'textarea[aria-label="chatbot-user-prompt"]';
        await page.waitForSelector(textBoxSelector);
        await page.type(textBoxSelector, prompt);

        await page.keyboard.press('Enter');

        await page.waitForSelector('[data-testid="final-bot-response"] p');

        var value = await page.$$eval('[data-testid="final-bot-response"]', async (elements) => {
            return elements.map((element) => element.textContent);
        });

        setTimeout(async () => {
            if(value.length === 0) return await interaction.editReply({ content: `There was an error getting that response.` });
        }, 30000);

        await browser.close();

        value.shift();
        const embed = new EmbedBuilder()
            .setColor(0x5DCA6E)
            .setTitle('🧠 | Ask ChatGPT')
            .addFields(
                { name: interaction.user.displayName, value: `\`\`\`${prompt}\`\`\`` },
                { name: 'ChatGPT', value: `\`\`\`${value.join(`\n\n\n\n`)}\`\`\``}
            )

        await interaction.editReply({ content: '', embeds: [embed] });
    }
}