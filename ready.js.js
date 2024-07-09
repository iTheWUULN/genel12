module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);

        // Durum mesajı ekleme
        const mtsabigEmoji = client.emojis.cache.get('1259143915093889054'); // Emoji kimliğini buraya girin
        if (mtsabigEmoji) {
            client.user.setPresence({
                activities: [{ name: `${mtsabigEmoji} MTSA için çalışıyorum`, type: 'PLAYING' }],
                status: 'online',
            });
        } else {
            console.error('Emoji bulunamadı. Lütfen emoji kimliğini kontrol edin.');
        }
    },
};
