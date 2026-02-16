import { BotClient } from './struct/BotClient';
import { Events } from 'discord.js'; // <-- Tambah ini
import dotenv from 'dotenv';

dotenv.config();

const client = new BotClient();

client.start();

client.on('ready', () => {
    console.log(`🤖 Logged in as ${client.user?.tag}!`);
    console.log(`🚀 System Modular Siap!`);
});

// === INI BAGIAN BARU (HANDLER) ===
// Pas ada user ketik slash command...
client.on(Events.InteractionCreate, async (interaction) => {
    // Kalau bukan chat command, cuekin
    if (!interaction.isChatInputCommand()) return;

    // Cari command di "tas" bot sesuai nama yang diketik user
    const command = client.commands.get(interaction.commandName);
    
    if (!command) {
        console.error(`Command ${interaction.commandName} gak ketemu.`);
        return;
    }

    try {
        // Jalanin function execute() yang ada di file command
        await command.execute(client, interaction);
    } catch (error) {
        console.error(error);
        // Kalau error, kasih tau user
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '❌ Ada error pas jalanin command ini!', ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ Ada error pas jalanin command ini!', ephemeral: true });
        }
    }
});