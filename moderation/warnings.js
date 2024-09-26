const warnings = new Map(); // Map pour stocker les avertissements

module.exports = {
    handleWarnings(message) {
        if (message.content.includes('mauvais_comportement')) {
            const userWarnings = warnings.get(message.author.id) || 0;
            warnings.set(message.author.id, userWarnings + 1);
            message.channel.send(`${message.author}, c'est ton ${userWarnings + 1}e avertissement.`);

            if (warnings.get(message.author.id) >= 3) {
                message.member.kick().then(() => {
                    message.channel.send(`${message.author} a été expulsé pour avoir reçu trop d'avertissements.`);
                });
            }
        }
    }
};