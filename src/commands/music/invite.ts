import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';
import { QueueManager } from '../../services/QueueManager';

const InviteCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Panggil bot ke Voice Channel (Masuk Mode Standby)'),

    execute: async (client, interaction) => {
        const member = interaction.guild?.members.cache.get(interaction.user.id);
        const voiceChannel = member?.voice.channel;

        if (!voiceChannel) {
            await interaction.reply({ content: '❌ Lu harus masuk voice channel dulu bang!', ephemeral: true });
            return;
        }

        let player = client.shoukaku.players.get(interaction.guildId!);

        if (player) {
            await interaction.reply({ content: '🤖 Bot sudah berada di dalam Voice Channel!', ephemeral: true });
            return;
        }

        try {
            player = await client.shoukaku.joinVoiceChannel({
                guildId: interaction.guildId!,
                channelId: voiceChannel.id,
                shardId: 0
            });

            const activePlayer = player;

            activePlayer.on('end', async (endData) => {
                if (endData.reason === 'replaced') return;

                const nextTrack = QueueManager.getNextItem(interaction.guildId!);
                if (nextTrack) {
                    await activePlayer.update({
                        track: { encoded: nextTrack.encoded }
                    });
                } else {
                    // FIX: Paksa hapus memori lagu agar pindah ke Mode Standby
                    await activePlayer.update({ track: { encoded: null } });
                }
            });

            await interaction.reply('🟢 **Bot berhasil masuk!** Sekarang sedang berjaga dalam mode **Standby**.');
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Gagal masuk ke Voice Channel.', ephemeral: true });
        }
    }
};

export default InviteCommand;