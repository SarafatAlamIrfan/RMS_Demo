<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/auth_check.php';

check_auth(['Admin', 'Manager']);

$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $pdo) {
    $action = $_POST['action'] ?? '';

    if ($action === 'create') {
        $name = trim($_POST['name'] ?? '');
        $sku = trim($_POST['sku'] ?? '');
        $category_slug = $_POST['category_slug'] ?? 'Kacchi & Biryani';
        $price = (float)($_POST['price'] ?? 0);
        $description = trim($_POST['description'] ?? '');
        $image_url = trim($_POST['image_url'] ?? '');
        $tags = trim($_POST['tags'] ?? '100% Halal');
        $spice_level = (int)($_POST['spice_level'] ?? 1);
        $prep_time = (int)($_POST['prep_time_minutes'] ?? 10);
        $is_available = isset($_POST['is_available']) ? 1 : 0;
        $item_uid = 'dish_' . bin2hex(random_bytes(4));

        if (empty($sku)) {
            $sku = strtoupper(substr($name, 0, 3)) . '-' . rand(100, 999);
        }

        if (empty($image_url)) {
            $image_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80';
        }

        if ($name && $price > 0) {
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO menu_items (item_uid, sku, name, category_slug, price, description, image_url, tags, spice_level, is_available, prep_time_minutes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$item_uid, $sku, $name, $category_slug, $price, $description, $image_url, $tags, $spice_level, $is_available, $prep_time]);
                set_flash('success', "New dish '{$name}' added to menu successfully!");
                header('Location: menu_manage.php');
                exit;
            } catch (PDOException $e) {
                set_flash('error', 'Failed to add dish: ' . $e->getMessage());
            }
        } else {
            set_flash('error', 'Dish Name and valid Price are required.');
        }
    } elseif ($action === 'update') {
        $item_uid = $_POST['item_uid'] ?? '';
        $name = trim($_POST['name'] ?? '');
        $sku = trim($_POST['sku'] ?? '');
        $category_slug = $_POST['category_slug'] ?? 'Kacchi & Biryani';
        $price = (float)($_POST['price'] ?? 0);
        $description = trim($_POST['description'] ?? '');
        $image_url = trim($_POST['image_url'] ?? '');
        $tags = trim($_POST['tags'] ?? '100% Halal');
        $spice_level = (int)($_POST['spice_level'] ?? 1);
        $prep_time = (int)($_POST['prep_time_minutes'] ?? 10);
        $is_available = isset($_POST['is_available']) ? 1 : 0;

        if ($item_uid && $name && $price > 0) {
            try {
                $stmt = $pdo->prepare("
                    UPDATE menu_items 
                    SET name = ?, sku = ?, category_slug = ?, price = ?, description = ?, image_url = ?, tags = ?, spice_level = ?, is_available = ?, prep_time_minutes = ?
                    WHERE item_uid = ?
                ");
                $stmt->execute([$name, $sku, $category_slug, $price, $description, $image_url, $tags, $spice_level, $is_available, $prep_time, $item_uid]);
                set_flash('success', "Dish '{$name}' updated successfully!");
                header('Location: menu_manage.php');
                exit;
            } catch (PDOException $e) {
                set_flash('error', 'Failed to update dish: ' . $e->getMessage());
            }
        }
    } elseif ($action === 'delete') {
        $item_uid = $_POST['item_uid'] ?? '';
        if ($item_uid) {
            try {
                $stmt = $pdo->prepare("DELETE FROM menu_items WHERE item_uid = ?");
                $stmt->execute([$item_uid]);
                set_flash('success', 'Dish deleted from menu successfully.');
                header('Location: menu_manage.php');
                exit;
            } catch (PDOException $e) {
                set_flash('error', 'Failed to delete dish: ' . $e->getMessage());
            }
        }
    } elseif ($action === 'toggle_availability') {
        $item_uid = $_POST['item_uid'] ?? '';
        $current_status = (int)($_POST['current_status'] ?? 1);
        $new_status = ($current_status === 1) ? 0 : 1;

        if ($item_uid) {
            try {
                $stmt = $pdo->prepare("UPDATE menu_items SET is_available = ? WHERE item_uid = ?");
                $stmt->execute([$new_status, $item_uid]);
                set_flash('success', 'Dish availability updated.');
                header('Location: menu_manage.php');
                exit;
            } catch (PDOException $e) {
                set_flash('error', 'Update failed: ' . $e->getMessage());
            }
        }
    }
}

$edit_item = null;
if (isset($_GET['edit']) && $pdo) {
    $edit_uid = $_GET['edit'];
    $stmt = $pdo->prepare("SELECT * FROM menu_items WHERE item_uid = ? LIMIT 1");
    $stmt->execute([$edit_uid]);
    $edit_item = $stmt->fetch();
}

$search = trim($_GET['search'] ?? '');
$category_filter = trim($_GET['category'] ?? 'all');

$categories = [];
$menu_items = [];

