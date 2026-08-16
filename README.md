# 🔥 FlavourCraft Dhaka - Modern Bangladeshi Restaurant Management System

> **Managing Director & Admin**: Sadia Islam Dia  
> **Platform**: 100% Client-Side Web Application (HTML5, Plain CSS3, Vanilla JavaScript, Client MongoDB)  
> **Currency**: Bangladeshi Taka (৳ / BDT)  
> **Cuisine**: Authentic & Familiar Bangladeshi Restaurant Cuisine  

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Technology Stack & Architecture](#-technology-stack--architecture)
3. [Core Feature Breakdown](#-core-feature-breakdown)
   - [Customer-Facing Portal](#1-customer-facing-portal)
   - [Floor & Kitchen Operations](#2-floor--kitchen-operations)
   - [Admin & Inventory Control](#3-admin--inventory-control)
4. [Bangladeshi Menu & Food Catalog](#-bangladeshi-menu--food-catalog)
5. [Database Architecture (MongoDB)](#-database-architecture-mongodb)
6. [Design System & Aesthetics](#-design-system--aesthetics)
7. [Directory Structure](#-directory-structure)
8. [How to Run](#-how-to-run)

---

## 🌟 Project Overview

**FlavourCraft Dhaka** is an all-in-one, next-generation restaurant operations platform designed specifically for Bangladeshi restaurants. It unifies customer online ordering, table bookings, digital Kitchen Display System (KDS), 2D visual table management, rapid touch POS billing with Mushak-6.3 tax receipts, automated recipe ingredient stock deductions, food waste logging, and executive revenue analytics—all running in real-time in the browser with **zero external backend or server installation required**.

---

## 💻 Technology Stack & Architecture

- **Core**: 100% Pure HTML5 & Vanilla JavaScript (Modular ES6 Classes)
- **Styling**: Pure Vanilla CSS3 (Custom design system, CSS Grid/Flexbox, Glassmorphism, animations, responsive design)
- **Database Engine**: Custom Client-Side MongoDB Document Engine (`mongo-db.js`)
  - Full collection management (`menu`, `orders`, `tables`, `reservations`, `inventory`, `recipes`, `waste`, `users`)
  - Queries (`$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$regex`, `$exists`)
  - Update operators (`$set`, `$inc`, `$push`, `$pull`)
  - Aggregation pipeline (`$match`, `$group`, `$sort`, `$limit`, `$sum`, `$avg`)
  - BSON `ObjectId()` generation and LocalStorage persistence
  - One-click JSON database export and backup
- **Audio Engine**: Web Audio API Synthesizer (Generates acoustic arrival chimes, kitchen bells, and barcode scanner beeps without external MP3 files)
- **State Management**: Central reactive store with Pub/Sub EventBus (`store.js`)

---

## 🚀 Core Feature Breakdown

### 1. Customer-Facing Portal
- **Digital Interactive Menu**:
  - Categorized tabs: *Kacchi & Biryani*, *Beef, Mutton & Chicken*, *Fish & Seafood*, *Kabab & Street Food*, *Drinks & Desserts*.
  - Dietary filter pills: *Naga Spicy (🔥)*, *100% Halal*, *Vegetarian*, *Vegan*, *Gluten-Free*.
  - Instant dish search and live availability toggles.
- **Item Customizer Drawer**:
  - Add-ons: *Extra Biryani Aloo (+৳60)*, *Cold Borhani (+৳80)*, *Mutton Jali Kabab (+৳140)*, *Naga Morich Fire Dip (+৳50)*.
  - Heat level selector: *Shahi Mild*, *Dhaka Regular 🌶️*, *Naga Fiery 🔥*.
  - Special allergy/preparation notes with real-time price updates.
- **Table Reservation System**:
  - Date & time slot picker with ৳500 refundable deposit during peak dinner hours (7:30 PM – 9:30 PM).
  - Party size selector (1 to 12+ guests) across *Main Dining Hall*, *Family Lounge*, *Terrace Patio*, and *VIP Banquet Salon*.
  - Instant digital e-Ticket & SMS confirmation preview with QR code.
- **Multi-Mode Ordering & Checkout**:
  - Supports **Dine-In** (with table selection), **Takeaway**, and **Dhaka Home Delivery** (with ৳60 standard delivery fee).
  - Bangladeshi payment gateways: **bKash Merchant Pay**, **Nagad / Rocket**, **Debit/Credit Card**, and **Cash on Delivery**.
  - Promo discounts: `DHAKA10` (10% off), `KACCHI20` (20% off), `GULSHAN25` (25% VIP off).
- **Live Order Progress Tracker**:
  - Multi-stage visual progress timeline (*Order Received* ➔ *Cooking on Dum* ➔ *Ready / Out for Delivery* ➔ *Completed*).
  - Live countdown timers, active delivery rider simulation (Mehedi Hasan #04), and simulated stage advancement.

---

### 2. Floor & Kitchen Operations
- **Kitchen Display System (KDS)**:
  - Real-time digital ticket queue across *New Tickets*, *In Preparation*, and *Ready to Serve*.
  - Color-coded urgency countdown timers:
    - 🟢 Fresh (< 10 mins)
    - 🟡 Warning (10 - 20 mins)
    - 🔴 Overdue (> 20 mins) with pulsing alert glow.
  - Web Audio synthesized arrival chimes.
  - One-click bump status transitions (*Start Cooking*, *Mark Ready*, *Serve*).
  - **Recipe Formulation Modal**: Line cooks can click *Recipe* on any ticket to view exact ingredient proportions in grams/milliliters.
- **2D Visual Table & Floor Plan**:
  - Interactive table map across 4 dining zones with live status halos:
    - 🟢 Available
    - 🔵 Occupied
    - 🟠 Reserved
    - 🟡 Needs Cleaning (Dirty)
  - Quick action drawer to seat guests, inspect running balance in Taka, mark clean, or launch the POS directly.
- **Rapid Touch POS & Billing Register**:
  - Touch-friendly item grid with category quick filters.
  - **Barcode / SKU Scanner Simulator**: Click to simulate barcode scan with audible acoustic beep.
  - Automatic **5% Mushak-6.3 VAT** and **5% Service Charge** calculations.
  - Staff promo discounts & **Split-Bill Calculator** (per guest share in Taka).
  - **Mushak-6.3 Thermal Receipt Printer**: Monospaced thermal paper receipt format with authentic tear styling and one-click `window.print()` support.

---

### 3. Admin & Inventory Control
- **Recipe Costing & Profit Margins**:
  - Direct recipe-to-ingredient links with real-time food cost and gross profit margin calculations in Taka.
  - Food cost percentage health indicators (e.g. 24.8% Optimal vs. >35% Warning).
- **Automatic Stock Deduction Engine**:
  - Placed orders automatically reduce raw ingredient inventory in MongoDB via `$inc` mutations (e.g. 1 Kacchi Biryani deducts 250g Mutton, 180g Chinigura rice, 30g Ghee, 1 Aloo, 15g Aloo Bukhara).
- **Low-Stock Alert System**:
  - Real-time safety threshold monitoring with urgent alert banner.
  - One-click *Quick Reorder All* action to replenish inventory.
- **Food Waste & Spoilage Tracker**:
  - Log kitchen waste by ingredient, reason code, and financial loss in Taka.
- **Executive Analytics & Reports**:
  - 7-day revenue velocity SVG bar chart (e.g. ৳12.37 Lakh turnover).
  - Hourly customer traffic & kitchen rush heatmap.
  - Top 5 best-selling dishes ranking with revenue contribution.
  - One-click JSON export of the entire MongoDB database.
- **Authentication, Session & Role-Based Access Control (RBAC)**:
  - **Customer Order Login Gate**: Guests can browse menu and add dishes to cart freely; clicking *Proceed to Checkout* prompts login/sign-up before confirming.
  - **Staff Operations Gate**: Kitchen KDS, Floor Map, POS, Inventory, and Analytics are locked behind staff authentication.
  - **One-Click Demo Credentials**:
    | Role | Name | Identifier / Phone | Password |
    | :--- | :--- | :--- | :--- |
    | 👑 **Admin** | **Sadia Islam Dia** | `admin` | `admin123` |
    | 👩‍💼 **Manager** | **Tanima Ahmed** | `manager` | `manager123` |
    | 💳 **Cashier** | **Shakib Al Hasan** | `cashier` | `cashier123` |
    | 🍳 **Kitchen** | **Chef Rony** | `kitchen` | `kitchen123` |
    | 🛵 **Rider** | **Mehedi Hasan** | `rider` | `rider123` |
    | 🍽️ **Customer** | **Asif Rahman** | `+880 1711-234567` / `customer` | `customer123` |
  - Persistent login sessions via `localStorage` with dropdown profile menu & Sign Out action.

---

## 🍲 Bangladeshi Menu & Food Catalog

| SKU | Dish Name | Category | Price | Description |
| :--- | :--- | :--- | :--- | :--- |
| `KAC-101` | **Puran Dhaka Mutton Kacchi Biryani** | Kacchi & Biryani | **৳650** | Tender mutton kacchi with fragrant Chinigura rice, spiced aloo, and ghee. Served with Borhani. |
| `TEH-102` | **Old Dhaka Beef Tehari** | Kacchi & Biryani | **৳480** | Mustard oil beef tehari cooked with Katari-bhog rice, tender beef, and green chilies. |
| `ROS-103` | **Biye Bari Chicken Roast with Polao** | Kacchi & Biryani | **৳520** | Wedding-style thick gravy chicken roast, fragrant ghee polao, and egg. |
| `BEEF-201`| **Chittagong Beef Kala Bhuna** | Beef, Mutton & Chicken | **৳680** | Slow-roasted dark caramelized beef curry with radhuni, black pepper, and garlic. |
| `BEEF-202`| **Sylheti Beef with Shatkora** | Beef, Mutton & Chicken | **৳620** | Tender beef curry simmered with wild aromatic Sylheti Shatkora citrus fruit. |
| `FISH-301`| **Padma River Shorshe Ilish** | Fish & Seafood | **৳850** | Fresh Padma Hilsha fish cutlet cooked in yellow mustard paste and mustard oil. |
| `FISH-302`| **Golda Chingri Malai Curry** | Fish & Seafood | **৳950** | Freshwater jumbo prawns in velvety spiced coconut milk gravy. |
| `KAB-401` | **Special Crispy Fuchka & Chotpoti** | Kabab & Street Food | **৳220** | 10 pcs crispy puchkas with spiced yellow dubli dal, mashed potato, and tetul-gondhoraj tok. |
| `KAB-402` | **Chicken Reshmi Kabab with Naan** | Kabab & Street Food | **৳420** | Cashew cream marinated chicken skewers, charcoal-grilled, served with butter naan. |
| `KAB-403` | **Special Naga Crispy Chicken Wings** | Kabab & Street Food | **৳380** | 6 pcs crispy fried chicken wings in hot Sylheti Naga Morich pepper glaze. |
| `BEV-501` | **Classic Shahi Borhani** | Drinks & Desserts | **৳150** | Spiced sour curd digestive drink with black salt, cumin, mint, and mustard. |
| `BEV-502` | **Gondhoraj Lebu Shorbot** | Drinks & Desserts | **৳120** | Refreshing aromatic Gondhoraj lemon cooler with chilled soda and fresh mint. |
| `DES-601` | **Special Royal Falooda with Ice Cream** | Drinks & Desserts | **৳280** | Layered dessert with rose syrup, sweet noodles, basil seeds, fruits, and vanilla ice cream. |
| `DES-602` | **Bogura Shahi Mishti Doi** | Drinks & Desserts | **৳180** | Traditional caramelized sweet curd served chilled in authentic clay pot. |
| `DES-603` | **Sweet Rasmalai Bowl (4 pcs)** | Drinks & Desserts | **৳220** | Soft cottage cheese balls in saffron-cardamom flavored malai rabri with pistachios. |

---

## 🗄️ Database Architecture (MongoDB)

All entities are managed inside the client-side document database (`mongo-db.js`):

```json
{
  "menu": [ "Dish document with SKU, Name, Category, Price in ৳, Tags, RecipeID, Image" ],
  "recipes": [ "Recipe formula with required ingredient quantities in g/ml/pcs and unit costs" ],
  "inventory": [ "Raw ingredient stock with currentStock, threshold, unit, and costPerUnit" ],
  "tables": [ "12 Table nodes with capacity, shape, zone, status, and assignedServer" ],
  "orders": [ "Order documents with items, subtotal, VAT 5%, service 5%, discount, totalAmount" ],
  "reservations": [ "Booking documents with date, timeSlot, partySize, zone, depositPaid" ],
  "waste": [ "Kitchen spoilage logs with ingredientName, quantity, reason, costLoss" ],
  "users": [ "Staff profiles with roles: Admin, Manager, Cashier, Kitchen, Rider, Customer" ]
}
```

---

## 🎨 Design System & Aesthetics

- **Color Palette**:
  - Background Canvas: `#080c14` (Deep obsidian dark)
  - Surface Glass: `rgba(15, 23, 42, 0.8)` with `backdrop-filter: blur(16px)`
  - Accent Primary: `#f59e0b` / `#fbbf24` (Golden Amber / Saffron)
  - Success: `#10b981` (Emerald Green)
  - Danger / Alert: `#ef4444` (Crimson Red)
  - Info: `#38bdf8` (Sky Blue)
- **Typography Pairing**:
  - Headings: `Playfair Display` & `Outfit`
  - Body Text: `Plus Jakarta Sans`
  - POS / Numerical / Receipts: `JetBrains Mono`

---

## 📁 Directory Structure

```
d:/Personal Projects/FlavourCraft/
├── index.html                      # Single-Page Application Master Shell
├── README.md                       # Complete Project Documentation
├── implementation_plan.md          # Technical Architecture & Implementation Plan
├── css/
│   ├── variables.css               # Design tokens, color palette, glassmorphism
│   ├── style.css                   # Global styles, layout, buttons, modals, toasts
│   ├── menu.css                    # Menu cards, spice meters, customizer drawer
│   ├── ordering.css                # Cart drawer, checkout, live tracking progress
│   ├── reservations.css            # Table booking, seat selector & digital e-pass
│   ├── kds.css                     # Kitchen tickets, urgency timers, audio chimes
│   ├── floor.css                   # 2D table floor plan & live occupancy halos
│   ├── pos.css                     # Touch POS register & thermal receipt printer
│   ├── inventory.css               # Stock table, recipe margins, low-stock alerts
│   ├── analytics.css               # Sales SVG charts, peak hour heatmaps, metric cards
│   ├── rbac.css                    # Role badges & permission indicators
│   └── auth.css                    # Authentication modal, demo pills, dropdown menu & lock screen
└── js/
    ├── db/
    │   ├── mongo-db.js             # Client-side MongoDB document engine
    │   └── seed-data.js            # Initial dataset (Menu, Stock, Tables, Orders, Admin: Sadia Islam Dia)
    ├── store.js                    # Reactive state, Web Audio synthesizer, Auto-deduction, Auth engine
    ├── app.js                      # Main controller, router, modal & toast manager
    └── components/
        ├── auth.js                 # Authentication controller, login modal, registration & staff gate
        ├── menu.js                 # Menu component & item customizer
        ├── reservations.js         # Table reservations & digital ticket generator
        ├── ordering.js             # Checkout with login gate, payment gateways & live tracker
        ├── kds.js                  # Kitchen Display System & recipe specs
        ├── floor.js                # Visual 2D floor management
        ├── pos.js                  # POS register, split billing & thermal receipts
        ├── inventory.js            # Stock inventory, recipe costing & waste logs
        ├── analytics.js            # Analytics charts & JSON DB export
        └── rbac.js                 # Role-based permissions & navigation filtering
```

---

## 🏁 How to Run

1. Open the project folder in File Explorer or your IDE.
2. Double-click **`index.html`** or open it with any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. The application will initialize the client MongoDB storage and run immediately offline or online with zero configuration!
