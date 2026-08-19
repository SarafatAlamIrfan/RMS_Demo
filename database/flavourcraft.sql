CREATE DATABASE IF NOT EXISTS `flavourcraft` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `flavourcraft`;
SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `categories` WRITE;
INSERT INTO `categories` VALUES 
(1,'Kacchi & Biryani','Kacchi & Biryani','🍛',1),
(2,'Beef, Mutton & Chicken','Beef, Mutton & Chicken','🥩',2),
(3,'Fish & Seafood','Fish & Seafood','🐟',3),
(4,'Kabab & Street Food','Kabab & Street Food','🍢',4),
(5,'Drinks & Desserts','Drinks & Desserts','🍨',5);
UNLOCK TABLES;

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ingredient_uid` varchar(64) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category` varchar(50) NOT NULL,
  `current_stock` decimal(12,2) NOT NULL DEFAULT 0.00,
  `threshold` decimal(12,2) NOT NULL DEFAULT 0.00,
  `unit` varchar(20) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ingredient_uid` (`ingredient_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `inventory` WRITE;
INSERT INTO `inventory` VALUES 
(1,'ing_mutton','Fresh Bengal Mutton Cuts','Meats',18250.00,5000.00,'g',1.10,'2026-08-19 14:51:41'),
(2,'ing_beef','Fresh Bengal Beef Cuts','Meats',22000.00,6000.00,'g',0.85,'2026-08-19 14:46:15'),
(3,'ing_chinigura_rice','Aromatic Dinajpur Chinigura Rice','Grains',44820.00,12000.00,'g',0.16,'2026-08-19 14:51:41'),
(4,'ing_pure_ghee','Baghabari Pure Ghee','Dairy',4170.00,1500.00,'g',1.40,'2026-08-19 14:51:41'),
(5,'ing_aloo_bukhara','Aloo Bukhara & Biryani Spices','Spices',335.00,500.00,'g',4.00,'2026-08-19 14:51:41'),
(6,'ing_potato','Munshiganj Fresh Potatoes','Produce',139.00,40.00,'pcs',15.00,'2026-08-19 14:51:41'),
(7,'ing_ilish_fish','Fresh Padma River Hilsha Fish','Seafood',4600.00,2500.00,'g',2.50,'2026-08-19 14:52:19'),
(8,'ing_mustard_oil','Pure Ghani Mustard Oil','Oils',15975.00,4000.00,'ml',0.35,'2026-08-19 14:52:19'),
(9,'ing_shorshe_paste','Yellow Mustard Paste','Spices',3160.00,1000.00,'g',0.40,'2026-08-19 14:52:19'),
(10,'ing_golda_chingri','Bay of Bengal Jumbo Golda Prawns','Seafood',24.00,35.00,'pcs',220.00,'2026-08-19 14:46:15'),
(11,'ing_coconut_milk','Fresh Coconut Milk','Dairy',8000.00,2500.00,'ml',0.50,'2026-08-19 14:46:15'),
(12,'ing_onion_beresta','Crispy Fried Onion Beresta','Pantry',6500.00,2000.00,'g',0.30,'2026-08-19 14:46:15'),
(13,'ing_fuchka_puri','Crispy Fuchka Shells','Bakery',250.00,80.00,'pcs',3.00,'2026-08-19 14:46:15'),
(14,'ing_chicken_wings','Fresh Chicken Wings','Poultry',18.00,40.00,'pcs',25.00,'2026-08-19 14:46:15');
UNLOCK TABLES;

