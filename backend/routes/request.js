const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  try {
    const { seed_id, message } = req.body;

    if (!seed_id) {
      return res.status(400).json({ error: "L'identifiant de la graine est obligatoire." });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Le message ne peut pas être vide." });
    }

    const result = await pool.query(
      `INSERT INTO requests (seed_id, message) 
       VALUES ($1, $2) RETURNING *`,
      [seed_id, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la création de la demande:', err);
    res.status(500).json({ error: "Une erreur serveur est survenue lors de la demande de troc." });
  }
});

module.exports = router;