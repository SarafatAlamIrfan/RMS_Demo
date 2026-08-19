<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/auth_check.php';

check_auth(['Admin', 'Manager']);

$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'restock' && $pdo) {
        $ingredient_uid = $_POST['ingredient_uid'] ?? '';
        $add_qty = (float)($_POST['add_qty'] ?? 0);

        if ($ingredient_uid && $add_qty > 0) {
            try {
                $stmt = $pdo->prepare("UPDATE inventory SET current_stock = current_stock + ? WHERE ingredient_uid = ?");
                $stmt->execute([$add_qty, $ingredient_uid]);
                set_flash('success', "Added +{$add_qty} to stock successfully.");
            } catch (PDOException $e) {
                set_flash('error', 'Restock failed: ' . $e->getMessage());
            }
        }
    } elseif ($action === 'add_ingredient' && $pdo) {
        $name = trim($_POST['name'] ?? '');
        $category = $_POST['category'] ?? 'Pantry';
        $stock = (float)($_POST['current_stock'] ?? 0);
        $threshold = (float)($_POST['threshold'] ?? 0);
        $unit = trim($_POST['unit'] ?? 'g');
        $cost = (float)($_POST['cost_per_unit'] ?? 0);
        $uid = 'ing_' . bin2hex(random_bytes(4));

        if ($name) {
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO inventory (ingredient_uid, name, category, current_stock, threshold, unit, cost_per_unit)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$uid, $name, $category, $stock, $threshold, $unit, $cost]);
                set_flash('success', "New ingredient '{$name}' added to inventory.");
            } catch (PDOException $e) {
                set_flash('error', 'Adding ingredient failed: ' . $e->getMessage());
            }
        }
    }
}

$inventory = [];
$recipes = [];
$low_stock_count = 0;

