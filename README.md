# 🔥 FlavourCraft - Modern Bangladeshi Restaurant Management System

> **Managing Director & Admin**: Sadia Islam Dia  
> **General Restaurant Manager**: Sarafat Alam Irfan  
> **Head Baburchi (Kitchen Chef)**: Chef Rony  
> **Technology Stack**: HTML5, Plain CSS3, Vanilla JavaScript, PHP (Basic / Procedural / PDO), SQL (MySQL)  
> **Themes Supported**: ☀️ Light Mode (Pinkish Red & Saffron Amber)  
> **Currency**: Bangladeshi Taka (৳ / BDT)  
> **Cuisine**: Authentic & Familiar Bangladeshi Restaurant Cuisine  
> **Roles**: 👑 Admin, 👨‍💼 Manager, 🍳 Kitchen Staff, 🌟 Customer, 👤 Guest  

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Technology Stack & Architecture](#-technology-stack--architecture)
3. [Pre-Configured System Accounts](#-pre-configured-system-accounts)
4. [Core Feature Breakdown](#-core-feature-breakdown)
   - [Customer Experience & Digital Dining](#1-customer-experience--digital-dining)
   - [Kitchen Operations & KDS](#2-kitchen-operations--kds)
   - [Admin & Manager Management Hub](#3-admin--manager-management-hub)
   - [User Profile Management](#4-user-profile-management)
5. [Bangladeshi Menu & Food Catalog](#-bangladeshi-menu--food-catalog)
6. [Database Schema & SQL Architecture](#-database-schema--sql-architecture)
7. [Directory Structure](#-directory-structure)
8. [Step-by-Step Tutorial: How to Run the Project](#-step-by-step-tutorial-how-to-run-the-project)
   - [Method 1: Using XAMPP (Standard Apache & phpMyAdmin)](#method-1-using-xampp-standard-apache--phpmyadmin)
   - [Method 2: Using PHP Built-In Server (Fastest CLI Setup)](#method-2-using-php-built-in-server-fastest-cli-setup)
   - [Method 3: How to Access on Mobile Phones / Other Devices (WiFi LAN)](#method-3-how-to-access-on-mobile-phones--other-devices-over-wifi-lan)

---

## 🌟 Project Overview

**FlavourCraft** is an all-in-one, beginner-friendly restaurant operations management platform engineered specifically for traditional and modern Bangladeshi dining establishments. 

Built using core web fundamentals (**HTML, CSS, JS, PHP, SQL**), it delivers a seamless end-to-end experience:
- Digital public dining menu with live category filters and instant dish search.
- Menu Catalog Management (CRUD) with local dish photo file uploads.
- Guest authentication gate & privacy-protected table reservation booking with digital passes.
- Direct-to-kitchen digital ordering with automatic raw ingredient inventory deduction.
- Real-time Kitchen Display System (KDS) with ticket stage bumping for chefs.
- User profile management with customizable avatar icons and delivery addresses.
- Executive revenue analytics & profit margin calculation in Bangladeshi Taka (BDT).

---

## 💻 Technology Stack & Architecture

- **Frontend**: 
  - **HTML5**: Clean, accessible, semantic markup.
  - **Plain CSS3**: Curated color tokens (Pinkish Red `#e11d48` & Saffron `#f59e0b`), CSS Grid, Flexbox, glassmorphism, responsive across desktop and mobile.
  - **Vanilla JavaScript**: Lightweight interactive DOM logic and real-time calculation.
- **Backend (Basic PHP)**:
  - Clean, straightforward PHP scripts using standard **MySQLi** database functions with zero complex frameworks.
  - Basic database queries (SELECT, INSERT, UPDATE, DELETE) with transaction support (`mysqli_begin_transaction`, `mysqli_commit`, `mysqli_rollback`).
- **Database (Basic SQL / MySQL)**:
  - Normalized MySQL schema in `database/flavourcraft.sql`.
  - Normalized tables (`users`, `categories`, `menu_items`, `recipes`, `recipe_ingredients`, `orders`, `order_items`, `reservations`, `inventory`) with foreign keys and complete Bangladeshi seed data for 1-click import in **phpMyAdmin / XAMPP / WAMP**.
- **Media & File Storage**:
  - Native PHP multipart file upload handling saving dish photos to `uploads/`.

---

## 🔐 Pre-Configured System Accounts

FlavourCraft includes 4 role-based accounts ready out-of-the-box:

| Role | Full Name | Username | Password | Access Scope & Permissions |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Admin** | **Sadia Islam Dia** | `admin` | `admin123` | Full access: Menu CRUD, Inventory, Analytics, Staff, Reservations, KDS, Orders. |
| 👨‍💼 **Manager** | **Sarafat Alam Irfan** | `manager` | `manager123` | Operations management: Menu CRUD, Inventory, Reservations, KDS, Analytics. |
| 🍳 **Kitchen** | **Chef Rony** | `kitchen` | `kitchen123` | Kitchen Operations: KDS Live Screen, order stage transitions, Recipe specs. |
| 🌟 **Customer** | **Arnob Rahman** | `customer` | `customer123` | Dining Customer: Browse menu, place orders, book tables, view personal passes & profile. |

---

## 🚀 Core Feature Breakdown

### 1. Customer Experience & Digital Dining
- **Interactive Culinary Menu ([index.php](file:///d:/Personal%20Projects/FlavourCraft/index.php))**:
  - Category filter pills: *🍛 Kacchi & Biryani*, *🥩 Beef, Mutton & Chicken*, *🐟 Fish & Seafood*, *🍢 Kabab & Street Food*, *🍨 Drinks & Desserts*.
  - Instant dish search and prep time badges.
  - 1-click quantity selector and shopping cart integration.
- **Shopping Cart & Checkout ([cart.php](file:///d:/Personal%20Projects/FlavourCraft/cart.php))**:
  - Live subtotal, 5% standard Bangladeshi VAT, and delivery fee calculation.
  - Multi-mode ordering: **Dine-In**, **Takeaway**, and **Home Delivery**.
  - Payment methods: **bKash**, **Nagad / Rocket**, **Visa / Mastercard**, or **Cash on Delivery**.
- **Table Reservation System ([reservations.php](file:///d:/Personal%20Projects/FlavourCraft/reservations.php))**:
  - **Guest Gate**: Requires customers to log in or register before booking a table.
  - **Privacy Filter**: Regular customers only view their own confirmed reservation passes; Admin and Manager view the complete master reservation book.
- **Live Order Progress Tracker ([track_order.php](file:///d:/Personal%20Projects/FlavourCraft/track_order.php))**:
  - Real-time 4-stage visual timeline (*Received* ➔ *Preparing in Kitchen* ➔ *Ready to Serve / Dispatched* ➔ *Completed*).

---

### 2. Kitchen Operations & KDS
- **Kitchen Display System ([kds.php](file:///d:/Personal%20Projects/FlavourCraft/kds.php))**:
  - Restricted strictly to **Admin**, **Manager**, and **Kitchen Staff**.
  - 3-column ticket workflow: *New Incoming*, *In Preparation*, and *Ready for Service*.
  - Stage advance button to notify servers and update customer tracking in real time.

---

### 3. Admin & Manager Management Hub
- **Menu Catalog Management (CRUD) ([menu_manage.php](file:///d:/Personal%20Projects/FlavourCraft/menu_manage.php))**:
  - **Create**: Add new dishes with name, SKU, category, price in ৳ BDT, preparation time, tags, description, and photo.
  - **Read**: Live searchable and filterable dish catalog.
  - **Update**: Edit existing dishes, update prices, change descriptions, or replace photos.
  - **Delete**: Remove discontinued items with confirmation protection.
  - **Photo Upload**: Supports direct image file upload (`.jpg`, `.png`, `.webp`, `.gif`) or external photo URLs.
  - **Stock Status Toggle**: 1-click toggle to mark items *Available* or *Sold Out*.
- **Inventory & Recipe Stock Control ([inventory.php](file:///d:/Personal%20Projects/FlavourCraft/inventory.php))**:
  - Automatic deduction of raw ingredients (e.g. Mutton, Chinigura Rice, Baghabari Ghee, Mustard Oil) whenever orders are placed.
  - Low-stock threshold alerts with 1-click reorder.
  - Recipe costing and gross profit margin percentage analytics.
- **Executive Analytics ([analytics.php](file:///d:/Personal%20Projects/FlavourCraft/analytics.php))**:
  - Total revenue turnover, orders completed, average order value, and top 5 best-selling dishes.
- **Staff Roster Management ([staff.php](file:///d:/Personal%20Projects/FlavourCraft/staff.php))**:
  - Manage employee directory, roles, and shift allocations.

---

### 4. User Profile Management
- **Profile View & Edit ([profile.php](file:///d:/Personal%20Projects/FlavourCraft/profile.php))**:
  - Allows any logged-in user to update their full name, phone number, email address, and home delivery address.
  - Emoji Avatar Selector (👩‍💼, 👨‍💼, 🍳, 🌟, 👑, 🍽️, 🥘, ☕).
  - Optional secure password change.

---

## 🍲 Bangladeshi Menu & Food Catalog

| SKU | Dish Name | Category | Price (BDT) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `KAC-101` | **Puran Dhaka Mutton Kacchi Biryani** | Kacchi & Biryani | **৳650** | Old Dhaka tender mutton kacchi with fragrant Chinigura rice, spiced aloo, and Baghabari pure ghee. |
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

Located in [`database/flavourcraft.sql`](file:///d:/Personal%20Projects/FlavourCraft/database/flavourcraft.sql):
- **`users`**: User records, passwords, roles (`Admin`, `Manager`, `Kitchen`, `Customer`), contact details, avatars, and delivery addresses.
- **`categories`**: Menu categories with slug, display order, and emoji icons.
- **`menu_items`**: Complete culinary catalog with SKU, price, description, image path, tags, and availability flag.
- **`recipes` & `recipe_ingredients`**: Bill of materials per portion mapping dishes to inventory items.
- **`inventory`**: Raw meat, fish, dairy, grain, and spice stock with units, costs, and alert thresholds.
- **`orders` & `order_items`**: Order headers, line items, customer details, status, and payment breakdown.
- **`reservations`**: Table booking records, guest details, party size, dining zone, and status.

---

## 📁 Directory Structure

```
FlavourCraft/
├── config/
│   └── db.php                  # Database connection (PDO MySQL), session starter, helpers
├── includes/
│   ├── header.php              # Global HTML head, fonts, sidebar navigation, topbar, user badge
│   ├── footer.php              # Standard page footer and global closing tags
│   └── auth_check.php          # Route protection & role verification helper
├── css/                        # Responsive CSS stylesheets (Light mode, Rose Pink & Saffron)
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
├── js/
│   └── main.js                 # Frontend interactive scripts
├── uploads/                    # Directory for user-uploaded dish photos
├── database/
│   └── flavourcraft.sql        # Clean, comment-free MySQL schema & complete seed data
├── index.php                   # Digital Menu Catalog & Hero Banner
├── menu_manage.php             # Menu Catalog CRUD + Photo Upload (Admin & Manager)
├── cart.php                    # Shopping Cart, VAT, and Checkout Form
├── cart_action.php             # POST handler: Cart item addition/removal/quantity
├── place_order.php             # POST handler: Processes checkout, creates order, deducts stock
├── reservations.php            # Table Reservations + Auth Gate + Digital Pass
├── track_order.php             # Live Order Progress & Rider Radar Tracker
├── kds.php                     # Kitchen Display System (Admin, Manager, Kitchen)
├── kds_action.php              # POST handler: Advances ticket status
├── inventory.php               # Raw Stock Control & Recipe Costing
├── analytics.php               # Executive Sales & Revenue Analytics
├── staff.php                   # Staff Roster & Employee Directory
├── profile.php                 # User Profile View & Edit (Name, Avatar, Password)
├── login.php                   # Account Sign In & New Customer Registration
├── logout.php                  # Session termination & redirect
└── README.md                   # Project documentation & execution guide
```

---

## 🛠️ Step-by-Step Tutorial: How to Run the Project

### Method 1: Using XAMPP (Standard Apache & phpMyAdmin)

#### Step 1: Install XAMPP
- Download and install XAMPP for Windows, macOS, or Linux from [apachefriends.org](https://www.apachefriends.org/).

#### Step 2: Copy Project to `htdocs`
- Copy or move the entire `FlavourCraft` folder into your XAMPP `htdocs` directory:
  - **Windows**: `C:\xampp\htdocs\FlavourCraft` (or `D:\xampp\htdocs\FlavourCraft`)
  - **macOS**: `/Applications/XAMPP/xamppfiles/htdocs/FlavourCraft`
  - **Linux**: `/opt/lampp/htdocs/FlavourCraft`

#### Step 3: Start Services
- Open the **XAMPP Control Panel**.
- Click **Start** next to **Apache**.
- Click **Start** next to **MySQL**.

#### Step 4: Import Database in phpMyAdmin
1. Open your web browser and go to: `http://localhost/phpmyadmin`
2. In the left sidebar, click **New** to create a database:
   - Database name: `flavourcraft`
   - Collation: `utf8mb4_general_ci`
   - Click **Create**.
3. Select the newly created `flavourcraft` database from the left menu.
4. Click on the **Import** tab at the top.
5. Click **Choose File** (Browse) and select:
   `C:\xampp\htdocs\FlavourCraft\database\flavourcraft.sql`
6. Scroll down and click **Import** (or **Go**).

#### Step 5: Launch the Application
- Open your browser and navigate to:
  ```
  http://localhost/FlavourCraft/index.php
  ```
- Sign in using any of the credentials from the [Accounts Table](#-pre-configured-system-accounts).

---

### Method 2: Using PHP Built-In Server (Fastest CLI Setup)

If you have PHP and MySQL installed (via XAMPP or standalone), you can run FlavourCraft in seconds without configuring virtual hosts:

#### Step 1: Start MySQL Database
- Ensure MySQL is running on port `3306`.
- Import the database if you haven't already:
  ```bash
  mysql -u root -e "CREATE DATABASE IF NOT EXISTS flavourcraft;"
  mysql -u root flavourcraft < "database/flavourcraft.sql"
  ```

#### Step 2: Start PHP Built-In Server
- Open your terminal / command prompt inside the `FlavourCraft` project directory.
- Run:
  ```bash
  php -S localhost:8000
  ```
  *(Or if using XAMPP's PHP on Windows: `& "D:\xampp\php\php.exe" -S localhost:8000`)*

#### Step 3: Open in Browser
- Navigate to:
  ```
  http://localhost:8000/
  ```

---

### Method 3: How to Access on Mobile Phones / Other Devices (over WiFi LAN)

To test and demonstrate the responsive design on mobile phones, tablets, or other laptops connected to the same local network:

1. **Find your Computer's Local IP Address**:
   - **Windows**: Open Command Prompt / PowerShell and type `ipconfig`. Look for the **IPv4 Address** (e.g. `192.168.1.25`).
   - **macOS / Linux**: Open Terminal and type `ifconfig` or `ip a`. Look for `inet 192.168.x.x`.

2. **Start the PHP Server on All Network Interfaces**:
   - Run the server bound to `0.0.0.0`:
     ```bash
     php -S 0.0.0.0:8000
     ```

3. **Open on your Mobile Phone**:
   - Connect your phone to the **same WiFi network** as your computer.
   - Open Chrome / Safari on your phone and browse to:
     ```
     http://192.168.1.25:8000/
     ```
     *(Replace `192.168.1.25` with your computer's actual IPv4 address).*
