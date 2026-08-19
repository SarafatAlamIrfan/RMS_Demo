<?php
$page_title = 'Live Order Tracker - FlavourCraft';
$page_heading = 'Live Order Tracker & Rider Radar';
$page_desc = 'Real-time kitchen dispatch status, rider GPS tracking & instant digital receipt';

require_once __DIR__ . '/includes/header.php';

$search_order = trim($_GET['order_id'] ?? '');
$order = null;
$order_items = [];

$pdo = get_db();

if ($pdo && !empty($search_order)) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE order_number = ? OR order_uid = ? LIMIT 1");
        $stmt->execute([$search_order, $search_order]);
        $order = $stmt->fetch();

        if ($order) {
            $item_stmt = $pdo->prepare("SELECT * FROM order_items WHERE order_uid = ?");
            $item_stmt->execute([$order['order_uid']]);
            $order_items = $item_stmt->fetchAll();
        }
    } catch (PDOException $e) {
        $db_error = $e->getMessage();
    }
}

if (!$order && isset($_SESSION['latest_order'])) {
    if (empty($search_order) || $_SESSION['latest_order']['order_number'] === $search_order) {
        $order = $_SESSION['latest_order'];
        $order_items = $_SESSION['latest_order']['items'] ?? [];
    }
}
?>

<div style="background: #fff; padding: 20px 24px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
  <form method="GET" action="track_order.php" style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 250px;">
      <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 4px; text-transform: uppercase;">
        Track Any Order by Number
      </label>
      <input type="text" name="order_id" placeholder="e.g. FC-1001 or ord_..." value="<?php echo htmlspecialchars($search_order ?: ($order['order_number'] ?? '')); ?>" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.95rem; font-family: 'JetBrains Mono', monospace;" />
    </div>
    <button type="submit" style="background: #e11d48; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-top: 20px;">
      <span>🔍</span> Track Order
    </button>
  </form>
</div>

<?php if (!$order): ?>
  <div style="background: #fff; border-radius: 16px; padding: 60px 20px; text-align: center; border: 1px solid #e2e8f0;">
    <div style="font-size: 3.5rem; margin-bottom: 14px;">📍</div>
    <h3 style="color: #1e293b; margin-bottom: 6px;">No Active Order to Display</h3>
    <p style="color: #64748b; margin-bottom: 20px;">Enter an order number above or place a new order from our delicious menu.</p>
    <a href="index.php" style="background: #e11d48; color: #fff; padding: 10px 20px; border-radius: 8px; font-weight: 700; text-decoration: none;">Explore Menu</a>
  </div>
<?php else: 
  $status = $order['status'] ?? 'New';
  $steps = [
    'New' => ['icon' => '📝', 'label' => 'Order Received', 'desc' => 'Sent to Kitchen'],
    'Preparing' => ['icon' => '🍳', 'label' => 'Cooking in Kitchen', 'desc' => 'Chef preparing dish'],
    'Ready to Serve' => ['icon' => '📦', 'label' => 'Ready & Packed', 'desc' => 'Passed quality check'],
    'Out for Delivery' => ['icon' => '🛵', 'label' => 'Out with Rider', 'desc' => 'On the way to destination'],
    'Completed' => ['icon' => '✅', 'label' => 'Delivered / Served', 'desc' => 'Enjoy your meal!']
  ];
  $status_keys = array_keys($steps);
  $current_idx = array_search($status, $status_keys);
  if ($current_idx === false) $current_idx = 0;
