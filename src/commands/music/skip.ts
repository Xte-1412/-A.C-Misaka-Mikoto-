import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';

const SkipCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip lagu yang lagi main (Lanjut ke antrian)'),

    execute: async (client, interaction) => {
        const member = interaction.guild?.members.cache.get(interaction.user.id);
        const voiceChannel = member?.voice.channel;
        const player = client.shoukaku.players.get(interaction.guildId!);

        if (!player) {
            await interaction.reply({ content: '❌ Gak ada lagu yang lagi main.', ephemeral: true });
            return;
        }

        // AMAN: Cek channel ID langsung dari data bot di Discord
        const botVoiceChannelId = interaction.guild?.members.me?.voice.channelId;
        if (!voiceChannel || voiceChannel.id !== botVoiceChannelId) {
            await interaction.reply({ content: '❌ Lu harus satu VC sama bot buat skip!', ephemeral: true });
            return;
        }

        try {
            // Ini akan memicu event 'end' secara otomatis untuk memutar antrian
            await player.stopTrack();
            await interaction.reply('⏭️ **Lagu di-skip!** Memutar lagu selanjutnya (jika ada di antrian)...');
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Gagal skip lagu.', ephemeral: true });
        }
    }
};

export default SkipCommand;