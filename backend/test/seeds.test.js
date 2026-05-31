// backend/tests/seeds.test.js
const request = require('supertest');
const app = require('../app'); // Pas besoin de démarrer le serveur !
const pool = require('../db'); 

describe('GET /seeds', () => {
  it('devrait retourner un tableau vide', async () => {
    const res = await request(app).get('/seeds');
    expect(res.status).toBe(200);
  });
});

// Fonction pour vider la table avant/après les tests
beforeAll(async () => {
  await pool.query('DELETE FROM seeds');
});

afterAll(async () => {
  await pool.query('DELETE FROM seeds');
  await pool.end(); // Ferme la connexion à la base
});

describe('GET /seeds', () => {
  it('devrait retourner un tableau vide si aucune graine', async () => {
    const res = await request(app)
      .get('/seeds');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('devrait retourner toutes les graines', async () => {
    // Insère une graine pour le test
    await pool.query(
      'INSERT INTO seeds (name, type, quantity) VALUES ($1, $2, $3)',
      ['Test Seed', 'Flower', 10]
    );

    const res = await request(app)
      .get('/seeds');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('POST /seeds', () => {
  it('devrait créer une nouvelle graine (201)', async () => {
    const res = await request(app)
      .post('/seeds')
      .send({
        name: 'Sunflower',
        type: 'Flower',
        quantity: 20
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Sunflower');
    expect(res.body.type).toBe('Flower');
    expect(res.body.id).toBeDefined(); // Vérifie que l'ID est généré
  });

  it('devrait retourner 400 si le nom est manquant', async () => {
    const res = await request(app)
      .post('/seeds')
      .send({
        type: 'Flower'
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('nom');
  });
});

describe('PUT /seeds/:id', () => {
  it('devrait modifier une graine existante', async () => {
    // Insère une graine pour le test
    const insertRes = await pool.query(
      'INSERT INTO seeds (name, type) VALUES ($1, $2) RETURNING id',
      ['Old Name', 'Flower']
    );
    const seedId = insertRes.rows[0].id;

    const res = await request(app)
      .put(`/seeds/${seedId}`)
      .send({
        name: 'New Name',
        type: 'Vegetable'
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New Name');
    expect(res.body.type).toBe('Vegetable');
  });

  it('devrait retourner 404 si la graine n\'existe pas', async () => {
    const res = await request(app)
      .put('/seeds/99999')
      .send({
        name: 'Non-existent',
        type: 'Flower'
      });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /seeds/:id', () => {
  it('devrait supprimer une graine existante', async () => {
    // Insère une graine pour le test
    const insertRes = await pool.query(
      'INSERT INTO seeds (name, type) VALUES ($1, $2) RETURNING id',
      ['To Delete', 'Flower']
    );
    const seedId = insertRes.rows[0].id;

    const res = await request(app)
      .delete(`/seeds/${seedId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('supprimée');

    // Vérifie que la graine a bien été supprimée
    const checkRes = await pool.query('SELECT * FROM seeds WHERE id = $1', [seedId]);
    expect(checkRes.rows.length).toBe(0);
  });

  it('devrait retourner 404 si la graine n\'existe pas', async () => {
    const res = await request(app)
      .delete('/seeds/99999');
    expect(res.status).toBe(404);
  });
});