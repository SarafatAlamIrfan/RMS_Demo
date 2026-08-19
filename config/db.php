<?php
if (!ob_get_level()) {
    ob_start();
}
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'flavourcraft';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';
$db_port = getenv('DB_PORT') ?: '3306';

$pdo = null;
$db_error = null;

try {
    $pdo = new PDO("mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    $db_error = $e->getMessage();
}

function get_db() {
    global $pdo;
    return $pdo;
}

function format_bdt($amount) {
    return '৳' . number_format((float)$amount, 2);
}

function set_flash($type, $message) {
    $_SESSION['flash'] = [
        'type' => $type,
        'message' => $message
    ];
}

function get_flash() {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

function get_cart_count() {
    if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
        return 0;
    }
    $count = 0;
    foreach ($_SESSION['cart'] as $item) {
        $count += (int)($item['quantity'] ?? 1);
    }
    return $count;
}

function get_user_avatar($avatar = '', $role = 'Customer') {
    if (!empty($avatar) && strpos($avatar, '?') === false) {
        return $avatar;
    }
    $role_avatars = [
        'Admin' => '👩‍💼',
        'Manager' => '👨‍💼',
        'Kitchen' => '🍳',
        'Customer' => '🌟',
        'Guest' => '👤'
    ];
    return $role_avatars[$role] ?? '👤';
}

function get_current_user_data() {
    global $pdo;
    if (isset($_SESSION['user']) && is_array($_SESSION['user'])) {
        if ($pdo && !empty($_SESSION['user']['user_uid'])) {
            try {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE user_uid = ? LIMIT 1");
                $stmt->execute([$_SESSION['user']['user_uid']]);
                $db_user = $stmt->fetch();
                if ($db_user) {
                    $_SESSION['user'] = array_merge($_SESSION['user'], $db_user);
                }
            } catch (PDOException $e) {
            }
        }
        $_SESSION['user']['avatar'] = get_user_avatar($_SESSION['user']['avatar'] ?? '', $_SESSION['user']['role'] ?? 'Customer');
        return $_SESSION['user'];
    }
    return [
        'user_uid' => null,
        'username' => 'guest',
        'name' => 'Guest Customer',
        'role' => 'Guest',
        'avatar' => '👤',
        'email' => null
    ];
}