if ($pdo) {
    try {
        $inv_stmt = $pdo->query("SELECT * FROM inventory ORDER BY category ASC, name ASC");
        $inventory = $inv_stmt->fetchAll();

        foreach ($inventory as $item) {
            if ($item['current_stock'] <= $item['threshold']) {
                $low_stock_count++;
            }
        }

        $rec_stmt = $pdo->query("
            SELECT r.*, 
                   SUM(ri.quantity * ri.unit_cost) AS total_cost
            FROM recipes r
            LEFT JOIN recipe_ingredients ri ON r.recipe_uid = ri.recipe_uid
            GROUP BY r.recipe_uid
        ");
        $recipes = $rec_stmt->fetchAll();
    } catch (PDOException $e) {
        $db_error = $e->getMessage();
    }
}

$page_title = 'Inventory & Recipe Costing - FlavourCraft';
$page_heading = 'Stock Inventory & Recipe Costing Engine';
$page_desc = 'Track raw pantry ingredients, automatic recipe deductions, and gross profit margins';

require_once __DIR__ . '/includes/header.php';
?>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 25px;">
  <div style="background: #fff; border-radius: 14px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <div style="font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Total Raw Ingredients</div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-top: 4px;">
      <?php echo count($inventory); ?> Items
    </div>
  </div>

  <div style="background: #fff; border-radius: 14px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <div style="font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Low Stock Warnings</div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.8rem; font-weight: 800; color: <?php echo ($low_stock_count > 0) ? '#e11d48' : '#059669'; ?>; margin-top: 4px;">
      <?php echo $low_stock_count; ?> Alert<?php echo ($low_stock_count === 1) ? '' : 's'; ?>
    </div>
  </div>

  <div style="background: #fff; border-radius: 14px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <div style="font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Standard Meat Cost</div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-top: 4px;">
      ৳1.10 / g
    </div>
  </div>
</div>

<div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; flex-wrap: wrap; gap: 10px;">
    <h3 style="font-size: 1.2rem; margin: 0; color: #0f172a; display: flex; align-items: center; gap: 8px;">
      <span>📦</span> Live Stock Inventory
    </h3>
  </div>

  <div style="overflow-x: auto;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569;">
          <th style="padding: 12px 14px;">Ingredient Name</th>
          <th style="padding: 12px 14px;">Category</th>
          <th style="padding: 12px 14px;">Current Stock</th>
          <th style="padding: 12px 14px;">Min Threshold</th>
          <th style="padding: 12px 14px;">Cost / Unit</th>
          <th style="padding: 12px 14px; text-align: right;">Quick Restock</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($inventory as $item): 
          $is_low = ($item['current_stock'] <= $item['threshold']);
        ?>
          <tr style="border-bottom: 1px solid #f1f5f9; <?php echo $is_low ? 'background: #fff1f2;' : ''; ?>">
            <td style="padding: 12px 14px; font-weight: 700; color: #0f172a;">
              <?php echo htmlspecialchars($item['name']); ?>
              <?php if ($is_low): ?>
                <span style="background: #fee2e2; color: #991b1b; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">LOW STOCK</span>
              <?php endif; ?>
            </td>
            <td style="padding: 12px 14px; color: #64748b;">
              <span style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">
                <?php echo htmlspecialchars($item['category']); ?>
              </span>
            </td>
            <td style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: <?php echo $is_low ? '#e11d48' : '#0f172a'; ?>;">
              <?php echo number_format($item['current_stock'], 1); ?> <?php echo htmlspecialchars($item['unit']); ?>
            </td>
            <td style="padding: 12px 14px; color: #64748b; font-family: 'JetBrains Mono', monospace;">
              <?php echo number_format($item['threshold'], 1); ?> <?php echo htmlspecialchars($item['unit']); ?>
            </td>
            <td style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #0f172a;">
              <?php echo format_bdt($item['cost_per_unit']); ?> / <?php echo htmlspecialchars($item['unit']); ?>
            </td>
            <td style="padding: 12px 14px; text-align: right;">
              <form method="POST" action="inventory.php" style="display: inline-flex; align-items: center; gap: 6px; margin: 0;">
                <input type="hidden" name="action" value="restock" />
                <input type="hidden" name="ingredient_uid" value="<?php echo htmlspecialchars($item['ingredient_uid']); ?>" />
                <input type="number" name="add_qty" value="1000" min="1" step="any" style="width: 80px; padding: 6px 8px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.8rem; text-align: center;" />
                <button type="submit" style="background: #059669; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer;">
                  + Add
                </button>
              </form>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
  <h3 style="font-size: 1.2rem; margin: 0 0 16px; color: #0f172a; display: flex; align-items: center; gap: 8px;">
    <span>📊</span> Recipe Costing & Profit Margins
  </h3>

  <div style="overflow-x: auto;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569;">
          <th style="padding: 12px 14px;">Recipe Dish</th>
          <th style="padding: 12px 14px;">Food Cost (Ingredients)</th>
          <th style="padding: 12px 14px;">Selling Price</th>
          <th style="padding: 12px 14px;">Gross Profit</th>
          <th style="padding: 12px 14px;">Profit Margin %</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($recipes as $rec): 
          $cost = (float)($rec['total_cost'] ?? 0);
          $price = (float)$rec['selling_price'];
          $profit = $price - $cost;
          $margin = ($price > 0) ? ($profit / $price) * 100 : 0;
        ?>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 14px; font-weight: 700; color: #0f172a;">
              <?php echo htmlspecialchars($rec['dish_name']); ?>
            </td>
            <td style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; color: #e11d48; font-weight: 700;">
              <?php echo format_bdt($cost); ?>
            </td>
            <td style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; color: #0f172a; font-weight: 700;">
              <?php echo format_bdt($price); ?>
            </td>
            <td style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; color: #059669; font-weight: 800;">
              +<?php echo format_bdt($profit); ?>
            </td>
            <td style="padding: 12px 14px;">
              <span style="background: #dcfce7; color: #166534; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem;">
                <?php echo number_format($margin, 1); ?>% Margin
              </span>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
