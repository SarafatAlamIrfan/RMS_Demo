<?php
/**
 * FlavourCraft Dhaka - Tables & 2D Floor Plan API
 * Manages Table Occupancy, Zones, and Statuses in MySQL
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// ----------------------------------------------------------------------------
// 1. GET /api/tables.php - List all 12 floor tables
// ----------------------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM dining_tables ORDER BY id ASC");
    $rows = $stmt->fetchAll();

    $tables = [];
    foreach ($rows as $t) {
        $tables[] = [
            'id' => $t['table_uid'],
            'number' => $t['table_number'],
            'capacity' => (int)$t['capacity'],
            'shape' => $t['shape'],
            'zone' => $t['zone'],
            'status' => $t['status'],
            'currentOrderId' => $t['current_order_id'],
            'reservedFor' => $t['reserved_for'],
            'activeServer' => $t['active_server']
        ];
    }

    sendResponse(['success' => true, 'tables' => $tables]);
}

// ----------------------------------------------------------------------------
// 2. PUT /api/tables.php - Update Table Status (available/occupied/reserved/dirty)
// ----------------------------------------------------------------------------
if ($method === 'PUT' || ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'update_status')) {
    $input = getJsonInput();
    $tableId = $input['id'] ?? '';
    $newStatus = $input['status'] ?? 'available';

    if (empty($tableId)) {
        sendResponse(['success' => false, 'error' => 'Table ID is required.'], 400);
    }

    $stmt = $pdo->prepare("UPDATE dining_tables SET status = :stat WHERE table_uid = :tuid OR table_number = :tuid");
    $stmt->execute(['stat' => $newStatus, 'tuid' => $tableId]);

    sendResponse([
        'success' => true,
        'message' => 'Table status updated successfully',
        'id' => $tableId,
        'status' => $newStatus
    ]);
}

sendResponse(['success' => false, 'error' => 'Method not allowed.'], 405);
