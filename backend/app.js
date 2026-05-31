require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const seedsRouter = require('./routes/seeds');
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:3001'], // Remplace par l'URL de ton frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));
app.use(express.json());

// Utilise les routes pour les graines
app.use('/seeds', seedsRouter);

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Bienvenue sur Grainotrope !');
});

// // Démarre le serveur
// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur http://localhost:${PORT}`);
// });

// Exporte l'app pour les tests (Supertest)
module.exports = app;