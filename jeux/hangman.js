module.exports = {
    startHangmanGame(message) {
        const words = ['javascript', 'discord', 'programmation', 'bot'];
        const wordToGuess = words[Math.floor(Math.random() * words.length)];
        let hiddenWord = '_ '.repeat(wordToGuess.length).trim();
        let attempts = 6;
        const guessedLetters = [];

        message.channel.send(`Jeu du Pendu ! Mot à deviner : \`${hiddenWord}\``);

        const filter = response => response.author.id === message.author.id && response.content.length === 1;
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', msg => {
            const guess = msg.content.toLowerCase();
            
            if (guessedLetters.includes(guess)) {
                return msg.channel.send("Tu as déjà deviné cette lettre !");
            }

            guessedLetters.push(guess);

            if (wordToGuess.includes(guess)) {
                let newHiddenWord = '';
                for (let i = 0; i < wordToGuess.length; i++) {
                    newHiddenWord += wordToGuess[i] === guess ? guess : hiddenWord[2 * i];
                }
                hiddenWord = newHiddenWord.split('').join(' ');

                if (!hiddenWord.includes('_')) {
                    msg.channel.send(`Bravo ! Tu as trouvé le mot : **${wordToGuess}**`);
                    collector.stop();
                } else {
                    msg.channel.send(`Bien joué ! Mot à deviner : \`${hiddenWord}\``);
                }
            } else {
                attempts--;
                if (attempts === 0) {
                    msg.channel.send(`Tu as perdu ! Le mot était **${wordToGuess}**`);
                    collector.stop();
                } else {
                    msg.channel.send(`Mauvaise lettre ! Il te reste ${attempts} tentatives.`);
                }
            }
        });

        collector.on('end', () => {
            message.channel.send("Le jeu du Pendu est terminé.");
        });
    }
};