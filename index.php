<?php
$page_title = 'FlavourCraft - Heritage & Contemporary Menu';
$page_heading = 'FlavourCraft Menu';
$page_desc = 'Authentic Bangladeshi Traditional Cuisine & Signature Dishes';

require_once __DIR__ . '/includes/header.php';

$pdo = get_db();
$selected_category = $_GET['category'] ?? 'all';
$search_query = trim($_GET['search'] ?? '');

$categories = [];
$menu_items = [];

if ($pdo) {
    try {
        $cat_stmt = $pdo->query("SELECT * FROM categories ORDER BY display_order ASC");
        $categories = $cat_stmt->fetchAll();

        $sql = "SELECT * FROM menu_items WHERE 1=1";
        $params = [];

        if ($selected_category !== 'all' && !empty($selected_category)) {
            $sql .= " AND category_slug = ?";
            $params[] = $selected_category;
        }

        if (!empty($search_query)) {
            $sql .= " AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)";
            $wildcard = "%$search_query%";
            $params[] = $wildcard;
            $params[] = $wildcard;
            $params[] = $wildcard;
        }

        $sql .= " ORDER BY id ASC";
        $item_stmt = $pdo->prepare($sql);
        $item_stmt->execute($params);
        $menu_items = $item_stmt->fetchAll();
    } catch (PDOException $e) {
        $db_error = $e->getMessage();
    }
}
?>

<div class="menu-hero-banner" style="background: linear-gradient(135deg, rgba(225, 29, 72, 0.95), rgba(245, 158, 11, 0.9)), url('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80') center/cover; border-radius: 18px; padding: 36px 40px; color: #fff; margin-bottom: 30px; box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.3); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
  <div style="max-width: 650px;">
    <span style="background: rgba(255,255,255,0.25); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; backdrop-filter: blur(4px);">
      👑 Authentic Bangladeshi Cuisine
    </span>
    <h1 style="font-family: 'Playfair Display', serif; font-size: 2.3rem; margin: 12px 0 8px; color: #fff; line-height: 1.2;">
      FlavourCraft Culinary Heritage
    </h1>
    <p style="font-size: 1rem; opacity: 0.95; margin: 0; line-height: 1.5;">
      Slow-cooked Kacchi Biryani with Baghabari Ghee, sizzling Chittagong Kala Bhuna, and stone-ground Padma Shorshe Ilish.
    </p>
  </div>
  <div style="display: flex; gap: 12px;">
    <a href="reservations.php" style="background: #fff; color: #e11d48; padding: 12px 22px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
      <span>📅</span> Book a Table
    </a>
    <a href="cart.php" style="background: rgba(0,0,0,0.3); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 12px 22px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; backdrop-filter: blur(4px);">
      <span>🛒</span> View Cart (<?php echo $cart_count; ?>)
    </a>
  </div>
</div>

<div class="category-tabs-container" style="margin-bottom: 25px;">
  <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px;">
    <a href="index.php?category=all<?php echo !empty($search_query) ? '&search=' . urlencode($search_query) : ''; ?>" 
       class="category-tab-pill <?php echo ($selected_category === 'all') ? 'active' : ''; ?>"
       style="padding: 10px 20px; border-radius: 30px; font-weight: 600; text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; transition: all 0.2s; <?php echo ($selected_category === 'all') ? 'background: #e11d48; color: #fff; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);' : 'background: #fff; color: #475569; border: 1px solid #e2e8f0;'; ?>">
      <span>🍽️</span>
      <span>All Dishes</span>
    </a>

    <?php foreach ($categories as $cat): ?>
      <a href="index.php?category=<?php echo urlencode($cat['slug']); ?><?php echo !empty($search_query) ? '&search=' . urlencode($search_query) : ''; ?>" 
         class="category-tab-pill <?php echo ($selected_category === $cat['slug']) ? 'active' : ''; ?>"
         style="padding: 10px 20px; border-radius: 30px; font-weight: 600; text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; transition: all 0.2s; <?php echo ($selected_category === $cat['slug']) ? 'background: #e11d48; color: #fff; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);' : 'background: #fff; color: #475569; border: 1px solid #e2e8f0;'; ?>">
        <span><?php echo htmlspecialchars($cat['icon']); ?></span>
        <span><?php echo htmlspecialchars($cat['name']); ?></span>
      </a>
    <?php endforeach; ?>
  </div>
</div>

<?php if (!empty($search_query)): ?>
  <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 12px 18px; border-radius: 10px; border: 1px solid #e2e8f0;">
    <div>Search results for: <strong>"<?php echo htmlspecialchars($search_query); ?>"</strong> (<?php echo count($menu_items); ?> dishes found)</div>
    <a href="index.php" style="color: #e11d48; font-weight: 600; text-decoration: none; font-size: 0.85rem;">Clear Search ✕</a>
  </div>
