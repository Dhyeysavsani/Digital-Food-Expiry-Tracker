# Digital Food Expiry Tracker (DFET)

A full-stack web app to track food expiry dates, reduce waste, and get recipe suggestions for items nearing expiry.

## Tech Stack
- Frontend: React + Vite, Tailwind CSS, React Router, React Query, QuaggaJS (barcode scanning)
- Backend: Node.js, Express, Sequelize (MySQL), JWT Auth, Web Push, Nodemailer, node-cron
- Database: MySQL (schema + seed)

## Monorepo Structure
- `frontend/` – React app
- `backend/` – Express API server
- `database/` – SQL schema and seed

## Prerequisites
- Node.js 18+
- npm 9+
- MySQL 8+

Optional: Use Docker to run MySQL easily.

## Quick Start

1) Clone repo and set up environment files
- Copy `backend/.env.example` to `backend/.env` and adjust values
- Copy `frontend/.env.example` to `frontend/.env` and set `VITE_BACKEND_URL` and `VITE_VAPID_PUBLIC_KEY`

2) Start MySQL
- Option A: Docker
```bash
docker compose up -d
```
- Option B: Local MySQL
  - Create database per `database/schema.sql`
  - Update connection env vars in `backend/.env`

3) Initialize database
```bash
mysql -u <user> -p < database/schema.sql
mysql -u <user> -p < database/seed.sql
```
Or run the JS seeder for dynamic dates:
```bash
cd backend
npm run seed
```

4) Install dependencies
```bash
cd frontend && npm install
cd ../backend && npm install
```

5) Run apps in dev mode
- Backend
```bash
cd backend
npm run dev
```
- Frontend
```bash
cd frontend
npm run dev
```
Open the frontend URL shown by Vite (usually `http://localhost:5173`).

## Features
- Dashboard groups items by status: Safe, Expiring Soon, Expired
- Add items manually or via barcode scanner (QuaggaJS)
- Recipe suggestions via Spoonacular API based on soon-to-expire items
- Browser push notifications (Web Push API) and optional email alerts
- JWT authentication (signup/login)

## Environment Variables
See `backend/.env.example` and `frontend/.env.example` for all options, including:
- MySQL connection
- JWT secret
- VAPID keys for Web Push
- Spoonacular API key
- SMTP credentials for email alerts

## Scripts
Backend:
- `npm run dev` – start server with nodemon
- `npm run start` – start server
- `npm run seed` – seed demo data

Frontend:
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview build

## Notes
- Push notifications require HTTPS or localhost and valid VAPID keys.
- If Spoonacular key is not set, the backend returns mocked recipes.

## License
MIT