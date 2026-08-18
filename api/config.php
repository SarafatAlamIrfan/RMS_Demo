<?php
/**
 * FlavourCraft Dhaka - Database Configuration & API Helper
 * Connects to MySQL using standard PHP PDO
 */

// Enable CORS for local testing and web requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database Credentials (Standard XAMPP / WAMP defaults)
$db_host = 'localhost';
$db_name = 'flavourcraft_dhaka';
$db_user = 'root';
$db_pass = '';
$db_port = '3306';

try {
    $pdo = new PDO("mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // If database connection fails (e.g. MySQL not yet started), return clear JSON error
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage(),
        'hint' => 'Ensure MySQL is running in XAMPP/WAMP and import database/flavourcraft_dhaka.sql'
    ]);
    exit;
}

/**
 * Helper function to read incoming JSON request body
 */
function getJsonInput() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

/**
 * Helper function to send standard JSON response
 */
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
