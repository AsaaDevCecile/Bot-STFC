const userMessages = new Map();

module.exports = {
    handleAntiSpam(message) {
        const currentTime = Date.now();
        const userData = userMessages.get(message.author.id) || { count: 0, lastMessage: currentTime };

        if (currentTime - userData.lastMessage < 3000) {
            userData.count += 1;
        } else {
            userData.count = 1;
        }

        userData.lastMessage = currentTime;
        userMessages.set(message.author.id, userData);

        if (userData.count >= 5) {
            message.member.timeout(60000).then(() => {
                message.channel.send(`${message.author.tag} a été temporairement bloqué pour spam.`);
            });
        }
    }
};