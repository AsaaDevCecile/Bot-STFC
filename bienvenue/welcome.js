module.exports = {
    handleMemberWelcome(member) {
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'bienvenue'); // Remplace par le nom du canal de bienvenue
        const role = member.guild.roles.cache.find(r => r.name === 'Membre'); // Remplace par le nom du rôle que tu souhaites attribuer

        if (!role) {
            console.log('Rôle non trouvé. Crée un rôle "Membre" dans ton serveur.');
            return;
        }

        // Envoyer un message de bienvenue dans le canal dédié
        if (welcomeChannel) {
            welcomeChannel.send(`Bienvenue ${member.user}, réagis avec 👍 pour obtenir le rôle de ${role.name}!`);
        }

        // Envoyer un message privé au nouveau membre
        member.send(`Bienvenue sur le serveur ! Réagis à ce message avec 👍 pour être vérifié.`).then(() => {
            // Gérer la réaction pour attribuer le rôle
            const filter = (reaction, user) => reaction.emoji.name === '👍' && user.id === member.id;
            const collector = member.createDM().createReactionCollector({ filter, max: 1, time: 60000 });

            collector.on('collect', () => {
                member.roles.add(role).then(() => {
                    member.send(`Tu as été vérifié et le rôle ${role.name} t'a été attribué !`);
                }).catch(err => {
                    console.log('Erreur lors de l\'attribution du rôle.', err);
                });
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    member.send('Temps de vérification expiré. Réessaye en envoyant un message au modérateur.');
                }
            });
        });
    }
};