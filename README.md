# HIMU Pharmacy

Monorepo with **separate** frontend, admin, and backend apps.

```
himu-pharmaceutical/
├── frontend/        # User storefront (React + Vite) → http://localhost:5173
├── Admin/           # Admin dashboard (React + Vite) → http://localhost:5174
└── himu-backend/    # REST API (Express + MongoDB) → http://localhost:5000
```

## Setup

```bash
# Install all apps
npm run install:all

# Or install one by one
cd frontend && npm install
cd ../Admin && npm install
cd ../himu-backend && npm install
```

Copy env files if needed:

- `frontend/.env.example` → `frontend/.env`
- `Admin/.env.example` → `Admin/.env`
- `himu-backend/.env.example` → `himu-backend/.env`

## Run (3 terminals)

```bash
# API
npm run dev:backend

# User website
npm run dev:frontend

# Admin panel
npm run dev:admin
```

| App | URL |
|-----|-----|
| Storefront | http://localhost:5173 |
| Admin | http://localhost:5174 |
| Backend API | http://localhost:5000/api |

### Admin login (local mode)

- Email: `admin@himu.local`
- Password: `HimuAdmin@2026`
