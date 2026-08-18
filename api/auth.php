<?php
/**
 * FlavourCraft Dhaka - Authentication & Role API
 * Handles Login, Registration, and User Sessions in PHP & MySQL
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// ----------------------------------------------------------------------------
// 1. POST /api/auth.php?action=login
// ----------------------------------------------------------------------------
if ($method === 'POST' && $action === 'login') {
    $input = getJsonInput();
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($username) || empty($password)) {
        sendResponse(['success' => false, 'error' => 'Username/Phone and password are required.'], 400);
    }

    // Lookup user by username OR phone number
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :u OR phone = :p LIMIT 1");
    $stmt->execute(['u' => $username, 'p' => $username]);
    $user = $stmt->fetch();

    if ($user && ($password === $user['password'] || password_verify($password, $user['password']))) {
        unset($user['password']); // Never send password back
        sendResponse([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['user_uid'],
                'username' => $user['username'],
                'name' => $user['name'],
                'role' => $user['role'],
                'avatar' => $user['avatar'],
                'phone' => $user['phone'],
                'email' => $user['email'],
                'delivery_address' => $user['delivery_address']
            ]
        ]);
    } else {
        sendResponse(['success' => false, 'error' => 'Invalid username/phone or password.'], 401);
    }
}

// ----------------------------------------------------------------------------
// 2. POST /api/auth.php?action=register
// ----------------------------------------------------------------------------
if ($method === 'POST' && $action === 'register') {
    $input = getJsonInput();
    $name = trim($input['name'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = trim($input['password'] ?? '');
    $address = trim($input['address'] ?? '');

    if (empty($name) || empty($phone) || empty($password)) {
        sendResponse(['success' => false, 'error' => 'Full Name, Phone number, and Password are required.'], 400);
    }

    // Check if phone or email already registered
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE phone = :p OR (email != '' AND email = :e) LIMIT 1");
    $checkStmt->execute(['p' => $phone, 'e' => $email]);
    if ($checkStmt->fetch()) {
        sendResponse(['success' => false, 'error' => 'An account with this phone number or email already exists.'], 409);
    }

    $userUid = 'usr_cust_' . time() . '_' . rand(100, 999);
    $username = preg_replace('/[^a-zA-Z0-9]/', '', strtolower($phone));

    $insertStmt = $pdo->prepare("
        INSERT INTO users (user_uid, username, password, name, role, avatar, phone, email, delivery_address)
        VALUES (:uid, :uname, :pwd, :name, 'Customer', '🍽️', :phone, :email, :addr)
    ");

    $insertStmt->execute([
        'uid' => $userUid,
        'uname' => $username,
        'pwd' => $password,
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'addr' => $address
    ]);

    sendResponse([
        'success' => true,
        'message' => 'Customer registered successfully',
        'user' => [
            'id' => $userUid,
            'username' => $username,
            'name' => $name,
            'role' => 'Customer',
            'avatar' => '🍽️',
            'phone' => $phone,
            'email' => $email,
            'delivery_address' => $address
        ]
    ], 201);
}

// ----------------------------------------------------------------------------
// 3. GET /api/auth.php?action=users
// ----------------------------------------------------------------------------
if ($method === 'GET' && $action === 'users') {
    $stmt = $pdo->query("SELECT user_uid as id, username, name, role, avatar, phone, email, delivery_address FROM users ORDER BY id ASC");
    $users = $stmt->fetchAll();
    sendResponse(['success' => true, 'users' => $users]);
}

sendResponse(['success' => false, 'error' => 'Invalid action or request method.'], 400);
