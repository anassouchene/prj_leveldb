import express from 'express';
import level from 'level';
import cors from 'cors';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new level.Level('./mydb');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Serve static files (HTML, CSS, JS, etc.) from the current directory
app.use(express.static(path.join(__dirname, '/')));

// Redirection des requêtes vers des fichiers .html sans extension
app.get('/:page', (req, res) => {
  const { page } = req.params;
  res.sendFile(path.join(__dirname, `/${page}.html`));
});

// POST endpoint to add a new person
app.post('/api/personnes', async (req, res) => {
  const { key, nom, prenom, age } = req.body;

  if (!key || !nom || !prenom || !age) {
    return res.status(400).json({ message: 'Clé, nom, prénom et âge sont requis.' });
  }

  // Basic validation (age should be a number)
  if (isNaN(age) || age <= 0) {
    return res.status(400).json({ message: 'L\'âge doit être un nombre positif.' });
  }

  try {
    // Vérification si la clé existe déjà
    const personneExistante = await db.get(key).catch(() => null);

    if (personneExistante) {
      return res.status(409).json({ message: 'L employé avec cette clé existe déjà.' });
    }

    // Si la clé n'existe pas, ajout de la personne
    await db.put(key, JSON.stringify({ nom, prenom, age }));
    res.status(201).json({ message: 'Employé ajouté avec succès !' });
  } catch (error) {
    console.error(chalk.red('Erreur lors de l\'ajout de la personne :'), error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET endpoint to retrieve a person by key
app.get('/api/personnes/:key', async (req, res) => {
  const { key } = req.params;

  try {
    const personne = await db.get(key);
    res.json(JSON.parse(personne));
  } catch (error) {
    console.error(chalk.red('Erreur lors de la récupération de la personne :'), error);
    res.status(404).json({ message: 'Employé non trouvé.' });
  }
});

// GET endpoint to list all people (this is optional)
app.get('/api/personnes', async (req, res) => {
  try {
    const personnes = [];
    for await (const [key, value] of db.iterator()) {
      personnes.push({ key, ...JSON.parse(value) });
    }
    res.json(personnes);
  } catch (error) {
    console.error(chalk.red('Erreur lors de la récupération des personnes :'), error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const port = 4200;
app.listen(port, () => {
  console.log(chalk.green(`Serveur démarré sur http://localhost:${port}`));
});
