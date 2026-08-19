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
$db_port = (int)(getenv('DB_PORT') ?: 3306);

$conn = @mysqli_connect($db_host, $db_user, $db_pass, $db_name, $db_port);
$db_error = null;

if (!$conn) {
    $db_error = mysqli_connect_error();
} else {
    mysqli_set_charset($conn, "utf8mb4");
}

function get_db() {
    global $conn;
    return $conn;
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
    global $conn;
    if (isset($_SESSION['user']) && is_array($_SESSION['user'])) {
        if ($conn && !empty($_SESSION['user']['user_uid'])) {
            $safe_uid = mysqli_real_escape_string($conn, $_SESSION['user']['user_uid']);
            $res = mysqli_query($conn, "SELECT * FROM users WHERE user_uid = '{$safe_uid}' LIMIT 1");
            if ($res && $db_user = mysqli_fetch_assoc($res)) {
                $_SESSION['user'] = array_merge($_SESSION['user'], $db_user);
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
