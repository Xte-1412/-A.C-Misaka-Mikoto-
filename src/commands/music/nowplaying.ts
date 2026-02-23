import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';

const NowPlayingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Lihat lagu apa yang sedang berputar secara detail'),

    execute: async (client, interaction) => {
        const player = client.shoukaku.players.get(interaction.guildId!);

        // Cek apakah bot ada di VC sama sekali
        if (!player) {
            await interaction.reply({ 
                content: '❌ Bot tidak sedang berada di Voice Channel.', 
                ephemeral: true 
            });
            return;
        }

        // --- UPDATE: DETEKSI MODE STANDBY ---
        if (!player.track) {
            const standbyEmbed = new EmbedBuilder()
                .setColor('#43b581') // Hijau khas Discord status online
                .setTitle('🟢 Mode Standby')
                .setDescription('Bot sedang *standby* di Voice Channel dan siap menerima perintah.\nGunakan `/play` untuk mulai memutar musik!')
                .setFooter({ text: 'Misaka Mikoto Music Engine' })
                .setTimestamp();
                
            await interaction.reply({ embeds: [standbyEmbed] });
            return;
        }
        // ------------------------------------

        await interaction.deferReply();

        try {
            const node = client.shoukaku.getIdealNode();
            if (!node) throw new Error("Lavalink node tidak ditemukan");

            const trackData = await node.rest.decode(player.track);
            
            if (!trackData) {
                await interaction.editReply('❌ Gagal membaca detail lagu dari Lavalink.');
                return;
            }

            const info = trackData.info;
            const position = player.position; 
            const duration = info.length; 

            const formatTime = (ms: number) => {
                const minutes = Math.floor(ms / 60000);
                const seconds = ((ms % 60000) / 1000).toFixed(0);
                return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
            };

            const createProgressBar = (current: number, total: number, length: number = 15) => {
                if (total === 0) return '🔘' + '▬'.repeat(length - 1);
                const progress = Math.round((current / total) * length);
                const emptyProgress = length - progress > 0 ? length - progress : 0;
                return '▬'.repeat(progress) + '🔘' + '▬'.repeat(emptyProgress);
            };

            const progressBar = createProgressBar(position, duration);
            const timeString = info.isStream ? '🔴 LIVE' : `${formatTime(position)} / ${formatTime(duration)}`;
            const thumbnail = `https://img.youtube.com/vi/${info.identifier}/hqdefault.jpg`;

            const embed = new EmbedBuilder()
                .setColor('#ff0000') 
                .setAuthor({ name: '🎵 Sedang Diputar' })
                .setTitle(info.title)
                .setURL(info.uri ?? null) 
                .setDescription(`👤 **Channel:** ${info.author}\n\n\`${progressBar}\`\n⏳ **${timeString}**`)
                .setThumbnail(thumbnail)
                .setFooter({ text: 'Misaka Mikoto Music Engine' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("❌ ERROR NOW PLAYING:", error);
            await interaction.editReply('❌ Terjadi kesalahan saat memproses data lagu.');
        }
    }
};

export default NowPlayingCommand;