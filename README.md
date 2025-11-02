# MovieMax (Movie Theatre Booking)

A full‑stack movie ticket booking app with dynamic seat maps, variable pricing, and production deployments for both frontend and backend.

- Frontend: React + Vite (deployed on Vercel)
- Backend: Node.js + Express + MongoDB (deployed on Render)

## Live URLs
- Frontend: https://movie-theatre-one.vercel.app
- Backend API Base: https://movietheatre-x72b.onrender.com/api

## Features
- Complex seat layout with:
  - Prime rows (+25%)
  - Couple seats (+10% per seat in the pair)
  - Accessible seats (-10%)
  - Aisles and row labels
- Dynamic base price by time of day (server-side):
  - Morning (<12:00): 0.90×
  - Matinee (12–16): 1.00×
  - Evening (16–21): 1.20×
  - Late night (≥21:00): 0.85×
- Showtime management endpoints (add/update)
- Generate full-day shows for all movies (9:00–23:00) with sensible base prices
- JWT auth (signup/login/me)
- Bookings with atomic seat locking and conflict handling
- My Bookings page with responsive cards

## Monorepo Structure
```
MovieMax/
├─ Backend/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ server.js
│  └─ ...
├─ Frontend/
│  ├─ src/
│  ├─ index.html
│  └─ ...
└─ README.md
```

## Environment Variables

Create .env files based on the examples below.

### Backend (.env)
See Backend/.env.example for the full template.
- PORT=5000
- MONGODB_URI=<your-mongodb-connection-string>
- JWT_SECRET=<a-strong-secret>
- JWT_EXPIRE=7d

CORS: Allowed origins are configured in `Backend/server.js` via an in-code array. Update it to include your deployed frontend origin (no trailing slash), e.g. `https://your-frontend.vercel.app` and local dev `http://localhost:5173`.

### Frontend (.env)
See Frontend/.env.example for the full template.
- VITE_API_URL=<backend-api-base> (e.g. https://movietheatre-x72b.onrender.com/api)

## Local Development

Prereqs: Node 18+, npm, MongoDB (Atlas or local).

- Backend
  ```bash
  cd Backend
  cp .env.example .env   # fill values
  npm install
  npm run dev            # starts on http://localhost:5000
  ```

- Frontend
  ```bash
  cd Frontend
  cp .env.example .env   # set VITE_API_URL (e.g. http://localhost:5000/api)
  npm install
  npm run dev            # opens on http://localhost:5173
  ```

## API Overview (selected)

- Auth
  - POST /api/auth/signup
  - POST /api/auth/login
  - GET  /api/auth/me

- Movies/Showtimes
  - GET  /api/movies
  - GET  /api/movies/:id
  - GET  /api/movies/:id/today-showtimes            # all today’s shows (9:00–23:00), marks past via isPast
  - POST /api/movies/:id/showtimes                  # add multiple showtimes
  - PATCH /api/movies/:movieId/showtimes/:showtimeId# update one showtime
  - POST /api/movies/generate-today                 # seed full-day shows for all movies (optional body: { times: [...] })
  - GET  /api/movies/:movieId/showtimes/:showtimeId/seats  # requires auth

- Bookings
  - POST /api/bookings                              # body: { movieId, showtimeId, seats: [Number], totalAmount }
  - GET  /api/bookings/my-bookings                  # requires auth

## Frontend Notes
- Uses `import.meta.env.VITE_API_URL` for API base with a production fallback in code.
- Ticket pricing on the client:
  - Prime = base × 1.25
  - Couple = base × 1.10
  - Accessible = base × 0.90
  - Normal = base
- Base price comes from the seats endpoint and already reflects server-side time-of-day adjustment.

## Short Description of Approach
- Pricing: Kept the source of truth for base price on the backend and applied simple percentage multipliers on the frontend for seat categories. This keeps calculations transparent and avoids backend churn when the seat layout changes.
- Availability: Seats are locked atomically using a single update to avoid race conditions. On conflicts, the client refreshes the seat map and prompts the user.
- Showtimes: Created endpoints to add/update showtimes and a utility endpoint to generate a full-day schedule across all movies. The seats and showtime lists expose adjusted prices so UI remains consistent.
- UX: Clear seat types, disabled past showtimes, improved empty states, toasts for feedback, and preventive guards against multiple submissions.

## Deployment
- Frontend: Vercel (import the Frontend folder). Set `VITE_API_URL` in project env.
- Backend: Render (Node/Express). Set env vars from the Backend section. Ensure CORS allowed origins include your Vercel domain.

## Troubleshooting
- 400 on `/api/auth/login`: Usually invalid credentials or no user exists on production. Sign up first.
- CORS errors: Confirm your exact frontend origin (no trailing slash) is present in `allowedOrigins` in `server.js`.
- 404 for new routes on Render: Redeploy backend to pick up latest code.
