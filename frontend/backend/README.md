# Collab Travel — Backend scaffold

Node.js + Express API prepared for a future PostgreSQL integration.

## Running

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API will start on `http://localhost:3000` and expose `/health`.

All resource routes are declared but commented out — wire them up once the
database is available (see `src/db/connection.js`).
