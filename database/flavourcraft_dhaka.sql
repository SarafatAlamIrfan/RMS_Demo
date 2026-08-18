-- ============================================================================
-- FlavourCraft Dhaka - Complete Relational SQL Database Schema & Seed Script
-- Managing Director & Admin: Sadia Islam Dia
-- Currency: Bangladeshi Taka (৳ / BDT)
-- Database Engine: MySQL / MariaDB (Compatible with phpMyAdmin, XAMPP, WAMP)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `flavourcraft_dhaka` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `flavourcraft_dhaka`;

-- Disable foreign key checks during schema creation & data load
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. Table: users (Staff & Customer Accounts)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_uid` VARCHAR(64) UNIQUE NOT NULL,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` ENUM('Admin', 'Manager', 'Cashier', 'Kitchen', 'Delivery', 'Customer') NOT NULL DEFAULT 'Customer',
  `avatar` VARCHAR(20) DEFAULT '👤',
  `phone` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `delivery_address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 2. Table: categories (Menu Categories)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(50) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(20) DEFAULT '🍽️',
  `display_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 3. Table: menu_items (Traditional & Modern Bangladeshi Dishes)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `menu_items`;
CREATE TABLE `menu_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `item_uid` VARCHAR(64) UNIQUE NOT NULL,
  `sku` VARCHAR(30) UNIQUE NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `category_slug` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `description` TEXT,
  `image_url` TEXT,
  `tags` VARCHAR(255) DEFAULT '',
  `spice_level` INT DEFAULT 0,
  `is_available` TINYINT(1) DEFAULT 1,
  `prep_time_minutes` INT DEFAULT 10,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_slug`) REFERENCES `categories` (`slug`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 4. Table: inventory (Raw Ingredients & Spices)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ingredient_uid` VARCHAR(64) UNIQUE NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `current_stock` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `threshold` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `unit` VARCHAR(20) NOT NULL,
  `cost_per_unit` DECIMAL(10,2) NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 5. Table: recipes (Recipe Formulations for Dishes)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `recipes`;
CREATE TABLE `recipes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipe_uid` VARCHAR(64) UNIQUE NOT NULL,
  `menu_item_uid` VARCHAR(64) NOT NULL,
  `dish_name` VARCHAR(150) NOT NULL,
  `selling_price` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`menu_item_uid`) REFERENCES `menu_items` (`item_uid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 6. Table: recipe_ingredients (Bill of Materials per Portion)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `recipe_ingredients`;
CREATE TABLE `recipe_ingredients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipe_uid` VARCHAR(64) NOT NULL,
  `ingredient_uid` VARCHAR(64) NOT NULL,
  `ingredient_name` VARCHAR(150) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `unit_cost` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`recipe_uid`) REFERENCES `recipes` (`recipe_uid`) ON DELETE CASCADE,
  FOREIGN KEY (`ingredient_uid`) REFERENCES `inventory` (`ingredient_uid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 7. Table: dining_tables (2D Floor Table Nodes)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `dining_tables`;
CREATE TABLE `dining_tables` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `table_uid` VARCHAR(64) UNIQUE NOT NULL,
  `table_number` VARCHAR(20) UNIQUE NOT NULL,
  `capacity` INT NOT NULL DEFAULT 4,
  `shape` ENUM('square', 'round', 'booth') DEFAULT 'square',
  `zone` VARCHAR(50) NOT NULL,
  `status` ENUM('available', 'occupied', 'reserved', 'dirty') DEFAULT 'available',
  `current_order_id` VARCHAR(64) DEFAULT NULL,
  `reserved_for` VARCHAR(150) DEFAULT NULL,
  `active_server` VARCHAR(100) DEFAULT 'Tanvir'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 8. Table: orders (Customer & POS Orders)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_uid` VARCHAR(64) UNIQUE NOT NULL,
  `order_number` VARCHAR(50) UNIQUE NOT NULL,
  `order_type` ENUM('Dine-In', 'Takeaway', 'Delivery') NOT NULL DEFAULT 'Dine-In',
  `table_number` VARCHAR(20) DEFAULT NULL,
  `delivery_address` TEXT DEFAULT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tax_vat` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `service_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `delivery_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `payment_method` VARCHAR(50) DEFAULT 'bKash',
  `payment_status` ENUM('Pending', 'Paid', 'Refunded') DEFAULT 'Paid',
  `status` ENUM('New', 'Preparing', 'Ready to Serve', 'Out for Delivery', 'Completed') DEFAULT 'New',
  `driver_name` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 9. Table: order_items (Items inside an Order)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_uid` VARCHAR(64) NOT NULL,
  `item_uid` VARCHAR(64) NOT NULL,
  `item_name` VARCHAR(150) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `modifiers` TEXT DEFAULT NULL,
  `item_total` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_uid`) REFERENCES `orders` (`order_uid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 10. Table: reservations (Table Bookings & e-Passes)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_uid` VARCHAR(64) UNIQUE NOT NULL,
  `booking_code` VARCHAR(50) UNIQUE NOT NULL,
  `guest_name` VARCHAR(100) NOT NULL,
  `guest_phone` VARCHAR(30) NOT NULL,
  `guest_email` VARCHAR(100) NOT NULL,
  `party_size` INT NOT NULL DEFAULT 2,
  `reservation_date` DATE NOT NULL,
  `time_slot` VARCHAR(20) NOT NULL,
  `table_preference` VARCHAR(50) NOT NULL,
  `assigned_table` VARCHAR(20) DEFAULT NULL,
  `deposit_paid` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Confirmed', 'Pending', 'Cancelled', 'Completed') DEFAULT 'Confirmed',
  `special_request` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 11. Table: food_waste (Kitchen Spoilage & Loss Tracker)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `food_waste`;
CREATE TABLE `food_waste` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `waste_uid` VARCHAR(64) UNIQUE NOT NULL,
  `ingredient_uid` VARCHAR(64) NOT NULL,
  `ingredient_name` VARCHAR(150) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `reason` VARCHAR(100) NOT NULL,
  `cost_loss` DECIMAL(10,2) NOT NULL,
  `logged_by` VARCHAR(100) DEFAULT 'Chef Rony',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ingredient_uid`) REFERENCES `inventory` (`ingredient_uid`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Enable foreign key checks after table creation
SET FOREIGN_KEY_CHECKS = 1;


-- ============================================================================
-- SEED DATA (Bangladeshi Traditional & Modern Dhaka Restaurant Dataset)
-- ============================================================================

-- Categories
INSERT INTO `categories` (`slug`, `name`, `icon`, `display_order`) VALUES
('Kacchi & Biryani', 'Kacchi & Biryani', '🍚', 1),
('Beef, Mutton & Chicken', 'Beef, Mutton & Chicken', '🥩', 2),
('Fish & Seafood', 'Fish & Seafood', '🐟', 3),
('Kabab & Street Food', 'Kabab & Street Food', '🍢', 4),
('Drinks & Desserts', 'Drinks & Desserts', '🍮', 5);

-- Users (Admin Sadia Islam Dia, Staff & Customers)
INSERT INTO `users` (`user_uid`, `username`, `password`, `name`, `role`, `avatar`, `phone`, `email`, `delivery_address`) VALUES
('usr_admin', 'admin', 'admin123', 'Sadia Islam Dia', 'Admin', '👩‍💼', '+880 1710-000001', 'sadia.dia@flavourcraft.bd', 'Banani, Dhaka'),
('usr_manager', 'manager', 'manager123', 'Tanima Ahmed (Floor Lead)', 'Manager', '👩‍💻', '+880 1710-000002', 'tanima@flavourcraft.bd', 'Gulshan 2, Dhaka'),
('usr_cashier', 'cashier', 'cashier123', 'Shakib Al Hasan (POS Lead)', 'Cashier', '🧑‍💻', '+880 1710-000003', 'shakib@flavourcraft.bd', 'Dhanmondi, Dhaka'),
('usr_kitchen', 'kitchen', 'kitchen123', 'Chef Rony (Biryani Ustad)', 'Kitchen', '🍳', '+880 1710-000004', 'rony@flavourcraft.bd', 'Old Dhaka, Dhaka'),
('usr_rider', 'rider', 'rider123', 'Mehedi Hasan (Rider #04)', 'Delivery', '🛵', '+880 1710-000005', 'mehedi@flavourcraft.bd', 'Mirpur, Dhaka'),
('usr_customer_asif', 'customer', 'customer123', 'Asif Rahman', 'Customer', '🍽️', '+880 1711-234567', 'asif.rahman@gmail.com', 'House 42, Road 11, Block D, Banani, Dhaka');

-- 15 Authentic Dishes in Taka
INSERT INTO `menu_items` (`item_uid`, `sku`, `name`, `category_slug`, `price`, `description`, `image_url`, `tags`, `spice_level`, `is_available`, `prep_time_minutes`) VALUES
('dish_01', 'KAC-101', 'Puran Dhaka Mutton Kacchi Biryani', 'Kacchi & Biryani', 650.00, 'Authentic Old Dhaka style tender mutton kacchi with fragrant Chinigura rice, spiced soft aloo, aloo bukhara, and Baghabari pure ghee. Served with cold Borhani.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', '100% Halal, Chef Special', 1, 1, 5),
('dish_02', 'TEH-102', 'Old Dhaka Beef Tehari', 'Kacchi & Biryani', 480.00, 'Traditional mustard oil beef tehari cooked with aromatic Katari-bhog rice, tender bite-sized beef pieces, whole green chilies, and rich beef broth.', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80', '100% Halal, Spicy', 2, 1, 5),
('dish_03', 'ROS-103', 'Biye Bari Chicken Roast with Polao', 'Kacchi & Biryani', 520.00, 'Classic wedding-style sweet & savory thick gravy chicken roast, fragrant ghee rice polao, boiled egg, and crispy mutton jali kabab.', 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80', '100% Halal', 1, 1, 8),
('dish_04', 'BEEF-201', 'Chittagong Beef Kala Bhuna', 'Beef, Mutton & Chicken', 680.00, 'Famous Chattagram style slow-roasted dark caramelized beef curry cooked with roasted radhuni, mustard oil, black pepper, and whole garlic cloves.', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', '100% Halal, Spicy', 3, 1, 10),
('dish_05', 'BEEF-202', 'Sylheti Beef with Shatkora', 'Beef, Mutton & Chicken', 620.00, 'Tender beef curry simmered with wild aromatic Sylheti Shatkora citrus fruit, creating a tangy, rich, deeply flavorful gravy.', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=80', '100% Halal, Spicy', 2, 1, 10),
('dish_06', 'FISH-301', 'Padma River Shorshe Ilish', 'Fish & Seafood', 850.00, 'Authentic fresh Padma Hilsha fish cutlet cooked in stone-ground yellow mustard paste, cold-pressed mustard oil, green chilies, and nigella seeds.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80', '100% Halal, Spicy, Gluten-Free', 2, 1, 12),
('dish_07', 'FISH-302', 'Golda Chingri Malai Curry', 'Fish & Seafood', 950.00, 'Large freshwater jumbo river prawns cooked in velvety spiced coconut milk gravy with green cardamom, bay leaves, and pure ghee.', 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80', '100% Halal, Gluten-Free', 1, 1, 14),
('dish_08', 'KAB-401', 'Special Crispy Fuchka & Chotpoti Platter', 'Kabab & Street Food', 220.00, '10 pcs super crispy handmade puchkas filled with spiced yellow dubli dal, mashed potato, tangy tetul-gondhoraj tok, and grated boiled egg.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', 'Vegetarian, 100% Halal, Spicy', 2, 1, 5),
('dish_09', 'KAB-402', 'Chicken Reshmi Kabab with Butter Naan', 'Kabab & Street Food', 420.00, 'Tender boneless chicken skewers marinated in cashew cream, egg white, and mild spices, charcoal-grilled and served with hot butter naan & salad.', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80', '100% Halal', 1, 1, 12),
('dish_10', 'KAB-403', 'Special Naga Crispy Chicken Wings', 'Kabab & Street Food', 380.00, '6 pcs juicy crispy fried chicken wings coated in hot Sylheti Naga Morich pepper glaze and honey.', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80', '100% Halal, Spicy', 3, 1, 10),
('dish_11', 'BEV-501', 'Classic Shahi Borhani', 'Drinks & Desserts', 150.00, 'Authentic spiced sour curd digestive drink whipped with bit lobon (black salt), roasted cumin, mustard, mint, and green chilies.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80', 'Vegetarian, 100% Halal, Gluten-Free', 1, 1, 2),
('dish_12', 'BEV-502', 'Gondhoraj Lebu Shorbot', 'Drinks & Desserts', 120.00, 'Super refreshing aromatic Gondhoraj lemon cooler with chilled soda, fresh mint leaves, and a pinch of black salt.', 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80', 'Vegan, 100% Halal, Gluten-Free', 0, 1, 2),
('dish_13', 'DES-601', 'Special Royal Falooda with Ice Cream', 'Drinks & Desserts', 280.00, 'Rich royal dessert layered with rose syrup, sweet vermicelli, tokma (basil seeds), green & red jelly, fresh fruits, and topped with rich vanilla ice cream.', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80', 'Vegetarian, 100% Halal', 0, 1, 4),
('dish_14', 'DES-602', 'Bogura Shahi Mishti Doi', 'Drinks & Desserts', 180.00, 'Authentic caramelized traditional Bogura sweet curd served chilled in traditional clay pot.', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80', 'Vegetarian, 100% Halal', 0, 1, 2),
('dish_15', 'DES-603', 'Sweet Rasmalai Bowl (4 pcs)', 'Drinks & Desserts', 220.00, 'Soft cottage cheese chenna balls soaked in thick saffron-cardamom flavored clotted malai milk with chopped pistachios.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80', 'Vegetarian, 100% Halal', 0, 1, 3);

-- Raw Ingredients Inventory
INSERT INTO `inventory` (`ingredient_uid`, `name`, `category`, `current_stock`, `threshold`, `unit`, `cost_per_unit`) VALUES
('ing_mutton', 'Fresh Bengal Mutton Cuts', 'Meats', 18500.00, 5000.00, 'g', 1.10),
('ing_beef', 'Fresh Bengal Beef Cuts', 'Meats', 22000.00, 6000.00, 'g', 0.85),
('ing_chinigura_rice', 'Aromatic Dinajpur Chinigura Rice', 'Grains', 45000.00, 12000.00, 'g', 0.16),
('ing_pure_ghee', 'Baghabari Pure Ghee', 'Dairy', 4200.00, 1500.00, 'g', 1.40),
('ing_aloo_bukhara', 'Aloo Bukhara & Biryani Spices', 'Spices', 350.00, 500.00, 'g', 4.00),
('ing_potato', 'Munshiganj Fresh Potatoes', 'Produce', 140.00, 40.00, 'pcs', 15.00),
('ing_ilish_fish', 'Fresh Padma River Hilsha Fish', 'Seafood', 4800.00, 2500.00, 'g', 2.50),
('ing_mustard_oil', 'Pure Ghani Mustard Oil', 'Oils', 16000.00, 4000.00, 'ml', 0.35),
('ing_shorshe_paste', 'Yellow Mustard Paste', 'Spices', 3200.00, 1000.00, 'g', 0.40),
('ing_golda_chingri', 'Bay of Bengal Jumbo Golda Prawns', 'Seafood', 24.00, 35.00, 'pcs', 220.00),
('ing_coconut_milk', 'Fresh Coconut Milk', 'Dairy', 8000.00, 2500.00, 'ml', 0.50),
('ing_onion_beresta', 'Crispy Fried Onion Beresta', 'Pantry', 6500.00, 2000.00, 'g', 0.30),
('ing_fuchka_puri', 'Crispy Fuchka Shells', 'Bakery', 250.00, 80.00, 'pcs', 3.00),
('ing_chicken_wings', 'Fresh Chicken Wings', 'Poultry', 18.00, 40.00, 'pcs', 25.00);

-- Recipes & Bill of Materials
INSERT INTO `recipes` (`recipe_uid`, `menu_item_uid`, `dish_name`, `selling_price`) VALUES
('rec_kacchi', 'dish_01', 'Puran Dhaka Mutton Kacchi Biryani', 650.00),
('rec_tehari', 'dish_02', 'Old Dhaka Beef Tehari', 480.00),
('rec_kala_bhuna', 'dish_04', 'Chittagong Beef Kala Bhuna', 680.00),
('rec_shorshe_ilish', 'dish_06', 'Padma River Shorshe Ilish', 850.00),
('rec_chingri_malai', 'dish_07', 'Golda Chingri Malai Curry', 950.00),
('rec_fuchka', 'dish_08', 'Special Crispy Fuchka & Chotpoti Platter', 220.00);

INSERT INTO `recipe_ingredients` (`recipe_uid`, `ingredient_uid`, `ingredient_name`, `quantity`, `unit`, `unit_cost`) VALUES
('rec_kacchi', 'ing_mutton', 'Fresh Bengal Mutton Cuts', 250.00, 'g', 1.10),
('rec_kacchi', 'ing_chinigura_rice', 'Chinigura Rice', 180.00, 'g', 0.16),
('rec_kacchi', 'ing_pure_ghee', 'Baghabari Pure Ghee', 30.00, 'g', 1.40),
('rec_kacchi', 'ing_potato', 'Biryani Aloo', 1.00, 'pcs', 15.00),
('rec_kacchi', 'ing_aloo_bukhara', 'Aloo Bukhara & Spices', 15.00, 'g', 4.00),
('rec_tehari', 'ing_beef', 'Fresh Beef Cuts', 200.00, 'g', 0.85),
('rec_tehari', 'ing_chinigura_rice', 'Chinigura Rice', 180.00, 'g', 0.16),
('rec_tehari', 'ing_mustard_oil', 'Mustard Oil', 30.00, 'ml', 0.35),
('rec_kala_bhuna', 'ing_beef', 'Fresh Beef Cuts', 300.00, 'g', 0.85),
('rec_kala_bhuna', 'ing_mustard_oil', 'Mustard Oil', 35.00, 'ml', 0.35),
('rec_kala_bhuna', 'ing_onion_beresta', 'Fried Onion Beresta', 50.00, 'g', 0.30),
('rec_shorshe_ilish', 'ing_ilish_fish', 'Padma Hilsha Fish Cutlet', 200.00, 'g', 2.50),
('rec_shorshe_ilish', 'ing_mustard_oil', 'Mustard Oil', 25.00, 'ml', 0.35),
('rec_shorshe_ilish', 'ing_shorshe_paste', 'Yellow Mustard Paste', 40.00, 'g', 0.40),
('rec_chingri_malai', 'ing_golda_chingri', 'Jumbo Golda Prawns', 2.00, 'pcs', 220.00),
('rec_chingri_malai', 'ing_coconut_milk', 'Coconut Milk Cream', 120.00, 'ml', 0.50),
('rec_fuchka', 'ing_fuchka_puri', 'Crispy Fuchka Puris', 10.00, 'pcs', 3.00),
('rec_fuchka', 'ing_potato', 'Mashed Spiced Potato & Dubli', 120.00, 'g', 0.25);

-- 12 Dining Tables
INSERT INTO `dining_tables` (`table_uid`, `table_number`, `capacity`, `shape`, `zone`, `status`, `active_server`) VALUES
('tbl_01', 'T-01', 2, 'square', 'Main Dining Hall', 'available', 'Tanvir'),
('tbl_02', 'T-02', 2, 'square', 'Main Dining Hall', 'occupied', 'Tanvir'),
('tbl_03', 'T-03', 4, 'booth', 'Main Dining Hall', 'occupied', 'Anika'),
('tbl_04', 'T-04', 4, 'booth', 'Main Dining Hall', 'available', 'Anika'),
('tbl_05', 'T-05', 4, 'square', 'Family Lounge', 'reserved', 'Rifat'),
('tbl_06', 'T-06', 4, 'square', 'Family Lounge', 'available', 'Rifat'),
('tbl_07', 'T-07', 6, 'round', 'Family Lounge', 'dirty', 'Rifat'),
('tbl_08', 'T-08', 2, 'round', 'Terrace Patio', 'available', 'Nusrat'),
('tbl_09', 'T-09', 4, 'square', 'Terrace Patio', 'occupied', 'Nusrat'),
('tbl_10', 'T-10', 4, 'square', 'Terrace Patio', 'available', 'Nusrat'),
('tbl_11', 'VIP-1', 8, 'booth', 'VIP Banquet Salon', 'reserved', 'Chef Rony'),
('tbl_12', 'VIP-2', 12, 'booth', 'VIP Banquet Salon', 'available', 'Chef Rony');

-- Sample Confirmed Reservations
INSERT INTO `reservations` (`booking_uid`, `booking_code`, `guest_name`, `guest_phone`, `guest_email`, `party_size`, `reservation_date`, `time_slot`, `table_preference`, `assigned_table`, `deposit_paid`, `status`, `special_request`) VALUES
('res_01', 'FC-DHK-801', 'Farhan Kabir', '+880 1712-998877', 'farhan.kabir@gmail.com', 4, CURDATE(), '20:00', 'Family Lounge', 'T-05', 500.00, 'Confirmed', 'Family dinner. Extra spicy kacchi biryani & borhani setup.');
