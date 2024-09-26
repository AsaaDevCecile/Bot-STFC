module.exports = {
    startChifumiGame(message) {
        const choices = ['pierre', 'papier', 'ciseaux'];
        const playerChoice = message.content.split(' ')[1];
        
        if (!choices.includes(playerChoice)) {
            return message.channel.send("Choisis entre pierre, papier ou ciseaux.");
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        message.channel.send(`Le bot a choisi ${botChoice}.`);

        if (playerChoice === botChoice) {
            message.channel.send("Égalité !");
        } else if (
            (playerChoice === 'pierre' && botChoice === 'ciseaux') ||
            (playerChoice === 'papier' && botChoice === 'pierre') ||
            (playerChoice === 'ciseaux' && botChoice === 'papier')
        ) {
            message.channel.send("Tu as gagné !");
        } else {
            message.channel.send("Le bot a gagné.");
        }
    }
};