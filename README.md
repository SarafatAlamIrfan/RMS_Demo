# 🔥 FlavourCraft Dhaka - Modern Bangladeshi Restaurant Management System

> **Managing Director & Admin**: Sadia Islam Dia  
> **Technology Stack**: HTML5, Plain CSS3, Vanilla JavaScript, PHP, SQL (MySQL)  
> **Themes Supported**: ☀️ Light Mode (Porcelain & Saffron) & 🌙 Dark Mode (Obsidian & Amber)  
> **Currency**: Bangladeshi Taka (৳ / BDT)  
> **Cuisine**: Authentic & Familiar Bangladeshi Restaurant Cuisine  

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Technology Stack & Architecture](#-technology-stack--architecture)
3. [Light Mode & Dark Mode Theming](#-light-mode--dark-mode-theming)
4. [Core Feature Breakdown](#-core-feature-breakdown)
   - [Customer-Facing Portal](#1-customer-facing-portal)
   - [Floor & Kitchen Operations](#2-floor--kitchen-operations)
   - [Admin & Inventory Control](#3-admin--inventory-control)
5. [Bangladeshi Menu & Food Catalog](#-bangladeshi-menu--food-catalog)
6. [Database Schema & SQL Architecture](#-database-schema--sql-architecture)
7. [PHP Backend REST API](#-php-backend-rest-api)
8. [Directory Structure](#-directory-structure)
9. [How to Run (XAMPP / PHP Server & Standalone)](#-how-to-run)

---

## 🌟 Project Overview

**FlavourCraft Dhaka** is an all-in-one, beginner-friendly restaurant operations platform designed specifically for Bangladeshi restaurants. It unifies customer online ordering, table bookings with QR e-passes, digital Kitchen Display System (KDS), 2D visual table management, rapid touch POS billing with Mushak-6.3 tax receipts, automated recipe ingredient stock deductions, food waste logging, and executive revenue analytics in Bangladeshi Taka.

---

## 💻 Technology Stack & Architecture

- **Frontend**: 
  - **HTML5**: Semantic, accessible markup.
  - **Plain CSS3**: Custom design system, CSS Grid/Flexbox, Glassmorphism, animations, responsive design.
  - **Vanilla JavaScript**: Clean, beginner-friendly ES6 classes with standard `fetch()` API client (`js/api-client.js`).
- **Backend (PHP)**:
  - Clean, modular PHP REST API endpoints using `PDO` prepared statements.
  - Automatic JSON responses, CORS support, and SQL transaction handling.
- **Database (SQL / MySQL)**:
  - Relational MySQL schema in `database/flavourcraft_dhaka.sql`.
  - 9 normalized tables with foreign keys and complete Bangladeshi seed data for 1-click import in **phpMyAdmin / XAMPP / WAMP**.
- **Dual-Mode High-Availability Architecture**:
  - **Full-Stack Mode**: Connects directly to PHP backend and MySQL database.
  - **Standalone / Demo Mode**: Seamless fallback using the built-in client database engine when running directly in browser without an active web server.

---

## ☀️ Light Mode & 🌙 Dark Mode Theming

FlavourCraft Dhaka includes a native theme switcher in the topbar:
- **🌙 Dark Obsidian Mode (Default)**: Deep midnight obsidian canvas (`#080c14`), translucent glass surfaces, and warm saffron/ghee accents (`#f59e0b`).
- **☀️ Light Porcelain Mode**: Crisp porcelain white canvas (`#f8fafc`), clean cards (`#ffffff`), deep slate text (`#0f172a`), and high-contrast warm amber accents (`#d97706`).
- **Persistence**: Remembers your preferred theme across browser reloads via `localStorage`.

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
  - Automated simulated SMS & Email confirmation with unique Booking ID & QR code.
- **Ordering & Checkout with Customer Login Gate**:
  - Multi-mode ordering: **Dine-In** (table selection), **Takeaway**, and **Dhaka Home Delivery** (৳60 flat fee).
  - Intercepts checkout for unauthenticated guests, requiring login/signup and auto-prefilling customer contact & delivery address upon login.
  - Integrated payment options: **bKash Merchant Pay**, **Nagad / Rocket**, **BRAC / City Bank Visa/Mastercard**, and **Cash on Delivery**.
  - Promo discounts (`DHAKA10`, `KACCHI20`, `GULSHAN25`).
- **Live Order Progress Tracker**:
  - Interactive multi-stage visual timeline (*Order Received* ➔ *Cooking in Handi / Dum* ➔ *Ready to Serve / Out for Delivery* ➔ *Completed*).
  - Delivery rider tracker (Mehedi Hasan #04) and estimated countdown timer.

### 2. Floor & Kitchen Operations
- **Kitchen Display System (KDS)**:
  - 3-column ticket queue (*New Incoming*, *In Preparation*, *Ready for Service*).
  - Dynamic color-coded urgency countdown timers (<10m Green, 10–20m Yellow, >20m Crimson Alert).
  - Web Audio synthetic arrival chimes on new orders.
  - **Line Cook Recipe Specs Modal**: Click *Recipe* on any ticket to view exact portion quantities in grams/milliliters.
  - One-click stage bump buttons.
- **Visual Table & Floor Management**:
  - Interactive 2D restaurant seat map across 4 dining zones (12 tables).
  - Status ring indicators: 🟢 Available, 🔵 Occupied, 🟠 Reserved, 🟡 Dirty (Needs Cleaning).
  - Quick action drawer: Change table state, inspect running balance in Taka, mark table clean, or launch POS.
- **Rapid Touch POS Register & Billing**:
  - Touch-friendly item catalog and live dish search.
  - Barcode / SKU scanner simulator with acoustic audio feedback.
  - Split-bill calculator (computes per-guest share in Taka).
  - Automatic **5% Mushak-6.3 VAT** and **5% Service Charge** calculations.
  - **Mushak-6.3 Thermal Receipt Generator**: Monospaced thermal receipt layout with authentic tear styling and one-click print support.

### 3. Admin & Inventory Control
- **Recipe Costing & Profit Margin Analysis**:
  - Direct recipe-to-ingredient links with real-time food cost and gross profit margin calculations in Taka.
  - Food cost percentage health indicators (e.g. 24.8% Optimal vs. >35% Warning).
- **Automatic Stock Deduction Engine**:
  - Placed orders automatically reduce raw ingredient inventory in SQL via atomic database transactions.
- **Low-Stock Alert System**:
  - Real-time safety threshold monitoring with urgent alert banner.
  - One-click *Quick Reorder All* action to replenish inventory.
- **Food Waste & Spoilage Tracker**:
  - Log kitchen waste by ingredient, reason code, and financial loss in Taka.
- **Executive Analytics & Reports**:
  - 7-day revenue velocity SVG bar chart (e.g. ৳12.37 Lakh turnover).
  - Hourly customer traffic & kitchen rush heatmap.
  - Top 5 best-selling dishes ranking with revenue contribution.
  - One-click JSON database export and backup.
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
| `DES-601` | **Royal Falooda with Ice Cream** | Drinks & Desserts | **৳280** | Layered rose syrup, vermicelli, tokma, jelly, fresh fruits & vanilla ice cream. |
| `DES-602` | **Bogura Shahi Mishti Doi** | Drinks & Desserts | **৳180** | Traditional caramelized Bogura sweet curd served in clay pot. |
| `DES-603` | **Sweet Rasmalai Bowl (4 pcs)** | Drinks & Desserts | **৳220** | Soft cottage cheese chenna balls in saffron-cardamom clotted malai milk. |

---

## 🗄️ Database Schema & SQL Architecture

Located in [`database/flavourcraft_dhaka.sql`](file:///d:/Personal%20Projects/FlavourCraft/database/flavourcraft_dhaka.sql):
- `users`: User authentication, roles, contact & delivery address.
- `categories`: Menu category taxonomy.
- `menu_items`: Complete dish catalog with pricing, tags, and preparation times.
- `recipes` & `recipe_ingredients`: Bill of materials per portion for stock deduction.
- `inventory`: Raw meat, fish, grain, and spice stock levels with safety thresholds.
- `dining_tables`: Floor map tables across 4 zones with occupancy states.
- `orders` & `order_items`: Customer and POS orders with line items and VAT/service charge.
- `reservations`: Bookings, party sizes, and peak hour deposit tracking.
- `food_waste`: Kitchen spoilage and trimming loss logs.

---

## 🔌 PHP Backend REST API

Located in `api/`:
- `api/config.php`: MySQL PDO connection and JSON response helper.
- `api/auth.php`: Login, registration, and user listings.
- `api/menu.php`: Menu item retrieval and availability toggles.
- `api/orders.php`: Order placement with automatic SQL recipe stock deduction and KDS status updates.
- `api/reservations.php`: Table booking and e-Pass generation.
- `api/tables.php`: 2D table floor status management.
- `api/inventory.php`: Raw stock restock and food waste logging.
- `api/analytics.php`: Turnover in Taka, top bestsellers, and peak hour metrics.

---

## 📁 Directory Structure

```
d:/Personal Projects/FlavourCraft/
├── index.html                      # Single-Page Application Master Shell
├── README.md                       # Complete Project Documentation
├── implementation_plan.md          # Technical Architecture & Implementation Plan
├── .gitignore                      # Git ignore rules
├── database/
│   └── flavourcraft_dhaka.sql      # MySQL Schema & Seed Data Script
├── api/
│   ├── config.php                  # Database Connection (PDO) & JSON Helper
│   ├── auth.php                    # Authentication & User Management API
│   ├── menu.php                    # Menu & Availability API
│   ├── orders.php                  # Orders & KDS Stage Update API
│   ├── reservations.php            # Table Reservations API
│   ├── tables.php                  # 2D Floor Tables API
│   ├── inventory.php               # Inventory Stock & Waste API
│   └── analytics.php               # Financial & Turnover Analytics API
├── css/
│   ├── variables.css               # Design tokens, Light & Dark theme variables
│   ├── style.css                   # Global styles, layout, topbar, theme button
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
    │   ├── mongo-db.js             # Client-side Document Engine (Fallback / Offline)
    │   └── seed-data.js            # Initial dataset (Menu, Stock, Tables, Orders, Admin: Sadia Islam Dia)
    ├── api-client.js               # Frontend API Client (PHP & MySQL Backend Bridge)
    ├── store.js                    # Reactive state, Web Audio synthesizer, Auto-deduction, Auth engine
    ├── app.js                      # Main controller, router, theme switcher & toast manager
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

### Option 1: Full-Stack Mode (XAMPP / WAMP / Apache + MySQL)
1. Copy the `FlavourCraft` folder into your XAMPP `htdocs` directory (e.g. `C:\xampp\htdocs\FlavourCraft`).
2. Start **Apache** and **MySQL** in the XAMPP Control Panel.
3. Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
4. Click **Import** and select `database/flavourcraft_dhaka.sql`, then click **Go**.
5. Open your browser and navigate to:
   ```
   http://localhost/FlavourCraft/index.html
   ```

### Option 2: Standalone Browser Demo (Zero Server Setup)
1. Simply double-click [`index.html`](file:///d:/Personal%20Projects/FlavourCraft/index.html) or open it directly in any modern browser (Chrome, Edge, Firefox).
2. The built-in client engine will automatically load all seed data, allowing full demonstration of all customer, kitchen, POS, inventory, authentication, and light/dark theme features!
