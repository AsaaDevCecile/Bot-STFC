const logChannelId = 'ID_DU_CHANNEL_LOGS'; // Remplace par l'ID du canal de logs

module.exports = {
    logModerationActions(member, action) {
        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            logChannel.send(`${member.user.tag} a été ${action}.`);
        }
    }
};
