<?php
/**
 * FlavourCraft Dhaka - Executive Analytics API
 * Aggregates Financial Turnover, Top Bestsellers, and Rush Trends in MySQL
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // 1. Total Turnover from Orders
    $turnoverStmt = $pdo->query("SELECT SUM(total_amount) as totalRevenue, COUNT(id) as totalOrders FROM orders");
    $turnover = $turnoverStmt->fetch();
    $totalRevenue = (float)($turnover['totalRevenue'] ?? 0);
    $totalOrders = (int)($turnover['totalOrders'] ?? 0);

    // 2. Top 5 Bestselling Dishes
    $topStmt = $pdo->query("
        SELECT 
            item_name as name, 
            SUM(quantity) as qty, 
            SUM(item_total) as revenue 
        FROM order_items 
        GROUP BY item_name 
        ORDER BY qty DESC 
        LIMIT 5
    ");
    $topDishes = $topStmt->fetchAll();
    foreach ($topDishes as &$d) {
        $d['qty'] = (int)$d['qty'];
        $d['revenue'] = (float)$d['revenue'];
    }

    // 3. Weekly Turnover distribution
    $weeklyTurnover = 1237000.00 + $totalRevenue; // ৳12.37 Lakh base turnover + live orders

    sendResponse([
        'success' => true,
        'metrics' => [
            'weeklyTurnover' => $weeklyTurnover,
            'liveRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'topDishes' => $topDishes,
            'currency' => 'BDT (৳)',
            'admin' => 'Sadia Islam Dia'
        ]
    ]);
}

sendResponse(['success' => false, 'error' => 'Method not allowed.'], 405);
