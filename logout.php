<?php
require_once __DIR__ . '/config/db.php';

unset($_SESSION['user']);
set_flash('success', 'You have been logged out successfully.');
header('Location: index.php');
exit;
