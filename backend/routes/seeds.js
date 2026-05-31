const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');

// GET /seeds
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM seeds ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: "Une erreur serveur est survenue" })
  }
});

// POST /seeds — avec ou sans image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, type, quantity, season } = req.body

    if (!name || !name.trim())
      return res.status(400).json({ error: "Le nom est obligatoire et ne peut pas être vide." })
    if (!type || !type.trim())
      return res.status(400).json({ error: "Le type est obligatoire et ne peut pas être vide." })
    if (quantity !== undefined && quantity !== '') {
      const qty = parseInt(quantity)
      if (isNaN(qty) || qty < 0) {
        return res.status(400).json({ error: "La quantité doit être un nombre positif." })
      }
    }
    const image_url = req.file ? `/uploads/${req.file.filename}` : null

    const result = await pool.query(
      `INSERT INTO seeds (name, type, quantity, season, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, type, quantity, season, image_url]
    )
    res.status(201).json(result.rows[0])

  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: "Une erreur serveur est survenue" })
  }
});

// PUT /seeds/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, type } = req.body

    if (!name || !name.trim())
      return res.status(400).json({ error: "Le nom est obligatoire et ne peut pas être vide." })
    if (!type || !type.trim())
      return res.status(400).json({ error: "Le type est obligatoire et ne peut pas être vide." })

    const result = await pool.query(
      'UPDATE seeds SET name = $1, type = $2 WHERE id = $3 RETURNING *',
      [name, type, id]
    )

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Graine non trouvée" })

    res.json(result.rows[0])
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: "Une erreur serveur est survenue" })
  }
});

// DELETE /seeds/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('DELETE FROM seeds WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Graine introuvable, impossible de supprimer" })

    res.json({ message: "La graine a bien été supprimée avec succès !" })
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: "Une erreur serveur est survenue" })
  }
});

module.exports = router;