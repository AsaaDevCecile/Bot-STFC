const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: './token.env' }); // Chargement du fichier token.env

// Modérations
const moderationCommands = require('./moderation/moderation');
const filterMessages = require('./moderation/messageFilter');
const warningsSystem = require('./moderation/warnings');
const antiSpam = require('./moderation/antiSpam');
const logs = require('./moderation/logs');
const verificationSystem = require('./moderation/verification');

// Bienvenue
const welcomeSystem = require('./bienvenue/welcome');
const formHandler = require('./bienvenue/forms');

// Jeux
const gamesHandler = require('./jeux/games');
const guessNumberGame = require('./jeux/devineLeNombre');
const ticTacToeGame = require('./jeux/ticTacToe');
const chifumiGame = require('./jeux/chifumi');
const bingoGame = require('./jeux/bingo');
const hangmanGame = require('./jeux/hangman');
const minesweeperGame = require('./jeux/minesweeper');
const colormindGame = require('./jeux/colormind');

// Musique 
const musicHandler = require('./musique/music');

// Créer une nouvelle instance du client Discord avec les intentions nécessaires
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Intention pour gérer les membres qui rejoignent
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Manquait une virgule ici
        GatewayIntentBits.GuildVoiceStates // Pour la musique
    ]
});

// Quand le bot est prêt
client.once('ready', () => {
    console.log('Bot is online!');
});

// Gérer les messages
client.on('messageCreate', message => {
    if (message.author.bot) return;

    // Commande Ping
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }

    // Commandes de modération
    moderationCommands.handleModeration(message);
    filterMessages.handleMessageFilter(message);
    warningsSystem.handleWarnings(message);
    antiSpam.handleAntiSpam(message);

    // Commandes des mini-jeux
    if (message.content === '!roll') {
        gamesHandler.rollDice(message);
    } else if (message.content === '!quiz') {
        gamesHandler.startQuiz(message);
    } else if (message.content === '!devine') {
        guessNumberGame.startGuessNumberGame(message);
    } else if (message.content === '!morpion') {
        ticTacToeGame.startTicTacToeGame(message);
    } else if (message.content.startsWith('!chifumi')) {
        chifumiGame.startChifumiGame(message);
    } else if (message.content === '!bingo') {
        bingoGame.startBingo(message);
    } else if (message.content === '!pendu') {
        hangmanGame.startHangmanGame(message);
    } else if (message.content === '!démineur') {
        minesweeperGame.startMinesweeperGame(message);
    } else if (message.content === '!colormind') {
        colormindGame.startColormindGame(message);
    }

    // Commandes pour la musique
    if (message.content.startsWith('!play ')) {
        const url = message.content.split(' ')[1];
        musicHandler.playMusic(message, url);
    } else if (message.content === '!stop') {
        musicHandler.stopMusic(message);
    }
});

// Gestion des nouveaux membres
client.on('guildMemberAdd', member => {
    verificationSystem.handleMemberVerification(member);
    welcomeSystem.handleMemberWelcome(member);

    // Formulaire de présentation
    member.send("Bienvenue ! Nous allons te poser quelques questions pour mieux te connaître.");
    formHandler.handleMemberForm(member);
});

// Connexion avec le token du bot (utilise une variable d'environnement pour le token)
client.login(process.env.BOT_TOKEN);