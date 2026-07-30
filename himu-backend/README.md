# HIMU Pharmacy Backend

Node.js + Express + MongoDB REST API for the HIMU Pharmacy website.

## Setup

```bash
cd backend/himu
npm install
cp .env.example .env
```

Make sure MongoDB is running locally, then seed the database:

```bash
npm run seed
npm run dev
```

Server runs at `http://localhost:5000`

## Security configuration

Before seeding or deploying, set a unique administrator password and a random
`JWT_SECRET` (at least 32 characters) in `.env`. Never commit the `.env` file.
For production, also set `NODE_ENV=production` and `CLIENT_URL` to your exact
HTTPS frontend domain (multiple domains may be comma-separated).

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products (`?category=&search=&page=&limit=`) |
| GET | `/api/products/:slug` | Product details |
| GET | `/api/categories` | All categories |
| GET | `/api/categories/:slug` | Category with products |
| GET | `/api/blogs` | All blog posts |
| GET | `/api/blogs/:slug` | Single blog post |
| GET | `/api/faq` | FAQs (`?category=`) |
| GET | `/api/company` | Company info, team, jobs, etc. |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/careers/apply` | Submit job application |
| POST | `/api/orders` | Place order |

### Admin (Bearer token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Current admin |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | List orders |
| PATCH | `/api/orders/:id/status` | Update order status |
| GET | `/api/contact` | List contact messages |
| GET | `/api/careers/applications` | List job applications |

## Frontend Integration

Set your frontend API base URL to:

```
http://localhost:5000/api
```

Example login:

```js
const res = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@himupharmacy.com", password: "admin123" }),
});
const { data } = await res.json();
// Use data.token for admin requests
```
