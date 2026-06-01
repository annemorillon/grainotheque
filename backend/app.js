require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const seedsRouter = require('./routes/seeds');
const trocRequest = require('./routes/request');
const PORT = process.env.PORT || 3000;
const app = express();
const path = require('path');

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://grainotheque-production.up.railway.app',
      'https://grainotheque-3yu7d58dk-annemorillons-projects.vercel.app/'
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqué par CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Sert les images comme fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Utilise les routes pour les graines
app.use('/seeds', seedsRouter);

// Utilise les demandes de troc
app.use('/request', trocRequest);

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Bienvenue sur Grainothèque !');
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