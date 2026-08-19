<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/auth_check.php';

$user = get_current_user_data();

if ($user['role'] === 'Guest' || empty($user['user_uid'])) {
    set_flash('error', 'Please sign in to view and edit your profile.');
    header('Location: login.php?redirect=profile.php');
    exit;
}

$conn = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $conn) {
    $name = trim($_POST['name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $delivery_address = trim($_POST['delivery_address'] ?? '');
    $avatar = $_POST['avatar'] ?? ($user['avatar'] ?? '👤');
    $new_password = trim($_POST['new_password'] ?? '');

    if ($name) {
        $safe_name = mysqli_real_escape_string($conn, $name);
        $safe_phone = mysqli_real_escape_string($conn, $phone);
        $safe_email = mysqli_real_escape_string($conn, $email);
        $safe_addr = mysqli_real_escape_string($conn, $delivery_address);
        $safe_avatar = mysqli_real_escape_string($conn, $avatar);
        $safe_uid = mysqli_real_escape_string($conn, $user['user_uid']);

        if (!empty($new_password)) {
            $safe_pass = mysqli_real_escape_string($conn, $new_password);
            $sql = "
                UPDATE users 
                SET name = '{$safe_name}', phone = '{$safe_phone}', email = '{$safe_email}', 
                    delivery_address = '{$safe_addr}', avatar = '{$safe_avatar}', password = '{$safe_pass}'
                WHERE user_uid = '{$safe_uid}'
            ";
        } else {
            $sql = "
                UPDATE users 
                SET name = '{$safe_name}', phone = '{$safe_phone}', email = '{$safe_email}', 
                    delivery_address = '{$safe_addr}', avatar = '{$safe_avatar}'
                WHERE user_uid = '{$safe_uid}'
            ";
        }

        if (mysqli_query($conn, $sql)) {
            $_SESSION['user']['name'] = $name;
            $_SESSION['user']['phone'] = $phone;
            $_SESSION['user']['email'] = $email;
            $_SESSION['user']['delivery_address'] = $delivery_address;
            $_SESSION['user']['avatar'] = $avatar;

            set_flash('success', 'Profile information updated successfully!');
            header('Location: profile.php');
            exit;
        } else {
            set_flash('error', 'Profile update failed: ' . mysqli_error($conn));
        }
    } else {
        set_flash('error', 'Full Name is required.');
    }
}

$user = get_current_user_data();

$page_title = 'My Profile & Account Settings - FlavourCraft';
$page_heading = 'User Profile & Preferences';
$page_desc = 'Manage your account details, contact info, default delivery address, and credentials';

require_once __DIR__ . '/includes/header.php';
?>

<div style="display: grid; grid-template-columns: 320px 1fr; gap: 30px; align-items: start; max-width: 1050px; margin: 0 auto;">

  <div style="background: #fff; border-radius: 16px; padding: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); text-align: center;">
    
    <div style="width: 90px; height: 90px; border-radius: 50%; background: #fff1f2; border: 3px solid #e11d48; display: flex; align-items: center; justify-content: center; font-size: 3rem; margin: 0 auto 16px; box-shadow: 0 4px 12px rgba(225,29,72,0.15);">
      <?php echo htmlspecialchars($user['avatar'] ?? '👤'); ?>
    </div>

    <h3 style="margin: 0 0 4px; font-size: 1.25rem; color: #0f172a;">
      <?php echo htmlspecialchars($user['name']); ?>
    </h3>
    
    <div style="margin-bottom: 12px;">
      <span style="display: inline-block; background: #e11d48; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">
        ● <?php echo htmlspecialchars($user['role']); ?>
      </span>
    </div>

    <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 0.85rem; color: #64748b; text-align: left; display: flex; flex-direction: column; gap: 10px;">
      <div>
        <span style="font-weight: 600; color: #334155;">Username:</span> 
        <code>@<?php echo htmlspecialchars($user['username']); ?></code>
      </div>
      <div>
        <span style="font-weight: 600; color: #334155;">Phone:</span> 
        <span><?php echo htmlspecialchars($user['phone'] ?? 'Not provided'); ?></span>
      </div>
      <div>
        <span style="font-weight: 600; color: #334155;">Email:</span> 
        <span><?php echo htmlspecialchars($user['email'] ?? 'Not provided'); ?></span>
      </div>
    </div>

    <div style="margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
      <a href="logout.php" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #fee2e2; color: #991b1b; border-radius: 8px; font-size: 0.85rem; font-weight: 700; text-decoration: none;">
        🚪 Sign Out of Account
      </a>
    </div>

  </div>

  <div style="background: #fff; border-radius: 16px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px;">
      <span style="font-size: 1.4rem;">⚙️</span>
      <div>
        <h3 style="font-size: 1.2rem; margin: 0; color: #0f172a;">Edit Account Details</h3>
        <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Update your personal profile, contact information, and security</p>
      </div>
    </div>

    <form method="POST" action="profile.php">
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px;">Full Name *</label>
          <input type="text" name="name" required value="<?php echo htmlspecialchars($user['name']); ?>" placeholder="Your Full Name" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>

        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px;">Profile Avatar Emoji</label>
          <select name="avatar" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
            <option value="👩‍💼" <?php echo (($user['avatar'] ?? '') === '👩‍💼') ? 'selected' : ''; ?>>👩‍💼 Executive Female</option>
            <option value="👨‍💼" <?php echo (($user['avatar'] ?? '') === '👨‍💼') ? 'selected' : ''; ?>>👨‍💼 Executive Male</option>
            <option value="🍳" <?php echo (($user['avatar'] ?? '') === '🍳') ? 'selected' : ''; ?>>🍳 Head Baburchi / Chef</option>
            <option value="🍽️" <?php echo (($user['avatar'] ?? '') === '🍽️') ? 'selected' : ''; ?>>🍽️ Dining Customer</option>
            <option value="👤" <?php echo (($user['avatar'] ?? '') === '👤') ? 'selected' : ''; ?>>👤 Member / Staff</option>
            <option value="🌟" <?php echo (($user['avatar'] ?? '') === '🌟') ? 'selected' : ''; ?>>🌟 VIP Gold Member</option>
            <option value="👑" <?php echo (($user['avatar'] ?? '') === '👑') ? 'selected' : ''; ?>>👑 Royal Patron</option>
            <option value="🛵" <?php echo (($user['avatar'] ?? '') === '🛵') ? 'selected' : ''; ?>>🛵 Express Rider</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px;">Contact Phone Number</label>
          <input type="text" name="phone" value="<?php echo htmlspecialchars($user['phone'] ?? ''); ?>" placeholder="+880 1700-000000" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>

        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px;">Email Address</label>
          <input type="email" name="email" value="<?php echo htmlspecialchars($user['email'] ?? ''); ?>" placeholder="user@example.com" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px;">Default Home / Delivery Address</label>
        <textarea name="delivery_address" rows="2" placeholder="e.g. House 42, Road 11, Block D, Banani, Dhaka" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;"><?php echo htmlspecialchars($user['delivery_address'] ?? ''); ?></textarea>
      </div>

      <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
        <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 4px;">
          Change Password (Optional)
        </label>
        <p style="font-size: 0.75rem; color: #64748b; margin: 0 0 10px;">Leave blank if you do not want to change your current password.</p>
        <input type="password" name="new_password" placeholder="Enter new password (min 4 characters)" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem; background: #fff;" />
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <a href="index.php" style="padding: 12px 20px; border-radius: 8px; border: 1px solid #cbd5e1; color: #475569; text-decoration: none; font-weight: 600; font-size: 0.9rem;">
          Cancel
        </a>
        <button type="submit" style="background: linear-gradient(135deg, #e11d48, #be123c); color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.3);">
          💾 Save Profile Changes
        </button>
      </div>

    </form>

  </div>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
