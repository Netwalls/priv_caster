# PrivCaster Backend

A minimal Node.js Express server with MongoDB for storing Aleo identity records.

## Setup

1. Copy `.env.example` to `.env` and set your MongoDB URI.
2. Run `npm install`.
3. Start the server with `npm start`.

## Endpoints

- `POST /identity` — Save or update an identity record by wallet address
- `GET /identity/:address` — Fetch identity record by wallet address

## Example Identity Record
```json
{
  "address": "aleo1...",
  "identity": { /* Aleo identity record object */ }
}
```
