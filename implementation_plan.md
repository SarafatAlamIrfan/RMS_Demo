# Implementation Plan - FlavourCraft Dhaka: Restaurant Management OS

Build a comprehensive, modern, state-of-the-art Restaurant Management System customized for **Authentic & Familiar Bangladeshi Restaurant Cuisine** under the leadership of **Managing Director & Admin Sadia Islam Dia**, with all financial operations, pricing, bills, and costing calculated in **Bangladeshi Taka (৳ / BDT)**.

The system is built using **100% Pure HTML5, Plain CSS3, and Modular Vanilla JavaScript** with a zero-dependency **Client-Side MongoDB Document Engine (`mongo-db.js`)**, Web Audio API synthesizer, and an integrated **Authentication & Role-Based Access Control Gate System**.

---

## 🎨 Aesthetic & Modern UI/UX Design System (Plain CSS)

The application features a **luxury dark obsidian & warm amber/saffron design system** built entirely with pure, bespoke CSS:

- **Curated Color Tokens**:
  - Deep Obsidian Canvas: `#080c14` & Surface `#0f172a`
  - Translucent Glass Paneling: `rgba(15, 23, 42, 0.80)` with `backdrop-filter: blur(16px)`
  - Primary Warm Amber Accents: `#f59e0b` / `#fbbf24` (Saffron & Ghee glow)
  - Fresh Culinary Emerald: `#10b981` (Available, Ready, Healthy)
  - Spicy Ruby Crimson: `#ef4444` (Naga Spice, Urgent, Overdue, Low-Stock)
  - Cyber Indigo & Violet: `#6366f1` / `#8b5cf6` (Admin, Analytics)
- **Modern Typography Pairing**:
  - Headings & Branding: `Outfit` & `Playfair Display` from Google Fonts
  - High-Legibility UI & Content: `Plus Jakarta Sans`
  - POS / Numerical & Thermal Receipts: `JetBrains Mono`
- **Dynamic Micro-Interactions & Fluid Animations**:
  - Interactive 3D/Glow card hover elevations (`translateY(-4px)` + ambient box-shadows).
  - Live pulsing status halos for kitchen timers (<10m, 10–20m, >20m overdue) & occupied table seats.
  - Smooth cubic-bezier transitions for sliding panels, checkout drawers, and modal backdrops.
  - Custom scrollbars, glowing category filter pills, interactive spice-level flame meters.
  - Realistic thermal POS receipt renderer with authentic monospace layout, Mushak-6.3 tax formatting, and native print styling.
  - Built-in Web Audio chime engine providing acoustic feedback for chef orders and barcode scanner beeps without external MP3 files.
- **Ultra-Responsive Layout**:
  - Adaptive CSS Grid & Flexbox engineered for Mobile foodies, Tablet POS/KDS terminals, and Desktop Operations screens.

---

## 🏛️ Architecture (Pure HTML5 + Plain CSS + Vanilla JS)

```
FlavourCraft/
├── index.html                      # Main Single-Page Application shell
├── README.md                       # Comprehensive Project Documentation
├── implementation_plan.md          # Technical Architecture & Implementation Plan
├── css/
│   ├── variables.css               # Design tokens, color palette, gradients, glassmorphism, shadows
│   ├── style.css                   # Core layout, top header, glass navbar, badges, toast notifications
│   ├── menu.css                    # Luxury digital menu cards, spice meters, item customizer drawer
│   ├── ordering.css                # Checkout, MFS/Card payment modal, live animated progress tracker
│   ├── reservations.css            # Interactive table booking, seat selector & digital e-Pass ticket
│   ├── kds.css                     # Kitchen Display System tickets, glowing countdown timers, audio chime alerts
│   ├── floor.css                   # Visual 2D Table Floor Plan with live table halos & seat indicators
│   ├── pos.css                     # Fast touch-screen POS register, barcode scanner simulator & thermal receipt
│   ├── inventory.css               # Stock inventory, recipe margin breakdown, low-stock glow alerts
│   ├── analytics.css               # Sales SVG charts, peak hour heatmaps, waste tracking in Taka
│   ├── rbac.css                    # Role switcher, user badges, permission indicators
│   └── auth.css                    # Authentication modal, demo pills, dropdown profile menu, staff lock screen
└── js/
    ├── db/
    │   ├── mongo-db.js             # Client-side MongoDB document engine (find, insertOne, updateOne, aggregate, $inc, $set)
    │   └── seed-data.js            # Initial MongoDB collections (Menu, Recipes, Stock, Tables, Orders, Admin: Sadia Islam Dia)
    ├── store.js                    # Reactive state, Web Audio synthesizer, Auto-deduction, Authentication engine
    ├── app.js                      # Main controller, router, modal handlers, toast manager
    └── components/
        ├── auth.js                 # Authentication controller, login modal, registration, staff lock overlay
        ├── menu.js                 # Menu rendering, search, dietary filtering (Vegan, Halal, Spicy), customization
        ├── reservations.js         # Table booking engine, party size, table preference, deposit calculation & SMS/Email confirmation
        ├── ordering.js             # Multi-mode checkout (Dine-in, Takeaway, Delivery), payment simulation, live order tracking progress
        ├── kds.js                  # Kitchen Display System tickets, countdown timers, sound alerts, recipe popup, one-click bumps
        ├── floor.js                # Interactive 2D restaurant floor plan, table statuses (Available, Occupied, Reserved, Dirty)
        ├── pos.js                  # POS terminal, quick lookup, barcode scanner, split billing, VAT/service calculation, thermal receipt printer
        ├── inventory.js            # Inventory stock tracker, recipe costing & margin analysis, auto stock deduction, waste logging
        ├── analytics.js            # Visual interactive analytics (revenue trends, peak hours, bestsellers, profit margins in BDT)
        └── rbac.js                 # Role-Based Access Control (Admin, Manager, Cashier, Kitchen Chef, Delivery Rider)
```

