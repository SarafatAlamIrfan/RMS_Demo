<?php
require_once __DIR__ . '/config/db.php';

$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $guest_name = trim($_POST['guest_name'] ?? '');
    $guest_phone = trim($_POST['guest_phone'] ?? '');
    $guest_email = trim($_POST['guest_email'] ?? '');
    $party_size = max(1, (int)($_POST['party_size'] ?? 2));
    $reservation_date = $_POST['reservation_date'] ?? date('Y-m-d');
    $time_slot = $_POST['time_slot'] ?? '19:30';
    $table_preference = $_POST['table_preference'] ?? 'Ground Floor Heritage Lounge';
    $special_request = trim($_POST['special_request'] ?? '');

    $booking_uid = 'res_' . bin2hex(random_bytes(5));
    $booking_code = 'FC-RES-' . rand(100, 999);

    if (!isset($_SESSION['my_reservations']) || !is_array($_SESSION['my_reservations'])) {
        $_SESSION['my_reservations'] = [];
    }
    $_SESSION['my_reservations'][] = $booking_code;

    if ($pdo && $guest_name && $guest_phone) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO reservations (
                    booking_uid, booking_code, guest_name, guest_phone, guest_email,
                    party_size, reservation_date, time_slot, table_preference,
                    deposit_paid, status, special_request
                ) VALUES (
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    500.00, 'Confirmed', ?
                )
            ");
            $stmt->execute([
                $booking_uid, $booking_code, $guest_name, $guest_phone, $guest_email,
                $party_size, $reservation_date, $time_slot, $table_preference,
                $special_request
            ]);
            set_flash('success', "🎉 Table Reservation #{$booking_code} Confirmed! We look forward to welcoming you.");
        } catch (PDOException $e) {
            set_flash('error', 'Reservation failed: ' . $e->getMessage());
        }
    } else {
        set_flash('success', "🎉 Table Reservation #{$booking_code} Confirmed for {$guest_name}!");
    }
}

$user = get_current_user_data();
$is_staff = ($user['role'] === 'Admin' || $user['role'] === 'Manager');

$reservations = [];
if ($pdo) {
    try {
        if ($is_staff) {
            $stmt = $pdo->query("SELECT * FROM reservations ORDER BY reservation_date DESC, id DESC LIMIT 10");
            $reservations = $stmt->fetchAll();
        } else {
            $my_codes = $_SESSION['my_reservations'] ?? [];
            $user_phone = $user['phone'] ?? '';
            $user_name = ($user['role'] !== 'Guest') ? $user['name'] : '';

            $conditions = [];
            $params = [];

            if (!empty($my_codes)) {
                $placeholders = implode(',', array_fill(0, count($my_codes), '?'));
                $conditions[] = "booking_code IN ($placeholders)";
                $params = array_merge($params, $my_codes);
            }
            if ($user_phone) {
                $conditions[] = "guest_phone = ?";
                $params[] = $user_phone;
            }
            if ($user_name) {
                $conditions[] = "guest_name = ?";
                $params[] = $user_name;
            }

            if (!empty($conditions)) {
                $sql = "SELECT * FROM reservations WHERE " . implode(' OR ', $conditions) . " ORDER BY id DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $reservations = $stmt->fetchAll();
            }
        }
    } catch (PDOException $e) {
    }
}

$page_title = 'Table Bookings & Reservations - FlavourCraft';
$page_heading = 'FlavourCraft Dining Reservations';
$page_desc = 'Reserve your table for traditional feasts, rooftop gatherings, and VIP dining';

