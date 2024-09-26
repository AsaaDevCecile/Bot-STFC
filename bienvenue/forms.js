module.exports = {
    async handleMemberForm(member) {
        const questions = [
            "A/ Généralité :\n1.1/ Quel est ton nom sur Discord ?",
            "1.2/ Quel est ton nom dans le jeu (pseudo) ?",
            "1.3/ Quel est ton genre ?",
            "1.4/ Quelle est ta date de naissance ?",
            "1.5/ Quels sont tes loisirs ?",
            "1.6/ Qu'est-ce que tu aimes ?",
            "1.7/ Qu'est-ce que tu n'aimes pas ?",
            "B/ Partie Jeux :\n2.1/ Quel est ton serveur d'origine (ex: 178) ?",
            "2.2/ Quel est ton serveur actuel ?",
            "2.3/ Quel est ton tag d'Alliance (ex: BOB) ?",
            "2.4/ Quel est le nom de ton Alliance ?",
            "2.5/ Quel est ton grade dans l'Alliance ?",
            "2.6/ Quelle était ton ancienne Alliance ?",
            "2.7/ À quels autres jeux joues-tu ?",
            "C/ Personnalité et situation géographique :\n3.1/ Quelles sont tes qualités ?",
            "3.2/ Quels sont tes défauts ?",
            "3.3/ Quelles langues parles-tu ?",
            "3.4/ Sur quel continent vis-tu ?",
            "3.5/ Quel est ton pays ?",
            "3.6/ Quel est ton département ?"
        ];

        const collectedAnswers = [];
        let index = 0;

        // Envoie la première question en DM
        const askQuestion = async () => {
            if (index < questions.length) {
                await member.send(questions[index]);
                index++;
            } else {
                // Quand toutes les questions sont répondues, affiche les résultats
                await member.send("Merci d'avoir rempli le formulaire !");
                
                // Envoie les résultats dans le canal "présentations" sous la catégorie "la promenade publique"
                const resultsChannel = member.guild.channels.cache.find(channel => 
                    channel.name === 'présentations' && channel.parent?.name === 'la promenade publique'
                );
                
                if (resultsChannel) {
                    resultsChannel.send(`Présentation de ${member.user.tag} :\n\n${formatAnswers(collectedAnswers)}`);
                } else {
                    console.log('Le canal "présentations" sous la catégorie "la promenade publique" n\'a pas été trouvé.');
                }
            }
        };

        // Gestion des réponses
        const dmChannel = await member.createDM();
        const collector = dmChannel.createMessageCollector({
            time: 60000 * questions.length // Limite de temps pour répondre
        });

        collector.on('collect', async (message) => {
            collectedAnswers.push(message.content);
            if (index < questions.length) {
                await askQuestion();
            } else {
                collector.stop();
            }
        });

        collector.on('end', () => {
            if (index < questions.length) {
                member.send("Formulaire annulé ou expiré.");
            }
        });

        // Lance la première question
        await askQuestion();

        // Fonction pour formater les réponses
        const formatAnswers = (answers) => {
            let result = '';
            questions.forEach((question, idx) => {
                result += `${question}\nRéponse : ${answers[idx] || 'Pas de réponse'}\n\n`;
            });
            return result;
        };
    }
};