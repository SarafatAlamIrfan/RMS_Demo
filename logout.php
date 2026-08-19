<?php
require_once __DIR__ . '/config/db.php';

unset($_SESSION['user']);
session_destroy();

session_start();
set_flash('success', 'You have been logged out successfully.');
header('Location: index.php');
exit;
