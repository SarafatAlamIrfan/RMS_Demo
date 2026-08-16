# 📋 FlavourCraft Dhaka: Master Implementation Plan & System Architecture Specification

> **System Name**: FlavourCraft Dhaka - Modern Bangladeshi Restaurant Management System  
> **Executive Leadership**: Managing Director & Admin **Sadia Islam Dia**  
> **Platform Paradigm**: 100% Pure Client-Side Single-Page Web Application (HTML5, Plain CSS3, Modular Vanilla JavaScript, Client MongoDB Engine)  
> **Currency Unit**: Bangladeshi Taka (**৳ / BDT**)  
> **Cuisine Specialization**: Authentic & Familiar Bangladeshi Traditional & Modern Dhaka Cuisine  
> **Repository**: [https://github.com/SarafatAlamIrfan/RMS_Demo.git](https://github.com/SarafatAlamIrfan/RMS_Demo.git)

---

## 📑 Table of Contents
1. [Executive Summary & System Mission](#1-executive-summary--system-mission)
2. [Architectural Philosophy & Zero-Dependency Paradigm](#2-architectural-philosophy--zero-dependency-paradigm)
3. [Design System & UI/UX Specifications (Plain CSS)](#3-design-system--uiux-specifications-plain-css)
4. [Client-Side MongoDB Document Engine Specification](#4-client-side-mongodb-document-engine-specification)
5. [Comprehensive Database Schema Definitions](#5-comprehensive-database-schema-definitions)
6. [Detailed Feature & Module Specifications](#6-detailed-feature--module-specifications)
   - [Module 1: Digital Interactive Menu & Customizer](#module-1-digital-interactive-menu--customizer)
   - [Module 2: Table Reservation Engine & Digital e-Pass](#module-2-table-reservation-engine--digital-e-pass)
   - [Module 3: Multi-Mode Ordering & Bangladeshi Checkout](#module-3-multi-mode-ordering--bangladeshi-checkout)
   - [Module 4: Customer Order Login Gate](#module-4-customer-order-login-gate)
   - [Module 5: Live Order Progress Tracker & Rider Radar](#module-5-live-order-progress-tracker--rider-radar)
   - [Module 6: Kitchen Display System (KDS) & Cook Recipe Specs](#module-6-kitchen-display-system-kds--cook-recipe-specs)
   - [Module 7: 2D Interactive Table & Floor Plan](#module-7-2d-interactive-table--floor-plan)
   - [Module 8: Rapid Touch POS Register & Mushak-6.3 Receipts](#module-8-rapid-touch-pos-register--mushak-63-receipts)
   - [Module 9: Inventory Management & Automatic Stock Deductions](#module-9-inventory-management--automatic-stock-deductions)
   - [Module 10: Recipe Costing & Profit Margin Engine](#module-10-recipe-costing--profit-margin-engine)
   - [Module 11: Food Waste & Kitchen Spoilage Tracker](#module-11-food-waste--kitchen-spoilage-tracker)
   - [Module 12: Executive Analytics & Reports](#module-12-executive-analytics--reports)
   - [Module 13: Authentication, Session & Role-Based Access Control (RBAC)](#module-13-authentication-session--role-based-access-control-rbac)
7. [Directory Structure & File Manifest](#7-directory-structure--file-manifest)
8. [End-to-End Quality Verification Protocol](#8-end-to-end-quality-verification-protocol)

---

## 1. Executive Summary & System Mission

**FlavourCraft Dhaka** is an enterprise-grade restaurant management operating system tailored specifically to Bangladeshi dining establishments. Under the executive direction of **Sadia Islam Dia (Managing Director & Admin)**, the platform replaces fragmented restaurant tools with a single unified, ultra-fast interface covering:
- **Customer Acquisition**: Online menu browsing, customization, table reservations with e-Pass generation, and online ordering with MFS payments (bKash/Nagad).
- **Kitchen & Floor Operations**: Real-time Kitchen Display System (KDS) tickets, urgency countdowns, line cook recipe specs, 2D floor visualizer, and rapid POS register with Mushak-6.3 tax invoices.
- **Back-Office & Supply Chain**: Dynamic recipe costing, automatic raw ingredient stock deduction upon order confirmation, low-stock safety alarms, food waste logging, and executive revenue turnover analytics in Bangladeshi Taka.

---

## 2. Architectural Philosophy & Zero-Dependency Paradigm

The system is constructed strictly adhering to the **Zero External Backend / 100% Native Client-Side Architecture**:
1. **Core Web Standard**: Standard HTML5 semantic document hierarchy and Modular ES6 Vanilla JavaScript classes.
2. **Zero Python / Node.js Runtime Dependencies**: The app runs directly in any modern browser by opening `index.html` without requiring Node modules, NPM servers, or Python backends.
3. **Pure Bespoke CSS3**: Hand-crafted CSS design tokens, custom glassmorphism, responsive grid/flexbox layouts, keyframe animations, and zero Tailwind or UI framework bloat.
4. **Client-Side Document Database**: A custom MongoDB implementation (`js/db/mongo-db.js`) providing genuine MongoDB collections, CRUD operations, query operators, update modifiers, aggregation pipelines, and LocalStorage persistence.
5. **Acoustic Audio Engine**: Uses the native browser **Web Audio API** (`AudioContext` oscillators) to generate dynamic audio alerts (chimes, bell rings, scanner beeps, alarm sirens) with zero external audio file dependencies.

---

## 3. Design System & UI/UX Specifications (Plain CSS)

### 🎨 Color Palette Tokens (`css/variables.css`)
- **Canvas Base**: `#080c14` (Obsidian Midnight)
- **Elevated Surface**: `#0f172a` / `#1e293b` (Deep Slate Glass)
- **Glassmorphism Panels**: `rgba(15, 23, 42, 0.80)` with `backdrop-filter: blur(16px)` and `border: 1px solid rgba(255, 255, 255, 0.08)`
- **Primary Brand Accent**: `#f59e0b` / `#fbbf24` (Saffron Gold / Warm Mustard Ghee)
- **Culinary Emerald (Success)**: `#10b981` (Available tables, completed orders, optimal margins)
- **Naga Crimson (Danger / Urgency)**: `#ef4444` (Overdue tickets >20m, low stock alerts, food waste)
- **Sky Blue (Info / MFS)**: `#38bdf8` (Takeaway, bKash/Nagad gateways)
- **Royal Amethyst (VIP / Admin)**: `#8b5cf6` (VIP salons, executive analytics)

### 🔤 Typography Hierarchy
- **Brand & Headings**: `Playfair Display` (Serif elegance for menu titles) & `Outfit` (Modern geometric sans-serif for UI headers).
- **Body & Controls**: `Plus Jakarta Sans` (Clean, highly legible body text).
- **Numerals, Barcodes & Thermal POS Receipts**: `JetBrains Mono` (High-contrast monospaced font for billing and stock units).

### ✨ Micro-Interactions & Animation Physics
- Smooth card hover lift: `transform: translateY(-4px)` with dynamic gold drop-shadows.
- Real-time pulsating status rings for occupied/dirty tables and critical kitchen tickets.
- Sliding drawer transitions with `cubic-bezier(0.16, 1, 0.3, 1)` easing.
- Authentic thermal paper tear formatting with CSS dashed borders and `@media print` layout.

---

## 4. Client-Side MongoDB Document Engine Specification

Implemented in `js/db/mongo-db.js`, the document engine simulates genuine MongoDB database operations inside the browser:

### ⚙️ Engine Capabilities
- **Database Initialization & Persistence**: Automatically persists collections in browser `localStorage` using unique keys (e.g. `flavourcraft_dhaka_v6_auth`).
- **BSON ObjectId Generation**: Generates 24-character hex ObjectIds (`_id`).
- **CRUD Operations**:
  - `collection.find(query, options)`: Filter documents with sorting (`sort`), pagination (`skip`), and limits (`limit`).
  - `collection.findOne(query)`: Retrieve first matching document.
  - `collection.insertOne(document)`: Insert single document with automatic `_id` and timestamps (`createdAt`, `updatedAt`).
  - `collection.insertMany(documents)`: Bulk insert.
  - `collection.updateOne(filter, update)`: Update document using `$set`, `$inc`, `$push`, `$pull`.
  - `collection.updateMany(filter, update)`: Update multiple matching documents.
  - `collection.deleteOne(filter)` / `collection.deleteMany(filter)`: Remove records.
  - `collection.countDocuments(filter)`: Count records.
- **Query Operators**: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$regex`, `$exists`, `$or`, `$and`.
- **Aggregation Pipeline (`collection.aggregate(pipeline)`)**:
  - `$match`: Filter records.
  - `$group`: Aggregate totals using `$sum`, `$avg`, `$min`, `$max`, `$count`.
  - `$sort`: Sort result sets.
  - `$limit`: Limit output count.
- **Event Change Stream**: Emits `change` events on document mutations to trigger real-time reactive UI re-renders.
- **JSON Backup & Export**: One-click extraction of the entire database state as an exported JSON file.

---

## 5. Comprehensive Database Schema Definitions

### 📦 1. `menu` Collection
```json
{
  "_id": "dish_01",
  "sku": "KAC-101",
  "name": "Puran Dhaka Mutton Kacchi Biryani",
  "category": "Kacchi & Biryani",
  "price": 650,
  "description": "Authentic Old Dhaka style tender mutton kacchi with fragrant Chinigura rice, spiced soft aloo, aloo bukhara, and Baghabari pure ghee. Served with cold Borhani.",
  "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
  "tags": ["100% Halal", "Chef Special"],
  "spiceLevel": 1,
  "isAvailable": true,
  "recipeId": "rec_kacchi",
  "prepTimeMinutes": 5
}
```

### 📋 2. `recipes` Collection
```json
{
  "_id": "rec_kacchi",
  "dishId": "dish_01",
  "dishName": "Puran Dhaka Mutton Kacchi Biryani",
  "sellingPrice": 650,
  "ingredients": [
    { "ingredientId": "ing_mutton", "name": "Fresh Bengal Mutton Cuts", "quantity": 250, "unit": "g", "unitCost": 1.10 },
    { "ingredientId": "ing_chinigura_rice", "name": "Chinigura Rice", "quantity": 180, "unit": "g", "unitCost": 0.16 },
    { "ingredientId": "ing_pure_ghee", "name": "Baghabari Pure Ghee", "quantity": 30, "unit": "g", "unitCost": 1.40 },
    { "ingredientId": "ing_potato", "name": "Biryani Aloo", "quantity": 1, "unit": "pcs", "unitCost": 15.00 },
    { "ingredientId": "ing_aloo_bukhara", "name": "Aloo Bukhara & Spices", "quantity": 15, "unit": "g", "unitCost": 4.00 }
  ]
}
```

### 🥩 3. `inventory` Collection
```json
{
  "_id": "ing_mutton",
  "name": "Fresh Bengal Mutton Cuts",
  "category": "Meats",
  "currentStock": 18500,
  "threshold": 5000,
  "unit": "g",
  "costPerUnit": 1.10
}
```

### 🪑 4. `tables` Collection
```json
{
  "_id": "tbl_03",
  "number": "T-03",
  "capacity": 4,
  "shape": "booth",
  "zone": "Main Dining Hall",
  "status": "occupied",
  "currentOrderId": "ord_101",
  "activeServer": "Anika"
}
```

### 📝 5. `orders` Collection
```json
{
  "_id": "ord_101",
  "orderNumber": "#FC-DHK-501",
  "type": "Dine-In",
  "tableNumber": "T-03",
  "customerName": "Asif Rahman",
  "customerPhone": "+880 1711-234567",
  "status": "Preparing",
  "createdAt": "2026-08-16T15:40:00.000Z",
  "items": [
    { "dishId": "dish_01", "name": "Puran Dhaka Mutton Kacchi Biryani", "quantity": 2, "unitPrice": 650, "modifiers": ["Extra Aloo (+৳60)"], "itemTotal": 1420 }
  ],
  "subtotal": 1420,
  "taxVat": 71,
  "serviceCharge": 71,
  "deliveryFee": 0,
  "discount": 0,
  "totalAmount": 1562,
  "paymentMethod": "bKash",
  "paymentStatus": "Paid"
}
```

### 📅 6. `reservations` Collection
```json
{
  "_id": "res_01",
  "bookingCode": "FC-DHK-801",
  "guestName": "Farhan Kabir",
  "guestPhone": "+880 1712-998877",
  "guestEmail": "farhan.kabir@gmail.com",
  "partySize": 4,
  "date": "2026-08-16",
  "timeSlot": "20:00",
  "tablePreference": "Family Lounge",
  "assignedTable": "T-05",
  "depositPaid": 500,
  "status": "Confirmed",
  "specialRequest": "Family dinner. Extra spicy kacchi biryani setup."
}
```

### 🗑️ 7. `waste` Collection
```json
{
  "_id": "wst_01",
  "ingredientId": "ing_mutton",
  "ingredientName": "Fresh Bengal Mutton Cuts",
  "quantity": 300,
  "unit": "g",
  "reason": "Fat trimming",
  "costLoss": 330,
  "loggedBy": "Chef Rony",
  "createdAt": "2026-08-16T12:00:00.000Z"
}
```

### 👥 8. `users` Collection
```json
{
  "_id": "usr_admin",
  "username": "admin",
  "password": "admin123",
  "name": "Sadia Islam Dia",
  "role": "Admin",
  "avatar": "👩‍💼",
  "phone": "+880 1710-000001",
  "email": "sadia.dia@flavourcraft.bd"
}
```

---

## 6. Detailed Feature & Module Specifications

### Module 1: Digital Interactive Menu & Customizer
- **Categories**: *Kacchi & Biryani*, *Beef, Mutton & Chicken*, *Fish & Seafood*, *Kabab & Street Food*, *Drinks & Desserts*.
- **15 Authentic Dishes**:
  1. *Puran Dhaka Mutton Kacchi Biryani* (৳650)
  2. *Old Dhaka Beef Tehari* (৳480)
  3. *Biye Bari Chicken Roast with Polao* (৳520)
  4. *Chittagong Beef Kala Bhuna* (৳680)
  5. *Sylheti Beef with Shatkora* (৳620)
  6. *Padma River Shorshe Ilish* (৳850)
  7. *Golda Chingri Malai Curry* (৳950)
  8. *Special Crispy Fuchka & Chotpoti Platter* (৳220)
  9. *Chicken Reshmi Kabab with Butter Naan* (৳420)
  10. *Special Naga Crispy Chicken Wings* (৳380)
  11. *Classic Shahi Borhani* (৳150)
  12. *Gondhoraj Lebu Shorbot* (৳120)
  13. *Special Royal Falooda with Ice Cream* (৳280)
  14. *Bogura Shahi Mishti Doi* (৳180)
  15. *Sweet Rasmalai Bowl (4 pcs)* (৳220)
- **Dietary Filter System**: *Naga Spicy (🔥)*, *100% Halal*, *Vegetarian*, *Vegan*, *Gluten-Free*.
- **Customizer Drawer**: Modifiers (+৳60 Biryani Aloo, +৳80 Borhani, +৳140 Jali Kabab, +৳50 Naga Dip), heat level selector (*Shahi Mild*, *Dhaka Regular 🌶️*, *Naga Fiery 🔥*), and live total recalculations.

### Module 2: Table Reservation Engine & Digital e-Pass
- **Dining Zones**: *Main Dining Hall*, *Family Lounge*, *Terrace Patio*, *VIP Banquet Salon*.
- **Time Slots & Peak Rush**: 1:00 PM, 2:30 PM, 6:00 PM, 7:30 PM (Peak), 8:00 PM (Peak), 8:30 PM (Peak), 9:00 PM (Peak), 10:00 PM.
- **Deposit Handling**: Automatic ৳500 refundable deposit prompt during peak dinner slots (7:30 PM – 9:30 PM).
- **Digital Guest Pass**: Generates unique Booking Code (`FC-DHK-XXXX`), seating details, dynamic QR code graphic, and simulated SMS confirmation.

### Module 3: Multi-Mode Ordering & Bangladeshi Checkout
- **Ordering Channels**:
  - **Dine-In**: Selects table number (T-01 to VIP-2). Applies 5% VAT + 5% Service Charge.
  - **Takeaway**: Self-pickup option. Applies 5% VAT.
  - **Dhaka Home Delivery**: Address field input with standard ৳60 delivery fee inside Dhaka.
- **Bangladeshi Payment Gateways**: **bKash Merchant Pay**, **Nagad / Rocket**, **Debit/Credit Cards (BRAC/City Visa)**, and **Cash on Delivery**.
- **Promo Engine**: Validates promo codes (`DHAKA10` for 10% off, `KACCHI20` for 20% off, `GULSHAN25` for 25% VIP off).

### Module 4: Customer Order Login Gate
- Customers can add items to the cart as guests.
- Clicking **"Proceed to Checkout"** checks `window.store.isLoggedIn()`.
- If unauthenticated, opens the **Login/Sign-up Modal** with an informative banner.
- Upon successful authentication, seamlessly resumes and opens the checkout modal with customer's Name, Phone, and Delivery Address pre-populated.

### Module 5: Live Order Progress Tracker & Rider Radar
- **Visual Progress Pipeline**: *Order Received* ➔ *Cooking in Handi / Dum* ➔ *Ready to Serve / Out for Delivery* ➔ *Completed*.
- **Driver Dispatch Simulation**: Shows rider avatar, name (Mehedi Hasan #04), and delivery countdown timer (~15-20 Mins).
- **Stage Advance Trigger**: Interactive button allowing line cooks or dispatchers to advance orders through pipeline stages in real time.

### Module 6: Kitchen Display System (KDS) & Cook Recipe Specs
- **3-Column Ticket Board**: *New Incoming*, *In Preparation*, and *Ready for Service*.
- **Urgency Timers & Color Coding**:
  - 🟢 Fresh (< 10 minutes)
  - 🟡 Warning (10 – 20 minutes)
  - 🔴 Critical / Overdue (> 20 minutes with pulsing crimson border)
- **Web Audio Arrival Chimes**: Tactile audio notification when an order is submitted.
- **Line Cook Recipe Spec Guide**: Clicking `Recipe` on any ticket opens an ingredient breakdown showing exact grams/units needed for preparation.

### Module 7: 2D Interactive Table & Floor Plan
- **12 Table Nodes Across 4 Zones**:
  - *Main Dining Hall*: T-01, T-02, T-03 (Booth), T-04 (Booth)
  - *Family Lounge*: T-05, T-06, T-07 (6-Seat Round)
  - *Terrace Patio*: T-08 (Round), T-09, T-10
  - *VIP Banquet Salon*: VIP-1 (8-Seat), VIP-2 (12-Seat)
- **Status Ring Halos**: 🟢 Available, 🔵 Occupied, 🟠 Reserved, 🟡 Dirty (Needs Cleaning).
- **Table Action Drawer**: Quick modal to change table state, inspect running POS balance in ৳ BDT, mark clean, or launch POS directly.

### Module 8: Rapid Touch POS Register & Mushak-6.3 Receipts
- **Touch Item Catalog**: Fast category tabs and live dish search.
- **Barcode / SKU Scanner Simulator**: Click to simulate barcode scan with audible acoustic beep.
- **Split-Bill Calculator**: Computes exact per-guest split in Taka based on party size.
- **Mushak-6.3 Thermal Receipt Generator**: Monospaced thermal paper layout with BANANI DHAKA restaurant address, BIN number, item breakdown, VAT 5%, Service Charge 5%, and native `@media print` support.

### Module 9: Inventory Management & Automatic Stock Deductions
- **Automatic Stock Deduction Engine**: Executed inside `store.submitOrder()`. Every order item inspects recipe formula and reduces raw stocks in MongoDB using `$inc` operations.
- **Real-Time Threshold Monitoring**: Low-stock banner triggered when ingredients dip below safety thresholds.
- **One-Click Quick Reorder All**: Restocks all depleted items to safe levels instantly.

### Module 10: Recipe Costing & Profit Margin Engine
- Calculates raw portion cost from recipe formulas and compares against menu selling prices.
- Computes Gross Profit Margin (৳) and Food Cost % (e.g. 24.8% Optimal vs. >35% Warning).

### Module 11: Food Waste & Kitchen Spoilage Tracker
- Kitchen staff can log wasted food with quantity, ingredient name, reason code (*Overcooked in Handi*, *Shelf Life Expired*, *Prep Spill*, *Quality Rejection*), and financial loss in Taka.
- Automatically adjusts raw stock inventory downward upon waste submission.

### Module 12: Executive Analytics & Reports
- **7-Day Revenue Velocity Chart**: SVG bar chart displaying weekly turnover in Taka (e.g. ৳12.37 Lakh).
- **Dhaka Peak Ordering Hours Heatmap**: Visualizes order density across Lunch (1–2:30 PM), Adda (6 PM), and Dinner Rush (8–10 PM).
- **Top 5 Bestsellers Ranking**: Quantities sold and total revenue contribution.
- **Database JSON Export**: Full client MongoDB backup downloadable with a single click.

### Module 13: Authentication, Session & Role-Based Access Control (RBAC)
- **Staff Operations Route Guard**: Public guest access is restricted to Menu, Reservations, and Tracking. Navigating to KDS, Floor, POS, Inventory, or Analytics shows a **"🔒 Staff Login Required"** lock screen.
- **One-Click Demo Credentials**:
  | Role | Name | Username / Identifier | Password | Permissions |
  | :--- | :--- | :--- | :--- | :--- |
  | 👑 **Admin** | **Sadia Islam Dia** | `admin` | `admin123` | Full access across all 8 modules |
  | 👩‍💼 **Manager** | **Tanima Ahmed** | `manager` | `manager123` | Floor, POS, Inventory, Analytics, Menu |
  | 💳 **Cashier** | **Shakib Al Hasan** | `cashier` | `cashier123` | POS Register, Floor Plan, Menu, Tracking |
  | 🍳 **Kitchen** | **Chef Rony** | `kitchen` | `kitchen123` | Kitchen KDS, Recipe Specs, Inventory |
  | 🛵 **Rider** | **Mehedi Hasan** | `rider` | `rider123` | Live Tracking, Dispatch Radar |
  | 🍽️ **Customer** | **Asif Rahman** | `customer` / `+880 1711-234567` | `customer123` | Menu, Reservations, Order Checkout |
- **Session Persistence**: Stores session token in `localStorage` under `flavourcraft_auth_session`. Topbar user profile chip provides profile information and instant Sign Out.

---

## 7. Directory Structure & File Manifest

```
d:/Personal Projects/FlavourCraft/
├── index.html                      # Single-Page Application Master HTML Shell
├── README.md                       # Comprehensive Project User Guide & Documentation
├── implementation_plan.md          # Technical Master Implementation Plan (This Document)
├── .gitignore                      # Git ignore rules for logs and OS files
├── css/
│   ├── variables.css               # Design tokens, color palette, glassmorphism, shadows
│   ├── style.css                   # Global styles, layout, sidebar, topbar, buttons, toasts
│   ├── menu.css                    # Menu cards, spice meters, customizer drawer
│   ├── ordering.css                # Cart drawer, checkout, live tracking progress
│   ├── reservations.css            # Table booking, seat selector & digital e-Pass ticket
│   ├── kds.css                     # Kitchen tickets, urgency countdown timers, audio chimes
│   ├── floor.css                   # 2D table floor plan & live occupancy halos
│   ├── pos.css                     # Touch POS register & thermal receipt printer
│   ├── inventory.css               # Stock table, recipe margins, low-stock glow alerts
│   ├── analytics.css               # Sales SVG charts, peak hour heatmaps, metric cards
│   ├── rbac.css                    # Role badges & permission indicators
│   └── auth.css                    # Authentication modal, demo pills, dropdown menu & lock screen
└── js/
    ├── db/
    │   ├── mongo-db.js             # Client-side MongoDB document engine (CRUD, Aggregations)
    │   └── seed-data.js            # Initial MongoDB seed dataset (Menu, Stock, Tables, Users)
    ├── store.js                    # Reactive state, Web Audio synthesizer, Auto-deduction, Auth engine
    ├── app.js                      # Main application controller, router, modal & toast manager
    └── components/
        ├── auth.js                 # Authentication controller, login modal, registration & staff gate
        ├── menu.js                 # Menu component, item customizer & dietary filter
        ├── reservations.js         # Table reservations & digital ticket generator
        ├── ordering.js             # Checkout with login gate, payment gateways & live tracker
        ├── kds.js                  # Kitchen Display System & cook recipe specs
        ├── floor.js                # Visual 2D floor & table management
        ├── pos.js                  # POS register, split billing & thermal receipts
        ├── inventory.js            # Stock inventory, recipe costing & waste logs
        ├── analytics.js            # Analytics charts & JSON DB export
        └── rbac.js                 # Role-based permissions & navigation filtering
```

---

## 8. End-to-End Quality Verification Protocol

### Test Case 1: Customer Order Login Gate
1. Open application in browser without logging in (Guest state).
2. Browse menu, customize *Puran Dhaka Mutton Kacchi Biryani* with Extra Aloo (+৳60), and add to cart.
3. Open Cart Drawer and click **"Proceed to Checkout"**.
4. **Expected Result**: System intercepts the checkout, displays a warning toast, and opens the Authentication Modal with the *"Login Required for Checkout"* banner.
5. Log in using Customer credentials (`customer` / `customer123`).
6. **Expected Result**: Checkout modal automatically opens with customer name (*Asif Rahman*), phone (*+880 1711-234567*), and Banani delivery address pre-filled.

### Test Case 2: Staff Route Access Guard
1. As an unauthenticated guest or logged-in Customer, click **"Kitchen Display (KDS)"** or **"POS & Billing"** on the sidebar.
2. **Expected Result**: View is locked, rendering the **"🔒 Staff Login Required"** lock overlay.
3. Click *"Sign In with Staff Credentials"* and click the **Sadia (Admin)** one-click demo pill.
4. **Expected Result**: System authenticates as Admin Sadia Islam Dia, unlocks all 8 operational views, and displays full navigation.

### Test Case 3: Automatic Stock Deduction & Low-Stock Alerts
1. Note current stock of *Fresh Bengal Mutton Cuts* (e.g. 18,500g).
2. Place a Dine-In order for 2x *Puran Dhaka Mutton Kacchi Biryani*.
3. **Expected Result**: Stock automatically reduces by 500g mutton, 360g Chinigura rice, and 60g ghee.
4. Navigate to **Inventory & Recipes** to verify updated stock numbers in the real-time data table.

### Test Case 4: Rapid POS Register & Mushak-6.3 Receipt
1. Navigate to **POS & Billing**.
2. Click **"Scan SKU Barcode"** or tap menu items to add to the register ticket.
3. Apply a 10% Member discount and select **Split Bill** (e.g. 3 guests). Verify individual share in Taka.
4. Click **"Settle & Print Receipt"**.
5. **Expected Result**: Generates authentic Mushak-6.3 Tax Invoice formatted for Banani, Dhaka with 5% VAT, 5% Service Charge, and printable layout.

### Test Case 5: Kitchen KDS Bump Stages & Audio Chimes
1. Submit an order from POS or customer checkout.
2. **Expected Result**: Audio chime rings, and new ticket appears in KDS *New* column.
3. Click *Start Cooking* ➔ moves to *In Preparation*. Click *Recipe* ➔ displays portion metrics. Click *Mark Ready* ➔ moves to *Ready to Serve*.
