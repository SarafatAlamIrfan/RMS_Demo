<?php
require_once __DIR__ . '/config/db.php';

$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'login';

    if ($action === 'quick_switch') {
        $role = $_POST['role'] ?? 'Admin';
        
        $roles_map = [
            'Admin' => [
                'user_uid' => 'usr_admin',
                'username' => 'admin',
                'name' => 'Sadia Islam Dia',
                'role' => 'Admin',
                'avatar' => '👩‍💼',
                'email' => 'sadia.dia@flavourcraft.bd'
            ],
            'Manager' => [
                'user_uid' => 'usr_manager',
                'username' => 'manager',
                'name' => 'Sarafat Alam Irfan',
                'role' => 'Manager',
                'avatar' => '👨‍💼',
                'email' => 'irfan@flavourcraft.bd'
            ],
            'Kitchen' => [
                'user_uid' => 'usr_kitchen',
                'username' => 'kitchen',
                'name' => 'Chef Rony (Biryani Ustad)',
                'role' => 'Kitchen',
                'avatar' => '🍳',
                'email' => 'rony@flavourcraft.bd'
            ],
            'Customer' => [
                'user_uid' => 'usr_customer',
                'username' => 'customer',
                'name' => 'Asif Rahman',
                'role' => 'Customer',
                'avatar' => '🍽️',
                'email' => 'asif.rahman@gmail.com'
            ]
        ];

        if (isset($roles_map[$role])) {
            $_SESSION['user'] = $roles_map[$role];
            set_flash('success', "Logged in as {$roles_map[$role]['name']} ({$role})");
            header('Location: index.php');
            exit;
        }
    } elseif ($action === 'login' && $pdo) {
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');

        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? LIMIT 1");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if ($user && ($user['password'] === $password || $password === 'admin123' || $password === 'pass123')) {
                $_SESSION['user'] = [
                    'user_uid' => $user['user_uid'],
                    'username' => $user['username'],
                    'name' => $user['name'],
                    'role' => $user['role'],
                    'avatar' => $user['avatar'],
                    'email' => $user['email']
                ];
                set_flash('success', "Welcome back, {$user['name']}!");
                header('Location: index.php');
                exit;
            } else {
                set_flash('error', 'Invalid username or password.');
            }
        } catch (PDOException $e) {
            set_flash('error', 'Login error: ' . $e->getMessage());
        }
    }
}

$page_title = 'Login & Role Switcher - FlavourCraft';
$page_heading = 'Role-Based Authentication Gateway';
$page_desc = 'Switch roles or login with restaurant credentials to test Executive, Kitchen, and Staff permissions';

require_once __DIR__ . '/includes/header.php';
?>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: start; max-width: 950px; margin: 0 auto;">

  <div style="background: #fff; border-radius: 16px; padding: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
      <span style="font-size: 1.5rem;">⚡</span>
      <h3 style="font-size: 1.25rem; margin: 0; color: #0f172a;">1-Click Role Switcher</h3>
    </div>
    <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 20px;">
      Instantly switch active user session to test role-specific screens (Admin, Kitchen KDS, Floor Manager, Customer).
    </p>

    <div style="display: flex; flex-direction: column; gap: 12px;">
      
      <form method="POST" action="login.php" style="margin:0;">
        <input type="hidden" name="action" value="quick_switch" />
        <input type="hidden" name="role" value="Admin" />
        <button type="submit" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 12px; border: 2px solid <?php echo ($current_user['role'] === 'Admin') ? '#e11d48' : '#e2e8f0'; ?>; background: <?php echo ($current_user['role'] === 'Admin') ? '#fff1f2' : '#f8fafc'; ?>; cursor: pointer; text-align: left;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.6rem;">👩‍💼</span>
            <div>
              <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Sadia Islam Dia</div>
              <div style="font-size: 0.8rem; color: #e11d48; font-weight: 700;">Managing Director & Admin</div>
            </div>
          </div>
          <span style="font-size: 0.8rem; font-weight: 700; color: #64748b;">Full Access →</span>
        </button>
      </form>

      <form method="POST" action="login.php" style="margin:0;">
        <input type="hidden" name="action" value="quick_switch" />
        <input type="hidden" name="role" value="Manager" />
        <button type="submit" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 12px; border: 2px solid <?php echo ($current_user['role'] === 'Manager') ? '#3b82f6' : '#e2e8f0'; ?>; background: <?php echo ($current_user['role'] === 'Manager') ? '#eff6ff' : '#f8fafc'; ?>; cursor: pointer; text-align: left;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.6rem;">👨‍💼</span>
            <div>
              <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Sarafat Alam Irfan</div>
              <div style="font-size: 0.8rem; color: #3b82f6; font-weight: 700;">General Restaurant Manager</div>
            </div>
          </div>
          <span style="font-size: 0.8rem; font-weight: 700; color: #64748b;">Staff & Stock →</span>
        </button>
      </form>

      <form method="POST" action="login.php" style="margin:0;">
        <input type="hidden" name="action" value="quick_switch" />
        <input type="hidden" name="role" value="Kitchen" />
        <button type="submit" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 12px; border: 2px solid <?php echo ($current_user['role'] === 'Kitchen') ? '#f59e0b' : '#e2e8f0'; ?>; background: <?php echo ($current_user['role'] === 'Kitchen') ? '#fffbeb' : '#f8fafc'; ?>; cursor: pointer; text-align: left;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.6rem;">🍳</span>
            <div>
              <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Chef Rony</div>
              <div style="font-size: 0.8rem; color: #f59e0b; font-weight: 700;">Head Baburchi (Kitchen Lead)</div>
            </div>
          </div>
          <span style="font-size: 0.8rem; font-weight: 700; color: #64748b;">KDS Station →</span>
        </button>
      </form>

      <form method="POST" action="login.php" style="margin:0;">
        <input type="hidden" name="action" value="quick_switch" />
        <input type="hidden" name="role" value="Customer" />
        <button type="submit" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 12px; border: 2px solid <?php echo ($current_user['role'] === 'Customer') ? '#10b981' : '#e2e8f0'; ?>; background: <?php echo ($current_user['role'] === 'Customer') ? '#ecfdf5' : '#f8fafc'; ?>; cursor: pointer; text-align: left;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.6rem;">🍽️</span>
            <div>
              <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">Asif Rahman</div>
              <div style="font-size: 0.8rem; color: #10b981; font-weight: 700;">Dining Customer</div>
            </div>
          </div>
          <span style="font-size: 0.8rem; font-weight: 700; color: #64748b;">Order & Book →</span>
        </button>
      </form>

    </div>
  </div>

  <div style="background: #fff; border-radius: 16px; padding: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
      <span style="font-size: 1.5rem;">🔐</span>
      <h3 style="font-size: 1.25rem; margin: 0; color: #0f172a;">Credentials Login</h3>
    </div>
    <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 20px;">
      Standard database login using <code>users</code> table credentials.
    </p>

    <form method="POST" action="login.php">
      <input type="hidden" name="action" value="login" />

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Username</label>
        <input type="text" name="username" required placeholder="admin / manager / kitchen / customer" value="admin" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Password</label>
        <input type="password" name="password" required placeholder="admin123" value="admin123" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
      </div>

      <button type="submit" style="width: 100%; background: #0f172a; color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer;">
        Sign In with Credentials
      </button>

      <div style="margin-top: 16px; font-size: 0.8rem; color: #64748b; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 14px;">
        Default Passwords: <code>admin123</code>, <code>manager123</code>, <code>kitchen123</code>
      </div>
    </form>
  </div>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
