<?php
require_once __DIR__ . '/../config/db.php';

function check_auth($allowed_roles = []) {
    $user = get_current_user_data();
    
    if (empty($allowed_roles)) {
        return true;
    }
    
    if (!in_array($user['role'], $allowed_roles)) {
        set_flash('error', "Access Denied: Your role ({$user['role']}) does not have permission to view this page.");
        header('Location: index.php');
        exit;
    }
    
    return true;
}
