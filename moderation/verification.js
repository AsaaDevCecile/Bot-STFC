module.exports = {
    handleMemberVerification(member) {
        const role = member.guild.roles.cache.find(r => r.name === 'Vérifié');
        member.send('Bienvenue sur le serveur ! Réagis à ce message avec 👍 pour obtenir le rôle "Vérifié".');

        client.on('messageReactionAdd', (reaction, user) => {
            if (reaction.emoji.name === '👍' && user.id === member.id) {
                member.roles.add(role);
            }
        });
    }
};