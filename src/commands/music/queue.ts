import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';
import { QueueManager } from '../../services/QueueManager';

const QueueCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Lihat daftar antrian lagu saat ini'),

    execute: async (client, interaction) => {
        // Ambil data antrian dari QueueManager
        const queue = QueueManager.getQueue(interaction.guildId!);

        // Cek kalau antriannya kosong
        if (!queue || queue.length === 0) {
            await interaction.reply({ 
                content: '📭 Antrian saat ini kosong. Yuk tambahin lagu pake command `/next`!', 
                ephemeral: true 
            });
            return;
        }

        // Bikin tampilan Embed (Kotak rapi dengan warna)
        const embed = new EmbedBuilder()
            .setTitle('🎶 Daftar Antrian Musik')
            .setColor('#0099ff') // Warna biru khas bot
            .setFooter({ 
                text: `Diminta oleh ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL() 
            })
            .setTimestamp();

        // Kita batasi nampilin 10 lagu aja biar pesan Discord gak kepanjangan/error
        const maxLagu = 10;
        const laguDitampilkan = queue.slice(0, maxLagu);

        let deskripsi = '';
        laguDitampilkan.forEach((lagu, index) => {
            deskripsi += `**${index + 1}.** ${lagu.title}\n👤 *Req: ${lagu.requester}*\n\n`;
        });

        // Kalau lagunya lebih dari 10, kasih info tambahan di bawahnya
        if (queue.length > maxLagu) {
            deskripsi += `*...dan ${queue.length - maxLagu} lagu lainnya masih ngantri.*`;
        }

        embed.setDescription(deskripsi);

        // Kirim embed ke Discord
        await interaction.reply({ embeds: [embed] });
    }
};

export default QueueCommand;