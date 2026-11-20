# Avoxell E-Commerce Web Application

A full-stack, modern e-commerce web platform developed strictly according to the **IEEE 830 / ISO/IEC/IEEE 29148 Software Requirements Specification (SRS)** and the official **Avoxell UI Reference Mockup**.

The application faithfully replicates all **4 independent web pages** featured in the reference design along with complete e-commerce checkout, coupon handling, and order management capabilities.

---

## 🎨 Four Primary Web Pages (Recreated from Mockup)

| # | Page Name | Route | Key Features & Mockup Fidelity |
|---|---|---|---|
| **1** | **Home Page** | `/` | Silky light-blue 3D hero carousel banner with *"Dream Bigger. Shop Smarter."*, interactive arrows and carousel indicator dots, 4 trust badges (*Free Shipping*, *Secure Payments*, *24/7 Support*, *Easy Returns*), 6 rounded category cards with clean imagery (*Electronics*, *Fashion*, *Home & Living*, *Beauty*, *Sports*, *Accessories*), *"Up to 60% OFF"* promo banner, and global sticky navigation. |
| **2** | **Shop / Product Listing** | `/shop` | Secondary promo banner (*"Smart Choices. Better Living."*), dynamic sidebar filters for **Category** (with exact counts), **Price Range slider** (₹0 to ₹10,000+), **Brand** (Apple, Samsung, Sony, Nike, Others), and **Ratings** (2★ to 5★). Responsive 4-column product grid with instant wishlist hearts, rating stars, and *"Add to Cart"* buttons. Server-side search & sort controls. |
| **3** | **Product Details (PDP)** | `/product/:slug` | 5 vertical clickable gallery thumbnails with high-res main showcase card, *"Best Seller"* badge, average rating (*★ 4.8 / 12,450 reviews / 1M+ sold*), strike-through MRP & discount percentage (*37% OFF*), audio highlights with sparkle icons, interactive quantity stepper, *"Add to Cart"* and *"Buy Now"* CTA buttons, social share actions, specifications tab, and live customer reviews submission. |
| **4** | **Shopping Cart** | `/cart` | Replicates the bottom-right mockup: *"Your Cart (2 items)"*, individual line items (*Avoxell ProPods* ₹4,999 + *Avoxell Backpack* ₹2,499), interactive quantity modifiers `[- 1 +]`, trash removal, sticky Order Summary panel (*Subtotal ₹7,498*, *Shipping ₹0*, *Total ₹7,498*), interactive Coupon input (*AVOXELL10* for 10% OFF, *WELCOME500* for ₹500 OFF), and *"Proceed to Checkout →"* flow. |

---

## 🚀 Additional Integrated Pages (From SRS)

- **Checkout Page (`/checkout`)**: Multi-step delivery address form (Name, phone, street, city, state, PIN code), payment method selector (UPI, Cards, Net Banking, COD), and atomic order placement.
- **Order Confirmation & Tracking (`/orders`)**: Real-time order history, tracking IDs (e.g. `AVX-928410`), status pills (*Confirmed*, *Delivered*), and purchase breakdowns.
- **Wishlist Page (`/wishlist`)**: Interactive saved items gallery with instant move-to-cart.
- **Authentication Modal**: One-click customer login and registration modal with persistent JWT token simulation.
- **Customer Care & About (`/about`, `/contact`)**: Support channels, FAQs, shipping policies, and company background.

---

## 🛠️ Technology Stack

- **Frontend**:
  - ReactJS 18+ (Functional Components & Hooks)
  - React Router DOM v6
  - Tailwind CSS 3.4 (Avoxell brand color palette, soft rounded radii, subtle elevation shadows)
  - Lucide React Icons
  - Vite 6 (Lightning-fast HMR and optimized production bundles)
- **Backend**:
  - Python 3.11+ / 3.14+
  - Django 6.1+ & Django REST Framework (DRF)
  - django-cors-headers
  - SQLite database (pre-seeded with 12 rich catalogue products, categories, coupons, and banners)

---

## ⚡ Quick Start Instructions

### 1. Launch Everything in One Click (Windows)
Double-click:
```bash
start_all.bat
```
This automatically boots both the Django REST API on `http://127.0.0.1:8000/` and the Vite React application on `http://localhost:5173/`.

---

### 2. Manual Startup

#### Backend (Django REST Framework):
```bash
cd backend
python manage.py runserver 127.0.0.1:8000
```
API Root: `http://127.0.0.1:8000/api/v1/`

#### Frontend (React + Vite):
```bash
cd frontend
npm run dev
```
Open your browser at: `http://localhost:5173/`

---

## 📋 REST API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/home/` | Hero carousel, trust strip, 6 categories, and featured products |
| `GET` | `/api/v1/products/` | Products with filtering (`category`, `brand`, `min_price`, `max_price`, `rating`), search (`q`), and sorting |
| `GET` | `/api/v1/products/<slug>/` | Full product detail with multi-angle gallery images, reviews, and related items |
| `POST` | `/api/v1/products/<id>/reviews/` | Submit customer rating and review |
| `GET` | `/api/v1/categories/` | Category list with real-time product counts |
| `GET` | `/api/v1/brands/` | Brand list with real-time product counts |
| `GET` | `/api/v1/cart/` | Retrieve current cart items and totals |
| `POST` | `/api/v1/cart/items/` | Add product to cart with quantity and variant |
| `PATCH/DELETE` | `/api/v1/cart/items/<id>/` | Modify item quantity or remove from cart |
| `POST` | `/api/v1/cart/coupon/` | Validate and compute coupon discounts |
| `POST` | `/api/v1/orders/` | Atomically create order, reserve stock, and clear cart |
| `GET` | `/api/v1/orders/list/` | Retrieve order history |
