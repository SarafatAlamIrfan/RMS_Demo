/**
 * FlavourCraft - Authentic Bangladeshi Popular & Familiar Restaurant Cuisine
 * Admin: Sadia Islam Dia
 * All Pricing in Bangladeshi Taka (৳ / BDT)
 */

window.SEED_DATA = {
  menu: [
    // 1. Bengali Food
    {
      _id: 'dish_01',
      sku: 'KAC-101',
      name: 'Puran Dhaka Mutton Kacchi Biryani',
      category: 'Bengali Food',
      price: 650,
      description: 'Authentic Old Dhaka style tender mutton kacchi with fragrant Chinigura rice, spiced soft aloo, aloo bukhara, and Baghabari pure ghee. Served with cold Borhani.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal', 'Chef Special'],
      spiceLevel: 1,
      isAvailable: true,
      recipeId: 'rec_kacchi',
      prepTimeMinutes: 5
    },
    {
      _id: 'dish_02',
      sku: 'TEH-102',
      name: 'Old Dhaka Beef Tehari',
      category: 'Bengali Food',
      price: 480,
      description: 'Traditional mustard oil beef tehari cooked with aromatic Katari-bhog rice, tender bite-sized beef pieces, whole green chilies, and rich beef broth.',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal', 'Spicy'],
      spiceLevel: 2,
      isAvailable: true,
      recipeId: 'rec_tehari',
      prepTimeMinutes: 5
    },
    {
      _id: 'dish_03',
      sku: 'ROS-103',
      name: 'Biye Bari Chicken Roast with Polao',
      category: 'Bengali Food',
      price: 520,
      description: 'Classic wedding-style sweet & savory thick gravy chicken roast, fragrant ghee rice polao, boiled egg, and crispy mutton jali kabab.',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal'],
      spiceLevel: 1,
      isAvailable: true,
      recipeId: 'rec_morog_polao',
      prepTimeMinutes: 8
    },
    {
      _id: 'dish_04',
      sku: 'BEEF-201',
      name: 'Chittagong Beef Kala Bhuna',
      category: 'Bengali Food',
      price: 680,
      description: 'Famous Chattagram style slow-roasted dark caramelized beef curry cooked with roasted radhuni, mustard oil, black pepper, and whole garlic cloves.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal', 'Spicy'],
      spiceLevel: 3,
      isAvailable: true,
      recipeId: 'rec_kala_bhuna',
      prepTimeMinutes: 10
    },
    {
      _id: 'dish_05',
      sku: 'BEEF-202',
      name: 'Sylheti Beef with Shatkora',
      category: 'Bengali Food',
      price: 620,
      description: 'Tender beef curry simmered with wild aromatic Sylheti Shatkora citrus fruit, creating a tangy, rich, deeply flavorful gravy.',
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal', 'Spicy'],
      spiceLevel: 2,
      isAvailable: true,
      recipeId: 'rec_shatkora_beef',
      prepTimeMinutes: 10
    },
    {
      _id: 'dish_06',
      sku: 'FISH-301',
      name: 'Padma River Shorshe Ilish',
      category: 'Bengali Food',
      price: 850,
      description: 'Authentic fresh Padma Hilsha fish cutlet cooked in stone-ground yellow mustard paste, cold-pressed mustard oil, green chilies, and nigella seeds (kalojeera).',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal', 'Spicy', 'Gluten-Free'],
      spiceLevel: 2,
      isAvailable: true,
      recipeId: 'rec_shorshe_ilish',
      prepTimeMinutes: 12
    },
    {
      _id: 'dish_07',
      sku: 'FISH-302',
      name: 'Golda Chingri Malai Curry',
      category: 'Bengali Food',
      price: 950,
      description: 'Large freshwater jumbo river prawns cooked in velvety spiced coconut milk gravy with green cardamom, bay leaves, and pure ghee.',
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal', 'Gluten-Free'],
      spiceLevel: 1,
      isAvailable: true,
      recipeId: 'rec_chingri_malai',
      prepTimeMinutes: 14
    },

    // 2. Chinese
    {
      _id: 'dish_chn_01',
      sku: 'CHN-701',
      name: 'Szechuan Chilli Chicken (Gravy)',
      category: 'Chinese',
      price: 540,
      description: 'Crispy fried boneless chicken tossed in wok with dark soya, fiery chili paste, garlic, and fresh bell peppers.',
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal', 'Spicy'],
      spiceLevel: 2,
      isAvailable: true,
      recipeId: 'rec_chilli_chicken',
      prepTimeMinutes: 12
    },
    {
      _id: 'dish_chn_02',
      sku: 'CHN-702',
      name: 'Yangchow Special Mixed Fried Rice',
      category: 'Chinese',
      price: 460,
      description: 'Classic wok-tossed long-grain fried rice with chicken chunks, tender prawns, scrambled egg ribbons, and scallions.',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal'],
      spiceLevel: 1,
      isAvailable: true,
      recipeId: 'rec_fried_rice',
      prepTimeMinutes: 10
    },
    {
      _id: 'dish_chn_03',
      sku: 'CHN-703',
      name: 'Sizzling Beef with Black Pepper',
      category: 'Chinese',
      price: 620,
      description: 'Tender marinated sliced beef tossed in rich crushed black pepper glaze, served hot with onions and mushrooms.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal', 'Spicy'],
      spiceLevel: 2,
      isAvailable: true,
      recipeId: 'rec_sizzling_beef',
      prepTimeMinutes: 12
    },
    {
      _id: 'dish_chn_04',
      sku: 'CHN-704',
      name: 'Prawn Hakka Chowmein Noodles',
      category: 'Chinese',
      price: 480,
      description: 'Wok-charred egg noodles tossed with fresh Bay of Bengal prawns, crunchy cabbage, carrots, capsicum, and dark soy.',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal'],
      spiceLevel: 1,
      isAvailable: true,
      recipeId: 'rec_chowmein',
      prepTimeMinutes: 10
    },

    // 3. Appetizer
    {
      _id: 'dish_08',
      sku: 'KAB-401',
      name: 'Special Crispy Fuchka & Chotpoti Platter',
      category: 'Appetizer',
      price: 220,
      description: '10 pcs super crispy handmade puchkas filled with spiced yellow dubli dal, mashed potato, tangy tetul-gondhoraj tok, and grated boiled egg.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      tags: ['Vegetarian', '100% Halal', 'Spicy'],
      spiceLevel: 2,
      isAvailable: true,
      recipeId: 'rec_fuchka',
      prepTimeMinutes: 5
    },
    {
      _id: 'dish_09',
      sku: 'KAB-402',
      name: 'Chicken Reshmi Kabab with Butter Naan',
      category: 'Appetizer',
      price: 420,
      description: 'Tender boneless chicken skewers marinated in cashew cream, egg white, and mild spices, charcoal-grilled and served with hot butter naan & salad.',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal'],
      spiceLevel: 1,
      isAvailable: true,
      recipeId: 'rec_reshmi_kabab',
      prepTimeMinutes: 12
    },
    {
      _id: 'dish_10',
      sku: 'KAB-403',
      name: 'Special Naga Crispy Chicken Wings',
      category: 'Appetizer',
      price: 380,
      description: '6 pcs juicy crispy fried chicken wings coated in hot Sylheti Naga Morich pepper glaze and honey.',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal', 'Spicy'],
      spiceLevel: 3,
      isAvailable: true,
      recipeId: 'rec_naga_wings',
      prepTimeMinutes: 10
    },
    {
      _id: 'dish_app_04',
      sku: 'APP-801',
      name: 'Crispy Golden Prawn Wontons (6 pcs)',
      category: 'Appetizer',
      price: 340,
      description: 'Deep-fried golden wonton pockets filled with seasoned minced prawns and green onions, served with sweet chili sauce.',
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
      tags: ['100% Halal'],
      spiceLevel: 1,
      isAvailable: true,
      recipeId: 'rec_wontons',
      prepTimeMinutes: 8
    },

    // 4. Drinks & Coffee
    {
      _id: 'dish_11',
      sku: 'BEV-501',
      name: 'Classic Shahi Borhani',
      category: 'Drinks & Coffee',
      price: 150,
      description: 'Authentic spiced sour curd digestive drink whipped with bit lobon (black salt), roasted cumin, mustard, mint, and green chilies.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
      tags: ['Vegetarian', '100% Halal', 'Gluten-Free'],
      spiceLevel: 1,
      isAvailable: true,
      recipeId: 'rec_borhani',
      prepTimeMinutes: 2
    },
    {
      _id: 'dish_12',
      sku: 'BEV-502',
      name: 'Gondhoraj Lebu Shorbot',
      category: 'Drinks & Coffee',
      price: 120,
      description: 'Super refreshing aromatic Gondhoraj lemon cooler with chilled soda, fresh mint leaves, and a pinch of black salt.',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80',
      tags: ['Vegan', '100% Halal', 'Gluten-Free'],
      spiceLevel: 0,
      isAvailable: true,
      recipeId: 'rec_gondhoraj_cooler',
      prepTimeMinutes: 2
    },
    {
      _id: 'dish_bev_03',
      sku: 'COF-901',
      name: 'Freshly Brewed Hot Cappuccino',
      category: 'Drinks & Coffee',
      price: 220,
      description: 'Steaming rich espresso pulled from 100% Arabica beans, topped with thick velvety steamed milk foam and cocoa dusting.',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80',
      tags: ['Vegetarian', '100% Halal'],
      spiceLevel: 0,
      isAvailable: true,
      recipeId: 'rec_cappuccino',
      prepTimeMinutes: 4
    },
    {
      _id: 'dish_bev_04',
      sku: 'COF-902',
      name: 'Dhaka Iced Caramel Cold Coffee',
      category: 'Drinks & Coffee',
      price: 260,
      description: 'Chilled blended espresso with whole milk, vanilla bean ice cream, and handcrafted dark caramel swirl.',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
      tags: ['Vegetarian', '100% Halal'],
      spiceLevel: 0,
      isAvailable: true,
      recipeId: 'rec_iced_coffee',
      prepTimeMinutes: 4
    },

    // 5. Dessert
    {
      _id: 'dish_13',
      sku: 'DES-601',
      name: 'Special Royal Falooda with Ice Cream',
      category: 'Dessert',
      price: 280,
      description: 'Rich royal dessert layered with rose syrup, sweet vermicelli, tokma (basil seeds), green & red jelly, fresh fruits, and topped with rich vanilla ice cream.',
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
      tags: ['Vegetarian', '100% Halal'],
      spiceLevel: 0,
      isAvailable: true,
      recipeId: 'rec_falooda',
      prepTimeMinutes: 4
    },
    {
      _id: 'dish_14',
      sku: 'DES-602',
      name: 'Bogura Shahi Mishti Doi',
      category: 'Dessert',
      price: 180,
      description: 'Authentic caramelized traditional Bogura sweet curd served chilled in traditional clay pot.',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
      tags: ['Vegetarian', '100% Halal'],
      spiceLevel: 0,
      isAvailable: true,
      recipeId: 'rec_mishti_doi',
      prepTimeMinutes: 2
    },
    {
      _id: 'dish_15',
      sku: 'DES-603',
      name: 'Sweet Rasmalai Bowl (4 pcs)',
      category: 'Dessert',
      price: 220,
      description: 'Soft cottage cheese chenna balls soaked in thick saffron-cardamom flavored clotted malai milk with chopped pistachios.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      tags: ['Vegetarian', '100% Halal'],
      spiceLevel: 0,
      isAvailable: true,
      recipeId: 'rec_rasmalai',
      prepTimeMinutes: 3
    }
  ],

  recipes: [
    {
      _id: 'rec_kacchi',
      dishId: 'dish_01',
      dishName: 'Puran Dhaka Mutton Kacchi Biryani',
      sellingPrice: 650,
      ingredients: [
        { ingredientId: 'ing_mutton', name: 'Fresh Bengal Mutton Cuts', quantity: 250, unit: 'g', unitCost: 1.10 },
        { ingredientId: 'ing_chinigura_rice', name: 'Chinigura Rice', quantity: 180, unit: 'g', unitCost: 0.16 },
        { ingredientId: 'ing_pure_ghee', name: 'Baghabari Pure Ghee', quantity: 30, unit: 'g', unitCost: 1.40 },
        { ingredientId: 'ing_potato', name: 'Biryani Aloo', quantity: 1, unit: 'pcs', unitCost: 15.00 },
        { ingredientId: 'ing_aloo_bukhara', name: 'Aloo Bukhara & Spices', quantity: 15, unit: 'g', unitCost: 4.00 }
      ]
    },
    {
      _id: 'rec_tehari',
      dishId: 'dish_02',
      dishName: 'Old Dhaka Beef Tehari',
      sellingPrice: 480,
      ingredients: [
        { ingredientId: 'ing_beef', name: 'Fresh Beef Cuts', quantity: 200, unit: 'g', unitCost: 0.85 },
        { ingredientId: 'ing_chinigura_rice', name: 'Chinigura Rice', quantity: 180, unit: 'g', unitCost: 0.16 },
        { ingredientId: 'ing_mustard_oil', name: 'Mustard Oil', quantity: 30, unit: 'ml', unitCost: 0.35 }
      ]
    },
    {
      _id: 'rec_kala_bhuna',
      dishId: 'dish_04',
      dishName: 'Chittagong Beef Kala Bhuna',
      sellingPrice: 680,
      ingredients: [
        { ingredientId: 'ing_beef', name: 'Fresh Beef Cuts', quantity: 300, unit: 'g', unitCost: 0.85 },
        { ingredientId: 'ing_mustard_oil', name: 'Mustard Oil', quantity: 35, unit: 'ml', unitCost: 0.35 },
        { ingredientId: 'ing_onion_beresta', name: 'Fried Onion Beresta', quantity: 50, unit: 'g', unitCost: 0.30 }
      ]
    },
    {
      _id: 'rec_shorshe_ilish',
      dishId: 'dish_06',
      dishName: 'Padma River Shorshe Ilish',
      sellingPrice: 850,
      ingredients: [
        { ingredientId: 'ing_ilish_fish', name: 'Padma Hilsha Fish Cutlet', quantity: 200, unit: 'g', unitCost: 2.50 },
        { ingredientId: 'ing_mustard_oil', name: 'Mustard Oil', quantity: 25, unit: 'ml', unitCost: 0.35 },
        { ingredientId: 'ing_shorshe_paste', name: 'Yellow Mustard Paste', quantity: 40, unit: 'g', unitCost: 0.40 }
      ]
    },
    {
      _id: 'rec_chingri_malai',
      dishId: 'dish_07',
      dishName: 'Golda Chingri Malai Curry',
      sellingPrice: 950,
      ingredients: [
        { ingredientId: 'ing_golda_chingri', name: 'Jumbo Golda Prawns', quantity: 2, unit: 'pcs', unitCost: 220.00 },
        { ingredientId: 'ing_coconut_milk', name: 'Coconut Milk Cream', quantity: 120, unit: 'ml', unitCost: 0.50 }
      ]
    },
    {
      _id: 'rec_fuchka',
      dishId: 'dish_08',
      dishName: 'Special Crispy Fuchka & Chotpoti Platter',
      sellingPrice: 220,
      ingredients: [
        { ingredientId: 'ing_fuchka_puri', name: 'Crispy Fuchka Puris', quantity: 10, unit: 'pcs', unitCost: 3.00 },
        { ingredientId: 'ing_potato', name: 'Mashed Spiced Potato & Dubli', quantity: 120, unit: 'g', unitCost: 0.25 }
      ]
    }
  ],

  inventory: [
    { _id: 'ing_mutton', name: 'Fresh Bengal Mutton Cuts', category: 'Meats', currentStock: 18500, threshold: 5000, unit: 'g', costPerUnit: 1.10 },
    { _id: 'ing_beef', name: 'Fresh Bengal Beef Cuts', category: 'Meats', currentStock: 22000, threshold: 6000, unit: 'g', costPerUnit: 0.85 },
    { _id: 'ing_chinigura_rice', name: 'Aromatic Dinajpur Chinigura Rice', category: 'Grains', currentStock: 45000, threshold: 12000, unit: 'g', costPerUnit: 0.16 },
    { _id: 'ing_pure_ghee', name: 'Baghabari Pure Ghee', category: 'Dairy', currentStock: 4200, threshold: 1500, unit: 'g', costPerUnit: 1.40 },
    { _id: 'ing_aloo_bukhara', name: 'Aloo Bukhara & Biryani Spices', category: 'Spices', currentStock: 350, threshold: 500, unit: 'g', costPerUnit: 4.00 }, // LOW STOCK!
    { _id: 'ing_potato', name: 'Munshiganj Fresh Potatoes', category: 'Produce', currentStock: 140, threshold: 40, unit: 'pcs', costPerUnit: 15.00 },
    { _id: 'ing_ilish_fish', name: 'Fresh Padma River Hilsha Fish', category: 'Seafood', currentStock: 4800, threshold: 2500, unit: 'g', costPerUnit: 2.50 },
    { _id: 'ing_mustard_oil', name: 'Pure Ghani Mustard Oil', category: 'Oils', currentStock: 16000, threshold: 4000, unit: 'ml', costPerUnit: 0.35 },
    { _id: 'ing_shorshe_paste', name: 'Yellow Mustard Paste', category: 'Spices', currentStock: 3200, threshold: 1000, unit: 'g', costPerUnit: 0.40 },
    { _id: 'ing_golda_chingri', name: 'Bay of Bengal Jumbo Golda Prawns', category: 'Seafood', currentStock: 24, threshold: 35, unit: 'pcs', costPerUnit: 220.00 }, // LOW STOCK!
    { _id: 'ing_coconut_milk', name: 'Fresh Coconut Milk', category: 'Dairy', currentStock: 8000, threshold: 2500, unit: 'ml', costPerUnit: 0.50 },
    { _id: 'ing_onion_beresta', name: 'Crispy Fried Onion Beresta', category: 'Pantry', currentStock: 6500, threshold: 2000, unit: 'g', costPerUnit: 0.30 },
    { _id: 'ing_fuchka_puri', name: 'Crispy Fuchka Shells', category: 'Bakery', currentStock: 250, threshold: 80, unit: 'pcs', costPerUnit: 3.00 },
    { _id: 'ing_chicken_wings', name: 'Fresh Chicken Wings', category: 'Poultry', currentStock: 18, threshold: 40, unit: 'pcs', costPerUnit: 25.00 } // LOW STOCK!
  ],

  tables: [
    { _id: 'tbl_01', number: 'T-01', capacity: 2, shape: 'square', zone: 'Main Dining Hall', status: 'available', currentOrderId: null, activeServer: 'Tanvir' },
    { _id: 'tbl_02', number: 'T-02', capacity: 2, shape: 'square', zone: 'Main Dining Hall', status: 'occupied', currentOrderId: 'ord_102', activeServer: 'Tanvir' },
    { _id: 'tbl_03', number: 'T-03', capacity: 4, shape: 'booth', zone: 'Main Dining Hall', status: 'occupied', currentOrderId: 'ord_101', activeServer: 'Anika' },
    { _id: 'tbl_04', number: 'T-04', capacity: 4, shape: 'booth', zone: 'Main Dining Hall', status: 'available', currentOrderId: null, activeServer: 'Anika' },
    { _id: 'tbl_05', number: 'T-05', capacity: 4, shape: 'square', zone: 'Family Lounge', status: 'reserved', currentOrderId: null, reservedFor: 'Farhan Kabir (8:00 PM)', activeServer: 'Rifat' },
    { _id: 'tbl_06', number: 'T-06', capacity: 4, shape: 'square', zone: 'Family Lounge', status: 'available', currentOrderId: null, activeServer: 'Rifat' },
    { _id: 'tbl_07', number: 'T-07', capacity: 6, shape: 'round', zone: 'Family Lounge', status: 'dirty', currentOrderId: null, activeServer: 'Rifat' },
    { _id: 'tbl_08', number: 'T-08', capacity: 2, shape: 'round', zone: 'Terrace Patio', status: 'available', currentOrderId: null, activeServer: 'Nusrat' },
    { _id: 'tbl_09', number: 'T-09', capacity: 4, shape: 'square', zone: 'Terrace Patio', status: 'occupied', currentOrderId: 'ord_103', activeServer: 'Nusrat' },
    { _id: 'tbl_10', number: 'T-10', capacity: 4, shape: 'square', zone: 'Terrace Patio', status: 'available', currentOrderId: null, activeServer: 'Nusrat' },
    { _id: 'tbl_11', number: 'VIP-1', capacity: 8, shape: 'booth', zone: 'VIP Banquet Salon', status: 'reserved', currentOrderId: null, reservedFor: 'Family Banquet Party (8:30 PM)', activeServer: 'Chef Rony' },
    { _id: 'tbl_12', number: 'VIP-2', capacity: 12, shape: 'booth', zone: 'VIP Banquet Salon', status: 'available', currentOrderId: null, activeServer: 'Chef Rony' }
  ],

  orders: [
    {
      _id: 'ord_101',
      orderNumber: '#FC-DHK-501',
      userId: 'usr_customer_asif',
      type: 'Dine-In',
      tableNumber: 'T-03',
      customerName: 'Asif Rahman',
      customerPhone: '+880 1711-234567',
      status: 'Preparing',
      createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
      items: [
        { dishId: 'dish_01', name: 'Puran Dhaka Mutton Kacchi Biryani', quantity: 2, unitPrice: 650, modifiers: ['Extra Aloo (+৳60)', 'Cold Borhani (+৳80)'], itemTotal: 1580 },
        { dishId: 'dish_08', name: 'Special Crispy Fuchka & Chotpoti Platter', quantity: 1, unitPrice: 220, modifiers: [], itemTotal: 220 }
      ],
      subtotal: 1800,
      taxVat: 90,
      serviceCharge: 90,
      discount: 0,
      totalAmount: 1980,
      paymentMethod: 'bKash',
      paymentStatus: 'Paid'
    },
    {
      _id: 'ord_102',
      orderNumber: '#FC-DHK-502',
      userId: 'usr_customer_nusrat',
      type: 'Dine-In',
      tableNumber: 'T-02',
      customerName: 'Nusrat Jahan',
      customerPhone: '+880 1819-876543',
      status: 'New',
      createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
      items: [
        { dishId: 'dish_06', name: 'Padma River Shorshe Ilish', quantity: 1, unitPrice: 850, modifiers: [], itemTotal: 850 },
        { dishId: 'dish_11', name: 'Classic Shahi Borhani', quantity: 2, unitPrice: 150, modifiers: [], itemTotal: 300 }
      ],
      subtotal: 1150,
      taxVat: 57.50,
      serviceCharge: 57.50,
      discount: 0,
      totalAmount: 1265,
      paymentMethod: 'Nagad',
      paymentStatus: 'Paid'
    },
    {
      _id: 'ord_103',
      orderNumber: '#FC-DHK-503',
      userId: 'usr_customer_fahim',
      type: 'Delivery',
      deliveryAddress: 'House 24, Road 7, Dhanmondi, Dhaka',
      customerName: 'Fahim Choudhury',
      customerPhone: '+880 1912-345678',
      status: 'Out for Delivery',
      driverName: 'Mehedi Hasan (Delivery Rider #04)',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
      items: [
        { dishId: 'dish_02', name: 'Old Dhaka Beef Tehari', quantity: 2, unitPrice: 480, modifiers: [], itemTotal: 960 },
        { dishId: 'dish_14', name: 'Bogura Shahi Mishti Doi', quantity: 2, unitPrice: 180, modifiers: [], itemTotal: 360 }
      ],
      subtotal: 1320,
      taxVat: 66,
      serviceCharge: 0,
      deliveryFee: 60,
      discount: 100,
      totalAmount: 1346,
      paymentMethod: 'Card Payment',
      paymentStatus: 'Paid'
    },
    {
      _id: 'ord_104',
      orderNumber: '#FC-DHK-480',
      userId: 'usr_customer_asif',
      type: 'Delivery',
      deliveryAddress: 'House 42, Road 11, Block D, Banani, Dhaka',
      customerName: 'Asif Rahman',
      customerPhone: '+880 1711-234567',
      status: 'Completed',
      driverName: 'Mehedi Hasan (Delivery Rider #04)',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      items: [
        { dishId: 'dish_01', name: 'Puran Dhaka Mutton Kacchi Biryani', quantity: 1, unitPrice: 650, modifiers: ['Cold Borhani (+৳80)'], itemTotal: 730 },
        { dishId: 'dish_04', name: 'Chittagong Beef Kala Bhuna', quantity: 1, unitPrice: 680, modifiers: [], itemTotal: 680 }
      ],
      subtotal: 1410,
      taxVat: 70.50,
      serviceCharge: 0,
      deliveryFee: 60,
      discount: 0,
      totalAmount: 1540.50,
      paymentMethod: 'bKash',
      paymentStatus: 'Paid'
    }
  ],

  reservations: [
    {
      _id: 'res_01',
      bookingCode: 'FC-DHK-801',
      guestName: 'Farhan Kabir',
      guestPhone: '+880 1712-998877',
      guestEmail: 'farhan.kabir@gmail.com',
      partySize: 4,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '20:00',
      tablePreference: 'Family Lounge',
      assignedTable: 'T-05',
      depositPaid: 500,
      status: 'Confirmed',
      specialRequest: 'Family dinner. Extra spicy kacchi biryani & borhani setup.'
    }
  ],

  waste: [
    {
      _id: 'wst_01',
      ingredientId: 'ing_mutton',
      ingredientName: 'Fresh Bengal Mutton Cuts',
      quantity: 300,
      unit: 'g',
      reason: 'Fat trimming',
      costLoss: 330,
      loggedBy: 'Chef Rony',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
    }
  ],

  users: [
    { 
      _id: 'usr_admin', 
      username: 'admin', 
      password: 'admin123',
      name: 'Sadia Islam Dia', 
      role: 'Admin', 
      avatar: '👩‍💼', 
      phone: '+880 1710-000001',
      email: 'sadia.dia@flavourcraft.bd' 
    },
    { 
      _id: 'usr_manager', 
      username: 'manager', 
      password: 'manager123',
      name: 'Sarafat Alam Irfan', 
      role: 'Manager', 
      avatar: '👨‍💼', 
      phone: '+880 1710-000002',
      email: 'irfan@flavourcraft.bd' 
    },
    { 
      _id: 'usr_kitchen', 
      username: 'kitchen', 
      password: 'kitchen123',
      name: 'Chef Rony', 
      role: 'Kitchen', 
      avatar: '🍳', 
      phone: '+880 1710-000004',
      email: 'rony@flavourcraft.bd' 
    },
    { 
      _id: 'usr_customer_asif', 
      username: 'customer', 
      password: 'customer123',
      name: 'Asif Rahman', 
      role: 'Customer', 
      avatar: '🍽️', 
      phone: '+880 1711-234567',
      email: 'asif.rahman@gmail.com',
      deliveryAddress: 'House 42, Road 11, Block D, Banani, Dhaka'
    }
  ]
};
