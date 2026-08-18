<?php
/**
 * FlavourCraft Dhaka - Orders & KDS API
 * Handles Order Placement with Automatic SQL Recipe Stock Deductions
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// ----------------------------------------------------------------------------
// 1. GET /api/orders.php - List all orders with items
// ----------------------------------------------------------------------------
if ($method === 'GET') {
    $orderQuery = $pdo->query("SELECT * FROM orders ORDER BY id DESC");
    $orders = $orderQuery->fetchAll();

    $itemQuery = $pdo->query("SELECT * FROM order_items");
    $allItems = $itemQuery->fetchAll();

    // Group items by order_uid
    $groupedItems = [];
    foreach ($allItems as $item) {
        $ouid = $item['order_uid'];
        if (!isset($groupedItems[$ouid])) {
            $groupedItems[$ouid] = [];
        }
        $groupedItems[$ouid][] = [
            'dishId' => $item['item_uid'],
            'name' => $item['item_name'],
            'quantity' => (int)$item['quantity'],
            'unitPrice' => (float)$item['unit_price'],
            'modifiers' => !empty($item['modifiers']) ? json_decode($item['modifiers'], true) : [],
            'itemTotal' => (float)$item['item_total']
        ];
    }

    $formattedOrders = [];
    foreach ($orders as $o) {
        $formattedOrders[] = [
            'id' => $o['order_uid'],
            'orderNumber' => $o['order_number'],
            'type' => $o['order_type'],
            'tableNumber' => $o['table_number'],
            'deliveryAddress' => $o['delivery_address'],
            'customerName' => $o['customer_name'],
            'customerPhone' => $o['customer_phone'],
            'subtotal' => (float)$o['subtotal'],
            'taxVat' => (float)$o['tax_vat'],
            'serviceCharge' => (float)$o['service_charge'],
            'deliveryFee' => (float)$o['delivery_fee'],
            'discount' => (float)$o['discount_amount'],
            'totalAmount' => (float)$o['total_amount'],
            'paymentMethod' => $o['payment_method'],
            'paymentStatus' => $o['payment_status'],
            'status' => $o['status'],
            'driverName' => $o['driver_name'],
            'createdAt' => $o['created_at'],
            'items' => $groupedItems[$o['order_uid']] ?? []
        ];
    }

    sendResponse(['success' => true, 'orders' => $formattedOrders]);
}

// ----------------------------------------------------------------------------
// 2. POST /api/orders.php - Place Order & Deduct Recipe Inventory in SQL
// ----------------------------------------------------------------------------
if ($method === 'POST') {
    $input = getJsonInput();

    $orderUid = 'ord_' . time() . '_' . rand(1000, 9999);
    $orderNumber = $input['orderNumber'] ?? ('#FC-DHK-' . rand(100, 999));
    $orderType = $input['type'] ?? 'Dine-In';
    $tableNumber = $input['tableNumber'] ?? null;
    $deliveryAddress = $input['deliveryAddress'] ?? null;
    $customerName = trim($input['customerName'] ?? 'Guest');
    $customerPhone = trim($input['customerPhone'] ?? '+880 1711-000000');
    $subtotal = (float)($input['subtotal'] ?? 0);
    $taxVat = (float)($input['taxVat'] ?? 0);
    $serviceCharge = (float)($input['serviceCharge'] ?? 0);
    $deliveryFee = (float)($input['deliveryFee'] ?? 0);
    $discount = (float)($input['discount'] ?? 0);
    $totalAmount = (float)($input['totalAmount'] ?? 0);
    $paymentMethod = $input['paymentMethod'] ?? 'bKash';
    $paymentStatus = $input['paymentStatus'] ?? 'Paid';
    $status = $input['status'] ?? 'New';
    $items = $input['items'] ?? [];

    if (empty($items)) {
        sendResponse(['success' => false, 'error' => 'Order must contain at least one item.'], 400);
    }

    // Begin SQL Transaction for Data Integrity
    $pdo->beginTransaction();

    try {
        // 1. Insert into orders table
        $orderStmt = $pdo->prepare("
            INSERT INTO orders 
            (order_uid, order_number, order_type, table_number, delivery_address, customer_name, customer_phone, subtotal, tax_vat, service_charge, delivery_fee, discount_amount, total_amount, payment_method, payment_status, status)
            VALUES 
            (:ouid, :onum, :otype, :tbl, :addr, :cname, :cphone, :sub, :vat, :sc, :dfee, :disc, :tot, :pmeth, :pstat, :stat)
        ");

        $orderStmt->execute([
            'ouid' => $orderUid,
            'onum' => $orderNumber,
            'otype' => $orderType,
            'tbl' => $tableNumber,
            'addr' => $deliveryAddress,
            'cname' => $customerName,
            'cphone' => $customerPhone,
            'sub' => $subtotal,
            'vat' => $taxVat,
            'sc' => $serviceCharge,
            'dfee' => $deliveryFee,
            'disc' => $discount,
            'tot' => $totalAmount,
            'pmeth' => $paymentMethod,
            'pstat' => $paymentStatus,
            'stat' => $status
        ]);

        // 2. Insert Order Items & Deduct Raw Stock from Recipes
        $itemStmt = $pdo->prepare("
            INSERT INTO order_items (order_uid, item_uid, item_name, quantity, unit_price, modifiers, item_total)
            VALUES (:ouid, :iuid, :iname, :qty, :uprice, :mods, :itot)
        ");

        $deductStockStmt = $pdo->prepare("
            UPDATE inventory 
            SET current_stock = GREATEST(0, current_stock - :used_qty) 
            WHERE ingredient_uid = :ing_uid
        ");

        foreach ($items as $item) {
            $dishId = $item['dishId'] ?? '';
            $qty = (int)($item['quantity'] ?? 1);
            $unitPrice = (float)($item['unitPrice'] ?? 0);
            $itemTotal = (float)($item['itemTotal'] ?? ($qty * $unitPrice));
            $modifiers = !empty($item['modifiers']) ? json_encode($item['modifiers']) : '[]';

            $itemStmt->execute([
                'ouid' => $orderUid,
                'iuid' => $dishId,
                'iname' => $item['name'] ?? '',
                'qty' => $qty,
                'uprice' => $unitPrice,
                'mods' => $modifiers,
                'itot' => $itemTotal
            ]);

            // Query recipe ingredients for this dish to deduct stock
            $recStmt = $pdo->prepare("
                SELECT ri.ingredient_uid, ri.quantity 
                FROM recipes r
                JOIN recipe_ingredients ri ON r.recipe_uid = ri.recipe_uid
                WHERE r.menu_item_uid = :dish_id
            ");
            $recStmt->execute(['dish_id' => $dishId]);
            $ingredients = $recStmt->fetchAll();

            foreach ($ingredients as $ing) {
                $totalDeduction = (float)$ing['quantity'] * $qty;
                $deductStockStmt->execute([
                    'used_qty' => $totalDeduction,
                    'ing_uid' => $ing['ingredient_uid']
                ]);
            }
        }

        // Commit all changes atomically
        $pdo->commit();

        sendResponse([
            'success' => true,
            'message' => 'Order placed and raw inventory deducted successfully',
            'order' => [
                'id' => $orderUid,
                'orderNumber' => $orderNumber,
                'status' => $status,
                'totalAmount' => $totalAmount
            ]
        ], 201);

    } catch (Exception $e) {
        $pdo->rollBack();
        sendResponse(['success' => false, 'error' => 'Failed to place order: ' . $e->getMessage()], 500);
    }
}

// ----------------------------------------------------------------------------
// 3. PUT /api/orders.php?action=update_status - Bump KDS / Delivery status
// ----------------------------------------------------------------------------
if ($method === 'PUT' || ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'update_status')) {
    $input = getJsonInput();
    $orderUid = $input['id'] ?? '';
    $newStatus = $input['status'] ?? '';

    if (empty($orderUid) || empty($newStatus)) {
        sendResponse(['success' => false, 'error' => 'Order ID and new status are required.'], 400);
    }

    $stmt = $pdo->prepare("UPDATE orders SET status = :stat WHERE order_uid = :ouid");
    $stmt->execute(['stat' => $newStatus, 'ouid' => $orderUid]);

    sendResponse([
        'success' => true,
        'message' => 'Order status updated successfully',
        'id' => $orderUid,
        'status' => $newStatus
    ]);
}

sendResponse(['success' => false, 'error' => 'Method not allowed.'], 405);