?>

  <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">🔥</span>
          <h2 style="font-size: 1.4rem; margin: 0; color: #0f172a; font-family: 'JetBrains Mono', monospace;">
            <?php echo htmlspecialchars($order['order_number']); ?>
          </h2>
          <span style="background: #e11d48; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 20px;">
            <?php echo htmlspecialchars($order['order_type'] ?? 'Dine-In'); ?>
          </span>
        </div>
        <div style="color: #64748b; font-size: 0.85rem; margin-top: 4px;">
          Customer: <strong><?php echo htmlspecialchars($order['customer_name']); ?></strong> (<?php echo htmlspecialchars($order['customer_phone']); ?>)
        </div>
      </div>

      <div style="text-align: right;">
        <div style="font-size: 0.8rem; color: #64748b;">Current Status</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #e11d48;">
          <?php echo htmlspecialchars($status); ?>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; position: relative; margin: 30px 10px 20px;">
      <div style="position: absolute; top: 20px; left: 5%; right: 5%; height: 4px; background: #e2e8f0; z-index: 1;"></div>
      <div style="position: absolute; top: 20px; left: 5%; width: <?php echo ($current_idx / (count($status_keys) - 1)) * 90; ?>%; height: 4px; background: #e11d48; z-index: 2; transition: width 0.4s;"></div>

      <?php foreach ($steps as $k => $step_info): 
        $idx = array_search($k, $status_keys);
        $is_done = ($idx <= $current_idx);
        $is_active = ($idx === $current_idx);
      ?>
        <div style="position: relative; z-index: 3; text-align: center; flex: 1;">
          <div style="width: 44px; height: 44px; border-radius: 50%; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; <?php echo $is_active ? 'background: #e11d48; color: #fff; box-shadow: 0 0 0 6px rgba(225,29,72,0.2);' : ($is_done ? 'background: #059669; color: #fff;' : 'background: #f1f5f9; color: #94a3b8; border: 2px solid #e2e8f0;'); ?>">
            <?php echo $step_info['icon']; ?>
          </div>
          <div style="font-size: 0.85rem; font-weight: 700; color: <?php echo $is_done ? '#0f172a' : '#94a3b8'; ?>;">
            <?php echo $step_info['label']; ?>
          </div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">
            <?php echo $step_info['desc']; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
    
    <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      <h3 style="font-size: 1.15rem; margin: 0 0 16px; color: #0f172a; display: flex; align-items: center; gap: 8px;">
        <span>🛵</span> Delivery & Kitchen Radar
      </h3>

      <?php if (($order['order_type'] ?? '') === 'Delivery'): ?>
        <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: #fed7aa; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
              🛵
            </div>
            <div>
              <div style="font-weight: 700; color: #0f172a;">Rider: Tanvir Alam</div>
              <div style="font-size: 0.8rem; color: #64748b;">Vehicle: Honda Motorcycle (Dhaka Metro-Ha 44-1234)</div>
              <div style="font-size: 0.8rem; color: #059669; font-weight: 600; margin-top: 2px;">● Active Tracking</div>
            </div>
          </div>
        </div>

        <div style="font-size: 0.85rem; color: #475569; margin-bottom: 8px;">
          <strong>Delivery Destination:</strong><br />
          <?php echo htmlspecialchars($order['delivery_address'] ?? 'Banani, Dhaka'); ?>
        </div>
      <?php elseif (($order['order_type'] ?? '') === 'Dine-In'): ?>
        <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">Table Service:</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #e11d48;">
            <?php echo htmlspecialchars($order['table_number'] ?? 'Table 01'); ?>
          </div>
          <div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">Assigned Waiter: Server Rafiq (Floor A)</div>
        </div>
      <?php else: ?>
        <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
          <div style="font-weight: 700; color: #0f172a;">Takeaway Pickup Counter:</div>
          <div style="font-size: 0.9rem; color: #475569; margin-top: 4px;">Please show this order ticket at Counter #2 when status is "Ready & Packed".</div>
        </div>
      <?php endif; ?>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; margin-top: 10px; font-size: 0.85rem; color: #64748b;">
        <div>Payment Method: <strong><?php echo htmlspecialchars($order['payment_method'] ?? 'bKash'); ?></strong></div>
        <div style="margin-top: 4px;">Payment Status: <span style="color: #059669; font-weight: 700;">● Paid</span></div>
      </div>
    </div>

    <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      <h3 style="font-size: 1.15rem; margin: 0 0 16px; color: #0f172a; display: flex; align-items: center; gap: 8px;">
        <span>🧾</span> Itemized Receipt
      </h3>

      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;">
        <?php foreach ($order_items as $item): ?>
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; border-bottom: 1px dashed #f1f5f9; padding-bottom: 8px;">
            <div>
              <span style="font-weight: 700; color: #0f172a;"><?php echo (int)($item['quantity'] ?? 1); ?>x</span>
              <span style="color: #334155; margin-left: 6px;"><?php echo htmlspecialchars($item['item_name'] ?? $item['name'] ?? 'Dish'); ?></span>
              <?php if (!empty($item['modifiers'])): ?>
                <div style="font-size: 0.75rem; color: #64748b; margin-left: 22px;"><?php echo htmlspecialchars($item['modifiers']); ?></div>
              <?php endif; ?>
            </div>
            <div style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #0f172a;">
              <?php echo format_bdt($item['item_total'] ?? (($item['price'] ?? 0) * ($item['quantity'] ?? 1))); ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        <div style="display: flex; justify-content: space-between;">
          <span>Subtotal:</span>
          <span style="font-family: 'JetBrains Mono', monospace;"><?php echo format_bdt($order['subtotal'] ?? 0); ?></span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>VAT (5%):</span>
          <span style="font-family: 'JetBrains Mono', monospace;"><?php echo format_bdt($order['tax_vat'] ?? 0); ?></span>
        </div>
        <?php if (!empty($order['delivery_fee'])): ?>
          <div style="display: flex; justify-content: space-between;">
            <span>Delivery Fee:</span>
            <span style="font-family: 'JetBrains Mono', monospace;"><?php echo format_bdt($order['delivery_fee']); ?></span>
          </div>
        <?php endif; ?>
        <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: #e11d48; margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 8px;">
          <span>Total Paid:</span>
          <span style="font-family: 'JetBrains Mono', monospace;"><?php echo format_bdt($order['total_amount'] ?? 0); ?></span>
        </div>
      </div>

      <div style="margin-top: 18px; text-align: center;">
        <button onclick="window.print()" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
          🖨️ Print Receipt
        </button>
      </div>
    </div>

  </div>

<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
