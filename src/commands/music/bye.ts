import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';
import { QueueManager } from '../../services/QueueManager';

const ByeCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('bye')
        .setDescription('Keluarkan bot dari Voice Channel'),

    execute: async (client, interaction) => {
        const member = interaction.guild?.members.cache.get(interaction.user.id);
        const voiceChannel = member?.voice.channel;

        if (!voiceChannel) {
            await interaction.reply({ content: '❌ Masuk voice channel dulu dong!', ephemeral: true });
            return;
        }

        const player = client.shoukaku.players.get(interaction.guildId!);
        if (!player) {
            await interaction.reply({ content: '❌ Bot emang gak ada di VC kok.', ephemeral: true });
            return;
        }

        const botVoiceChannelId = interaction.guild?.members.me?.voice.channelId;
        if (voiceChannel.id !== botVoiceChannelId) {
            await interaction.reply({ content: '❌ Lu harus satu VC sama bot buat ngusir!', ephemeral: true });
            return;
        }

        try {
            // Bersihkan memori antrian
            QueueManager.clearQueue(interaction.guildId!);
            
            // Putuskan koneksi bot dari Discord VC
            await client.shoukaku.leaveVoiceChannel(interaction.guildId!);
            
            await interaction.reply('👋 **Dadah!** Bot telah keluar dari Voice Channel.');
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Gagal mengeluarkan bot.', ephemeral: true });
        }
    }
};

export default ByeCommand;