DROP TABLE IF EXISTS `menu_items`;
CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_uid` varchar(64) NOT NULL,
  `sku` varchar(30) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category_slug` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `tags` varchar(255) DEFAULT '',
  `is_available` tinyint(1) DEFAULT 1,
  `prep_time_minutes` int(11) DEFAULT 10,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_uid` (`item_uid`),
  UNIQUE KEY `sku` (`sku`),
  KEY `category_slug` (`category_slug`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`category_slug`) REFERENCES `categories` (`slug`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `menu_items` WRITE;
INSERT INTO `menu_items` VALUES 
(1,'dish_01','KAC-101','Puran Dhaka Mutton Kacchi Biryani','Kacchi & Biryani',650.00,'Authentic Old Dhaka style tender mutton kacchi with fragrant Chinigura rice, spiced soft aloo, aloo bukhara, and Baghabari pure ghee. Served with cold Borhani.','https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80','100% Halal, Chef Special',1,5,'2026-08-19 14:46:15'),
(2,'dish_02','TEH-102','Old Dhaka Beef Tehari','Kacchi & Biryani',480.00,'Traditional mustard oil beef tehari cooked with aromatic Katari-bhog rice, tender bite-sized beef pieces, whole green chilies, and rich beef broth.','https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80','100% Halal, Spicy',1,5,'2026-08-19 14:46:15'),
(3,'dish_03','ROS-103','Biye Bari Chicken Roast with Polao','Kacchi & Biryani',520.00,'Classic wedding-style sweet & savory thick gravy chicken roast, fragrant ghee rice polao, boiled egg, and crispy mutton jali kabab.','https://i.pinimg.com/564x/f9/e9/48/f9e948bce47ef21a625b58081876797f.jpg','100% Halal',1,8,'2026-08-19 14:46:15'),
(4,'dish_04','BEEF-201','Chittagong Beef Kala Bhuna','Beef, Mutton & Chicken',680.00,'Famous Chattagram style slow-roasted dark caramelized beef curry cooked with roasted radhuni, mustard oil, black pepper, and whole garlic cloves.','https://utshob.com/uploads/product_images/featured_images/beef%20kala%20bhuna_641c10a704363.jfif','100% Halal, Spicy',1,10,'2026-08-19 14:46:15'),
(5,'dish_05','BEEF-202','Sylheti Beef with Shatkora','Beef, Mutton & Chicken',620.00,'Tender beef curry simmered with wild aromatic Sylheti Shatkora citrus fruit, creating a tangy, rich, deeply flavorful gravy.','https://media-cdn2.greatbritishchefs.com/media/x1ifrwul/img81389.whqc_475x317q80.jpg','100% Halal, Spicy',1,10,'2026-08-19 14:46:15'),
(6,'dish_06','FISH-301','Padma River Shorshe Ilish','Fish & Seafood',850.00,'Authentic fresh Padma Hilsha fish cutlet cooked in stone-ground yellow mustard paste, cold-pressed mustard oil, green chilies, and nigella seeds.','https://images.squarespace-cdn.com/content/v1/5ea5f3913b0ccf06d0ec2563/1618436942908-ISHE9NOL0KRM1UCKPC42/Pohela+Boishakh+2021+%2810%29.jpg','100% Halal, Spicy, Gluten-Free',1,12,'2026-08-19 14:46:15'),
(7,'dish_07','FISH-302','Golda Chingri Malai Curry','Fish & Seafood',950.00,'Large freshwater jumbo river prawns cooked in velvety spiced coconut milk gravy with green cardamom, bay leaves, and pure ghee.','https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80','100% Halal, Gluten-Free',1,14,'2026-08-19 14:46:15'),
(8,'dish_08','KAB-401','Special Fuchka & Chotpoti Platter','Kabab & Street Food',220.00,'10 pcs super crispy handmade puchkas filled with spiced yellow dubli dal, mashed potato, tangy tetul-gondhoraj tok, and grated boiled egg.','https://thefinancialexpress.com.bd/_next/image?url=https%3A%2F%2Fthefe-bd.sgp1.cdn.digitaloceanspaces.com%2Fposts%2F153976%2Ffutchka-and-chotpoti.jpg&w=3840&q=75','Vegetarian, 100% Halal, Spicy',1,5,'2026-08-19 14:46:15'),
(9,'dish_09','KAB-402','Chicken Reshmi Kabab with Butter Naan','Kabab & Street Food',420.00,'Tender boneless chicken skewers marinated in cashew cream, egg white, and mild spices, charcoal-grilled and served with hot butter naan & salad.','https://veenaazmanov.com/wp-content/uploads/2018/06/Chicken-Malai-Tikka-Murg-Malai-Kebabs8.jpg','100% Halal',1,12,'2026-08-19 14:46:15'),
(10,'dish_10','KAB-403','Special Naga Crispy Chicken Wings','Kabab & Street Food',380.00,'6 pcs juicy crispy fried chicken wings coated in hot Sylheti Naga Morich pepper glaze and honey.','https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80','100% Halal, Spicy',1,10,'2026-08-19 14:46:15'),
(11,'dish_11','BEV-501','Classic Shahi Borhani','Drinks & Desserts',150.00,'Authentic spiced sour curd digestive drink whipped with bit lobon (black salt), roasted cumin, mustard, mint, and green chilies.','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5-aQFLUNxZG-mTcxBEDwUEvn1_iCwHu1_OyOjn9idao0Y_Ca-XWAtyy8&s=10','Vegetarian, 100% Halal, Gluten-Free',1,2,'2026-08-19 14:46:15'),
(12,'dish_12','BEV-502','Gondhoraj Lebu Shorbot','Drinks & Desserts',120.00,'Super refreshing aromatic Gondhoraj lemon cooler with chilled soda, fresh mint leaves, and a pinch of black salt.','https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80','Vegan, 100% Halal, Gluten-Free',1,2,'2026-08-19 14:46:15'),
(13,'dish_13','DES-601','Special Royal Falooda with Ice Cream','Drinks & Desserts',280.00,'Rich royal dessert layered with rose syrup, sweet vermicelli, tokma (basil seeds), green & red jelly, fresh fruits, and topped with rich vanilla ice cream.','https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80','Vegetarian, 100% Halal',1,4,'2026-08-19 14:46:15'),
(14,'dish_14','DES-602','Bogura Shahi Mishti Doi','Drinks & Desserts',180.00,'Authentic caramelized traditional Bogura sweet curd served chilled in traditional clay pot.','https://images.arla.com/recordid/B019705A-978B-4AB1-A7308E114C562DDB/picture.jpg?width=375&height=469&mode=crop&format=jpg','Vegetarian, 100% Halal',1,2,'2026-08-19 14:46:15'),
(15,'dish_15','DES-603','Sweet Rasmalai Bowl (4 pcs)','Drinks & Desserts',220.00,'Soft cottage cheese chenna balls soaked in thick saffron-cardamom flavored clotted malai milk with chopped pistachios.','uploads/dish_1787163791_8ece2411.jpg','Vegetarian, 100% Halal',1,3,'2026-08-19 14:46:15');
UNLOCK TABLES;

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_uid` varchar(64) NOT NULL,
  `item_uid` varchar(64) NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `modifiers` text DEFAULT NULL,
  `item_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_uid` (`order_uid`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_uid`) REFERENCES `orders` (`order_uid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_uid` varchar(64) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `order_type` enum('Dine-In','Takeaway','Delivery') NOT NULL DEFAULT 'Dine-In',
  `table_number` varchar(20) DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(30) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_vat` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(50) NOT NULL DEFAULT 'Cash',
  `payment_status` enum('Pending','Paid','Refunded') NOT NULL DEFAULT 'Paid',
  `status` enum('New','Preparing','Ready to Serve','Completed','Cancelled') NOT NULL DEFAULT 'New',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_uid` (`order_uid`),
  UNIQUE KEY `order_number` (`order_number`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `recipes`;
CREATE TABLE `recipes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_uid` varchar(64) NOT NULL,
  `menu_item_uid` varchar(64) NOT NULL,
  `portion_yield` int(11) NOT NULL DEFAULT 1,
  `labor_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `overhead_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `recipe_uid` (`recipe_uid`),
  KEY `menu_item_uid` (`menu_item_uid`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`menu_item_uid`) REFERENCES `menu_items` (`item_uid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `recipes` WRITE;
INSERT INTO `recipes` VALUES 
(1,'rec_01','dish_01',1,50.00,30.00),
(2,'rec_02','dish_02',1,40.00,25.00),
(3,'rec_03','dish_04',1,60.00,35.00),
(4,'rec_04','dish_06',1,70.00,40.00),
(5,'rec_05','dish_07',1,80.00,45.00),
(6,'rec_06','dish_08',1,20.00,15.00);
UNLOCK TABLES;

DROP TABLE IF EXISTS `recipe_ingredients`;
CREATE TABLE `recipe_ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_uid` varchar(64) NOT NULL,
  `ingredient_uid` varchar(64) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipe_uid` (`recipe_uid`),
  KEY `ingredient_uid` (`ingredient_uid`),
  CONSTRAINT `recipe_ingredients_ibfk_1` FOREIGN KEY (`recipe_uid`) REFERENCES `recipes` (`recipe_uid`) ON DELETE CASCADE,
  CONSTRAINT `recipe_ingredients_ibfk_2` FOREIGN KEY (`ingredient_uid`) REFERENCES `inventory` (`ingredient_uid`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `recipe_ingredients` WRITE;
INSERT INTO `recipe_ingredients` VALUES 
(1,'rec_01','ing_mutton',250.00,1.10),
(2,'rec_01','ing_chinigura_rice',180.00,0.16),
(3,'rec_01','ing_pure_ghee',30.00,1.40),
(4,'rec_01','ing_potato',1.00,15.00),
(5,'rec_01','ing_aloo_bukhara',15.00,4.00),
(6,'rec_02','ing_beef',200.00,0.85),
(7,'rec_02','ing_chinigura_rice',200.00,0.16),
(8,'rec_02','ing_mustard_oil',40.00,0.35),
(9,'rec_03','ing_beef',350.00,0.85),
(10,'rec_03','ing_mustard_oil',50.00,0.35),
(11,'rec_03','ing_onion_beresta',40.00,0.30),
(12,'rec_04','ing_ilish_fish',200.00,2.50),
(13,'rec_04','ing_shorshe_paste',40.00,0.40),
(14,'rec_04','ing_mustard_oil',25.00,0.35),
(15,'rec_05','ing_golda_chingri',2.00,220.00);
UNLOCK TABLES;

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_uid` varchar(64) NOT NULL,
  `booking_code` varchar(30) NOT NULL,
  `guest_name` varchar(100) NOT NULL,
  `guest_phone` varchar(30) NOT NULL,
  `guest_email` varchar(100) DEFAULT NULL,
  `party_size` int(11) NOT NULL DEFAULT 2,
  `reservation_date` date NOT NULL,
  `time_slot` varchar(20) NOT NULL,
  `table_preference` varchar(100) DEFAULT 'Standard Dining',
  `deposit_paid` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('Confirmed','Pending','Cancelled','Seated') NOT NULL DEFAULT 'Confirmed',
  `special_request` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_uid` (`booking_uid`),
  UNIQUE KEY `booking_code` (`booking_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `reservations` WRITE;
INSERT INTO `reservations` VALUES 
(1,'res_1a2b3c4d','FC-RES-501','Sadia Islam Dia','+880 1710-000001','sadia.dia@flavourcraft.bd',4,'2026-08-25','20:00','VIP Royal Suite (1st Floor)',500.00,'Confirmed','Window side VIP table for anniversary celebration dinner','2026-08-19 14:46:15');
UNLOCK TABLES;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_uid` varchar(64) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` enum('Admin','Manager','Kitchen','Customer') NOT NULL DEFAULT 'Customer',
  `avatar` varchar(50) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_uid` (`user_uid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES 
(1,'usr_admin','admin','admin123','Sadia Islam Dia','Admin','👩‍💼','+880 1710-000001','sadia.dia@flavourcraft.bd','Banani, Dhaka','2026-08-19 14:46:15'),
(2,'usr_manager','manager','manager123','Sarafat Alam Irfan','Manager','👨‍💼','+880 1710-000002','irfan@flavourcraft.bd','Gulshan 2, Dhaka','2026-08-19 14:46:15'),
(3,'usr_kitchen','kitchen','kitchen123','Chef Rony','Kitchen','🍳','+880 1710-000004','rony@flavourcraft.bd','Old Dhaka, Dhaka','2026-08-19 14:46:15'),
(4,'usr_customer','customer','customer123','Arnob Rahman','Customer','🌟','+880 1711-234567','arnob.rahman@gmail.com','House 42, Road 11, Block D, Banani, Dhaka','2026-08-19 14:46:15');
UNLOCK TABLES;

SET FOREIGN_KEY_CHECKS=1;
