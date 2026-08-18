<?php
/**
 * FlavourCraft Dhaka - Inventory, Recipe Costing & Food Waste API
 * Manages Raw Stock Levels, Recipes, and Spoilage in MySQL
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// ----------------------------------------------------------------------------
// 1. GET /api/inventory.php - List inventory items, recipes, and waste logs
// ----------------------------------------------------------------------------
if ($method === 'GET') {
    // 1. Inventory Items
    $invStmt = $pdo->query("SELECT ingredient_uid as id, name, category, current_stock as currentStock, threshold, unit, cost_per_unit as costPerUnit FROM inventory ORDER BY id ASC");
    $inventory = $invStmt->fetchAll();
    foreach ($inventory as &$inv) {
        $inv['currentStock'] = (float)$inv['currentStock'];
        $inv['threshold'] = (float)$inv['threshold'];
        $inv['costPerUnit'] = (float)$inv['costPerUnit'];
    }

    // 2. Recipes & Ingredients
    $recStmt = $pdo->query("SELECT recipe_uid as id, menu_item_uid as dishId, dish_name as dishName, selling_price as sellingPrice FROM recipes");
    $recipes = $recStmt->fetchAll();

    $ingStmt = $pdo->query("SELECT * FROM recipe_ingredients");
    $allIngs = $ingStmt->fetchAll();
    $groupedIngs = [];
    foreach ($allIngs as $ing) {
        $ruid = $ing['recipe_uid'];
        if (!isset($groupedIngs[$ruid])) $groupedIngs[$ruid] = [];
        $groupedIngs[$ruid][] = [
            'ingredientId' => $ing['ingredient_uid'],
            'name' => $ing['ingredient_name'],
            'quantity' => (float)$ing['quantity'],
            'unit' => $ing['unit'],
            'unitCost' => (float)$ing['unit_cost']
        ];
    }
    foreach ($recipes as &$rec) {
        $rec['sellingPrice'] = (float)$rec['sellingPrice'];
        $rec['ingredients'] = $groupedIngs[$rec['id']] ?? [];
    }

    sendResponse([
        'success' => true,
        'inventory' => $inventory,
        'recipes' => $recipes
    ]);
}

// ----------------------------------------------------------------------------
// 2. POST /api/inventory.php?action=restock - Quick Reorder / Restock All
// ----------------------------------------------------------------------------
if ($method === 'POST' && $action === 'restock') {
    $pdo->query("
        UPDATE inventory 
        SET current_stock = CASE 
            WHEN category = 'Meats' THEN 25000.00
            WHEN category = 'Grains' THEN 50000.00
            WHEN category = 'Dairy' THEN 6000.00
            WHEN category = 'Seafood' THEN 8000.00
            WHEN category = 'Oils' THEN 20000.00
            WHEN category = 'Produce' THEN 200.00
            WHEN category = 'Spices' THEN 2000.00
            ELSE 10000.00
        END
    ");

    sendResponse(['success' => true, 'message' => 'All inventory stocks replenished to safe levels!']);
}

sendResponse(['success' => false, 'error' => 'Method not allowed.'], 405);

