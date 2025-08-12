# Seller Backend (Ebay-like)

Tech: Node.js, TypeScript, Express, Mongoose

## Quick start

1. Copy `.env.example` to `.env` and adjust values
2. Install deps and run dev

```
npm install
npm run dev
```

Default server: http://localhost:4000

## Env vars

```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/project_seller
JWT_SECRET=dev-secret
ENABLE_RECAPTCHA=false
RECAPTCHA_SECRET=
UPLOADS_DIR=uploads
```

## Core routes

- POST /api/auth/register
- POST /api/auth/login
- GET /api/seller/me
- PUT /api/seller/store (multipart: banner)
- POST /api/products (multipart: images[])
- GET /api/products
- PUT /api/products/:id
- PUT /api/products/:id/hide | /unhide
- DELETE /api/products/:id
- GET /api/inventory/:productId, PUT /api/inventory/:productId
- POST /api/coupons
- GET /api/orders
- POST /api/orders/:id/confirm
- GET /api/orders/:id/shipping-label
- PUT /api/orders/:id/status
- GET /api/reviews
- POST /api/feedback
- GET /api/reports/sales?range=week|month
- GET /api/disputes, PUT /api/disputes/:id

Notes: Only verified sellers can create listings. Product creation has rate-limit and optional reCAPTCHA. 