# Communication Hub

Full-stack multi-tenant team messaging app with email-based auth, teams, members, and per-team message access.

## Stack
- Backend: Node.js, Express, TypeScript, Sequelize (PostgreSQL)
- Frontend: React + Vite + TypeScript, Axios
- Auth: header-based using `x-user-email`

## Features
- Register/login by email; register can create or join a tenant by name.
- Tenants contain teams; team creators are auto-added as members.
- Team list shows all teams in the tenant with `isMember` to indicate access.
- Messages can only be read/sent by team members; others see a no-access notice.
- Add members (same tenant) to teams; list tenant users and team members.
- Seed script to populate sample tenants/users/teams/messages.

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL running locally 

## Project Structure
```
backend/   # Express API
frentend/  # React UI (Vite)
```

## Backend Setup (API)
1) Install deps
```bash
cd backend
npm install
```
2) Configure environment (`backend/.env`)
```
DATABASE_NAME=team_communication
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
CORS_ORIGIN=http://localhost:5173   # set to your frontend origin
```
3) Create the database in Postgres (match `DATABASE_NAME`).
4) Run seeds (creates tenants, users, teams, memberships, messages)
```bash
npm run seed
```
5) Start API (dev)
```bash
npm run dev
```
- Server listens on `http://localhost:3000` by default.
- All routes are under `/api`.

## Frontend Setup (UI)
1) Install deps
```bash
cd frentend
npm install
```
2) Configure API base (`frentend/.env`)
```
VITE_API_URL=http://localhost:3000/api
```
3) Run UI (dev)
```bash
npm run dev
```
- Vite prints the local dev URL (default `http://localhost:5173`).
- Ensure this URL matches `CORS_ORIGIN` in the backend.

## Authentication Model
- The frontend stores `{ userId, tenantId, name, email }` in `localStorage` after login/register.
- Every request sends `x-user-email` header via Axios interceptor; the backend uses it to identify the user.
- Registration: `POST /auth/register` with `email`, `name`, optional `tenantName` (joins existing or creates new tenant). If neither `tenantName` nor `tenantId` is provided, a personal tenant is created.
- Login: `POST /auth/login` with `email` (must already exist).

## API Endpoints (summary)
_Base path: `/api`_
- `POST /auth/register` — body `{ email, name, tenantName? }` → creates user (and tenant if needed).
- `POST /auth/login` — body `{ email }` → returns user.
- `GET /tenants` — list tenants (id, name).
- `GET /users` — list users in requester’s tenant.
- `GET /teams` — list all teams in tenant with `isMember` flag.
- `POST /teams` — create team (requires auth); creator auto-added as member.
- `GET /teams/:id/members` — list members (same tenant).
- `POST /teams/:id/members` — body `{ userId }`; same-tenant only.
- `GET /teams/:id/messages` — messages for team; 403 if not a member.
- `POST /teams/:id/messages` — body `{ content }`; 403 if not a member.

_All protected routes rely on `x-user-email` matching an existing user._

## Access Rules
- Users can see all teams in their tenant (`GET /teams`) but can only read/send messages where `isMember` is true.
- Adding members is restricted to same-tenant users.
- Message endpoints return 403 for non-members.

## Sample Requests (curl)
```bash
# Register (join or create tenant by name)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice","tenantName":"Acme"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com"}'

# List teams (needs x-user-email)
curl -X GET http://localhost:3000/api/teams \
  -H "x-user-email: alice@example.com"

# Create team (creator auto-member)
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "x-user-email: alice@example.com" \
  -d '{"name":"Dev Team","description":"Core devs"}'

# Send message (must be member)
curl -X POST http://localhost:3000/api/teams/<teamId>/messages \
  -H "Content-Type: application/json" \
  -H "x-user-email: alice@example.com" \
  -d '{"content":"Hello"}'
```

## Seeding
Run `npm run seed` in `backend` after configuring the database. It inserts tenants, users, teams, memberships, and sample messages for quick testing.

## Testing
- No automated tests are included (`npm test` is a placeholder).
- Use the provided Postman collection: `backend/postman/CommunicationHub.postman_collection.json`.
- Manual checks: use the curl samples above or the frontend UI.

## Common Issues
- **CORS errors**: ensure `CORS_ORIGIN` matches the frontend dev URL.
- **DB connection**: confirm Postgres credentials/host/port and that the database exists.
- **403 on messages**: user is not a member of that team; add them first.

## Running Both Apps
- In one terminal: `cd backend && npm run dev`
- In another: `cd frentend && npm run dev`
- Open the frontend URL, register/login, create teams, add members, and chat.
