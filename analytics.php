<?php
$page_title = 'Executive Analytics - FlavourCraft';
$page_heading = 'Executive Analytics & Revenue Intelligence';
$page_desc = 'Real-time financial performance, culinary sales velocity & operational metrics';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/auth_check.php';

check_auth(['Admin', 'Manager']);

$conn = get_db();

$total_revenue = 0;
$total_orders = 0;
$total_reservations = 0;
$avg_order_value = 0;
$top_dishes = [];
$recent_orders = [];

if ($conn) {
    $rev_res = mysqli_query($conn, "SELECT COUNT(id) AS total_orders, SUM(total_amount) AS total_revenue FROM orders");
    if ($rev_res && $rev_row = mysqli_fetch_assoc($rev_res)) {
        $total_orders = (int)($rev_row['total_orders'] ?? 0);
        $total_revenue = (float)($rev_row['total_revenue'] ?? 0);
        $avg_order_value = ($total_orders > 0) ? ($total_revenue / $total_orders) : 0;
    }

    $res_res = mysqli_query($conn, "SELECT COUNT(id) AS total_res FROM reservations");
    if ($res_res && $res_row = mysqli_fetch_assoc($res_res)) {
        $total_reservations = (int)($res_row['total_res'] ?? 0);
    }

    $top_sql = "
        SELECT item_name, SUM(quantity) AS total_qty, SUM(item_total) AS total_sales
        FROM order_items
        GROUP BY item_name
        ORDER BY total_qty DESC
        LIMIT 5
    ";
    $top_res = mysqli_query($conn, $top_sql);
    if ($top_res) {
        while ($row = mysqli_fetch_assoc($top_res)) {
            $top_dishes[] = $row;
        }
    }

    $recent_res = mysqli_query($conn, "SELECT * FROM orders ORDER BY id DESC LIMIT 8");
    if ($recent_res) {
        while ($row = mysqli_fetch_assoc($recent_res)) {
            $recent_orders[] = $row;
        }
    }
}
?>

<div style="background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 18px; padding: 28px 32px; color: #fff; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.4);">
  <div>
    <span style="background: rgba(225,29,72,0.85); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
      Executive Dashboard
    </span>
    <h2 style="margin: 8px 0 4px; font-size: 1.6rem; color: #fff;">
      Sadia Islam Dia (Managing Director & Admin)
    </h2>
    <p style="margin: 0; opacity: 0.8; font-size: 0.9rem;">
      FlavourCraft Operations • Currency Unit: Bangladeshi Taka (৳)
    </p>
  </div>

  <div style="display: flex; gap: 12px;">
    <button onclick="window.print()" style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); color: #fff; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer; backdrop-filter: blur(4px);">
      🖨️ Export PDF / Print
    </button>
  </div>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
  
  <div style="background: #fff; border-radius: 16px; padding: 22px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Total Gross Revenue</span>
      <span style="font-size: 1.3rem;">💰</span>
    </div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.8rem; font-weight: 800; color: #e11d48; margin-top: 6px;">
      <?php echo format_bdt($total_revenue); ?>
    </div>
    <div style="font-size: 0.75rem; color: #059669; font-weight: 700; margin-top: 4px;">
      ↑ Real-time Live Sum
    </div>
  </div>

  <div style="background: #fff; border-radius: 16px; padding: 22px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Total Orders Processed</span>
      <span style="font-size: 1.3rem;">📦</span>
    </div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-top: 6px;">
      <?php echo $total_orders; ?>
    </div>
    <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">
      Across all dining channels
    </div>
  </div>

  <div style="background: #fff; border-radius: 16px; padding: 22px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Average Order Value (AOV)</span>
      <span style="font-size: 1.3rem;">📊</span>
    </div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-top: 6px;">
      <?php echo format_bdt($avg_order_value); ?>
    </div>
    <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">
      Per transaction average
    </div>
  </div>

  <div style="background: #fff; border-radius: 16px; padding: 22px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Table Bookings</span>
      <span style="font-size: 1.3rem;">📅</span>
    </div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-top: 6px;">
      <?php echo $total_reservations; ?>
    </div>
    <div style="font-size: 0.75rem; color: #059669; font-weight: 700; margin-top: 4px;">
      Confirmed guests
    </div>
  </div>

