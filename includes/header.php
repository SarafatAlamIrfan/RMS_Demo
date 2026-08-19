<?php
require_once __DIR__ . '/../config/db.php';

$current_page = basename($_SERVER['PHP_SELF']);
$current_user = get_current_user_data();
$cart_count = get_cart_count();
$flash = get_flash();

$page_title = $page_title ?? 'FlavourCraft - Modern Bangladeshi Restaurant Management';
$page_heading = $page_heading ?? 'FlavourCraft Menu';
$page_desc = $page_desc ?? 'Authentic Bangladeshi Cuisine & Dining Service';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo htmlspecialchars($page_title); ?></title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="css/variables.css" />
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/menu.css" />
  <link rel="stylesheet" href="css/ordering.css" />
  <link rel="stylesheet" href="css/reservations.css" />
  <link rel="stylesheet" href="css/kds.css" />
  <link rel="stylesheet" href="css/inventory.css" />
  <link rel="stylesheet" href="css/analytics.css" />
  <link rel="stylesheet" href="css/staff.css" />
  <link rel="stylesheet" href="css/rbac.css" />
  <link rel="stylesheet" href="css/auth.css" />
</head>
<body>

  <div id="app-shell">
    <aside class="sidebar" id="app-sidebar">
      <div class="brand-container">
        <a href="index.php" style="display:flex; align-items:center; gap:12px; text-decoration:none; color:inherit;">
          <div class="brand-icon">🔥</div>
          <div class="brand-text">
            <h1 style="margin:0; font-size:1.4rem;">FlavourCraft</h1>
          </div>
        </a>
      </div>

      <nav class="nav-menu">
        <div class="nav-section-title">Customer Experience</div>
        <a class="nav-item <?php echo ($current_page === 'index.php' || $current_page === 'menu.php') ? 'active' : ''; ?>" href="index.php" id="nav-menu">
          <span class="icon">📖</span>
          <span>Digital Menu</span>
        </a>
        <a class="nav-item <?php echo ($current_page === 'reservations.php') ? 'active' : ''; ?>" href="reservations.php" id="nav-reservations">
          <span class="icon">📅</span>
          <span>Table Bookings</span>
        </a>
        <a class="nav-item <?php echo ($current_page === 'track_order.php') ? 'active' : ''; ?>" href="track_order.php" id="nav-tracking">
          <span class="icon">📍</span>
          <span>Live Order Tracker</span>
        </a>

        <?php if (in_array($current_user['role'] ?? '', ['Admin', 'Manager', 'Kitchen'])): ?>
        <div class="nav-section-title">Operations & Kitchen</div>
        <a class="nav-item <?php echo ($current_page === 'kds.php') ? 'active' : ''; ?>" href="kds.php" id="nav-kds">
          <span class="icon">🍳</span>
          <span>Kitchen Display (KDS)</span>
          <span class="nav-badge danger" style="background:#e11d48; color:#fff; font-size:0.7rem; padding:2px 6px; border-radius:4px;">LIVE</span>
        </a>
        <?php endif; ?>

        <?php if (in_array($current_user['role'] ?? '', ['Admin', 'Manager'])): ?>
        <div class="nav-section-title">Admin & Operations</div>
        <a class="nav-item <?php echo ($current_page === 'menu_manage.php') ? 'active' : ''; ?>" href="menu_manage.php" id="nav-menu-manage">
          <span class="icon">📋</span>
          <span>Menu Management</span>
        </a>
        <a class="nav-item <?php echo ($current_page === 'inventory.php') ? 'active' : ''; ?>" href="inventory.php" id="nav-inventory">
          <span class="icon">📦</span>
          <span>Inventory & Recipes</span>
        </a>
        <a class="nav-item <?php echo ($current_page === 'analytics.php') ? 'active' : ''; ?>" href="analytics.php" id="nav-analytics">
          <span class="icon">📊</span>
          <span>Executive Analytics</span>
        </a>
        <a class="nav-item <?php echo ($current_page === 'staff.php') ? 'active' : ''; ?>" href="staff.php" id="nav-staff">
          <span class="icon">👥</span>
          <span>Staff Management</span>
        </a>
        <?php endif; ?>
      </nav>

      <div class="sidebar-footer">
        <a href="<?php echo isset($_SESSION['user']) ? 'profile.php' : 'login.php'; ?>" style="text-decoration:none; color:inherit; display:block;">
          <div class="user-profile-card" style="cursor:pointer;" title="<?php echo isset($_SESSION['user']) ? 'Click to view & edit your profile' : 'Click to sign in'; ?>">
            <div class="user-avatar"><?php echo htmlspecialchars(get_user_avatar($current_user['avatar'] ?? '', $current_user['role'] ?? 'Guest')); ?></div>
            <div class="user-info">
              <div class="user-name"><?php echo htmlspecialchars($current_user['name'] ?? 'Guest Customer'); ?></div>
              <div class="user-role-badge"><?php echo htmlspecialchars($current_user['role'] ?? 'Guest'); ?></div>
            </div>
          </div>
        </a>
      </div>
    </aside>

    <div class="main-wrapper">
      <header class="topbar">
        <div class="topbar-left">
          <div class="page-heading">
            <h2 id="topbar-page-title"><?php echo htmlspecialchars($page_heading); ?></h2>
            <p id="topbar-page-desc"><?php echo htmlspecialchars($page_desc); ?></p>
          </div>
          <?php if ($current_page === 'index.php' || $current_page === 'menu.php'): ?>
          <form method="GET" action="index.php" class="topbar-search" style="display:flex; align-items:center; gap:8px;">
            <span>🔍</span>
            <input type="text" name="search" id="global-search-input" placeholder="Search dishes, ingredients..." value="<?php echo htmlspecialchars($_GET['search'] ?? ''); ?>" />
            <?php if (!empty($_GET['category'])): ?>
              <input type="hidden" name="category" value="<?php echo htmlspecialchars($_GET['category']); ?>" />
            <?php endif; ?>
          </form>
          <?php endif; ?>
        </div>

        <div class="topbar-right">
          <div style="display:flex; align-items:center; gap:8px;">
            <?php if (isset($_SESSION['user'])): ?>
              <a href="profile.php" class="btn btn-secondary" style="padding:6px 12px; font-size:0.85rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px; border:1px solid #e2e8f0; border-radius:8px; background:#fff; color:#334155; font-weight:600;" title="Edit Profile">
                <span>👤</span>
                <span>Profile</span>
              </a>
              <a href="login.php" class="btn btn-secondary" style="padding:6px 12px; font-size:0.85rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px; border:1px solid #e2e8f0; border-radius:8px; background:#f8fafc; color:#334155; font-weight:600;" title="Switch Role">
                <span><?php echo htmlspecialchars(get_user_avatar($current_user['avatar'] ?? '', $current_user['role'])); ?></span>
                <span>Role: <strong><?php echo htmlspecialchars($current_user['role']); ?></strong></span>
              </a>
              <a href="logout.php" class="btn btn-sm" style="padding:6px 12px; font-size:0.85rem; text-decoration:none; background:#fee2e2; color:#b91c1c; border-radius:6px; font-weight:700;">🚪 Logout</a>
            <?php else: ?>
              <a href="login.php" class="btn btn-primary" style="padding:7px 16px; font-size:0.85rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px; border-radius:8px; background:#0f172a; color:#fff; font-weight:700;">
                <span>🔑</span>
                <span>Sign In / Demo</span>
              </a>
            <?php endif; ?>
          </div>

          <a href="cart.php" class="cart-toggle-btn" id="btn-toggle-cart" style="text-decoration:none; color:inherit;">
            <span>🛒</span>
            <span>Cart</span>
            <span class="badge" id="cart-badge-count" style="background:#e11d48; color:#fff; padding:2px 8px; border-radius:999px; font-size:0.75rem; font-weight:700;">
              <?php echo $cart_count; ?>
            </span>
          </a>
        </div>
      </header>

      <main class="content-body" style="padding: 24px;">

        <?php if ($flash): ?>
          <div style="margin-bottom: 20px; padding: 14px 18px; border-radius: 10px; font-weight: 500; display: flex; align-items: center; justify-content: space-between; <?php echo ($flash['type'] === 'success') ? 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' : 'background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;'; ?>">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span><?php echo ($flash['type'] === 'success') ? '✅' : '⚠️'; ?></span>
              <span><?php echo htmlspecialchars($flash['message']); ?></span>
            </div>
            <button onclick="this.parentElement.remove()" style="background:none; border:none; cursor:pointer; font-size:1.1rem; color:inherit;">✕</button>
          </div>
        <?php endif; ?>

        <?php if ($db_error): ?>
          <div style="margin-bottom: 20px; padding: 16px; border-radius: 10px; background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239;">
            <div style="font-weight: 700; font-size: 1rem; margin-bottom: 6px;">⚠️ MySQL Database Connection Notice</div>
            <div style="font-size: 0.9rem; margin-bottom: 8px;">Could not connect to MySQL: <code><?php echo htmlspecialchars($db_error); ?></code></div>
            <div style="font-size: 0.85rem; color: #475569;">
              💡 <strong>Quick Fix for XAMPP:</strong> Start Apache & MySQL in XAMPP Control Panel, open <code>http://localhost/phpmyadmin</code>, and import <code>database/flavourcraft.sql</code>.
            </div>
          </div>
        <?php endif; ?>
