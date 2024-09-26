module.exports = {
    startBingo(message) {
        const bingoGrid = Array.from({ length: 5 }, () =>
            Array.from({ length: 5 }, () => Math.floor(Math.random() * 75) + 1)
        );

        const printBingoGrid = () => {
            return bingoGrid.map(row => row.join(' | ')).join('\n');
        };

        message.channel.send(`Voici ta grille de Bingo : \n${printBingoGrid()}`);
    }
};