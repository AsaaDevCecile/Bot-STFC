module.exports = {
    startColormindGame(message) {
        const colors = ['rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc'];
        const secretColors = Array.from({ length: 4 }, () =>
            colors[Math.floor(Math.random() * colors.length)]
        );

        let attempts = 10;

        message.channel.send(`Jeu de Colormind ! Devine la bonne combinaison de 4 couleurs. Choix possibles : ${colors.join(', ')}`);

        const filter = response => response.author.id === message.author.id && response.content.split(' ').length === 4;
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', msg => {
            const playerGuess = msg.content.split(' ');

            let correctPositions = 0;
            let correctColors = 0;

            playerGuess.forEach((color, index) => {
                if (color === secretColors[index]) {
                    correctPositions++;
                } else if (secretColors.includes(color)) {
                    correctColors++;
                }
            });

            attempts--;

            if (correctPositions === 4) {
                msg.channel.send(`Félicitations ! Tu as deviné la combinaison : ${secretColors.join(' ')}`);
                collector.stop();
            } else if (attempts === 0) {
                msg.channel.send(`Dommage, tu n'as plus d'essais. La bonne combinaison était : ${secretColors.join(' ')}`);
                collector.stop();
            } else {
                msg.channel.send(`Tu as ${correctPositions} couleurs bien placées et ${correctColors} bonnes couleurs mais mal placées. Il te reste ${attempts} tentatives.`);
            }
        });

        collector.on('end', () => {
            message.channel.send("Le jeu de Colormind est terminé.");
        });
    }
};