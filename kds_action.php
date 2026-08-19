<?php
require_once __DIR__ . '/config/db.php';

$order_uid = $_POST['order_uid'] ?? '';
$next_status = $_POST['next_status'] ?? 'Preparing';

$pdo = get_db();

if ($pdo && $order_uid) {
    try {
        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE order_uid = ?");
        $stmt->execute([$next_status, $order_uid]);
        set_flash('success', "Order status updated to: {$next_status}");
    } catch (PDOException $e) {
        set_flash('error', 'Status update failed: ' . $e->getMessage());
    }
}

header('Location: kds.php');
exit;
