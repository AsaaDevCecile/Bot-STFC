module.exports = {
    startMinesweeperGame(message) {
        const size = 5;
        const minesCount = 5;
        const grid = Array.from({ length: size }, () => Array(size).fill(0));

        // Placer les mines aléatoirement
        for (let i = 0; i < minesCount; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * size);
                y = Math.floor(Math.random() * size);
            } while (grid[x][y] === '💣');
            grid[x][y] = '💣';
        }

        // Calculer les indices autour des mines
        const directions = [
            [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
        ];

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (grid[x][y] === '💣') continue;
                let count = 0;
                directions.forEach(([dx, dy]) => {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (newX >= 0 && newX < size && newY >= 0 && newY < size && grid[newX][newY] === '💣') {
                        count++;
                    }
                });
                grid[x][y] = count;
            }
        }

        const printGrid = () => {
            return grid.map(row => row.join(' | ')).join('\n');
        };

        message.channel.send(`Voici ton champ de démineur : \n${printGrid()}`);
    }
};