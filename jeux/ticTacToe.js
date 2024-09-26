module.exports = {
    startTicTacToeGame(message) {
        const grid = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];
        let currentPlayer = 'X';

        const printGrid = () => {
            return grid.map(row => row.join(' ')).join('\n');
        };

        const checkWinner = () => {
            // Vérifier les lignes, colonnes et diagonales pour déterminer le gagnant
            // Retourner 'X', 'O' ou null si pas encore de gagnant
        };

        message.channel.send(`Début du morpion! \n${printGrid()}`);

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', msg => {
            const [row, col] = msg.content.split(' ').map(Number);

            if (grid[row][col] === '-') {
                grid[row][col] = currentPlayer;
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                msg.channel.send(printGrid());

                const winner = checkWinner();
                if (winner) {
                    msg.channel.send(`${winner} a gagné!`);
                    collector.stop();
                }
            } else {
                msg.channel.send("Cette case est déjà prise.");
            }
        });

        collector.on('end', () => {
            message.channel.send("Fin du jeu.");
        });
    }
};