---

## 🚀 Detailed Feature Breakdown

### 1. Customer-Facing Portal
- **Digital Interactive Menu (Familiar & Beloved Bangladeshi Dishes)**:
  - Filter by category (*Kacchi & Biryani*, *Beef, Mutton & Chicken*, *Fish & Seafood*, *Kabab & Street Food*, *Drinks & Desserts*).
  - Popular Dishes: *Puran Dhaka Mutton Kacchi Biryani (৳650)*, *Old Dhaka Beef Tehari (৳480)*, *Biye Bari Chicken Roast with Polao (৳520)*, *Chittagong Beef Kala Bhuna (৳680)*, *Padma River Shorshe Ilish (৳850)*, *Golda Chingri Malai Curry (৳950)*, *Special Crispy Fuchka & Chotpoti (৳220)*, *Chicken Reshmi Kabab (৳420)*, *Naga Wings (৳380)*, *Shahi Borhani (৳150)*, *Falooda (৳280)*, *Bogura Mishti Doi (৳180)*, *Rasmalai (৳220)*.
  - Dietary pill tags: *Naga Spicy (🔥)*, *100% Halal*, *Vegetarian*, *Vegan*, *Gluten-Free*.
  - Instant live search with highlighted matches.
  - Item customizer drawer: *Extra Biryani Aloo (+৳60)*, *Cold Borhani (+৳80)*, *Mutton Jali Kabab (+৳140)*, *Naga Fire Dip (+৳50)*, spice heat selector (*Shahi Mild*, *Dhaka Regular 🌶️*, *Naga Fiery 🔥*).
- **Table Reservation System**:
  - Date & Time slot picker, party size (1 to 12+ guests), seating zones (*Main Dining Hall*, *Family Lounge*, *Terrace Patio*, *VIP Banquet Salon*).
  - ৳500 refundable deposit handling during peak dinner rush (7:30 PM – 9:30 PM).
  - Automated simulated SMS & Email confirmation with unique Booking ID & QR code.
- **Ordering & Checkout with Customer Authentication Gate**:
  - Order types: **Dine-In** (with table selection), **Takeaway**, and **Dhaka Home Delivery** (with ৳60 delivery fee).
  - **Login Gate**: Intercepts unauthenticated checkout with login/registration modal, then automatically opens checkout with customer's saved name, phone number, and address pre-populated.
  - Integrated payment modal supporting **bKash Merchant Pay**, **Nagad / Rocket**, **Debit/Credit Cards (BRAC/City Bank Visa)**, and **Cash on Delivery**.
  - Promo code discounts (`DHAKA10`, `KACCHI20`, `GULSHAN25`).
