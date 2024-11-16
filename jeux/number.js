module.exports = {
    startGuessNumberGame(message) {
        const numberToGuess = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;

        message.channel.send("J'ai choisi un nombre entre 1 et 100. Devinez-le!");

        const filter = response => !isNaN(response.content) && response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', msg => {
            const guess = parseInt(msg.content);
            attempts++;

            if (guess === numberToGuess) {
                msg.channel.send(`Bravo, tu as trouvé le nombre en ${attempts} tentatives!`);
                collector.stop();
            } else if (guess < numberToGuess) {
                msg.channel.send("Trop petit !");
            } else {
                msg.channel.send("Trop grand !");
            }
        });

        collector.on('end', () => {
            if (attempts === 0) {
                message.channel.send("Temps écoulé, personne n'a trouvé le nombre.");
            }
        });
    }
};