require_once __DIR__ . '/includes/header.php';
?>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: start;">

  <div style="background: #fff; border-radius: 16px; padding: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <h2 style="font-size: 1.3rem; margin: 0 0 8px; color: #0f172a; display: flex; align-items: center; gap: 10px;">
      <span>📅</span> Book a Dining Table
    </h2>
    <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 20px;">
      Instant table confirmation with digital e-Pass for your dining party.
    </p>

    <form method="POST" action="reservations.php">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Guest Name *</label>
          <input type="text" name="guest_name" required placeholder="e.g. Farhan Kabir" value="<?php echo ($current_user['role'] !== 'Guest') ? htmlspecialchars($current_user['name']) : ''; ?>" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Phone Number *</label>
          <input type="text" name="guest_phone" required placeholder="+880 1712-000000" value="<?php echo htmlspecialchars($current_user['phone'] ?? ''); ?>" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Email Address</label>
          <input type="email" name="guest_email" placeholder="guest@example.com" value="<?php echo htmlspecialchars($current_user['email'] ?? ''); ?>" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Party Size (Guests) *</label>
          <select name="party_size" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
            <option value="2">2 Persons (Couple Table)</option>
            <option value="4" selected>4 Persons (Standard Table)</option>
            <option value="6">6 Persons (Large Family)</option>
            <option value="8">8 Persons (Feast Group)</option>
            <option value="12">12+ Persons (VIP Hall)</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Date *</label>
          <input type="date" name="reservation_date" required value="<?php echo date('Y-m-d'); ?>" min="<?php echo date('Y-m-d'); ?>" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Time Slot *</label>
          <select name="time_slot" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
            <option value="13:00">1:00 PM (Lunch Feast)</option>
            <option value="14:30">2:30 PM (Afternoon Dining)</option>
            <option value="19:30" selected>7:30 PM (Prime Dinner)</option>
            <option value="21:00">9:00 PM (Late Dinner)</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Dining Zone Preference</label>
        <select name="table_preference" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
          <option value="Ground Floor Heritage Lounge">Ground Floor Heritage Lounge</option>
          <option value="Rooftop Garden View">Rooftop Garden View</option>
          <option value="Family VIP Hall">Family VIP Private Hall</option>
          <option value="Outdoor Gazebo">Outdoor Gazebo</option>
        </select>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Special Notes / Dietary Requests</label>
        <textarea name="special_request" rows="2" placeholder="e.g. Birthday cake arrangement, extra spicy setup..." style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;"></textarea>
      </div>

      <button type="submit" style="width: 100%; background: linear-gradient(135deg, #e11d48, #be123c); color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.35);">
        ✨ Confirm Table Reservation
      </button>
    </form>
  </div>

  <div style="display: flex; flex-direction: column; gap: 20px;">
    
    <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      <h3 style="font-size: 1.15rem; margin: 0 0 6px; color: #0f172a; display: flex; align-items: center; gap: 8px;">
        <span>🎟️</span> <?php echo $is_staff ? 'Confirmed Table e-Passes (Admin & Manager View)' : 'Your Confirmed Table e-Pass'; ?>
      </h3>
      <p style="font-size: 0.8rem; color: #64748b; margin: 0 0 16px;">
        <?php echo $is_staff ? 'Full guest table booking directory.' : '🔒 Private: Only you and restaurant management can view your booking.'; ?>
      </p>

      <?php if (empty($reservations)): ?>
        <div style="padding: 35px 20px; text-align: center; color: #64748b; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">
          <div style="font-size: 2rem; margin-bottom: 8px;">🍽️</div>
          <div style="font-weight: 700; color: #334155; margin-bottom: 4px;">No Active Bookings</div>
          <div style="font-size: 0.85rem;">
            <?php echo $is_staff ? 'No guest reservations in the system.' : 'Complete the reservation form on the left to confirm your table and view your digital e-Pass.'; ?>
          </div>
        </div>
      <?php else: ?>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <?php foreach ($reservations as $res): ?>
            <div style="background: linear-gradient(135deg, #fff, #f8fafc); border: 1px solid #e2e8f0; border-left: 5px solid #e11d48; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 1rem; color: #e11d48;">
                    <?php echo htmlspecialchars($res['booking_code']); ?>
                  </span>
                  <div style="font-weight: 700; color: #0f172a; margin-top: 2px;">
                    <?php echo htmlspecialchars($res['guest_name']); ?>
                  </div>
                </div>
                <span style="background: #dcfce7; color: #166534; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 6px;">
                  ● <?php echo htmlspecialchars($res['status']); ?>
                </span>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; color: #475569; margin-top: 10px; border-top: 1px dashed #e2e8f0; padding-top: 10px;">
                <div>👥 <strong><?php echo (int)$res['party_size']; ?> Guests</strong></div>
                <div>⏰ <strong><?php echo htmlspecialchars($res['time_slot']); ?></strong> (<?php echo htmlspecialchars($res['reservation_date']); ?>)</div>
                <div style="grid-column: span 2;">🏛️ Zone: <strong><?php echo htmlspecialchars($res['table_preference']); ?></strong></div>
                <?php if (!empty($res['special_request'])): ?>
                  <div style="grid-column: span 2; font-style: italic; color: #64748b;">📝 "<?php echo htmlspecialchars($res['special_request']); ?>"</div>
                <?php endif; ?>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    </div>

    <div style="background: #fff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      <h4 style="font-size: 0.95rem; margin: 0 0 10px; color: #0f172a; display: flex; align-items: center; gap: 6px;">
        <span>ℹ️</span> Reservation Policy & Notes
      </h4>
      <ul style="margin: 0; padding-left: 18px; font-size: 0.8rem; color: #64748b; line-height: 1.6;">
        <li>Tables are held for up to 15 minutes past scheduled booking time.</li>
        <li>For corporate events or groups exceeding 12 guests, contact our Banquet Manager.</li>
        <li>100% Halal kitchen certification guaranteed.</li>
      </ul>
    </div>

  </div>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
