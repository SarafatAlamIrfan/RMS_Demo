<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/auth_check.php';

check_auth(['Admin', 'Manager', 'Kitchen']);

$order_uid = $_POST['order_uid'] ?? '';
$next_status = $_POST['next_status'] ?? 'Preparing';

$conn = get_db();

if ($conn && $order_uid) {
    $safe_uid = mysqli_real_escape_string($conn, $order_uid);
    $safe_status = mysqli_real_escape_string($conn, $next_status);
    if (mysqli_query($conn, "UPDATE orders SET status = '{$safe_status}' WHERE order_uid = '{$safe_uid}'")) {
        set_flash('success', "Order status updated to: {$next_status}");
    } else {
        set_flash('error', 'Status update failed: ' . mysqli_error($conn));
    }
}

header('Location: kds.php');
exit;
