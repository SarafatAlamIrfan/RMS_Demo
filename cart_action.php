<?php
require_once __DIR__ . '/config/db.php';

if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$redirect = $_POST['redirect'] ?? $_GET['redirect'] ?? 'index.php';

$pdo = get_db();

if ($action === 'add') {
    $item_uid = trim($_POST['item_uid'] ?? '');
    $quantity = max(1, (int)($_POST['quantity'] ?? 1));
    
    $item = null;
    if ($pdo && $item_uid) {
        $stmt = $pdo->prepare("SELECT * FROM menu_items WHERE item_uid = ? LIMIT 1");
        $stmt->execute([$item_uid]);
        $item = $stmt->fetch();
    }
    
    if ($item) {
        $cart_key = $item_uid;
        
        if (isset($_SESSION['cart'][$cart_key])) {
            $_SESSION['cart'][$cart_key]['quantity'] += $quantity;
        } else {
            $_SESSION['cart'][$cart_key] = [
                'item_uid' => $item['item_uid'],
                'name' => $item['name'],
                'price' => (float)$item['price'],
                'quantity' => $quantity,
                'image_url' => $item['image_url'],
                'category_slug' => $item['category_slug']
            ];
        }
        set_flash('success', "Added {$quantity}x {$item['name']} to your cart.");
    } else {
        set_flash('error', 'Could not find selected dish.');
    }
} elseif ($action === 'update') {
    $cart_key = $_POST['cart_key'] ?? $_GET['cart_key'] ?? '';
    $delta = (int)($_POST['delta'] ?? $_GET['delta'] ?? 0);
    
    if (isset($_SESSION['cart'][$cart_key])) {
        $_SESSION['cart'][$cart_key]['quantity'] += $delta;
        if ($_SESSION['cart'][$cart_key]['quantity'] <= 0) {
            unset($_SESSION['cart'][$cart_key]);
            set_flash('success', 'Item removed from cart.');
        } else {
            set_flash('success', 'Cart updated.');
        }
    }
} elseif ($action === 'remove') {
    $cart_key = $_POST['cart_key'] ?? $_GET['cart_key'] ?? '';
    if (isset($_SESSION['cart'][$cart_key])) {
        $name = $_SESSION['cart'][$cart_key]['name'];
        unset($_SESSION['cart'][$cart_key]);
        set_flash('success', "Removed {$name} from cart.");
    }
} elseif ($action === 'clear') {
    $_SESSION['cart'] = [];
    set_flash('success', 'Cart cleared.');
}

header('Location: ' . $redirect);
exit;
