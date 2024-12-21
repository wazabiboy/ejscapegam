const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database(path.join(__dirname, '../escape_game.db')); // Chemin relatif pour la DB

// Serve les fichiers statiques depuis le dossier 'public' qui est à la racine du projet
app.use(express.static(path.join(__dirname, '../public'))); // Ajustement ici

// Middleware pour analyser le corps des requêtes (JSON)
app.use(bodyParser.json());

// Initialisation de la base de données
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    start_time INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  )`);
});

// Route d'inscription
app.post('/register', (req, res) => {
  const { name, city } = req.body;
  if (!name || !city) {
    return res.status(400).json({ success: false, message: 'Nom et ville sont obligatoires.' });
  }

  // Insérer un nouvel utilisateur
  db.run("INSERT INTO players (name, city) VALUES (?, ?)", [name, city], function(err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, playerId: this.lastID });
  });
});

// Route pour récupérer le temps restant d'un joueur
app.get('/time/:playerId', (req, res) => {
  const { playerId } = req.params;
  
  db.get("SELECT start_time FROM players WHERE id = ?", [playerId], (err, row) => {
    if (err || !row) {
      return res.status(500).json({ success: false, error: 'Joueur non trouvé.' });
    }

    const elapsedTime = (Date.now() / 1000) - row.start_time;
    const timeRemaining = 120 * 60 - elapsedTime;
    if (timeRemaining <= 0) {
      return res.status(200).json({ success: false, message: 'Temps écoulé' });
    }

    res.status(200).json({ success: true, timeRemaining });
  });
});

// Route de la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'page1.html')); // Chemin ajusté ici
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
