# 🔥 FlavourCraft - Modern Bangladeshi Restaurant Management System

> **Managing Director & Admin**: Sadia Islam Dia  
> **Technology Stack**: HTML5, Plain CSS3, Vanilla JavaScript, PHP, SQL (MySQL)  
> **Themes Supported**: ☀️ Light Mode (Pinkish Red & Saffron)  
> **Currency**: Bangladeshi Taka (৳ / BDT)  
> **Cuisine**: Authentic & Familiar Bangladeshi Restaurant Cuisine  
> **Roles**: 👑 Admin, 👩‍💼 Manager, 🍳 Kitchen, 🍽️ Customer  

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Technology Stack & Architecture](#-technology-stack--architecture)
3. [Light Mode Theming (Pinkish Red & Saffron)](#-light-mode-theming-pinkish-red--saffron)
4. [Core Feature Breakdown](#-core-feature-breakdown)
   - [Customer-Facing Portal](#1-customer-facing-portal)
   - [Kitchen & Operations](#2-kitchen--operations)
   - [Admin & Inventory Control](#3-admin--inventory-control)
5. [Bangladeshi Menu & Food Catalog](#-bangladeshi-menu--food-catalog)
6. [Basic Database Schema & SQL Architecture](#-basic-database-schema--sql-architecture)
7. [Basic PHP Backend Architecture](#-basic-php-backend-architecture)
8. [Directory Structure](#-directory-structure)
9. [How to Run (XAMPP / PHP Server & Standalone)](#-how-to-run)

---

## 🌟 Project Overview

**FlavourCraft** is an all-in-one, beginner-friendly restaurant operations platform designed specifically for Bangladeshi dining establishments. It unifies customer online ordering, table bookings with instant digital passes, digital Kitchen Display System (KDS), automated recipe ingredient stock deductions, and executive revenue analytics in Bangladeshi Taka.

---

## 💻 Technology Stack & Architecture

- **Frontend**: 
  - **HTML5**: Semantic, accessible, beginner-friendly markup.
  - **Plain CSS3**: Custom design tokens, CSS Grid/Flexbox, Glassmorphism, animations, responsive design.
  - **Vanilla JavaScript**: Clean, modular ES6 classes with standard `fetch()` API client (`js/api-client.js`).
- **Backend (Basic PHP)**:
  - Clean, straightforward PHP scripts using `PDO` prepared statements with zero complex frameworks.
  - Basic database queries (SELECT, INSERT, UPDATE) with transaction support.
- **Database (Basic SQL / MySQL)**:
  - Normalized MySQL schema in `database/flavourcraft.sql`.
  - Normalized tables (`users`, `categories`, `menu_items`, `recipes`, `recipe_ingredients`, `orders`, `order_items`, `reservations`, `inventory`) with foreign keys and complete Bangladeshi seed data for 1-click import in **phpMyAdmin / XAMPP / WAMP**.
- **Execution Flexibility**:
  - **Server Mode**: Runs on standard Apache / PHP / MySQL stack (XAMPP).
  - **Standalone Mode**: Can also run directly in any web browser for immediate demonstration.

---

## ☀️ Light Mode Theming (Pinkish Red & Saffron)

FlavourCraft features a vibrant **Light Mode** palette designed with **Pinkish Red & Saffron Amber Accents**:
- **Canvas Base**: Soft, clean porcelain background (`#fff5f7` with subtle rose-pink tint).
- **Surface Cards**: Pure white (`#ffffff`) with delicate pink-tinted borders (`#fed7d7` / `#fecdd3`).
- **Brand Accents**: 
  - **Primary Pinkish Red**: `#e11d48` / `#be123c` (Rose Crimson / Naga Red).
  - **Secondary Saffron**: `#f59e0b` / `#d97706` (Warm Saffron Ghee glow).
- **Typography**: Deep charcoal slate (`#0f172a` and `#334155`) for crisp, readable menus and tickets.

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
  - Automated simulated SMS & Email confirmation with unique Booking ID.
- **Ordering & Checkout with Customer Login Gate**:
  - Multi-mode ordering: **Dine-In**, **Takeaway**, and **Dhaka Home Delivery** (৳60 flat fee).
  - Intercepts checkout for unauthenticated guests, requiring login/signup and auto-prefilling customer contact & delivery address upon login.
  - Integrated payment options: **bKash Merchant Pay**, **Nagad / Rocket**, **BRAC / City Bank Visa/Mastercard**, and **Cash on Delivery**.
  - Promo discounts (`DHAKA10`, `KACCHI20`, `GULSHAN25`).
- **Live Order Progress Tracker**:
  - Interactive multi-stage visual timeline (*Order Received* ➔ *Cooking in Handi / Dum* ➔ *Ready to Serve / Out for Delivery* ➔ *Completed*).
  - Delivery rider tracker (Mehedi Hasan #04) and estimated countdown timer.

### 2. Kitchen & Operations
- **Kitchen Display System (KDS)**:
  - 3-column ticket queue (*New Incoming*, *In Preparation*, *Ready for Service*).
  - Dynamic color-coded urgency countdown timers (<10m Green, 10–20m Yellow, >20m Crimson Alert).
  - Web Audio synthetic arrival chimes on new orders.
  - **Line Cook Recipe Specs Modal**: Click *Recipe* on any ticket to view exact portion quantities in grams/milliliters.
  - One-click stage bump buttons.

### 3. Admin & Inventory Control
- **Recipe Costing & Profit Margin Analysis**:
  - Direct recipe-to-ingredient links with real-time food cost and gross profit margin calculations in Taka.
  - Food cost percentage health indicators (e.g. 24.8% Optimal vs. >35% Warning).
- **Automatic Stock Deduction Engine**:
  - Placed orders automatically reduce raw ingredient inventory in SQL via atomic database transactions.
- **Low-Stock Alert System**:
  - Real-time safety threshold monitoring with urgent alert banner.
  - One-click *Quick Reorder All* action to replenish inventory.
- **Executive Analytics & Reports**:
  - 7-day revenue velocity SVG bar chart (e.g. ৳12.37 Lakh turnover).
  - Hourly customer traffic & kitchen rush heatmap.
  - Top 5 best-selling dishes ranking.
- **Authentication, Session & Role-Based Access Control (4 Roles)**:
  - **Customer Order Login Gate**: Guests can browse menu and add dishes to cart freely; clicking *Proceed to Checkout* prompts login/sign-up before confirming.
  - **Staff Operations Gate**: Kitchen KDS, Inventory, and Analytics are locked behind staff authentication.
  - **Pre-Configured Staff & Customer Credentials**:
    | Role | Name | Identifier / Username | Password | Access Scope |
    | :--- | :--- | :--- | :--- | :--- |
    | 👑 **Admin** | **Sadia Islam Dia** | `admin` | `admin123` | Full access across all modules + Menu CRUD |
    | 👨‍💼 **Manager** | **Sarafat Alam Irfan** | `manager` | `manager123` | Operations, Inventory, Analytics + Menu CRUD |
    | 🍳 **Kitchen** | **Chef Rony** | `kitchen` | `kitchen123` | Kitchen KDS, Recipe Specs, Inventory |
    | 🍽️ **Customer** | **Asif Rahman** | `+880 1711-234567` / `customer` | `customer123` | Menu, Reservations, Order Checkout |

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

## 🗄️ Basic Database Schema & SQL Architecture

Located in [`database/flavourcraft.sql`](file:///d:/Personal%20Projects/FlavourCraft/database/flavourcraft.sql):
- `users`: User authentication, 4 roles (Admin Sadia Islam Dia, Manager, Kitchen, Customer), contact & delivery address.
- `categories`: Menu category taxonomy.
- `menu_items`: Complete dish catalog with pricing, tags, and preparation times.
- `recipes` & `recipe_ingredients`: Bill of materials per portion for stock deduction.
- `inventory`: Raw meat, fish, grain, and spice stock levels with safety thresholds.
- `orders` & `order_items`: Customer orders with line items, 5% VAT, and delivery fees.
- `reservations`: Bookings, party sizes, and confirmed dining table tracking.

---

## 🔌 Basic PHP Architecture (Multi-Page Server-Side Rendering)

- `config/db.php`: Database connection via PDO, session starter, and BDT formatting helper.
- `includes/header.php`: Shared HTML header, Google fonts, stylesheets, sidebar navigation, topbar, and cart badge.
- `includes/footer.php`: Shared footer and script tags.
- `includes/auth_check.php`: Basic PHP role-based permission verification.
- `index.php`: Digital Menu catalog with category filter (`?category=...`), search (`?search=...`), and Add to Cart forms.
- `cart.php`: Cart items table, subtotal, VAT 5%, delivery charge calculation, and Bangladeshi checkout form.
- `cart_action.php`: Session cart processor for adding, incrementing, decrementing, and removing dishes.
- `place_order.php`: Processes order `$_POST`, executes PDO transaction to save orders/items, and deducts inventory according to recipe ingredients.
- `reservations.php`: Table booking form with instant digital reservation e-Pass generation.
- `track_order.php`: Live order tracker with status stages (`New` ➔ `Preparing` ➔ `Ready to Serve` ➔ `Completed`), rider radar, and itemized receipt.
- `kds.php`: Kitchen Display System displaying live tickets for chefs with cooking specs.
- `kds_action.php`: Status update processor for advancing kitchen tickets.
- `inventory.php`: Raw ingredient stock management with low-stock alerts and recipe profit margin calculations.
- `analytics.php`: Executive Analytics for Managing Director **Sadia Islam Dia** (SQL SUM/COUNT revenue turnover and dish sales).
- `staff.php`: Staff roster and shift management.
- `login.php`: Credentials login + 1-Click Role Switcher for instant academic demonstration.
- `logout.php`: Session destroy and redirect.

---

## 📁 Directory Structure

```
FlavourCraft/
├── config/
│   └── db.php                  # Database connection (PDO with MySQL localhost/flavourcraft)
├── includes/
│   ├── header.php              # Global HTML <head>, fonts, CSS, Sidebar Navigation & Topbar
│   ├── footer.php              # Common footer, script includes, and closing tags
│   └── auth_check.php          # Session validation helper for protected routes (Admin/Staff)
├── css/                        # Existing rich CSS stylesheets (Light mode, Pinkish Red & Saffron)
│   ├── variables.css
│   ├── style.css
│   ├── menu.css
│   ├── ordering.css
│   ├── reservations.css
│   ├── kds.css
│   ├── inventory.css
│   ├── analytics.css
│   ├── staff.css
│   ├── rbac.css
│   └── auth.css
├── js/                         # Client-side helpers (alerts, DOM utilities)
│   └── main.js
├── database/
│   └── flavourcraft.sql        # Complete relational MySQL schema & seed data
├── index.php                   # Home & Digital Menu Catalog (Category filter, search, customizer)
├── cart.php                    # Shopping cart, subtotal, VAT (5%), delivery, checkout form
├── cart_action.php             # POST processor: add/remove/update cart session items
├── place_order.php             # POST processor: inserts order & order_items, deducts stock, redirects
├── reservations.php            # Table booking page + POST processor for reservation pass
├── track_order.php             # Live Order Tracker (search order by ID, visual step progress)
├── kds.php                     # Kitchen Display System (view live tickets, auto-refresh)
├── kds_action.php              # POST processor: update order status (Cooking, Ready, Dispatched)
├── inventory.php               # Inventory stock management & recipe costing (Admin/Manager)
├── analytics.php               # Executive Analytics (Sadia Islam Dia dashboard with SQL SUM/COUNT metrics)
├── staff.php                   # Staff roster & role-based management
├── login.php                   # Login page (Admin, Chef, Server, Customer switch/credentials)
└── logout.php                  # Destroys PHP session and redirects to index.php
```

---

## 🏁 How to Run on XAMPP / WAMP (Basic PHP)

1. Copy the `FlavourCraft` folder into your XAMPP `htdocs` directory:
   ```
   C:\xampp\htdocs\FlavourCraft
   ```
2. Start **Apache** and **MySQL** in the **XAMPP Control Panel**.
3. Open your browser and go to **phpMyAdmin**:
   ```
   http://localhost/phpmyadmin
   ```
4. Click **Import**, choose the file [`database/flavourcraft.sql`](file:///d:/Personal%20Projects/FlavourCraft/database/flavourcraft.sql), and click **Go**.
5. Open your browser and go to:
   ```
   http://localhost/FlavourCraft/index.php
   ```
