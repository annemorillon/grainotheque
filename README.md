# Grainothèque: The seed swap tinder

**A social and eco-friendly platform for swapping seeds.**

## About the project

**Themes:** Agriculture, Social Impact
**Focus for Beginners:** Mastering full **CRUD** operations (Create, Read, Update, Delete) and image uploads.

In the world of eco-responsible gardening, enthusiasts love to exchange seeds. **Grainothèque** connects individuals to swap their seeds (tomatoes, flowers, etc.) and foster a community around sustainable agriculture.

## 🌐 Liens du Projet en Production

Le projet est entièrement déployé et accessible en ligne :

* **🖥️ Application Frontend (Vercel) :** [Visiter la Grainothèque](https://TON-LIEN-VERCEL.vercel.app)
* **⚙️ API Backend (Railway) :** [Page d'accueil de l'API](https://grainotheque-production.up.railway.app/)
* **📊 Données :** [Endpoint des graines (Seeds)](https://grainotheque-production.up.railway.app/seeds)

## Features

### Seed catalog
- A homepage listing available seeds with **server-side filtering** (by plant type, sowing period).
- Dynamic cards displaying seed images, names, and availability.

### My garden space
- A form to add seeds, with client-side validation and image upload (stored via Cloudinary or local storage).
- Each seed entry includes: image, description, quantity, and owner contact info.

### Swap request system
- A "request a swap" button that opens a pre-filled contact form (using the seed owner’s email).
- Messages are sent via a simple email service (e.g., Nodemailer).

## What this project demonstrates

- **Database Design**: Structuring a relational database (PostgreSQL) for seeds, users, and swaps.
- **Full-Stack Development**: Building a REST API (Node/Express) and a dynamic frontend (React).
- **Form Handling**: Validating user inputs (e.g., seed name, quantity, image upload).
- **UI/UX**: Displaying dynamic seed cards with filters and user interactions.

## Tech stack
   Category     | Technology      |
 | ------------ | --------------- |
 | **Frontend** | React           |
 | **Backend**  | Node.js/Express |
 | **Database** | PostgreSQL      |

**Why a unified JavaScript stack?**
JavaScript is one of the most widely used programming languages today. Using a full JavaScript stack (React for frontend, Node.js/Express for backend, and PostgreSQL for the database) allows for a **consistent and cohesive development experience**. React is a popular choice for building interactive user interfaces, while Node.js and PostgreSQL provide a solid foundation for the backend. This combination benefits from a **large ecosystem** (npm packages, extensive documentation) and makes it easier to switch between frontend and backend development without changing languages.

## Testing Approach

### TDD-Light Principle
To avoid blocking progress while learning, I use a **"validate first, test after"** approach: I code until the feature works (tested manually in Postman), then write integration tests to ensure the expected behavior is maintained. This ensures practical test coverage without slowing down development.

**When to write a test?**
- Route returns 201 for valid data
- Route returns 400 if the name is empty
- DELETE removes the row from the database
- A function "is in season?" returns true/false

**Justification:**
Integration tests are written after manual validation to consolidate established behaviors. Target coverage: all CRUD routes + business error cases (e.g., empty seed name, invalid quantity).

### Example Test (Supertest)

```javascript
it('POST /seeds → 201', async () => {
  const res = await request(app)
    .post('/seeds')
    .send({ name: 'Tomato', type: 'vegetable' });
  expect(res.status).toBe(201);
  expect(res.body.name).toBe('Tomato');
});
```

> *Full test files example in folder: [test](./backend/test/)*

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repo:
  ```bash
   git clone git@github.com:annemorillon/grainotheque.git
  ```
2. Install dependencies:
  ```bash
   npm install
  ```
3. Set up your `.env` file with database and API keys.

## Roadmap

- [x] **Database**: Finalize SQL schema (tables: seeds, users, swaps).
- [x] **Backend**: Implement CRUD endpoints for seeds (POST, GET, PUT, DELETE).
- [x] **Testing**: Write integration tests for all CRUD routes (using Supertest).
- [x] **Frontend**: Build seed catalog page with filters and dynamic cards.
- [x] **Features**: Add image upload and swap request form.
- [x] **Deployment**: Deploy backend (Railway) and frontend (Vercel).