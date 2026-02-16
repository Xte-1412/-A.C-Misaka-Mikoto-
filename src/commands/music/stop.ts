import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';

const StopCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Hentikan musik dan usir bot dari VC'),

    execute: async (client, interaction) => {
        const member = interaction.guild?.members.cache.get(interaction.user.id);
        const voiceChannel = member?.voice.channel;

        if (!voiceChannel) {
            await interaction.reply({ content: '❌ Masuk voice channel dulu dong!', ephemeral: true });
            return;
        }

        const player = client.shoukaku.players.get(interaction.guildId!);
        if (!player) {
            await interaction.reply({ content: '❌ Bot lagi gak nyetel lagu kok.', ephemeral: true });
            return;
        }

        // AMAN: Cek channel ID langsung dari data bot di Discord
        const botVoiceChannelId = interaction.guild?.members.me?.voice.channelId;
        if (voiceChannel.id !== botVoiceChannelId) {
            await interaction.reply({ content: '❌ Lu harus satu VC sama bot buat stop!', ephemeral: true });
            return;
        }

        try {
            await client.shoukaku.leaveVoiceChannel(interaction.guildId!);
            await interaction.reply('🛑 **Musik dihentikan.** Sampai jumpa!');
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Gagal menghentikan musik.', ephemeral: true });
        }
    }
};

export default StopCommand;