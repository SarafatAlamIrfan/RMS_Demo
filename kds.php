<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/auth_check.php';

check_auth(['Admin', 'Manager', 'Kitchen']);

$pdo = get_db();
$orders = [];
$active_count = 0;
$preparing_count = 0;
$ready_count = 0;

if ($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT o.*, 
                   GROUP_CONCAT(CONCAT(oi.quantity, 'x ', oi.item_name, ' (', COALESCE(oi.modifiers, 'Standard'), ')') SEPARATOR '||') AS items_summary
            FROM orders o
            LEFT JOIN order_items oi ON o.order_uid = oi.order_uid
            WHERE o.status IN ('New', 'Preparing', 'Ready to Serve')
            GROUP BY o.order_uid
            ORDER BY o.id DESC
        ");
        $orders = $stmt->fetchAll();

        foreach ($orders as $ord) {
            if ($ord['status'] === 'New') $active_count++;
            if ($ord['status'] === 'Preparing') $preparing_count++;
            if ($ord['status'] === 'Ready to Serve') $ready_count++;
        }
    } catch (PDOException $e) {
        $db_error = $e->getMessage();
    }
}

$page_title = 'Kitchen Display System (KDS) - FlavourCraft';
$page_heading = 'Kitchen Display (KDS)';
$page_desc = 'Real-time kitchen dispatching, cook recipe specs & preparation status controller';

require_once __DIR__ . '/includes/header.php';
?>

<div style="display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 18px 24px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px; flex-wrap: wrap; gap: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
  <div style="display: flex; gap: 14px; align-items: center;">
    <span style="font-size: 1.8rem;">🍳</span>
    <div>
      <h3 style="margin: 0; font-size: 1.15rem; color: #0f172a;">Live Cooking Station</h3>
      <div style="font-size: 0.8rem; color: #64748b;">Staff Station: <strong><?php echo htmlspecialchars($current_user['name']); ?></strong> (<?php echo htmlspecialchars($current_user['role']); ?>)</div>
    </div>
  </div>

  <div style="display: flex; gap: 12px;">
    <div style="background: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 0.85rem;">
      New Tickets: <?php echo $active_count; ?>
    </div>
    <div style="background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 0.85rem;">
      Cooking: <?php echo $preparing_count; ?>
    </div>
    <div style="background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 0.85rem;">
      Ready to Serve: <?php echo $ready_count; ?>
    </div>
    <a href="kds.php" style="background: #f1f5f9; color: #334155; padding: 8px 14px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; text-decoration: none; display: flex; align-items: center; gap: 6px;">
      🔄 Refresh
    </a>
  </div>
</div>

<?php if (empty($orders)): ?>
  <div style="background: #fff; border-radius: 16px; padding: 60px 20px; text-align: center; border: 1px solid #e2e8f0;">
    <div style="font-size: 3.5rem; margin-bottom: 14px;">✨</div>
    <h3 style="color: #1e293b; margin-bottom: 6px;">All Kitchen Orders Cleared!</h3>
    <p style="color: #64748b; margin-bottom: 20px;">No pending orders in the queue. New tickets will appear here automatically.</p>
    <a href="index.php" style="background: #e11d48; color: #fff; padding: 10px 20px; border-radius: 8px; font-weight: 700; text-decoration: none;">Create Sample Order</a>
  </div>
<?php else: ?>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;">
    <?php foreach ($orders as $order): 
      $items = !empty($order['items_summary']) ? explode('||', $order['items_summary']) : [];
      $status = $order['status'];
      
      $card_border = '#e2e8f0';
      $header_bg = '#f8fafc';
      if ($status === 'New') {
        $card_border = '#f87171';
        $header_bg = '#fef2f2';
      } elseif ($status === 'Preparing') {
        $card_border = '#fbbf24';
        $header_bg = '#fffbeb';
      } elseif ($status === 'Ready to Serve') {
        $card_border = '#34d399';
        $header_bg = '#ecfdf5';
      }
    ?>
      <div style="background: #fff; border-radius: 16px; border: 2px solid <?php echo $card_border; ?>; box-shadow: 0 4px 15px rgba(0,0,0,0.04); overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
        
        <div style="background: <?php echo $header_bg; ?>; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; font-weight: 800; color: #0f172a;">
              <?php echo htmlspecialchars($order['order_number']); ?>
            </div>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">
              <span><?php echo htmlspecialchars($order['order_type']); ?></span>
              <?php if (!empty($order['table_number'])): ?>
                • <strong style="color: #e11d48;"><?php echo htmlspecialchars($order['table_number']); ?></strong>
              <?php endif; ?>
            </div>
          </div>

          <span style="font-size: 0.8rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; <?php echo ($status === 'New') ? 'background: #fee2e2; color: #991b1b;' : (($status === 'Preparing') ? 'background: #fef3c7; color: #92400e;' : 'background: #dcfce7; color: #166534;'); ?>">
            ● <?php echo htmlspecialchars($status); ?>
          </span>
        </div>

        <div style="padding: 20px; flex-grow: 1;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 10px;">
            Order Items & Cooking Specs:
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <?php foreach ($items as $item_str): ?>
              <div style="padding: 10px 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; font-weight: 600; color: #0f172a;">
                🍲 <?php echo htmlspecialchars($item_str); ?>
              </div>
            <?php endforeach; ?>
          </div>

          <div style="margin-top: 14px; font-size: 0.8rem; color: #64748b;">
            Customer: <strong><?php echo htmlspecialchars($order['customer_name']); ?></strong> (<?php echo htmlspecialchars($order['customer_phone']); ?>)
          </div>
        </div>

        <form action="kds_action.php" method="POST" style="padding: 14px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; gap: 10px;">
          <input type="hidden" name="order_uid" value="<?php echo htmlspecialchars($order['order_uid']); ?>" />
          
          <?php if ($status === 'New'): ?>
            <input type="hidden" name="next_status" value="Preparing" />
            <button type="submit" style="width: 100%; background: #f59e0b; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 700; cursor: pointer;">
              🍳 Start Cooking
            </button>
          <?php elseif ($status === 'Preparing'): ?>
            <input type="hidden" name="next_status" value="Ready to Serve" />
            <button type="submit" style="width: 100%; background: #10b981; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 700; cursor: pointer;">
              📦 Mark Ready to Serve
            </button>
          <?php elseif ($status === 'Ready to Serve'): ?>
            <input type="hidden" name="next_status" value="Completed" />
            <button type="submit" style="width: 100%; background: #3b82f6; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 700; cursor: pointer;">
              ✅ Complete / Dispatch
            </button>
          <?php endif; ?>
        </form>

      </div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
