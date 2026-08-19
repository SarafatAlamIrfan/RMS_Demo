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

$conn = get_db();

if ($conn) {
    mysqli_begin_transaction($conn);

    try {
        $safe_order_uid = mysqli_real_escape_string($conn, $order_uid);
        $safe_order_num = mysqli_real_escape_string($conn, $order_number);
        $safe_type = mysqli_real_escape_string($conn, $order_type);
        $safe_table = $table_number ? "'" . mysqli_real_escape_string($conn, $table_number) . "'" : "NULL";
        $safe_address = $delivery_address ? "'" . mysqli_real_escape_string($conn, $delivery_address) . "'" : "NULL";
        $safe_cname = mysqli_real_escape_string($conn, $customer_name);
        $safe_cphone = mysqli_real_escape_string($conn, $customer_phone);
        $safe_payment = mysqli_real_escape_string($conn, $payment_method);

        $order_sql = "
            INSERT INTO orders (
                order_uid, order_number, order_type, table_number, delivery_address,
                customer_name, customer_phone, subtotal, tax_vat, delivery_fee,
                total_amount, payment_method, payment_status, status
            ) VALUES (
                '{$safe_order_uid}', '{$safe_order_num}', '{$safe_type}', {$safe_table}, {$safe_address},
                '{$safe_cname}', '{$safe_cphone}', {$subtotal}, {$vat}, {$delivery_fee},
                {$total_amount}, '{$safe_payment}', 'Paid', 'New'
            )
        ";

        if (!mysqli_query($conn, $order_sql)) {
            throw new Exception(mysqli_error($conn));
        }

        foreach ($cart as $item) {
            $item_qty = (int)$item['quantity'];
            $item_price = (float)$item['price'];
            $item_total = $item_price * $item_qty;
            $safe_item_uid = mysqli_real_escape_string($conn, $item['item_uid']);
            $safe_item_name = mysqli_real_escape_string($conn, $item['name']);

            $item_sql = "
                INSERT INTO order_items (
                    order_uid, item_uid, item_name, quantity, unit_price, modifiers, item_total
                ) VALUES (
                    '{$safe_order_uid}', '{$safe_item_uid}', '{$safe_item_name}', {$item_qty}, {$item_price}, NULL, {$item_total}
                )
            ";

            if (!mysqli_query($conn, $item_sql)) {
                throw new Exception(mysqli_error($conn));
            }

            $recipe_sql = "
                SELECT ri.ingredient_uid, ri.quantity AS ingredient_qty
                FROM recipes r
                JOIN recipe_ingredients ri ON r.recipe_uid = ri.recipe_uid
                WHERE r.menu_item_uid = '{$safe_item_uid}'
            ";
            $recipe_res = mysqli_query($conn, $recipe_sql);
            if ($recipe_res) {
                while ($ing = mysqli_fetch_assoc($recipe_res)) {
                    $deduct_amount = (float)$ing['ingredient_qty'] * $item_qty;
                    $safe_ing_uid = mysqli_real_escape_string($conn, $ing['ingredient_uid']);
                    $deduct_sql = "
                        UPDATE inventory 
                        SET current_stock = GREATEST(0, current_stock - {$deduct_amount})
                        WHERE ingredient_uid = '{$safe_ing_uid}'
                    ";
                    mysqli_query($conn, $deduct_sql);
                }
            }
        }

        mysqli_commit($conn);
    } catch (Exception $e) {
        mysqli_rollback($conn);
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
