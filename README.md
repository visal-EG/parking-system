# Vikesh's Parking System

Monolithic Spring Boot backend + React (Vite) frontend.
Auth (JWT), role-based authorization, parking entry/exit, billing, reporting.

## Stack
- **Backend**: Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, Flyway, PostgreSQL (prod) / H2 (dev), Java 17
- **Frontend**: React 18 + Vite, React Router, Axios
- **Deploy**: Railway / Render / Fly.io (Docker)

## Local Dev

### Backend
```bash
cd backend
./mvnw spring-boot:run        # uses H2 in-memory DB
# API at http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev                    # http://localhost:5173
```

Default seeded users:
- `admin / admin123`   (ADMIN)
- `operator / op123`   (OPERATOR)
- `user / user123`     (CUSTOMER)

## Features
- JWT auth + refresh
- Roles: ADMIN, OPERATOR, CUSTOMER
- Parking: 1 mall, 3 basements (B1/B2/B3), BIKE + CAR spots
- Allocation: nearest-floor-first with pessimistic locking
- Billing: per-vehicle-type rate card, daily cap
- Reporting: occupancy, daily revenue, ticket history

## Deploy to Railway

1. Push this repo to GitHub.
2. Railway → New Project → Deploy from GitHub.
3. Add a PostgreSQL plugin — Railway injects `DATABASE_URL`.
4. Service variables:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `JWT_SECRET=<random 64-char string>`
   - `CORS_ORIGINS=https://<your-frontend>.up.railway.app`
5. Backend uses the Dockerfile in `backend/`. Frontend uses Dockerfile in `frontend/`.
6. Set frontend env `VITE_API_BASE=https://<your-backend>.up.railway.app`.

## Project layout
```
parking-system/
├── backend/        Spring Boot monolith
├── frontend/       React + Vite SPA
├── docker-compose.yml   local full-stack
└── railway.json
```