if ($pdo) {
    try {
        $cat_stmt = $pdo->query("SELECT * FROM categories ORDER BY display_order ASC");
        $categories = $cat_stmt->fetchAll();

        $query = "SELECT * FROM menu_items WHERE 1=1";
        $params = [];

        if ($category_filter !== 'all' && !empty($category_filter)) {
            $query .= " AND category_slug = ?";
            $params[] = $category_filter;
        }

        if (!empty($search)) {
            $query .= " AND (name LIKE ? OR description LIKE ? OR sku LIKE ?)";
            $searchTerm = "%{$search}%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $query .= " ORDER BY id DESC";
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $menu_items = $stmt->fetchAll();
    } catch (PDOException $e) {
        $db_error = $e->getMessage();
    }
}

$page_title = 'Menu Management (CRUD) - FlavourCraft';
$page_heading = 'Menu Catalog & Recipe Management';
$page_desc = 'Add new culinary dishes, modify pricing and descriptions, toggle live kitchen availability';

require_once __DIR__ . '/includes/header.php';
?>

<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 15px;">
  <div>
    <h3 style="margin: 0; font-size: 1.25rem; color: #0f172a;">Menu Management Dashboard</h3>
    <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Managing <?php echo count($menu_items); ?> dishes across <?php echo count($categories); ?> culinary categories</p>
  </div>

  <div style="display: flex; gap: 10px;">
    <a href="index.php" style="background: #f1f5f9; color: #334155; padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
      👁️ View Public Menu
    </a>
    <a href="menu_manage.php#form-card" style="background: #e11d48; color: #fff; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(225,29,72,0.3);">
      ➕ Add New Dish
    </a>
  </div>
</div>

<div style="display: grid; grid-template-columns: 1fr 380px; gap: 30px; align-items: start;">

  <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
      <form method="GET" action="menu_manage.php" style="display: flex; gap: 10px; flex-grow: 1; max-width: 450px;">
        <input type="text" name="search" placeholder="Search dish name or SKU..." value="<?php echo htmlspecialchars($search); ?>" style="flex-grow: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;" />
        
        <select name="category" onchange="this.form.submit()" style="padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;">
          <option value="all">All Categories</option>
          <?php foreach ($categories as $cat): ?>
            <option value="<?php echo htmlspecialchars($cat['slug']); ?>" <?php echo ($category_filter === $cat['slug']) ? 'selected' : ''; ?>>
              <?php echo htmlspecialchars($cat['name']); ?>
            </option>
          <?php endforeach; ?>
        </select>

        <button type="submit" style="background: #0f172a; color: #fff; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 600; cursor: pointer;">
          🔍
        </button>
      </form>
    </div>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569;">
            <th style="padding: 12px 14px;">Dish</th>
            <th style="padding: 12px 14px;">Category</th>
            <th style="padding: 12px 14px;">Price</th>
            <th style="padding: 12px 14px;">Status</th>
            <th style="padding: 12px 14px; text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($menu_items)): ?>
            <tr>
              <td colspan="5" style="padding: 30px; text-align: center; color: #64748b;">
                No dishes found matching your query.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($menu_items as $dish): ?>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 14px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="<?php echo htmlspecialchars($dish['image_url']); ?>" alt="" style="width: 45px; height: 45px; border-radius: 8px; object-fit: cover;" />
                    <div>
                      <div style="font-weight: 700; color: #0f172a;"><?php echo htmlspecialchars($dish['name']); ?></div>
                      <div style="font-size: 0.75rem; color: #64748b; font-family: 'JetBrains Mono', monospace;">
                        SKU: <?php echo htmlspecialchars($dish['sku']); ?>
                      </div>
                    </div>
                  </div>
                </td>
                <td style="padding: 12px 14px; color: #64748b; font-size: 0.85rem;">
                  <span style="background: #f1f5f9; padding: 3px 8px; border-radius: 6px;">
                    <?php echo htmlspecialchars($dish['category_slug']); ?>
                  </span>
                </td>
                <td style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #e11d48;">
                  <?php echo format_bdt($dish['price']); ?>
                </td>
                <td style="padding: 12px 14px;">
                  <form method="POST" action="menu_manage.php" style="margin: 0; display: inline;">
                    <input type="hidden" name="action" value="toggle_availability" />
                    <input type="hidden" name="item_uid" value="<?php echo htmlspecialchars($dish['item_uid']); ?>" />
                    <input type="hidden" name="current_status" value="<?php echo (int)$dish['is_available']; ?>" />
                    <button type="submit" style="border: none; cursor: pointer; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; <?php echo ($dish['is_available']) ? 'background: #dcfce7; color: #166534;' : 'background: #fee2e2; color: #991b1b;'; ?>">
                      ● <?php echo ($dish['is_available']) ? 'Available' : 'Sold Out'; ?>
                    </button>
                  </form>
                </td>
                <td style="padding: 12px 14px; text-align: right; white-space: nowrap;">
                  <div style="display: inline-flex; gap: 6px;">
                    <a href="menu_manage.php?edit=<?php echo urlencode($dish['item_uid']); ?>#form-card" style="background: #eff6ff; color: #1d4ed8; padding: 6px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; text-decoration: none;">
                      ✏️ Edit
                    </a>

                    <form method="POST" action="menu_manage.php" onsubmit="return confirm('Are you sure you want to delete this dish from the menu?');" style="margin: 0; display: inline;">
                      <input type="hidden" name="action" value="delete" />
                      <input type="hidden" name="item_uid" value="<?php echo htmlspecialchars($dish['item_uid']); ?>" />
                      <button type="submit" style="background: #fee2e2; color: #991b1b; border: none; padding: 6px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer;">
                        🗑️
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>

  </div>

  <div id="form-card" style="background: #fff; border-radius: 16px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
      <h3 style="font-size: 1.15rem; margin: 0; color: #0f172a; display: flex; align-items: center; gap: 8px;">
        <span><?php echo $edit_item ? '✏️' : '➕'; ?></span>
        <span><?php echo $edit_item ? 'Edit Dish' : 'Add New Dish'; ?></span>
      </h3>
      <?php if ($edit_item): ?>
        <a href="menu_manage.php" style="font-size: 0.8rem; color: #e11d48; text-decoration: none; font-weight: 700;">
          + New Dish
        </a>
      <?php endif; ?>
    </div>

    <form method="POST" action="menu_manage.php">
      <input type="hidden" name="action" value="<?php echo $edit_item ? 'update' : 'create'; ?>" />
      <?php if ($edit_item): ?>
        <input type="hidden" name="item_uid" value="<?php echo htmlspecialchars($edit_item['item_uid']); ?>" />
      <?php endif; ?>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Dish Name *</label>
        <input type="text" name="name" required value="<?php echo htmlspecialchars($edit_item['name'] ?? ''); ?>" placeholder="e.g. Shahi Mutton Rezala" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 4px;">SKU Code</label>
          <input type="text" name="sku" value="<?php echo htmlspecialchars($edit_item['sku'] ?? ''); ?>" placeholder="Auto-generated" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Price (৳ BDT) *</label>
          <input type="number" name="price" step="any" min="0" required value="<?php echo htmlspecialchars($edit_item['price'] ?? ''); ?>" placeholder="e.g. 550" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Category *</label>
        <select name="category_slug" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
          <?php foreach ($categories as $cat): ?>
            <option value="<?php echo htmlspecialchars($cat['slug']); ?>" <?php echo (($edit_item['category_slug'] ?? '') === $cat['slug']) ? 'selected' : ''; ?>>
              <?php echo htmlspecialchars($cat['name']); ?>
            </option>
          <?php endforeach; ?>
        </select>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Image URL</label>
        <input type="url" name="image_url" value="<?php echo htmlspecialchars($edit_item['image_url'] ?? ''); ?>" placeholder="https://images.unsplash.com/..." style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;" />
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Dietary & Special Tags</label>
        <input type="text" name="tags" value="<?php echo htmlspecialchars($edit_item['tags'] ?? '100% Halal, Chef Special'); ?>" placeholder="100% Halal, Chef Special, Spicy" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;" />
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Description</label>
        <textarea name="description" rows="3" placeholder="Dish description, ingredients, cooking style..." style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;"><?php echo htmlspecialchars($edit_item['description'] ?? ''); ?></textarea>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Spice Level</label>
          <select name="spice_level" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;">
            <option value="0" <?php echo (($edit_item['spice_level'] ?? 1) == 0) ? 'selected' : ''; ?>>0 - Mild / Sweet</option>
            <option value="1" <?php echo (($edit_item['spice_level'] ?? 1) == 1) ? 'selected' : ''; ?>>1 - Medium Spiced</option>
            <option value="2" <?php echo (($edit_item['spice_level'] ?? 1) == 2) ? 'selected' : ''; ?>>2 - Dhaka Spicy 🌶️</option>
            <option value="3" <?php echo (($edit_item['spice_level'] ?? 1) == 3) ? 'selected' : ''; ?>>3 - Naga Fiery 🔥</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Prep Time (Mins)</label>
          <input type="number" name="prep_time_minutes" value="<?php echo htmlspecialchars($edit_item['prep_time_minutes'] ?? '10'); ?>" min="1" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;" />
        </div>
      </div>

      <div style="margin-bottom: 18px;">
        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: #334155; cursor: pointer;">
          <input type="checkbox" name="is_available" value="1" <?php echo (!isset($edit_item) || $edit_item['is_available']) ? 'checked' : ''; ?> />
          <span>Available for Customer Orders</span>
        </label>
      </div>

      <button type="submit" style="width: 100%; background: linear-gradient(135deg, #e11d48, #be123c); color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);">
        💾 <?php echo $edit_item ? 'Update Dish Details' : 'Save & Publish Dish'; ?>
      </button>
    </form>

  </div>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