- **Live Order Tracking**:
  - Interactive multi-stage visual timeline (*Order Received* ➔ *Cooking on Dum / Handi* ➔ *Ready to Serve / Out for Delivery* ➔ *Completed*).
  - Estimated preparation countdown timer and simulated delivery rider avatar (Mehedi Hasan #04).

---

### 2. Floor & Kitchen Operations
- **Kitchen Display System (KDS)**:
  - Digital order ticket queue categorized by status (*New*, *In Preparation*, *Ready to Serve*).
  - Color-coded urgency timers:
    - 🟢 Normal (< 10 mins)
    - 🟡 Warning (10 - 20 mins)
    - 🔴 Critical / Overdue (> 20 mins) with flashing pulsing borders.
  - Web Audio synthetic chime alerts when new orders arrive.
  - **Recipe Formulation Modal**: Line cooks can click *Recipe* on any ticket to view exact ingredient proportions in grams/milliliters (*Dinajpur Chinigura rice*, *Baghabari pure ghee*, *Padma Ilish*, *Bengal Beef & Mutton*, *Mustard oil*).
  - One-click bump buttons to advance order stages in real time.
- **Visual Table & Floor Management**:
  - Interactive 2D restaurant layout map across 4 dining zones.
  - Status indicators: 🟢 Available, 🔵 Occupied, 🟠 Reserved, 🟡 Dirty (Needs Cleaning).
  - Quick action drawer: Seat guests, inspect running balance in Taka, mark table clean, assign server, or launch POS.
- **POS & Billing (Point of Sale)**:
  - Rapid search by name or barcode/SKU simulation (`KAC-101`, `TEH-102`, `BEEF-201`, `FISH-301`).
  - Quick-touch category grid and customizable modifiers.
  - Split-bill calculator (per guest share in Taka).
  - Automatic **5% Mushak-6.3 VAT** and **5% Service Charge** calculations.
  - **Mushak-6.3 Thermal Receipt Generator**: Monospaced thermal paper receipt format with authentic tear styling and one-click `window.print()` support.

---

### 3. Admin & Inventory Control
- **Recipe Costing & Profit Margins**:
  - Direct link between menu items and raw ingredients (e.g. 1 Kacchi Biryani = 250g Mutton, 180g Chinigura rice, 30g Ghee, 1 Aloo, 15g Aloo Bukhara).
  - **Automatic Stock Deduction Engine**: Whenever an order is confirmed, inventory stocks are reduced proportionally in MongoDB via `$inc` mutations.
  - Food Cost % and Profit Margin calculation for every dish in Taka.
- **Low-Stock Alerts**:
  - Configurable minimum threshold warnings for ingredients.
  - Urgent alert badges and quick-reorder action.
- **Analytics & Reports**:
  - Interactive charts for 7-day revenue in Taka (৳12.37 Lakh turnover), monthly sales trends, peak ordering hours heatmap, top 5 bestsellers, and table turnover rate.
  - Food waste logger with reason codes (spoilage, burned, expired) and financial loss calculation in Taka.
- **Authentication & Role-Based Access Control (RBAC)**:
  - **Staff Operations Gate**: Restricts operational views behind authentication.
  - **One-Click Demo Credentials**:
    - 👑 **Admin**: **Sadia Islam Dia** (`admin` / `admin123`)
    - 👩‍💼 **Manager**: **Tanima Ahmed** (`manager` / `manager123`)
    - 💳 **Cashier**: **Shakib Al Hasan** (`cashier` / `cashier123`)
    - 🍳 **Kitchen**: **Chef Rony** (`kitchen` / `kitchen123`)
    - 🛵 **Rider**: **Mehedi Hasan** (`rider` / `rider123`)
    - 🍽️ **Customer**: **Asif Rahman** (`customer` / `customer123`)
  - Persistent login sessions via `localStorage` with dropdown profile menu & Sign Out action.

---

## 🔒 Verification & Quality Checklist

1. **Database & Data Engine**: `mongo-db.js` initializes with rich collections and persists queries, updates, and aggregations correctly in `localStorage`.
2. **Customer Flow Testing**: Menu filtering, item customization, adding to cart, placing orders with login gate enforcement, and tracking live progression.
3. **KDS & Floor Plan Testing**: Trigger an order and verify real-time arrival in KDS with urgency timer, sound alert, recipe spec popup, and automatic table occupancy update.
4. **Inventory Auto-Deduction**: Confirm that checking out an order reduces the corresponding ingredient quantities and triggers low-stock warnings when below threshold.
5. **POS & Billing Testing**: Item search, applying promo discounts, calculating Mushak-6.3 VAT/service charge, and generating printable thermal receipts.
6. **Authentication & Access Gate**: Verify login gate prompts for customer checkout, staff lock screen protects operational routes, and demo quick-login buttons work seamlessly.
