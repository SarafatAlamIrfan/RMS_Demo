<?php
require_once __DIR__ . '/config/db.php';

$cart = $_SESSION['cart'] ?? [];

if (empty($cart)) {
    set_flash('error', 'Your cart is empty. Please add dishes before placing an order.');
    header('Location: index.php');
    exit;
}

$order_type = $_POST['order_type'] ?? 'Dine-In';
$table_number = ($order_type === 'Dine-In') ? ($_POST['table_number'] ?? 'Table 01') : null;
$delivery_address = ($order_type === 'Delivery') ? ($_POST['delivery_address'] ?? 'Banani, Dhaka') : null;
$customer_name = trim($_POST['customer_name'] ?? 'Guest Customer');
$customer_phone = trim($_POST['customer_phone'] ?? '+880 1700-000000');
$payment_method = $_POST['payment_method'] ?? 'bKash';

$subtotal = 0;
foreach ($cart as $item) {
    $subtotal += ($item['price'] * $item['quantity']);
}

$vat = $subtotal * 0.05;
$delivery_fee = ($order_type === 'Delivery') ? 60.00 : 0.00;
$total_amount = $subtotal + $vat + $delivery_fee;

$order_uid = 'ord_' . bin2hex(random_bytes(6));
$order_number = 'FC-' . rand(1000, 9999);

$pdo = get_db();

if ($pdo) {
    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            INSERT INTO orders (
                order_uid, order_number, order_type, table_number, delivery_address,
                customer_name, customer_phone, subtotal, tax_vat, delivery_fee,
                total_amount, payment_method, payment_status, status
            ) VALUES (
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, 'Paid', 'New'
            )
        ");
        $stmt->execute([
            $order_uid, $order_number, $order_type, $table_number, $delivery_address,
            $customer_name, $customer_phone, $subtotal, $vat, $delivery_fee,
            $total_amount, $payment_method
        ]);

        $item_stmt = $pdo->prepare("
            INSERT INTO order_items (
                order_uid, item_uid, item_name, quantity, unit_price, modifiers, item_total
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?
            )
        ");

        $recipe_stmt = $pdo->prepare("
            SELECT ri.ingredient_uid, ri.quantity AS ingredient_qty
            FROM recipes r
            JOIN recipe_ingredients ri ON r.recipe_uid = ri.recipe_uid
            WHERE r.menu_item_uid = ?
        ");

        $stock_deduct_stmt = $pdo->prepare("
            UPDATE inventory 
            SET current_stock = GREATEST(0, current_stock - ?)
            WHERE ingredient_uid = ?
        ");

        foreach ($cart as $item) {
            $item_qty = (int)$item['quantity'];
            $modifiers = trim(($item['spice'] ?? 'Regular') . ' | ' . ($item['addon'] ?? ''));
            $item_total = $item['price'] * $item_qty;

            $item_stmt->execute([
                $order_uid,
                $item['item_uid'],
                $item['name'],
                $item_qty,
                $item['price'],
                $modifiers,
                $item_total
            ]);

            $recipe_stmt->execute([$item['item_uid']]);
            $ingredients = $recipe_stmt->fetchAll();
            foreach ($ingredients as $ing) {
                $deduct_amount = (float)$ing['ingredient_qty'] * $item_qty;
                $stock_deduct_stmt->execute([$deduct_amount, $ing['ingredient_uid']]);
            }
        }

        $pdo->commit();
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        set_flash('error', 'Order processing failed: ' . $e->getMessage());
        header('Location: cart.php');
        exit;
    }
}

$_SESSION['latest_order'] = [
    'order_uid' => $order_uid,
    'order_number' => $order_number,
    'order_type' => $order_type,
    'table_number' => $table_number,
    'delivery_address' => $delivery_address,
    'customer_name' => $customer_name,
    'customer_phone' => $customer_phone,
    'subtotal' => $subtotal,
    'vat' => $vat,
    'delivery_fee' => $delivery_fee,
    'total_amount' => $total_amount,
    'payment_method' => $payment_method,
    'status' => 'New',
    'items' => $cart,
    'created_at' => date('Y-m-d H:i:s')
];

$_SESSION['cart'] = [];

set_flash('success', "🎉 Your order #{$order_number} has been placed successfully!");
header("Location: track_order.php?order_id={$order_number}");
exit;
