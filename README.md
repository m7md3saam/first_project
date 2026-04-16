# KH Factory — Website

Premium men's clothing e-commerce website for KH Factory. Built with **React + Vite + Tailwind CSS**. Ready for deployment on **Cloudflare Pages**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 3. Build for production
```bash
npm run build
```
Output goes to the `dist/` folder — ready for Cloudflare Pages.

---

## ☁️ Deploy to Cloudflare Pages

### Option A — GitHub (Recommended, Auto-deploys)

1. Push this project to a GitHub repo
2. Go to [Cloudflare Pages Dashboard](https://pages.cloudflare.com/)
3. Click **Create a project → Connect to Git**
4. Select your repo
5. Set these build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Click **Save and Deploy** ✅

Every push to `main` will auto-redeploy.

### Option B — Direct Upload

```bash
npm run build
npx wrangler pages deploy dist --project-name kh-factory
```

---

## 📱 Facebook Pixel Setup

1. Get your Pixel ID from [Facebook Events Manager](https://www.facebook.com/events_manager2)
2. Open `index.html`
3. Replace both instances of `YOUR_PIXEL_ID` with your actual Pixel ID
4. Rebuild and redeploy

---

## 🔐 Admin Panel

**URL:** `/admin` (e.g., `https://your-site.pages.dev/admin`)

**Default password:** `kh2024admin`

> ⚠️ **Change the password immediately** after first login via **Settings** tab!

### Admin Features:
- ➕ Add, edit, delete products
- 📸 Upload images (by URL or local file upload)
- 💰 Set prices and sale prices
- 📏 Toggle size availability (M / L / XL / 2XL)
- ⭐ Mark products as Featured
- 📢 Edit announcement bar text
- 📞 Change WhatsApp number
- 🔑 Change admin password

> **Note on data storage:** Product data is stored in the browser's `localStorage`. This means it persists on the same device/browser. For multi-device admin access, consider integrating Supabase (free tier) — contact your developer.

---

## 📞 WhatsApp Integration

Orders are sent to: **+20 1036689366**

When a customer places an order, WhatsApp opens with a pre-filled message containing all product details, size, quantity, and total price.

---

## 📂 Project Structure

```
kh-factory/
├── public/
│   ├── _redirects          ← Cloudflare SPA routing
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AnnouncementBar.jsx
│   │   ├── Navbar.jsx
│   │   ├── CartPanel.jsx
│   │   ├── ProductCard.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   └── StoreContext.jsx  ← Global state (products, cart, settings)
│   ├── data/
│   │   └── initialProducts.js  ← Sample products & categories
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx           ← Size + category filter
│   │   ├── ProductDetail.jsx
│   │   └── Admin.jsx          ← Full admin panel
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Customization

| What to change | Where |
|---|---|
| Brand name / logo | `src/components/Navbar.jsx`, `src/components/Footer.jsx` |
| Colors | `tailwind.config.js` → `colors.kh` |
| Announcement bar | Admin panel → Settings |
| WhatsApp number | Admin panel → Settings |
| Admin password | Admin panel → Settings |
| Facebook Pixel ID | `index.html` |
| Sample products | `src/data/initialProducts.js` |
| Add new categories | `src/data/initialProducts.js` → `CATEGORIES` array |

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **React Router v6** — Client-side routing
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **localStorage** — Data persistence (no backend needed)
- **Cloudflare Pages** — Hosting

---

## 📋 Checklist Before Going Live

- [ ] Replace `YOUR_PIXEL_ID` in `index.html`
- [ ] Change admin password from Settings
- [ ] Add real product photos and prices
- [ ] Test WhatsApp ordering on mobile
- [ ] Connect to your Facebook Page as a pixel
- [ ] Set up your custom domain in Cloudflare Pages

---

Made for KH Factory 🏭
