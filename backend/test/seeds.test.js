// backend/tests/seeds.test.js
const request = require('supertest');
const app = require('../app');
const pool = require('../db');
const path = require('path');
const fs = require('fs');

// Chemin vers une image de test — créée dynamiquement ci-dessous
const TEST_IMAGE_PATH = path.join(__dirname, 'fixtures', 'test-image.png');

// Crée une vraie image PNG minimale avant tous les tests
// (un PNG valide de 1x1 pixel en base64)
beforeAll(async () => {
  await pool.query('DELETE FROM seeds');

  const fixturesDir = path.join(__dirname, 'fixtures');
  if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir);

  const PNG_1x1 = Buffer.from(
    '89504e470d0a1a0a0000000d4948445200000001000000010806000000' +
    '1f15c4890000000a49444154789c626000000000020001e221bc33' +
    '0000000049454e44ae426082',
    'hex'
  );
  fs.writeFileSync(TEST_IMAGE_PATH, PNG_1x1);
});

afterAll(async () => {
  await pool.query('DELETE FROM seeds');
  // Nettoie l'image de test
  if (fs.existsSync(TEST_IMAGE_PATH)) fs.unlinkSync(TEST_IMAGE_PATH);
  await pool.end();
});

// ─────────────────────────────────────────
// GET /seeds
// ─────────────────────────────────────────
describe('GET /seeds', () => {
  it('devrait retourner un tableau vide si aucune graine', async () => {
    const res = await request(app).get('/seeds');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('devrait retourner toutes les graines', async () => {
    await pool.query(
      'INSERT INTO seeds (name, type, quantity) VALUES ($1, $2, $3)',
      ['Test Seed', 'Flower', 10]
    );
    const res = await request(app).get('/seeds');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────
// POST /seeds — sans image
// ─────────────────────────────────────────
describe('POST /seeds (sans image)', () => {
  it('devrait créer une graine sans image (201)', async () => {
    const res = await request(app)
      .post('/seeds')
      .field('name', 'Sunflower')   // .field() au lieu de .send()
      .field('type', 'Flower')      // car la route utilise upload.single()
      .field('quantity', '20');     // qui attend multipart, pas JSON

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Sunflower');
    expect(res.body.type).toBe('Flower');
    expect(res.body.id).toBeDefined();
    expect(res.body.image_url).toBeNull(); // pas d'image → null
  });

  it('devrait retourner 400 si le nom est manquant', async () => {
    const res = await request(app)
      .post('/seeds')
      .field('type', 'Flower');

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('nom');
  });

  it('devrait retourner 400 si le type est manquant', async () => {
    const res = await request(app)
      .post('/seeds')
      .field('name', 'Tomate');

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('type');
  });
});

// ─────────────────────────────────────────
// POST /seeds — avec image
// ─────────────────────────────────────────
describe('POST /seeds (avec image)', () => {
  it('devrait créer une graine avec image et retourner image_url (201)', async () => {
    expect(fs.existsSync(TEST_IMAGE_PATH)).toBe(true);
    const res = await request(app)
      .post('/seeds')
      .field('name', 'Tomate Cœur de Bœuf')
      .field('type', 'Légume')
      .field('quantity', '30')
      .field('season', 'Printemps')
      .attach('image', TEST_IMAGE_PATH); // .attach(champ, chemin)

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Tomate Cœur de Bœuf');
    expect(res.body.image_url).not.toBeNull();
    expect(res.body.image_url).toMatch(/^\/uploads\//); // commence par /uploads/
  });

  it('devrait refuser un fichier non-image (400)', async () => {
    // Crée un faux PDF pour le test
    const fakePdfPath = path.join(__dirname, 'fixtures', 'fake.pdf');
    fs.writeFileSync(fakePdfPath, '%PDF-1.4 faux contenu');

    const res = await request(app)
      .post('/seeds')
      .field('name', 'Basilic')
      .field('type', 'Herbe')
      .attach('image', fakePdfPath);

    // Multer rejette → erreur 400 ou 500 selon ta gestion d'erreur Multer
    expect([400, 500]).toContain(res.status);

    // Nettoyage
    fs.unlinkSync(fakePdfPath);
  });

  it('devrait stocker le fichier dans le dossier uploads/', async () => {
    const res = await request(app)
      .post('/seeds')
      .field('name', 'Courgette')
      .field('type', 'Légume')
      .attach('image', TEST_IMAGE_PATH);

    expect(res.status).toBe(201);

    // Vérifie que le fichier existe bien sur le disque
    const filename = res.body.image_url.replace('/uploads/', '');
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

// ─────────────────────────────────────────
// PUT /seeds/:id
// ─────────────────────────────────────────
describe('PUT /seeds/:id', () => {
  it('devrait modifier une graine existante', async () => {
    const insertRes = await pool.query(
      'INSERT INTO seeds (name, type) VALUES ($1, $2) RETURNING id',
      ['Old Name', 'Flower']
    );
    const seedId = insertRes.rows[0].id;

    const res = await request(app)
      .put(`/seeds/${seedId}`)
      .send({ name: 'New Name', type: 'Vegetable' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New Name');
    expect(res.body.type).toBe('Vegetable');
  });

  it("devrait retourner 404 si la graine n'existe pas", async () => {
    const res = await request(app)
      .put('/seeds/99999')
      .send({ name: 'Non-existent', type: 'Flower' });

    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────
// DELETE /seeds/:id
// ─────────────────────────────────────────
describe('DELETE /seeds/:id', () => {
  it('devrait supprimer une graine existante', async () => {
    const insertRes = await pool.query(
      'INSERT INTO seeds (name, type) VALUES ($1, $2) RETURNING id',
      ['To Delete', 'Flower']
    );
    const seedId = insertRes.rows[0].id;

    const res = await request(app).delete(`/seeds/${seedId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('supprimée');

    const checkRes = await pool.query('SELECT * FROM seeds WHERE id = $1', [seedId]);
    expect(checkRes.rows.length).toBe(0);
  });

  it("devrait retourner 404 si la graine n'existe pas", async () => {
    const res = await request(app).delete('/seeds/99999');
    expect(res.status).toBe(404);
  });
});