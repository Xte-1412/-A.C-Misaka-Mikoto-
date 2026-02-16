import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';

const PlayCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Putar lagu dari YouTube')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('Judul lagu atau Link')
                .setRequired(true)
        ),

    execute: async (client, interaction) => {
        const query = interaction.options.getString('query', true);
        const member = interaction.guild?.members.cache.get(interaction.user.id);
        const voiceChannel = member?.voice.channel;

        if (!voiceChannel) {
            await interaction.reply({ content: '❌ Masuk voice channel dulu bang!', ephemeral: true });
            return;
        }

        await interaction.deferReply();

        try {
            const node = client.shoukaku.getIdealNode();
            if (!node) throw new Error("Lavalink mati atau belum siap");

            // 1. Search Lagu
            const result = await node.rest.resolve(`ytsearch:${query}`);
            
            if (!result || result.loadType === 'empty' || result.loadType === 'error') {
                await interaction.editReply('❌ Lagu gak ketemu!');
                return;
            }

            // 2. Ambil Track Pertama
            const data = result.data as any;
            const track = Array.isArray(data) ? data[0] : data;

            if (!track) {
                await interaction.editReply('❌ Format lagu aneh.');
                return;
            }

            // --- LOGIC FIX: CEK EXISTING CONNECTION ---
            let player = client.shoukaku.players.get(interaction.guildId!);

            if (!player) {
                // Kalau belum ada, baru join
                player = await client.shoukaku.joinVoiceChannel({
                    guildId: interaction.guildId!,
                    channelId: voiceChannel.id,
                    shardId: 0
                });
            }
            // ------------------------------------------

            // 3. Play Audio
            await player.update({
                track: {
                    encoded: track.encoded
                }
            });
            
            await player.setGlobalVolume(100);

            await interaction.editReply(`🎶 **Now Playing:** ${track.info.title}`);

        } catch (error: any) {
            console.error("❌ ERROR PLAY:", error);
            await interaction.editReply(`❌ Gagal Play: ${error.message}`);
        }
    }
};

export default PlayCommand;