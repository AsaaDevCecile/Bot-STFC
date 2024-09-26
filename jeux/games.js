module.exports = {
    name: 'games',
    description: 'Joue à quelques mini-jeux',

    // Commande pour lancer un dé
    rollDice(message) {
        const sides = 6;
        const result = Math.floor(Math.random() * sides) + 1;
        message.channel.send(`🎲 Tu as obtenu un ${result}`);
    },

    // Commande pour un quiz simple
    startQuiz(message) {
        const questions = [
            { question: "Quel est le plus grand océan du monde ?", answer: "Pacifique" },
            { question: "Combien de côtés a un hexagone ?", answer: "6" }
        ];
        
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        message.channel.send(randomQuestion.question);

        const filter = response => response.content.toLowerCase() === randomQuestion.answer.toLowerCase();
        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                message.channel.send(`${collected.first().author} a donné la bonne réponse !`);
            })
            .catch(() => {
                message.channel.send("Temps écoulé ! La réponse était " + randomQuestion.answer);
            });
    }
};