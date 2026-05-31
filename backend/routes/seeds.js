const express = require('express');
const router = express.Router();
const pool = require('../db');

router.use(express.json());

// request SQL
router.get('/', async (req, res) => {
try {
	const result = await pool.query('SELECT * FROM seeds ORDER BY created_at DESC')
	res.json(result.rows)
} catch (err) {
	console.error('Erreur serveur:', err);
	res.status(500).json({ error: "Une erreur serveur est survenue" })
}
});

router.post('/', async (req, res) => {
try {
	const { name, type } = req.body
	if (!name || !name.trim()) {
	return res.status(400).json({ error: "Le nom est obligatoire et ne peut pas être vide." });
	}
	if (!type || !type.trim()) {
	return res.status(400).json({ error: "Le type est obligatoire et ne peut pas être vide." });
	}
	const result = await pool.query(
		'INSERT INTO seeds (name, type) VALUES ($1, $2) RETURNING *', 
		[name, type]
	)
	res.status(201).json(result.rows[0]);
}
catch (err) {
	console.error('Erreur serveur:', err);
	res.status(500).json({ error: "Une erreur serveur est survenue" })
}
});

router.put('/:id', async (req, res) => {
try {
	const { id } = req.params // L'id de la graine à modifier (ex: /seeds/5)
	const { name, type } = req.body // Les nouvelles valeurs
	if (!name || !name.trim()) {
	return res.status(400).json({ error: "Le nom est obligatoire et ne peut pas être vide." });
	}
	if (!type || !type.trim()) {
	return res.status(400).json({ error: "Le type est obligatoire et ne peut pas être vide." });
	}
	// On attend que la base de données METTE À JOUR la ligne correspondante
	const result = await pool.query(
		'UPDATE seeds SET name = $1, type = $2 WHERE id = $3 RETURNING *',
		[name, type, id]
	)

	// Si la graine n'existe pas, la base de données ne modifiera rien (rows sera vide)
	if (result.rows.length === 0) {
		return res.status(404).json({ error: "Graine non trouvé" })
	}

	// On renvoie la graine modifiée
	res.json(result.rows[0])
} catch (err) {
	console.error('Erreur serveur:', err);
	res.status(500).json({ error: "Une erreur serveur est survenue" })
}
});

router.delete('/:id', async (req, res) => {
try {
	const { id } = req.params

	// On attend que la base de données SUPPRIME la ligne
	const result = await pool.query('DELETE FROM seeds WHERE id = $1 RETURNING *', [id])

	if (result.rows.length === 0) {
		return res.status(404).json({ error: "Graine introuvable, impossible de supprimer" })
	}

	// On confirme la suppression réussie
	res.json({ message: "La graine a bien été supprimée avec succès !" })
} catch (err) {
	console.error('Erreur serveur:', err);
	res.status(500).json({ error: "Une erreur serveur est survenue" })
}
});

module.exports = router;