<?php endif; ?>

<?php if (empty($menu_items)): ?>
  <div style="background: #fff; padding: 50px 20px; border-radius: 16px; text-align: center; border: 1px solid #e2e8f0;">
    <div style="font-size: 3rem; margin-bottom: 12px;">🍲</div>
    <h3 style="color: #1e293b; margin-bottom: 6px;">No dishes found</h3>
    <p style="color: #64748b; margin-bottom: 18px;">Try searching for another dish or select a different category.</p>
    <a href="index.php" style="background: #e11d48; color: #fff; padding: 8px 18px; border-radius: 8px; font-weight: 600; text-decoration: none;">View All Menu Items</a>
  </div>
<?php else: ?>
  <div class="menu-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
    <?php foreach ($menu_items as $dish): ?>
      <div class="menu-card" style="background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.04); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;">
        
        <div style="position: relative; width: 100%; height: 210px; overflow: hidden; background: #f8fafc;">
          <img src="<?php echo htmlspecialchars($dish['image_url']); ?>" alt="<?php echo htmlspecialchars($dish['name']); ?>" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" />
          
          <div style="position: absolute; top: 12px; left: 12px; display: flex; flex-wrap: wrap; gap: 6px;">
            <span style="background: rgba(15, 23, 42, 0.75); color: #fff; backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
              <?php echo htmlspecialchars($dish['category_slug']); ?>
            </span>
            <?php if (!empty($dish['tags'])): ?>
              <span style="background: rgba(225, 29, 72, 0.85); color: #fff; backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                <?php echo htmlspecialchars(explode(',', $dish['tags'])[0]); ?>
              </span>
            <?php endif; ?>
          </div>

          <div style="position: absolute; bottom: 12px; right: 12px; display: flex; gap: 6px;">
            <span style="background: rgba(255, 255, 255, 0.92); color: #0f172a; padding: 4px 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
              ⏱️ <?php echo (int)$dish['prep_time_minutes']; ?> mins
            </span>
            <span style="background: rgba(255, 255, 255, 0.92); color: #e11d48; padding: 4px 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
              <?php 
                $spices = (int)$dish['spice_level'];
                echo ($spices === 0) ? '🌱 Mild' : str_repeat('🌶️', $spices);
              ?>
            </span>
          </div>
        </div>

        <div style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h3 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.3;">
                <?php echo htmlspecialchars($dish['name']); ?>
              </h3>
            </div>
            
            <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0 0 16px; min-height: 38px;">
              <?php echo htmlspecialchars($dish['description']); ?>
            </p>
          </div>

          <form action="cart_action.php" method="POST" style="border-top: 1px solid #f1f5f9; padding-top: 14px; margin-top: 8px;">
            <input type="hidden" name="action" value="add" />
            <input type="hidden" name="item_uid" value="<?php echo htmlspecialchars($dish['item_uid']); ?>" />
            <input type="hidden" name="redirect" value="<?php echo htmlspecialchars($_SERVER['REQUEST_URI']); ?>" />

            <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 0.8rem;">
              <div style="flex: 1;">
                <label style="display: block; color: #475569; font-weight: 600; margin-bottom: 4px;">Spice Level</label>
                <select name="spice_level" style="width: 100%; padding: 6px 8px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.8rem; background: #fff;">
                  <option value="Regular">Standard Spice</option>
                  <option value="Mild">Mild</option>
                  <option value="Spicy">Extra Spicy</option>
                  <option value="Naga Hot">Naga Morich (Super Hot)</option>
                </select>
              </div>

              <div style="flex: 1;">
                <label style="display: block; color: #475569; font-weight: 600; margin-bottom: 4px;">Add-on</label>
                <select name="addon" style="width: 100%; padding: 6px 8px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.8rem; background: #fff;">
                  <option value="">No Add-on</option>
                  <option value="Borhani">+ Borhani (+৳80)</option>
                  <option value="Extra Aloo">+ Extra Aloo (+৳40)</option>
                  <option value="Jali Kabab">+ Jali Kabab (+৳120)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <div>
                <div style="font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Price</div>
                <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.3rem; font-weight: 800; color: #e11d48;">
                  <?php echo format_bdt($dish['price']); ?>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" name="quantity" value="1" min="1" max="50" style="width: 55px; padding: 8px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700;" />
                <button type="submit" style="background: #e11d48; color: #fff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(225, 29, 72, 0.25);">
                  <span>+</span> Add
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
