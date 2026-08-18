<?php
/**
 * FlavourCraft Dhaka - Menu & Dishes API
 * Fetches authentic Bangladeshi dishes and categories from MySQL
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// ----------------------------------------------------------------------------
// 1. GET /api/menu.php - List all menu items and categories
// ----------------------------------------------------------------------------
if ($method === 'GET') {
    // Fetch categories
    $catStmt = $pdo->query("SELECT slug, name, icon FROM categories ORDER BY display_order ASC");
    $categories = $catStmt->fetchAll();

    // Fetch menu items
    $menuStmt = $pdo->query("
        SELECT 
            item_uid as id,
            sku,
            name,
            category_slug as category,
            price,
            description,
            image_url as image,
            tags,
            spice_level as spiceLevel,
            is_available as isAvailable,
            prep_time_minutes as prepTimeMinutes
        FROM menu_items 
        ORDER BY id ASC
    ");
    $items = $menuStmt->fetchAll();

    // Format tags array and booleans
    foreach ($items as &$item) {
        $item['price'] = (float)$item['price'];
        $item['spiceLevel'] = (int)$item['spiceLevel'];
        $item['isAvailable'] = (bool)$item['isAvailable'];
        $item['prepTimeMinutes'] = (int)$item['prepTimeMinutes'];
        $item['tags'] = !empty($item['tags']) ? array_map('trim', explode(',', $item['tags'])) : [];
    }

    sendResponse([
        'success' => true,
        'categories' => $categories,
        'menu' => $items
    ]);
}

// ----------------------------------------------------------------------------
// 2. POST /api/menu.php?action=toggle_availability
// ----------------------------------------------------------------------------
if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'toggle_availability') {
    $input = getJsonInput();
    $itemId = $input['id'] ?? '';
    $isAvailable = isset($input['isAvailable']) ? (int)$input['isAvailable'] : 1;

    if (empty($itemId)) {
        sendResponse(['success' => false, 'error' => 'Item ID is required.'], 400);
    }

    $stmt = $pdo->prepare("UPDATE menu_items SET is_available = :avail WHERE item_uid = :id");
    $stmt->execute(['avail' => $isAvailable, 'id' => $itemId]);

    sendResponse([
        'success' => true,
        'message' => 'Item availability updated successfully',
        'id' => $itemId,
        'isAvailable' => (bool)$isAvailable
    ]);
}

sendResponse(['success' => false, 'error' => 'Method not allowed.'], 405);
