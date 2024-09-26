const bannedWords = ['mot1', 'mot2'];

module.exports = {
    handleMessageFilter(message) {
        // Filtrage des mots interdits
        if (bannedWords.some(word => message.content.toLowerCase().includes(word))) {
            message.delete();
            message.channel.send(`${message.author}, ton message contient des mots interdits.`);
        }

        // Bloquer les liens non autorisés
        const containsLink = message.content.match(/(https?:\/\/[^\s]+)/g);
        if (containsLink && !message.member.permissions.has('ADMINISTRATOR')) {
            message.delete();
            message.channel.send('Les liens ne sont pas autorisés ici.');
        }
    }
};