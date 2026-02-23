import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';
import { QueueManager } from '../../services/QueueManager';

const NextCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('next')
        .setDescription('Tambahkan lagu ke dalam antrian')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('Judul lagu atau Link YouTube')
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

            const result = await node.rest.resolve(`ytsearch:${query}`);
            
            if (!result || result.loadType === 'empty' || result.loadType === 'error') {
                await interaction.editReply('❌ Lagu gak ketemu!');
                return;
            }

            const data = result.data as any;
            const track = Array.isArray(data) ? data[0] : data;

            if (!track) {
                await interaction.editReply('❌ Format lagu aneh.');
                return;
            }

            const player = client.shoukaku.players.get(interaction.guildId!);

            // --- UPDATE TEKS BALASAN STANDBY ---
            if (!player || !player.track) {
                await interaction.editReply('🟢 **Bot sedang dalam mode Standby.** Gunakan command `/play` aja biar langsung nyanyi!');
                return;
            }

            QueueManager.addToQueue(interaction.guildId!, {
                title: track.info.title,
                encoded: track.encoded,
                requester: interaction.user.tag
            });

            await interaction.editReply(`✅ **Berhasil ditambahkan ke antrian:** ${track.info.title}`);

        } catch (error: any) {
            console.error("❌ ERROR NEXT:", error);
            await interaction.editReply(`❌ Gagal menambahkan ke antrian: ${error.message}`);
        }
    }
};

export default NextCommand;