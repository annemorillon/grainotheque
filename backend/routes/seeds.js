const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const supabase = require('../supabaseClient');

// POST /seeds — avec image vers Supabase
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, type, quantity, season } = req.body

    if (!name || !name.trim())
      return res.status(400).json({ error: "Le nom est obligatoire." })
    if (!type || !type.trim())
      return res.status(400).json({ error: "Le type est obligatoire." })

    let image_url = null

    // Si une image a été uploadée
    if (req.file) {
      const nomUnique = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const nomFichier = `${nomUnique}${require('path').extname(req.file.originalname)}`
      
      // Upload vers Supabase
      const { data, error } = await supabase.storage
        .from('seeds-images')
        .upload(nomFichier, req.file.buffer, {
          contentType: req.file.mimetype
        })

      if (error) {
        console.error('Erreur Supabase:', error)
        return res.status(500).json({ error: 'Erreur lors de l\'upload' })
      }

      // Construire l'URL publique
      image_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/seeds-images/${nomFichier}`
    }

    // Sauvegarder en base de données
    const result = await pool.query(
      `INSERT INTO seeds (name, type, quantity, season, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, type, quantity, season, image_url]
    )
    res.status(201).json(result.rows[0])

  } catch (err) {
    console.error('Erreur:', err)
    res.status(500).json({ error: "Erreur serveur" })
  }
});

// PUT /seeds/:id — pour modifier avec nouvelle image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params
    const { name, type, quantity, season } = req.body

    if (!name || !name.trim())
      return res.status(400).json({ error: "Le nom est obligatoire." })
    if (!type || !type.trim())
      return res.status(400).json({ error: "Le type est obligatoire." })

    let updateData = { name, type, quantity, season }

    // Si une nouvelle image
    if (req.file) {
      const nomUnique = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const nomFichier = `${nomUnique}${require('path').extname(req.file.originalname)}`
      
      const { data, error } = await supabase.storage
        .from('seeds-images')
        .upload(nomFichier, req.file.buffer, {
          contentType: req.file.mimetype
        })

      if (error) return res.status(500).json({ error: 'Erreur upload' })

      updateData.image_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/seeds-images/${nomFichier}`
    }

    const result = await pool.query(
      `UPDATE seeds 
       SET name = $1, type = $2, quantity = $3, season = $4, image_url = $5 
       WHERE id = $6 RETURNING *`,
      [updateData.name, updateData.type, updateData.quantity, updateData.season, updateData.image_url, id]
    )

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Graine non trouvée" })

    res.json(result.rows[0])

  } catch (err) {
    console.error('Erreur:', err)
    res.status(500).json({ error: "Erreur serveur" })
  }
});

module.exports = router;