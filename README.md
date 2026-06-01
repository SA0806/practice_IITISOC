# AR House Design

“Where Augmented Reality Meets Interior Design”
Experience interior designing like never before - right from your browser.
A full-stack web application for visualizing and purchasing home furnishings using Augmented Reality and 3D room planning tools.

**Live Demo:** [practice-iitisoc.vercel.app](https://practice-iitisoc.vercel.app)

---

## What it does

Users browse furniture, décor, and architectural elements, preview them in AR on their phone, arrange them in a 3D room planner, and purchase directly - with their cart, wishlist, and room layouts saved across sessions and devices.

---

## Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router_v6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

- React Three Fiber + Drei - 3D scene rendering
- `<model-viewer>` Web Component - WebXR-based AR on mobile
- AOS - scroll animations

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

- Mongoose - three separate database connections
- Stripe - payment processing and order verification
- express-rate-limit - brute-force protection on auth routes

**Storage & CDN**

![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![jsDelivr](https://img.shields.io/badge/jsDelivr_CDN-E84D3D?style=for-the-badge&logo=jsdelivr&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

- Cloudinary - product images (64 products migrated from local assets)
- jsDelivr CDN via GitHub - 3D model files (.glb), optimized from ~1.96 GB to ~566 MB
- MongoDB Atlas - user data, orders, product catalogue

---

## Features

**AR & 3D Viewing**
- View furniture and décor as 3D models in Augmented Reality on mobile (WebXR / scene-viewer / quick-look)
- 2D room planner with drag, rotate, scale, and move controls on a Three.js canvas
- Export room design as a composite PNG (background + 3D models merged)
- AR session history saved per user

**E-commerce**
- Browse 64 products across Furniture, Décor, and Architecture categories
- Add to cart with persistent quantity tracking across devices
- Wishlist with heart toggle on each product card
- Stripe Checkout integration with payment verification
- Order history saved per user with itemised totals
- Cart cleared automatically after successful payment

**Authentication & Persistence**
- JWT-based signup and login with bcrypt password hashing
- Input validation via Joi
- Rate limiting on auth routes (10 attempts per 15 minutes)
- Private routes - Dashboard, Cart, Checkout redirect to Login if unauthenticated
- All user data (cart, wishlist, saved layout, AR history) synced to MongoDB and restored on next login

**User Profile**
- Profile page with three tabs: Wishlist, Order History, AR History
- Wishlist items can be added to cart or removed directly from the profile
- Order history shows itemised breakdown per order with payment status

**Developer Setup**
- UptimeRobot keepalive on `/ping` prevents Render free-tier cold starts
- SPA routing via `vercel.json` rewrites (no 404 on refresh)
- `.env.example` files for both client and server

---

## Project Structure

```
practice_IITISOC/
├── client/                     # React frontend
│   ├── public/
│   │   └── assets/
│   │       ├── images/         # (legacy - now on Cloudinary)
│   │       └── models/         # .glb files served via jsDelivr CDN
│   ├── src/
│   │   ├── components/         # Accordion, ImageCard, CartPanel, CanvasArea...
│   │   ├── Context/            # CartContext, SelectedObjectsContext
│   │   ├── hooks/              # useUserData - fetches and hydrates user state on login
│   │   ├── pages/              # Dashboard, ARView, TwoDimensionalViewPage, ProfilePage...
│   │   └── utils/
│   │       └── userApi.js      # All MongoDB sync functions (cart, wishlist, layout, AR history)
│   └── vercel.json             # SPA rewrite rules
│
└── server/                     # Express backend
    ├── controllers/            # AuthControllers
    ├── middlewares/            # JWT auth, input validation
    ├── models/                 # User, Order, Product schemas
    ├── routes/                 # AuthRouter, productRoutes, stripe, userRoutes
    └── server.js               # Entry point, DB connections, middleware setup
```

---

## Database Architecture

Three separate MongoDB databases on a single Atlas cluster:

| Database | Purpose | Key Collections |
|---|---|---|
| `AR_House_Design` | Product catalogue | `Products` |
| `checkoutDB` | Order records | `orders` |
| `ar_users` | User accounts & data | `users` |

Each user document stores:

```json
{
  "name": "string",
  "email": "string",
  "password": "bcrypt hash",
  "cart": [{ "productId", "name", "price", "image", "quantity" }],
  "wishlist": [{ "productId", "name", "price", "image", "category" }],
  "savedLayout": [{ "name", "category", "image", "model", "price" }],
  "arHistory": [{ "date", "products": [...] }]
}
```

---

## API Routes

**Auth** - `/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login, returns JWT |

**Products** - `/api/products`
| Method | Route | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:category` | Filter by category |
| POST | `/api/products` | Add product (admin) |

**User** - `/api/user` (JWT required)
| Method | Route | Description |
|---|---|---|
| GET | `/api/user/me` | Get user profile, cart, wishlist, layouts |
| POST | `/api/user/cart` | Add item to cart |
| DELETE | `/api/user/cart/:productId` | Remove item from cart |
| DELETE | `/api/user/cart` | Clear entire cart |
| POST | `/api/user/wishlist` | Add item to wishlist |
| DELETE | `/api/user/wishlist/:productId` | Remove from wishlist |
| POST | `/api/user/layout` | Save selected AR objects |
| POST | `/api/user/ar-history` | Save AR session snapshot |
| GET | `/api/user/orders` | Get order history by email |

**Payments** - `/api/stripe`
| Method | Route | Description |
|---|---|---|
| POST | `/api/stripe/create-checkout-session` | Create Stripe session |
| GET | `/api/stripe/verify-payment/:sessionId` | Verify and save order |

**Health**
| Method | Route | Description |
|---|---|---|
| GET | `/ping` | Server health check (used by UptimeRobot) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account (test mode keys are fine)
- Cloudinary account (optional - for image hosting)

### Clone and install

```bash
git clone https://github.com/SA0806/practice_IITISOC.git
cd practice_IITISOC

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment variables

Copy the example files and fill in your values:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

**`client/.env`**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**`server/.env`**
```env
PORT=5000
MONGO_CONN=mongodb+srv://<user>:<password>@<cluster>/ar_users
AR_HOUSE_DB_URI=mongodb+srv://<user>:<password>@<cluster>/AR_House_Design
CHECKOUT_DB_URI=mongodb+srv://<user>:<password>@<cluster>/checkoutDB
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
REACT_APP=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run locally

```bash
# Terminal 1 - backend
cd server && node server.js

# Terminal 2 - frontend
cd client && npm start
```

App runs at `http://localhost:3000`

---

## Deployment

| Service | Platform | Trigger |
|---|---|---|
| Frontend | Vercel | Auto-deploy on push to `master` |
| Backend | Render (free tier) | Auto-deploy on push to `master` |
| Images | Cloudinary | Manual upload via migration script |
| Models | jsDelivr CDN | Served directly from GitHub repo |
| Uptime | UptimeRobot | Pings `/ping` every 5 min to prevent cold starts |

---

## Key Design Decisions

**Three separate MongoDB databases** - Products, orders, and user data are intentionally separated so each can be scaled, backed up, or replaced independently without affecting the others.

**jsDelivr for 3D models** - GLB files (optimized from ~1.96 GB to ~566 MB using `@gltf-transform/cli`) are served via jsDelivr CDN backed by GitHub, giving global CDN distribution at zero cost. Cloudinary was evaluated but rejected due to its 10 MB raw file limit.

**Cloudinary for images** - All 64 product images migrated from local `/public/assets` to Cloudinary, reducing Vercel bundle size and enabling automatic format optimization and responsive delivery.

**JWT in localStorage** - Used for simplicity in a portfolio context. In production, `httpOnly` cookies would be preferred to mitigate XSS risk.

**Debounced auto-save** - User layout and selection changes are debounced at 1.5 seconds before syncing to MongoDB, preventing excessive API calls during rapid interactions.

---

## Built As Part Of

This project was built as part of **IIT Indore Summer of Code (IITI-SoC) 2025**.

---

## Team SD_007

| Role | Name |
|---|---|
| Team Leader | Sahiba Joshi |
| Team Member | Devanshi Kawlani |
| Team Member | Sohil Dangi |
| Team Member | Disha Dange |