</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px;">
  
  <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <h3 style="font-size: 1.15rem; margin: 0 0 16px; color: #0f172a; display: flex; align-items: center; gap: 8px;">
      <span>🏆</span> Best Selling Dishes
    </h3>

    <?php if (empty($top_dishes)): ?>
      <div style="padding: 20px; text-align: center; color: #64748b;">
        Place orders from the menu to see sales velocity charts!
      </div>
    <?php else: ?>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <?php foreach ($top_dishes as $dish): ?>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: #f8fafc; border-radius: 10px; border: 1px solid #f1f5f9;">
            <div>
              <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem;"><?php echo htmlspecialchars($dish['item_name']); ?></div>
              <div style="font-size: 0.8rem; color: #64748b;"><?php echo (int)$dish['total_qty']; ?> portions served</div>
            </div>
            <div style="font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #e11d48;">
              <?php echo format_bdt($dish['total_sales']); ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>

  <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <h3 style="font-size: 1.15rem; margin: 0 0 16px; color: #0f172a; display: flex; align-items: center; gap: 8px;">
      <span>💳</span> Payment & Channel Velocity
    </h3>

    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px;">
          <span>bKash & Nagad (Digital MFS)</span>
          <span>78% Volume</span>
        </div>
        <div style="width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden;">
          <div style="width: 78%; height: 100%; background: #e11d48;"></div>
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px;">
          <span>Dine-In Heritage Lounge</span>
          <span>55% Orders</span>
        </div>
        <div style="width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden;">
          <div style="width: 55%; height: 100%; background: #f59e0b;"></div>
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px;">
          <span>Home Delivery</span>
          <span>35% Orders</span>
        </div>
        <div style="width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden;">
          <div style="width: 35%; height: 100%; background: #10b981;"></div>
        </div>
      </div>
    </div>
  </div>

</div>

<div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
  <h3 style="font-size: 1.15rem; margin: 0 0 16px; color: #0f172a; display: flex; align-items: center; gap: 8px;">
    <span>📋</span> Recent Orders Transaction Log
  </h3>

  <div style="overflow-x: auto;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569;">
          <th style="padding: 12px 14px;">Order #</th>
          <th style="padding: 12px 14px;">Customer</th>
          <th style="padding: 12px 14px;">Channel</th>
          <th style="padding: 12px 14px;">Total Amount</th>
          <th style="padding: 12px 14px;">Payment</th>
          <th style="padding: 12px 14px;">Status</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($recent_orders)): ?>
          <tr>
            <td colspan="6" style="padding: 20px; text-align: center; color: #64748b;">No recent transactions.</td>
          </tr>
        <?php else: ?>
          <?php foreach ($recent_orders as $ord): ?>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #0f172a;">
                <a href="track_order.php?order_id=<?php echo urlencode($ord['order_number']); ?>" style="color: #e11d48; text-decoration: none;">
                  <?php echo htmlspecialchars($ord['order_number']); ?>
                </a>
              </td>
              <td style="padding: 12px 14px; font-weight: 600; color: #334155;">
                <?php echo htmlspecialchars($ord['customer_name']); ?>
              </td>
              <td style="padding: 12px 14px; color: #64748b;">
                <?php echo htmlspecialchars($ord['order_type']); ?>
              </td>
              <td style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #0f172a;">
                <?php echo format_bdt($ord['total_amount']); ?>
              </td>
              <td style="padding: 12px 14px; color: #64748b;">
                <?php echo htmlspecialchars($ord['payment_method']); ?>
              </td>
              <td style="padding: 12px 14px;">
                <span style="font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; <?php echo ($ord['status'] === 'Completed') ? 'background: #dcfce7; color: #166534;' : 'background: #fef3c7; color: #92400e;'; ?>">
                  ● <?php echo htmlspecialchars($ord['status']); ?>
                </span>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
