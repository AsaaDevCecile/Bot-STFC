// index.js
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logError = require('./utils/errorLogger');
require('dotenv').config({ path: './token.env' });

// Configuration
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.BOT_TOKEN;

// Création du client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Initialisation des collections
client.commands = new Collection();

// Importation des modules de modération
const moderationCommands = require('./moderation/moderation');
const filterMessages = require('./moderation/messageFilter');
const warningsSystem = require('./moderation/warnings');
const antiSpam = require('./moderation/antiSpam');
const logs = require('./moderation/logs');
const verificationSystem = require('./moderation/verification');
const welcomeSystem = require('./welcome/welcome'); // Assurez-vous d'avoir ce fichier
const formHandler = require('./form/formHandler'); // Assurez-vous d'avoir ce fichier

// Importation des modules de musique et jeux
const musicHandler = require('./musique/music');
const gamingHandler = require('./commands/cdsJeux');

// Chargement des commandes
const loadCommands = () => {
    // Commandes slash
    const commands = [
        {
            name: 'play',
            description: 'Joue une chanson',
            options: [{
                name: 'query',
                type: 3,
                description: 'La chanson à jouer',
                required: true,
            }],
        },
        {
            name: 'stop',
            description: 'Arrête la musique',
        },
        // Ajoutez d'autres commandes slash ici
    ];

    // Chargement des commandes depuis le dossier commands
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        client.commands.set(command.name, command);
    }

    return commands;
};

// Enregistrement des commandes slash
const registerCommands = async (commands) => {
    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log('Début du rafraîchissement des commandes (/)...');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log('Commandes (/) rechargées avec succès!');
    } catch (error) {
        console.error('Erreur lors du rechargement des commandes:', error);
        logError(error);
    }
};

// Event: Ready
client.once('ready', async () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    const commands = loadCommands();
    await registerCommands(commands);
});

// Event: MessageCreate
client.on('messageCreate', message => {
    if (message.author.bot) return;

    // Commande Ping basique
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }

    // Gestion de la modération
    moderationCommands.handleModeration(message);
    filterMessages.handleMessageFilter(message);
    warningsSystem.handleWarnings(message);
    antiSpam.handleAntiSpam(message);
});

// Event: InteractionCreate
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande:', error);
        logError(error);
        await interaction.reply({
            content: 'Une erreur est survenue lors de l\'exécution de la commande!',
            ephemeral: true
        });
    }
});

// Event: GuildMemberAdd
client.on('guildMemberAdd', member => {
    verificationSystem.handleMemberVerification(member);
    welcomeSystem.handleMemberWelcome(member);

    // Formulaire de présentation
    member.send("Bienvenue ! Nous allons te poser quelques questions pour mieux te connaître.");
    formHandler.handleMemberForm(member);
});

// Gestion des erreurs
client.on('error', error => {
    console.error('Une erreur globale est survenue:', error);
    logError(error);
});

process.on('unhandledRejection', error => {
    console.error('Promesse non gérée:', error);
    logError(error);
});

// Connexion du bot
client.login(token)
    .then(() => console.log('Bot connecté avec succès!'))
    .catch(error => {
        console.error('Erreur lors de la connexion:', error);
        logError(error);
    });

module.exports = client;
