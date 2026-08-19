<?php
$page_title = 'Shopping Cart & Checkout - FlavourCraft';
$page_heading = 'Your Culinary Order & Checkout';
$page_desc = 'Review items, select dining mode, and finalize your order with Bangladeshi payment options';

require_once __DIR__ . '/includes/header.php';

$cart = $_SESSION['cart'] ?? [];
$subtotal = 0;

foreach ($cart as $key => $item) {
    $subtotal += ($item['price'] * $item['quantity']);
}

$vat = $subtotal * 0.05;
$delivery_fee = 60.00;
$total_dinein = $subtotal + $vat;
$total_delivery = $subtotal + $vat + $delivery_fee;
?>

<div style="display: grid; grid-template-columns: 1fr 380px; gap: 30px; align-items: start;">

  <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px;">
      <h2 style="font-size: 1.3rem; margin: 0; color: #0f172a; display: flex; align-items: center; gap: 10px;">
        <span>🛒</span> Selected Items (<?php echo count($cart); ?>)
      </h2>
      <?php if (!empty($cart)): ?>
        <form action="cart_action.php" method="POST" onsubmit="return confirm('Clear entire cart?');">
          <input type="hidden" name="action" value="clear" />
          <input type="hidden" name="redirect" value="cart.php" />
          <button type="submit" style="background: none; border: 1px solid #fecdd3; color: #e11d48; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer;">
            Clear Cart
          </button>
        </form>
      <?php endif; ?>
    </div>

    <?php if (empty($cart)): ?>
      <div style="text-align: center; padding: 60px 20px;">
        <div style="font-size: 3.5rem; margin-bottom: 14px;">🛒</div>
        <h3 style="color: #1e293b; margin-bottom: 6px;">Your cart is currently empty</h3>
        <p style="color: #64748b; margin-bottom: 20px;">Explore our authentic menu to add delicious dishes!</p>
        <a href="index.php" style="background: #e11d48; color: #fff; padding: 12px 24px; border-radius: 10px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
          <span>📖</span> Browse Digital Menu
        </a>
      </div>
    <?php else: ?>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <?php foreach ($cart as $key => $item): 
          $item_total = $item['price'] * $item['quantity'];
        ?>
          <div style="display: flex; gap: 16px; align-items: center; justify-content: space-between; padding: 14px; border-radius: 12px; background: #f8fafc; border: 1px solid #f1f5f9;">
            <div style="display: flex; gap: 14px; align-items: center;">
              <?php if (!empty($item['image_url'])): ?>
                <img src="<?php echo htmlspecialchars($item['image_url']); ?>" alt="<?php echo htmlspecialchars($item['name']); ?>" style="width: 65px; height: 65px; border-radius: 10px; object-fit: cover;" />
              <?php endif; ?>
              <div>
                <h4 style="margin: 0 0 4px; font-size: 1rem; color: #0f172a;"><?php echo htmlspecialchars($item['name']); ?></h4>
                <div style="font-size: 0.8rem; color: #64748b;">
                  <span>Spice: <strong><?php echo htmlspecialchars($item['spice'] ?? 'Regular'); ?></strong></span>
                  <?php if (!empty($item['addon'])): ?>
                    <span style="margin-left: 8px; color: #e11d48;">+ <?php echo htmlspecialchars($item['addon']); ?></span>
                  <?php endif; ?>
                </div>
                <div style="font-size: 0.85rem; font-weight: 700; color: #e11d48; margin-top: 2px;">
                  <?php echo format_bdt($item['price']); ?> each
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; overflow: hidden;">
                <form action="cart_action.php" method="POST" style="margin:0;">
                  <input type="hidden" name="action" value="update" />
                  <input type="hidden" name="cart_key" value="<?php echo htmlspecialchars($key); ?>" />
                  <input type="hidden" name="delta" value="-1" />
                  <input type="hidden" name="redirect" value="cart.php" />
                  <button type="submit" style="background:none; border:none; padding: 6px 12px; cursor: pointer; font-weight: 800; color:#475569;">−</button>
                </form>

                <span style="padding: 0 10px; font-weight: 700; font-size: 0.95rem; font-family: 'JetBrains Mono', monospace; min-width: 25px; text-align: center;">
                  <?php echo (int)$item['quantity']; ?>
                </span>

                <form action="cart_action.php" method="POST" style="margin:0;">
                  <input type="hidden" name="action" value="update" />
                  <input type="hidden" name="cart_key" value="<?php echo htmlspecialchars($key); ?>" />
                  <input type="hidden" name="delta" value="1" />
                  <input type="hidden" name="redirect" value="cart.php" />
                  <button type="submit" style="background:none; border:none; padding: 6px 12px; cursor: pointer; font-weight: 800; color:#475569;">+</button>
                </form>
              </div>

              <div style="min-width: 90px; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 1.05rem; font-weight: 800; color: #0f172a;">
                <?php echo format_bdt($item_total); ?>
              </div>

              <form action="cart_action.php" method="POST" style="margin:0;">
                <input type="hidden" name="action" value="remove" />
                <input type="hidden" name="cart_key" value="<?php echo htmlspecialchars($key); ?>" />
                <input type="hidden" name="redirect" value="cart.php" />
                <button type="submit" title="Remove item" style="background:none; border:none; color: #94a3b8; font-size: 1.1rem; cursor: pointer; padding: 4px;">✕</button>
              </form>
            </div>
          </div>
        <?php endforeach; ?>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <a href="index.php" style="color: #e11d48; font-weight: 600; text-decoration: none; font-size: 0.9rem; display: flex; align-items: center; gap: 6px;">
          <span>←</span> Add More Dishes
        </a>
      </div>
    <?php endif; ?>
  </div>

  <?php if (!empty($cart)): ?>
    <div style="background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      <h3 style="font-size: 1.15rem; margin: 0 0 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
        📋 Order Summary
      </h3>

      <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; color: #475569; margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between;">
          <span>Food Subtotal:</span>
          <strong style="color: #0f172a; font-family: 'JetBrains Mono', monospace;"><?php echo format_bdt($subtotal); ?></strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Government VAT (5%):</span>
          <strong style="color: #0f172a; font-family: 'JetBrains Mono', monospace;"><?php echo format_bdt($vat); ?></strong>
        </div>
        <div style="display: flex; justify-content: space-between;" id="delivery-row">
          <span>Delivery Charge:</span>
          <strong id="delivery-val" style="color: #0f172a; font-family: 'JetBrains Mono', monospace;">৳0.00</strong>
        </div>
        <div style="border-top: 2px dashed #e2e8f0; padding-top: 12px; margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; font-size: 1rem; color: #0f172a;">Estimated Total:</span>
          <span id="grand-total-display" style="font-family: 'JetBrains Mono', monospace; font-size: 1.4rem; font-weight: 800; color: #e11d48;">
            <?php echo format_bdt($total_dinein); ?>
          </span>
        </div>
      </div>

      <form action="place_order.php" method="POST" id="checkout-form">
        <h4 style="font-size: 0.95rem; margin: 0 0 12px; color: #0f172a;">📍 1. Dining Mode</h4>
        
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <label style="flex: 1; border: 1px solid #cbd5e1; padding: 10px 8px; border-radius: 8px; text-align: center; cursor: pointer; font-size: 0.85rem; font-weight: 600;" id="label-dinein">
            <input type="radio" name="order_type" value="Dine-In" checked onchange="updateDiningMode('Dine-In')" style="display:none;" />
            🍽️ Dine-In
          </label>
          <label style="flex: 1; border: 1px solid #cbd5e1; padding: 10px 8px; border-radius: 8px; text-align: center; cursor: pointer; font-size: 0.85rem; font-weight: 600;" id="label-takeaway">
            <input type="radio" name="order_type" value="Takeaway" onchange="updateDiningMode('Takeaway')" style="display:none;" />
            🛍️ Takeaway
          </label>
          <label style="flex: 1; border: 1px solid #cbd5e1; padding: 10px 8px; border-radius: 8px; text-align: center; cursor: pointer; font-size: 0.85rem; font-weight: 600;" id="label-delivery">
            <input type="radio" name="order_type" value="Delivery" onchange="updateDiningMode('Delivery')" style="display:none;" />
            🛵 Delivery
          </label>
        </div>

        <div id="field-table" style="margin-bottom: 14px;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Select Table Number</label>
          <select name="table_number" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
            <option value="Table 01 (Lounge)">Table 01 (Ground Floor Lounge)</option>
            <option value="Table 02 (Window)">Table 02 (Window View)</option>
            <option value="Table 04 (Family VIP)">Table 04 (Family VIP Hall)</option>
            <option value="Table 07 (Rooftop)">Table 07 (Rooftop Garden)</option>
            <option value="Table 10 (Outdoor)">Table 10 (Outdoor Gazebo)</option>
          </select>
        </div>

        <div id="field-address" style="display: none; margin-bottom: 14px;">
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Delivery Address *</label>
          <textarea name="delivery_address" rows="2" placeholder="e.g. House 24, Road 11, Block D, Banani, Dhaka" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;"></textarea>
        </div>

        <h4 style="font-size: 0.95rem; margin: 16px 0 10px; color: #0f172a;">👤 2. Guest Information</h4>
        <div style="margin-bottom: 10px;">
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 4px;">Your Name *</label>
          <input type="text" name="customer_name" required value="<?php echo htmlspecialchars($current_user['name'] ?? 'Asif Rahman'); ?>" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>

        <div style="margin-bottom: 14px;">
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 4px;">Mobile Phone (for SMS updates) *</label>
          <input type="text" name="customer_phone" required placeholder="017XXXXXXXX" value="+880 1711-234567" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
        </div>

        <h4 style="font-size: 0.95rem; margin: 16px 0 10px; color: #0f172a;">💳 3. Payment Method</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px;">
          <label style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; cursor: pointer; font-size: 0.85rem;">
            <input type="radio" name="payment_method" value="bKash" checked />
            <span>📱 <strong>bKash</strong> (Online Gateway)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; cursor: pointer; font-size: 0.85rem;">
            <input type="radio" name="payment_method" value="Nagad" />
            <span>🟠 <strong>Nagad</strong> (Digital Payment)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; cursor: pointer; font-size: 0.85rem;">
            <input type="radio" name="payment_method" value="Cash" />
            <span>💵 <strong>Cash on Delivery / Counter Pay</strong></span>
          </label>
        </div>

        <button type="submit" style="width: 100%; background: linear-gradient(135deg, #e11d48, #be123c); color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.35); transition: transform 0.2s;">
          🚀 Confirm & Place Order
        </button>
      </form>
    </div>
  <?php endif; ?>

