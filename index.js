const { Client, GatewayIntentBits, Partials, PermissionsBitField } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Eski durumları saklamak için bir Map
const previousStates = new Map();
// Giriş kanalı ID'sini saklamak için bir değişken
let welcomeChannelId = null;
// Uyarı sayısını saklamak için bir Map
const warnings = new Map();

client.once('ready', () => {
    console.log('Bot hazır!');
});

client.on('guildMemberAdd', member => {
    if (welcomeChannelId) {
        const channel = member.guild.channels.cache.get(welcomeChannelId);
        if (channel) {
            channel.send(`<:bigmtsa:1259143915093889054> Sunucumuza hoş geldin, ${member}! Keyifli vakit geçirmeni dileriz.`);
        }
    }
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    // Rol ID'leri
    const roles = {
        rolver: '1259218307379232828',
        rolgeri: '1259218307379232828',
        uyar: '1259260459433853018',
        ban: '1259260506363920465',
        kick: '1259260522629697628',
        zamanaşımı: '1259260558918811758'
    };

    // Uyarı bildirim kanalı ID'si
    const notificationChannelId = '1259260161672089651';

    if (commandName in roles) {
        if (!interaction.member.roles.cache.has(roles[commandName])) {
            await interaction.reply('Bu komutu kullanmak için gerekli izniniz yok.');
            return;
        }

        switch (commandName) {
            case 'rolver':
                const memberToGiveRole = options.getMember('kisi');
                const name = options.getString('isim');
                const projectName = options.getString('proje');
                const role = options.getRole('rol');

                if (memberToGiveRole) {
                    previousStates.set(memberToGiveRole.id, {
                        nickname: memberToGiveRole.nickname,
                        roles: memberToGiveRole.roles.cache.map(role => role.id)
                    });

                    await memberToGiveRole.setNickname(`${name} ➸ ${projectName}`);
                    await memberToGiveRole.roles.add(role);
                    await interaction.reply('Rol başarıyla verildi ve isim değiştirildi!');
                } else {
                    await interaction.reply('Üye bulunamadı!');
                }
                break;

            case 'rolgeri':
                const memberToRevert = options.getMember('kisi');

                const previousState = previousStates.get(memberToRevert.id);

                if (memberToRevert && previousState) {
                    await memberToRevert.setNickname(previousState.nickname);
                    await memberToRevert.roles.set(previousState.roles);
                    previousStates.delete(memberToRevert.id);
                    await interaction.reply('Yapılan değişiklikler geri alındı!');
                } else {
                    await interaction.reply('Geri alınacak bir durum bulunamadı veya üye bulunamadı!');
                }
                break;

            case 'giris-kanali':
                const channel = options.getChannel('kanal');
                if (channel) {
                    welcomeChannelId = channel.id;
                    await interaction.reply(`Giriş kanalı başarıyla ayarlandı: ${channel}`);
                } else {
                    await interaction.reply('Geçerli bir kanal belirtin.');
                }
                break;

            case 'uyar':
                const userToWarn = options.getUser('kisi');
                const reason = options.getString('sebep');
                const warningCount = warnings.get(userToWarn.id) || 0;
                warnings.set(userToWarn.id, warningCount + 1);

                const warnChannel = interaction.guild.channels.cache.get(notificationChannelId);
                if (warnChannel) {
                    await warnChannel.send(`<@${userToWarn.id}> uyarıldı. Sebep: ${reason}. Toplam uyarı sayısı: ${warnings.get(userToWarn.id)}`);
                }
                await interaction.reply('Üye uyarıldı.');
                break;

            case 'ban':
                const userToBan = options.getUser('kisi');
                const banReason = options.getString('sebep');
                const memberToBan = await interaction.guild.members.fetch(userToBan.id);

                if (memberToBan) {
                    await memberToBan.ban({ reason: banReason });
                    const banChannel = interaction.guild.channels.cache.get(notificationChannelId);
                    if (banChannel) {
                        await banChannel.send(`<@${userToBan.id}> banlandı. Sebep: ${banReason}`);
                    }
                    await interaction.reply('Üye banlandı.');
                } else {
                    await interaction.reply('Üye bulunamadı!');
                }
                break;

            case 'kick':
                const userToKick = options.getUser('kisi');
                const kickReason = options.getString('sebep');
                const memberToKick = await interaction.guild.members.fetch(userToKick.id);

                if (memberToKick) {
                    await memberToKick.kick(kickReason);
                    const kickChannel = interaction.guild.channels.cache.get(notificationChannelId);
                    if (kickChannel) {
                        await kickChannel.send(`<@${userToKick.id}> sunucudan atıldı. Sebep: ${kickReason}`);
                    }
                    await interaction.reply('Üye sunucudan atıldı.');
                } else {
                    await interaction.reply('Üye bulunamadı!');
                }
                break;

            case 'zamanaşımı':
                const userToTimeout = options.getUser('kisi');
                const timeoutReason = options.getString('sebep');
                const timeoutDuration = options.getInteger('süre'); // Süre saniye cinsinden

                const memberToTimeout = await interaction.guild.members.fetch(userToTimeout.id);

                if (memberToTimeout) {
                    await memberToTimeout.timeout(timeoutDuration * 1000, timeoutReason);
                    const timeoutChannel = interaction.guild.channels.cache.get(notificationChannelId);
                    if (timeoutChannel) {
                        await timeoutChannel.send(`<@${userToTimeout.id}> zaman aşımına uğradı. Sebep: ${timeoutReason}, Süre: ${timeoutDuration} saniye`);
                    }
                    await interaction.reply('Üye zaman aşımına uğradı.');
                } else {
                    await interaction.reply('Üye bulunamadı!');
                }
                break;

            default:
                await interaction.reply('Bilinmeyen komut.');
        }
    }
});

client.login(token);
