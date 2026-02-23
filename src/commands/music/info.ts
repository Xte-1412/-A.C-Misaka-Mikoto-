import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';

const InfoCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Tampilkan pusat informasi dan daftar command bot'),

    execute: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor('#00bfff') // Warna Biru Elektrik ala kekuatan Railgun
            .setTitle('⚡ -A.C- Misaka Mikoto - Command Center')
            .setDescription('Selamat datang di sistem antarmuka **Misaka Mikoto**. Berikut adalah daftar frekuensi komando yang bisa kamu gunakan untuk mengontrol sistem audio:')
            .setThumbnail(client.user?.displayAvatarURL() || 'https://i.imgur.com/your-misaka-image-link.jpg') // Opsional: Bisa ganti URL ini dengan gambar logo bot lu
            .addFields(
                { 
                    name: '🎵 Core Audio System', 
                    value: '▶️ `/play` - Putar lagu langsung & reset antrian\n⏭️ `/skip` - Lewati lagu yang sedang main\n🛑 `/stop` - Hentikan musik & masuk mode Standby 🟢' 
                },
                { 
                    name: '📜 Queue Management', 
                    value: '➕ `/next` - Tambahkan lagu ke antrian\n📋 `/queue` - Lihat daftar tunggu lagu\n🎛️ `/nowplaying` - Detail lagu yang sedang diputar detik ini' 
                },
                { 
                    name: '🤖 Connection Control', 
                    value: '📥 `/invite` - Panggil bot ke VC (Mode Standby)\n👋 `/bye` - Putuskan koneksi bot dari Voice Channel\nℹ️ `/info` - Tampilkan panel informasi ini' 
                }
            )
            .setFooter({ 
                text: 'Misaka Mikoto Network | Tokiwadai Middle School', 
                iconURL: interaction.user.displayAvatarURL() 
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

export default InfoCommand;