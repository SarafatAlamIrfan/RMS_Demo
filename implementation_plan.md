# 📋 FlavourCraft Dhaka: Master Implementation Plan & Architecture Specification

> **System Name**: FlavourCraft Dhaka - Modern Bangladeshi Restaurant Management System  
> **Executive Leadership**: Managing Director & Admin **Sadia Islam Dia**  
> **Technology Stack**: HTML5, Plain CSS3, Vanilla JavaScript, PHP, SQL (MySQL)  
> **Themes Supported**: ☀️ Light Mode (Porcelain & Saffron) & 🌙 Dark Mode (Obsidian & Amber)  
> **Currency Unit**: Bangladeshi Taka (**৳ / BDT**)  
> **Cuisine Specialization**: Authentic & Familiar Bangladeshi Traditional & Modern Dhaka Cuisine  
> **Repository**: [https://github.com/SarafatAlamIrfan/RMS_Demo.git](https://github.com/SarafatAlamIrfan/RMS_Demo.git)

---

## 📑 Table of Contents
1. [Executive Summary & System Mission](#1-executive-summary--system-mission)
2. [Technology Stack & Architecture](#2-technology-stack--architecture)
3. [Light Mode & Dark Mode Theming (Plain CSS)](#3-light-mode--dark-mode-theming-plain-css)
4. [Relational SQL Database Schema (MySQL)](#4-relational-sql-database-schema-mysql)
5. [PHP Backend REST API Specification](#5-php-backend-rest-api-specification)
6. [Detailed Feature & Module Breakdown](#6-detailed-feature--module-breakdown)
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
8. [Quality Verification & Testing Protocol](#8-quality-verification--testing-protocol)

---

## 1. Executive Summary & System Mission

**FlavourCraft Dhaka** is an all-in-one restaurant management operating system tailored specifically to Bangladeshi dining establishments. Under the executive direction of **Sadia Islam Dia (Managing Director & Admin)**, the platform provides a complete solution for customer ordering, table bookings, digital kitchen dispatching, POS billing with Mushak-6.3 tax receipts, automated inventory deductions, and revenue turnover analytics in Bangladeshi Taka.

---

## 2. Technology Stack & Architecture

- **Frontend**: 
  - **HTML5**: Semantic, modular structure.
  - **Plain CSS3**: Custom design tokens, CSS Grid/Flexbox, Glassmorphism, animations, responsive design.
  - **Vanilla JavaScript**: Clean, beginner-friendly ES6 classes with standard `fetch()` API client (`js/api-client.js`).
- **Backend (PHP)**:
  - Clean, modular PHP REST API endpoints using `PDO` prepared statements.
  - Automatic JSON responses, CORS support, and atomic SQL transaction handling.
- **Database (SQL / MySQL)**:
  - Relational MySQL schema in `database/flavourcraft_dhaka.sql`.
  - 9 normalized tables with foreign keys and complete Bangladeshi seed data for 1-click import in **phpMyAdmin / XAMPP / WAMP**.
- **Dual-Mode High-Availability Architecture**:
  - **Full-Stack Mode**: Connects directly to PHP backend and MySQL database.
  - **Standalone / Demo Mode**: Seamless fallback using the built-in client database engine when running directly in browser without an active web server.

---

## 3. Light Mode & Dark Mode Theming (Plain CSS)

FlavourCraft Dhaka provides native dual-theme support through CSS variables:
- **🌙 Dark Obsidian Mode (Default)**: Deep midnight obsidian canvas (`#080c14`), translucent glass surfaces, and warm saffron/ghee accents (`#f59e0b`).
- **☀️ Light Porcelain Mode**: Crisp porcelain white canvas (`#f8fafc`), clean cards (`#ffffff`), deep slate text (`#0f172a`), and high-contrast warm amber accents (`#d97706`).
- **Persistence**: Remembers your preferred theme across browser reloads via `localStorage`.

---

## 4. Relational SQL Database Schema (MySQL)

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

## 5. PHP Backend REST API Specification

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

## 6. Detailed Feature & Module Breakdown

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
- **Automatic Stock Deduction Engine**: Executed inside SQL transaction in `api/orders.php` and simulated in `store.submitOrder()`. Every order item inspects recipe formula and reduces raw stocks.
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
- **Database JSON Export**: Full database backup downloadable with a single click.

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

## 8. Quality Verification & Testing Protocol

1. **Theme Switcher Verification**:
   - Click the Theme Toggle button (`☀️ Light Mode` / `🌙 Dark Mode`) in the topbar.
   - Verify all views, headers, cards, tables, inputs, and modals transition smoothly with high contrast in both themes.
   - Refresh the page and verify theme preference is preserved.
2. **Database & SQL Verification**:
   - Verify `database/flavourcraft_dhaka.sql` has clean MySQL DDL/DML syntax.
3. **PHP API Endpoints**:
   - Verify all `api/*.php` endpoints return standard JSON responses and handle SQL transactions properly.
4. **Ordering & Access Control**:
   - Verify customer checkout requires login/signup and auto-prefills customer data.
   - Verify staff operational views are protected by the staff lock screen.
