const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    name: 'music',
    description: 'Joue de la musique dans un canal vocal',

    playMusic(message, url) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send("Tu dois être dans un canal vocal pour jouer de la musique !");
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        const stream = ytdl(url, { filter: 'audioonly' });
        const resource = createAudioResource(stream);
        const player = createAudioPlayer();

        connection.subscribe(player);
        player.play(resource);

        message.channel.send(`🎶 En train de jouer : ${url}`);
    },

    stopMusic(message) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send("Tu dois être dans un canal vocal pour arrêter la musique !");
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        connection.destroy(); // Déconnecte le bot
        message.channel.send("Musique arrêtée.");
    }
};
