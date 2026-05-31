require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const seedsRouter = require('./routes/seeds');
const PORT = process.env.PORT || 3000;
const app = express();
const path = require('path');

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173'], // Remplace par l'URL de ton frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));
app.use(express.json());

// Sert les images comme fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Utilise les routes pour les graines
app.use('/seeds', seedsRouter);

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Bienvenue sur Grainotrope !');
});

// Gestion des erreurs Multer
app.use((err, req, res, next) => {
  if (err.message === 'Format non supporté. Utilisez JPG, PNG ou WebP.') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message });
});

// Exporte l'app pour les tests (Supertest)
module.exports = app;