</div>

<script>
function updateDiningMode(mode) {
  const tableField = document.getElementById('field-table');
  const addressField = document.getElementById('field-address');
  const deliveryVal = document.getElementById('delivery-val');
  const grandTotal = document.getElementById('grand-total-display');
  
  const subtotal = <?php echo (float)$subtotal; ?>;
  const vat = <?php echo (float)$vat; ?>;
  const deliveryFee = 60;

  document.getElementById('label-dinein').style.borderColor = (mode === 'Dine-In') ? '#e11d48' : '#cbd5e1';
  document.getElementById('label-takeaway').style.borderColor = (mode === 'Takeaway') ? '#e11d48' : '#cbd5e1';
  document.getElementById('label-delivery').style.borderColor = (mode === 'Delivery') ? '#e11d48' : '#cbd5e1';

  if (mode === 'Delivery') {
    tableField.style.display = 'none';
    addressField.style.display = 'block';
    deliveryVal.textContent = '৳60.00';
    const total = subtotal + vat + deliveryFee;
    grandTotal.textContent = '৳' + total.toFixed(2);
  } else if (mode === 'Takeaway') {
    tableField.style.display = 'none';
    addressField.style.display = 'none';
    deliveryVal.textContent = '৳0.00';
    const total = subtotal + vat;
    grandTotal.textContent = '৳' + total.toFixed(2);
  } else {
    tableField.style.display = 'block';
    addressField.style.display = 'none';
    deliveryVal.textContent = '৳0.00';
    const total = subtotal + vat;
    grandTotal.textContent = '৳' + total.toFixed(2);
  }
}
updateDiningMode('Dine-In');
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
