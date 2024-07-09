const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder()
        .setName('rolver')
        .setDescription('Belirtilen rolü ver ve ismi değiştir')
        .addUserOption(option => 
            option.setName('kisi')
                .setDescription('Kişi')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('isim')
                .setDescription('İsim')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('proje')
                .setDescription('Proje İsmi')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('rol')
                .setDescription('Verilecek Rol')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('rolgeri')
        .setDescription('Belirtilen kullanıcının değişikliklerini geri al')
        .addUserOption(option => 
            option.setName('kisi')
                .setDescription('Kişi')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('giris-kanali')
        .setDescription('Giriş mesajlarının gönderileceği kanalı ayarla')
        .addChannelOption(option => 
            option.setName('kanal')
                .setDescription('Giriş kanalı')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('uyar')
        .setDescription('Bir üyeyi uyar')
        .addUserOption(option => 
            option.setName('kisi')
                .setDescription('Uyarılacak kişi')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Uyarı sebebi')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bir üyeyi sunucudan yasakla')
        .addUserOption(option => 
            option.setName('kisi')
                .setDescription('Yasaklanacak kişi')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Yasaklama sebebi')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Bir üyeyi sunucudan at')
        .addUserOption(option => 
            option.setName('kisi')
                .setDescription('Atılacak kişi')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Atma sebebi')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('zamanaşımı')
        .setDescription('Bir üyeye zaman aşımı ver')
        .addUserOption(option => 
            option.setName('kisi')
                .setDescription('Zaman aşımına uğratılacak kişi')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Zaman aşımı sebebi')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('süre')
                .setDescription('Zaman aşımı süresi (saniye cinsinden)')
                .setRequired(true))
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
