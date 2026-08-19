<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/auth_check.php';

check_auth(['Admin', 'Manager']);

$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $pdo) {
    $name = trim($_POST['name'] ?? '');
    $role = $_POST['role'] ?? 'Customer';
    $username = trim($_POST['username'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $avatar = $_POST['avatar'] ?? '👤';
    $uid = 'usr_' . bin2hex(random_bytes(4));

    if ($name && $username) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO users (user_uid, username, password, name, role, avatar, phone)
                VALUES (?, ?, 'pass123', ?, ?, ?, ?)
            ");
            $stmt->execute([$uid, $username, $name, $role, $avatar, $phone]);
            set_flash('success', "Staff member '{$name}' added as {$role}.");
        } catch (PDOException $e) {
            set_flash('error', 'Failed to add staff: ' . $e->getMessage());
        }
    }
}

$staff_members = [];
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM users ORDER BY FIELD(role, 'Admin', 'Manager', 'Kitchen', 'Customer'), id ASC");
        $staff_members = $stmt->fetchAll();
    } catch (PDOException $e) {
        $db_error = $e->getMessage();
    }
}

$page_title = 'Staff Management - FlavourCraft';
$page_heading = 'Staff Roster & Shift Operations';
$page_desc = 'Manage restaurant team members, assign station roles, and coordinate dining service';

require_once __DIR__ . '/includes/header.php';
?>

<div style="display: grid; grid-template-columns: 1fr 340px; gap: 30px; align-items: start;">

  <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <h3 style="font-size: 1.2rem; margin: 0 0 16px; color: #0f172a; display: flex; align-items: center; gap: 8px;">
      <span>👥</span> Active Restaurant Team
    </h3>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
      <?php foreach ($staff_members as $member): 
        $role = $member['role'];
        $badge_color = ($role === 'Admin') ? '#e11d48' : (($role === 'Manager') ? '#3b82f6' : (($role === 'Kitchen') ? '#f59e0b' : '#64748b'));
      ?>
        <div style="background: #f8fafc; border-radius: 12px; padding: 18px; border: 1px solid #e2e8f0; display: flex; gap: 14px; align-items: center;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: #fff; border: 2px solid <?php echo $badge_color; ?>; display: flex; align-items: center; justify-content: center; font-size: 1.6rem;">
            <?php echo htmlspecialchars($member['avatar'] ?? '👤'); ?>
          </div>
          <div>
            <h4 style="margin: 0 0 2px; font-size: 1rem; color: #0f172a;">
              <?php echo htmlspecialchars($member['name']); ?>
            </h4>
            <span style="display: inline-block; background: <?php echo $badge_color; ?>; color: #fff; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 4px;">
              <?php echo htmlspecialchars($role); ?>
            </span>
            <div style="font-size: 0.8rem; color: #64748b;">
              📞 <?php echo htmlspecialchars($member['phone'] ?? 'N/A'); ?>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <h3 style="font-size: 1.15rem; margin: 0 0 16px; color: #0f172a; display: flex; align-items: center; gap: 8px;">
      <span>➕</span> Add New Staff
    </h3>

    <form method="POST" action="staff.php">
      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 4px;">Full Name *</label>
        <input type="text" name="name" required placeholder="e.g. Rafiqul Islam" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 4px;">Username *</label>
        <input type="text" name="username" required placeholder="e.g. rafiq123" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 4px;">Role *</label>
        <select name="role" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
          <option value="Manager">Manager</option>
          <option value="Kitchen">Kitchen (Cook / Baburchi)</option>
          <option value="Customer">Floor Waiter / Staff</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 4px;">Avatar Emoji</label>
        <select name="avatar" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
          <option value="👨‍🍳">👨‍🍳 Cook / Chef</option>
          <option value="👨‍💼">👨‍💼 Manager</option>
          <option value="👩‍💼">👩‍💼 Executive</option>
          <option value="🤵">🤵 Waiter</option>
          <option value="🛵">🛵 Rider</option>
        </select>
      </div>

      <div style="margin-bottom: 18px;">
        <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 4px;">Contact Phone</label>
        <input type="text" name="phone" placeholder="+880 1700-000000" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
      </div>

      <button type="submit" style="width: 100%; background: #e11d48; color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer;">
        Save Staff Member
      </button>
    </form>
  </div>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
