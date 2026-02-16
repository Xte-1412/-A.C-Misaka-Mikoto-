import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';
import { BotClient } from '../struct/BotClient';

export interface Command {
    // Data buat didaftarin ke Discord (Nama, Deskripsi, Option)
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    
    // Fungsi yang jalan pas command diketik
    execute: (client: BotClient, interaction: ChatInputCommandInteraction) => Promise<void>;
}