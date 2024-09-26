module.exports = {
    handleModeration(message) {
        // Commande !kick
        if (message.content.startsWith('!kick')) {
            if (!message.member.permissions.has('KICK_MEMBERS')) {
                return message.reply('Tu n’as pas la permission d’expulser des membres.');
            }

            const member = message.mentions.members.first();
            if (member) {
                member.kick().then(() => {
                    message.channel.send(`${member.user.tag} a été expulsé.`);
                }).catch(err => {
                    message.channel.send('Je ne peux pas expulser cet utilisateur.');
                    console.error(err);
                });
            } else {
                message.reply('Mentionne un membre valide pour l’expulser.');
            }
        }

        // Commande !ban
        if (message.content.startsWith('!ban')) {
            if (!message.member.permissions.has('BAN_MEMBERS')) {
                return message.reply('Tu n’as pas la permission de bannir des membres.');
            }

            const member = message.mentions.members.first();
            if (member) {
                member.ban().then(() => {
                    message.channel.send(`${member.user.tag} a été banni.`);
                }).catch(err => {
                    message.channel.send('Je ne peux pas bannir cet utilisateur.');
                    console.error(err);
                });
            } else {
                message.reply('Mentionne un membre valide pour le bannir.');
            }
        }

        // Commande !mute
        if (message.content.startsWith('!mute')) {
            if (!message.member.permissions.has('MUTE_MEMBERS')) {
                return message.reply('Tu n’as pas la permission de mute des membres.');
            }

            const member = message.mentions.members.first();
            const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

            if (!muteRole) {
                return message.channel.send('Le rôle "Muted" n\'existe pas. Crée-le et configure-le pour bloquer les messages.');
            }

            if (member) {
                member.roles.add(muteRole).then(() => {
                    message.channel.send(`${member.user.tag} a été mute.`);
                }).catch(err => {
                    message.channel.send('Je ne peux pas mute cet utilisateur.');
                    console.error(err);
                });
            } else {
                message.reply('Mentionne un membre valide pour le mute.');
            }
        }
    }
};