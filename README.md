# StockWise — Inventory Tracker

A full-stack inventory management application that allows users to manage products, monitor stock levels, and organize inventory records through a clean dashboard interface.

## Live Demo

- **Frontend:** https://inventory-tracker-frontend-jet.vercel.app
- **Backend:** https://inventory-tracker-backend-q4w6.onrender.com

> Note: The backend is hosted on Render's free tier and may take 30–60 seconds to wake up on the first request after a period of inactivity.

---

## Repositories

- **Frontend:** https://github.com/NifemiSoneye/inventory-tracker-frontend
- **Backend:** https://github.com/NifemiSoneye/inventory-tracker-backend

---

## Features

- Add, edit, and delete inventory items
- Track stock quantity with auto-derived status — In stock, Low stock, Out of stock
- Dashboard summary — total products, low stock count, out of stock count, unique category count
- Search products by name (server-side, debounced)
- Filter by category and status (client-side)
- Recent items panel in the sidebar
- Responsive layout — table view on desktop, horizontally scrollable on mobile
- Bottom sheet modal on mobile, centered modal on desktop
- Toast notifications for create, update, and delete actions

---

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS v4
- Redux Toolkit + RTK Query
- TanStack Table v8
- Shadcn UI
- Lucide Icons

### Backend
- Node.js + Express
- TypeScript (CommonJS)
- MongoDB + Mongoose
- REST API

---

## API Endpoints

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/items` | Get all items (supports `?search=`, `?category=`, `?status=`) |
| POST | `/items` | Create a new item |
| GET | `/items/:id` | Get a single item |
| PATCH | `/items/:id` | Update an item |
| DELETE | `/items/:id` | Delete an item |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get inventory summary stats |

---

## Item Model

```json
{
  "name": "Wireless Keyboard",
  "category": "Electronics",
  "quantity": 42,
  "price": 12000,
  "status": "In stock"
}
```

> Status is automatically derived from quantity — no manual input required.
> - `quantity === 0` → Out of stock
> - `quantity > 0 && quantity <= 5` → Low stock
> - `quantity > 5` → In stock

---

## Running Locally

### Backend

```bash
git clone https://github.com/NifemiSoneye/inventory-tracker-backend
cd inventory-tracker-backend
npm install
```

Create a `.env` file in the root:

```
MONGO_URI=your_mongodb_connection_string
PORT=3500
ALLOWED_ORIGINS=http://localhost:5173
```

```bash
npm run dev
```

### Frontend

```bash
git clone https://github.com/NifemiSoneye/inventory-tracker-frontend
cd inventory-tracker-frontend
npm install
```

Create a `.env` file in the root:

```
VITE_API_URL=http://localhost:3500
```

```bash
npm run dev
```

---

## Author

Nifemi Soneye
