# 📋 FlavourCraft: Master Implementation Plan & Architecture Specification

> **System Name**: FlavourCraft - Modern Bangladeshi Restaurant Management System  
> **Executive Leadership**: Managing Director & Admin **Sadia Islam Dia**  
> **Technology Stack**: HTML5, Plain CSS3, Vanilla JavaScript, PHP, SQL (MySQL)  
> **Themes Supported**: ☀️ Light Mode (Pinkish red & Saffron)  
> **Currency Unit**: Bangladeshi Taka (**৳ / BDT**)  
> **Cuisine Specialization**: Authentic & Familiar Bangladeshi Traditional Restaurant Cuisine  
> **Repository**: [https://github.com/SarafatAlamIrfan/RMS_Demo.git](https://github.com/SarafatAlamIrfan/RMS_Demo.git)

---

## 📑 Table of Contents
1. [Executive Summary & System Mission](#1-executive-summary--system-mission)
2. [Technology Stack & Architecture](#2-technology-stack--architecture)
3. [Theme Design: Light Mode (Pinkish Red & Saffron)](#3-theme-design-light-mode-pinkish-red--saffron)
4. [Basic Relational SQL Database Schema (MySQL)](#4-basic-relational-sql-database-schema-mysql)
5. [Basic PHP Backend Architecture](#5-basic-php-backend-architecture)
6. [Detailed Feature & Module Breakdown](#6-detailed-feature--module-breakdown)
   - [Module 1: Digital Interactive Menu & Customizer](#module-1-digital-interactive-menu--customizer)
   - [Module 2: Table Reservation Engine & Digital e-Pass](#module-2-table-reservation-engine--digital-e-pass)
   - [Module 3: Multi-Mode Ordering & Bangladeshi Checkout](#module-3-multi-mode-ordering--bangladeshi-checkout)
   - [Module 4: Customer Order Login Gate](#module-4-customer-order-login-gate)
   - [Module 5: Live Order Progress Tracker & Rider Radar](#module-5-live-order-progress-tracker--rider-radar)
   - [Module 6: Kitchen Display System (KDS) & Cook Recipe Specs](#module-6-kitchen-display-system-kds--cook-recipe-specs)
   - [Module 7: Inventory Management & Automatic Stock Deductions](#module-7-inventory-management--automatic-stock-deductions)
   - [Module 8: Recipe Costing & Profit Margin Engine](#module-8-recipe-costing--profit-margin-engine)
   - [Module 9: Executive Analytics & Reports](#module-9-executive-analytics--reports)
   - [Module 10: Authentication, Session & Role-Based Access Control (RBAC)](#module-10-authentication-session--role-based-access-control-rbac)
7. [Directory Structure & File Manifest](#7-directory-structure--file-manifest)
8. [Quality Verification & Testing Protocol](#8-quality-verification--testing-protocol)

---

## 1. Executive Summary & System Mission

**FlavourCraft** is an all-in-one, beginner-friendly restaurant management operating system tailored specifically to Bangladeshi dining establishments. Under the executive direction of **Sadia Islam Dia (Managing Director & Admin)**, the platform provides a complete, easy-to-understand solution for customer ordering, table bookings, digital kitchen dispatching, automated inventory recipe deductions, and revenue turnover analytics in Bangladeshi Taka.

---

## 2. Technology Stack & Architecture

- **Frontend**: 
  - **HTML5**: Clean, semantic, and beginner-friendly structure.
  - **Plain CSS3**: Custom design tokens, CSS Grid/Flexbox, Glassmorphism, animations, responsive design.
  - **Vanilla JavaScript**: Clean, well-commented ES6 scripts for UI interactivity.
- **Backend (Basic PHP)**:
  - Clean, simple, and straightforward PHP scripts using PDO prepared statements.
  - Basic database queries (SELECT, INSERT, UPDATE) with zero complex frameworks.
- **Database (Basic SQL / MySQL)**:
  - Simple, relational MySQL schema in `database/flavourcraft_dhaka.sql`.
  - Normalized tables (`users`, `categories`, `menu_items`, `recipes`, `recipe_ingredients`, `orders`, `order_items`, `reservations`, `inventory`) with foreign keys and complete sample seed data for 1-click import in **phpMyAdmin / XAMPP / WAMP**.
- **Execution Flexibility**:
  - **Server Mode**: Runs on standard Apache / PHP / MySQL stack (XAMPP).
  - **Standalone Mode**: Can also run directly in any web browser for immediate demonstration.

---

## 3. Theme Design: Light Mode (Pinkish Red & Saffron)

FlavourCraft features a vibrant **Light Mode** palette designed with **Pinkish Red & Saffron Amber Accents**:
- **Canvas Base**: Soft, clean porcelain background (`#fff5f5` / `#fdf2f2` with subtle rose-pink tint).
- **Surface Cards**: Pure white (`#ffffff`) with delicate pink-tinted borders (`#fed7d7` / `#fecdd3`).
- **Brand Accents**: 
  - **Primary Pinkish Red**: `#e11d48` / `#be123c` (Rose Crimson / Naga Red).
  - **Secondary Saffron**: `#f59e0b` / `#d97706` (Warm Saffron Ghee glow).
- **Typography**: Deep charcoal slate (`#0f172a` and `#334155`) for crisp, readable menus and tickets.

---

## 4. Basic Relational SQL Database Schema (MySQL)

Located in [`database/flavourcraft_dhaka.sql`](file:///d:/Personal%20Projects/FlavourCraft/database/flavourcraft_dhaka.sql):
- `users`: User authentication, roles (Admin Sadia Islam Dia, staff, customers), contact & address.
- `categories`: Menu category taxonomy (Kacchi, Beef/Chicken, Seafood, Kabab, Desserts).
- `menu_items`: Dish catalog with pricing in ৳ BDT, descriptions, dietary tags, and prep times.
- `recipes` & `recipe_ingredients`: Bill of materials per portion for stock deduction.
- `inventory`: Raw meat, fish, grain, and spice stock levels with safety thresholds.
- `orders` & `order_items`: Customer orders with line items, 5% VAT, and 5% service charge.
- `reservations`: Bookings, party sizes, and peak hour deposit records.

---

## 5. Basic PHP Backend Architecture

Located in `api/`:
- `api/config.php`: Basic MySQL connection helper using PHP PDO.
- `api/auth.php`: Basic login and registration handler.
- `api/menu.php`: Basic script to fetch dishes and update availability.
- `api/orders.php`: Basic script to save orders and deduct recipe stock from inventory.
- `api/reservations.php`: Basic script to save table reservations and return booking codes.
- `api/inventory.php`: Basic script to list inventory stock levels and restock items.
- `api/analytics.php`: Basic script calculating total turnover in Taka and bestsellers.

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

### Module 2: Table Reservation Engine & Digital Pass
- **Restaurant Architecture**: Single authentic dining venue & floor.
- **Time Slots & Peak Rush**: 1:00 PM, 2:30 PM, 6:00 PM, 7:30 PM (Peak), 8:00 PM (Peak), 8:30 PM (Peak), 9:00 PM (Peak), 10:00 PM.
- **Deposit Handling**: Automatic ৳500 refundable deposit prompt during peak dinner slots (7:30 PM – 9:30 PM).
- **Digital Guest Pass**: Generates unique Booking Code (`FC-DHK-XXXX`), guest party size, and instant confirmation pass.

### Module 3: Multi-Mode Ordering & Bangladeshi Checkout
- **Ordering Channels**:
  - **Dine-In**: Selects dining area / table. Applies 5% VAT + 5% Service Charge.
  - **Takeaway**: Self-pickup option. Applies 5% VAT.
  - **Dhaka Home Delivery**: Address field input with standard ৳60 delivery fee inside Dhaka.
- **Bangladeshi Payment Gateways**: **bKash Merchant Pay**, **Nagad / Rocket**, **Debit/Credit Cards (BRAC/City Visa)**, and **Cash on Delivery**.
- **Promo Engine**: Validates promo codes (`DHAKA10` for 10% off, `KACCHI20` for 20% off, `GULSHAN25` for 25% VIP off).

### Module 4: Customer Order Login Gate
- Customers can add items to the cart as guests.
- Clicking **"Proceed to Checkout"** checks user login status.
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

### Module 7: Inventory Management & Automatic Stock Deductions
- **Automatic Stock Deduction Engine**: Placed orders automatically reduce raw stocks in SQL based on recipe ingredient weights.
- **Real-Time Threshold Monitoring**: Low-stock banner triggered when ingredients dip below safety thresholds.
- **One-Click Quick Reorder All**: Restocks all depleted items to safe levels instantly.

### Module 8: Recipe Costing & Profit Margin Engine
- Calculates raw portion cost from recipe formulas and compares against menu selling prices.
- Computes Gross Profit Margin (৳) and Food Cost % (e.g. 24.8% Optimal vs. >35% Warning).

### Module 9: Executive Analytics & Reports
- **7-Day Revenue Velocity Chart**: SVG bar chart displaying weekly turnover in Taka (e.g. ৳12.37 Lakh).
- **Dhaka Peak Ordering Hours Heatmap**: Visualizes order density across Lunch (1–2:30 PM), Adda (6 PM), and Dinner Rush (8–10 PM).
- **Top 5 Bestsellers Ranking**: Quantities sold and total revenue contribution.
- **Database JSON Export**: Full database backup downloadable with a single click.

### Module 10: Authentication, Session & Role-Based Access Control (RBAC)
- **Staff Operations Route Guard**: Public guest access is restricted to Menu, Reservations, and Tracking. Navigating to KDS, Inventory, or Analytics shows a **"🔒 Staff Login Required"** lock screen.
- **One-Click Demo Credentials**:
  | Role | Name | Username / Identifier | Password | Permissions |
  | :--- | :--- | :--- | :--- | :--- |
  | 👑 **Admin** | **Sadia Islam Dia** | `admin` | `admin123` | Full access across all modules + Menu CRUD |
  | 👨‍💼 **Manager** | **Sarafat Alam Irfan** | `manager` | `manager123` | Operations, Inventory, Analytics + Menu CRUD |
  | 🍳 **Kitchen** | **Chef Rony** | `kitchen` | `kitchen123` | Kitchen KDS, Recipe Specs, Inventory |
  | 🍽️ **Customer** | **Asif Rahman** | `customer` / `+880 1711-234567` | `customer123` | Menu, Reservations, Order Checkout |
- **Session Persistence**: Stores session in `localStorage` under `flavourcraft_auth_session`. Topbar user profile chip provides profile information and instant Sign Out.

---

## 7. Directory Structure & File Manifest

```
d:/Personal Projects/FlavourCraft/
├── index.html                      # Single-Page Application Master Shell
├── README.md                       # Complete Project Documentation
├── implementation_plan.md          # Technical Architecture & Implementation Plan
├── .gitignore                      # Git ignore rules
├── database/
│   └── flavourcraft_dhaka.sql      # Basic MySQL Schema & Seed Data Script
├── api/
│   ├── config.php                  # Basic Database Connection (PDO)
│   ├── auth.php                    # Basic Authentication & User Management Script
│   ├── menu.php                    # Basic Menu & Availability Script
│   ├── orders.php                  # Basic Orders & KDS Stage Update Script
│   ├── reservations.php            # Basic Table Reservations Script
│   ├── inventory.php               # Basic Inventory Stock & Restock Script
│   └── analytics.php               # Basic Financial & Turnover Analytics Script
├── css/
│   ├── variables.css               # Design tokens, Pinkish Red & Saffron Light Mode
│   ├── style.css                   # Global styles, layout, topbar, theme button
│   ├── menu.css                    # Menu cards, spice meters, customizer drawer
│   ├── ordering.css                # Cart drawer, checkout, live tracking progress
│   ├── reservations.css            # Table booking, seat selector & digital e-pass
│   ├── kds.css                     # Kitchen tickets, urgency timers, audio chimes
│   ├── inventory.css               # Stock table, recipe margins, low-stock alerts
│   ├── analytics.css               # Sales SVG charts, peak hour heatmaps, metric cards
│   ├── rbac.css                    # Role badges & permission indicators
│   └── auth.css                    # Authentication modal, demo pills, dropdown menu & lock screen
└── js/
    ├── db/
    │   ├── mongo-db.js             # Client-side Document Engine (Fallback / Offline)
    │   └── seed-data.js            # Initial dataset (Menu, Stock, Orders, Admin: Sadia Islam Dia)
    ├── api-client.js               # Frontend API Client (PHP & MySQL Backend Bridge)
    ├── store.js                    # Reactive state, Web Audio synthesizer, Auto-deduction, Auth engine
    ├── app.js                      # Main controller, router, theme switcher & toast manager
    └── components/
        ├── auth.js                 # Authentication controller, login modal, registration & staff gate
        ├── menu.js                 # Menu component & item customizer
        ├── reservations.js         # Table reservations & digital ticket generator
        ├── ordering.js             # Checkout with login gate, payment gateways & live tracker
        ├── kds.js                  # Kitchen Display System & recipe specs
        ├── inventory.js            # Stock inventory, recipe costing & restock
        ├── analytics.js            # Analytics charts & JSON DB export
        └── rbac.js                 # Role-based permissions & navigation filtering
```

---

## 8. Quality Verification & Testing Protocol

1. **Light Mode Palette Verification**:
   - Verify all views, headers, cards, tables, inputs, and modals display with the pinkish-red and saffron theme with clear contrast.
2. **Database & Basic SQL Verification**:
   - Verify `database/flavourcraft_dhaka.sql` can be imported cleanly into MySQL.
3. **Basic PHP Backend**:
   - Verify simple PHP scripts handle login, menu retrieval, order saving with stock deduction, and reservation creation.
4. **Ordering & Access Control**:
   - Verify customer checkout requires login/signup and auto-prefills customer data.
   - Verify staff operational views are protected by the staff lock screen.
