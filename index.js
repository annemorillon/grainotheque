const express = require('express')
const cors = require('cors')
const pool = require('./db')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/seeds', async (req, res) => {
try {
	const result = await pool.query('SELECT * FROM seeds ORDER BY created_at DESC')
	res.json(result.rows)
} catch (err) {
	res.status(500).json({ error: err.message })
}
})

app.listen(3000, () => {
	console.log('Server started on http://localhost:3000')
})