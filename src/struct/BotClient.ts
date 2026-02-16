import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { Shoukaku, Connectors } from 'shoukaku';
import fs from 'fs';
import path from 'path';
import { Command } from '../interfaces/Command'; // <-- Kita import interface yang baru dibuat

const Nodes = [{
    name: 'LocalNode',
    url: 'localhost:2333',
    auth: 'youshallnotpass'
}];

export class BotClient extends Client {
    public shoukaku: Shoukaku;
    // Ini tas buat nampung command yang di-load
    public commands: Collection<string, Command> = new Collection();

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.shoukaku = new Shoukaku(new Connectors.DiscordJS(this), Nodes);
        
        this.shoukaku.on('error', (_, error) => console.error('❌ Lavalink Error:', error));
        this.shoukaku.on('ready', (name) => console.log(`🎵 Lavalink Node: ${name} siap tempur!`));
    }

    public async start() {
        const token = process.env.DISCORD_TOKEN;
        if (!token) throw new Error("Token not found in .env");

        // 1. Baca semua file command DULU sebelum login
        await this.loadCommands();
        
        // 2. Login ke Discord
        await this.login(token);

        // 3. Daftarin command ke server Discord (biar muncul pas ketik /)
        await this.registerCommands(token);
    }

private async loadCommands() {
            const commandsPath = path.join(__dirname, '..', 'commands');
            const commandFolders = fs.readdirSync(commandsPath);
            
            for (const folder of commandFolders) {
                const folderPath = path.join(commandsPath, folder);
                const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
                
                for (const file of commandFiles) {
                    const filePath = path.join(folderPath, file);
                    const commandModule = await import(filePath);
                    
                    // HAPUS ': Command' di sini biar jadi 'any' sementara
                    const command = commandModule.default; 
                    
                    // Sekarang cek ini jadi valid karena tipe-nya belum dipastikan
                    if(command && command.data && command.execute) {
                        // Pas mau simpen, baru kita anggap dia sebagai Command
                        this.commands.set(command.data.name, command);
                        console.log(`✅ Load Command: ${command.data.name}`);
                    }
                }
            }
        }

    private async registerCommands(token: string) {
        const rest = new REST({ version: '10' }).setToken(token);
        const commandsData = this.commands.map(cmd => cmd.data.toJSON());

        try {
            console.log('🔄 Mendaftarkan Slash Commands...');
            if (this.user?.id) {
                 // Pakai applicationCommands biar global
                 await rest.put(Routes.applicationCommands(this.user.id), { body: commandsData });
                 console.log('✨ Slash Commands Berhasil Didaftarkan!');
            }
        } catch (error) {
            console.error('Gagal daftar command:', error);
        }
    }
}