const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
// Récupérez tous les fichiers de commandes du répertoire de commandes que vous avez créé précédemment
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Récupérer la sortie SlashCommandBuilder#toJSON() des données de chaque commande pour le déploiement
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construire et préparer une instance du module REST
const rest = new REST({ version: '10' }).setToken(token);

// et déployez vos commandes !
(async () => {
	try {
		console.log(`A commencé à rafraîchir ${commands.length} application (/) commands.`);

		// La méthode put est utilisée pour actualiser complètement toutes les commandes de la guilde avec l'ensemble actuel
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),//
			{ body: commands },
		);

		console.log(`Rechargé avec succès ${data.length} application (/) commands.`);
	} catch (error) {
		// Et bien sûr, assurez-vous d'attraper et de consigner toutes les erreurs 
		console.error(error);
	}
})();
