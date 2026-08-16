/**
 * FlavourCraft - Ordering, Checkout & Live Progress Tracking Component
 * Bangladeshi Dhaka Modern Restaurant Edition (Prices in ৳ BDT)
 */

class OrderingComponent {
  constructor() {
    this.orderType = 'Dine-In';
    this.selectedPayment = 'bKash';
    this.activeTrackingOrder = null;
  }

  init() {
    window.store.subscribe('cart_updated', () => {
      this.renderCartDrawer();
    });

    window.store.subscribe('order_created', (order) => {
      this.activeTrackingOrder = order;
      this.renderTracker();
    });
  }

  renderCartDrawer() {
    const list = document.getElementById('cart-items-list');
    const summary = window.store.getCartSummary(this.orderType);
    const cartCountEl = document.getElementById('cart-badge-count');

    if (cartCountEl) {
      cartCountEl.textContent = summary.itemCount;
    }

    if (!list) return;

    if (summary.items.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <div style="font-size: 40px; margin-bottom: 12px;">🛒</div>
          <p style="font-size: 15px; color: #fff; font-weight: 600;">Your Cart is Empty</p>
          <p style="font-size: 13px;">Explore our Dhaka artisan menu and add items to begin.</p>
        </div>
      `;
    } else {
      list.innerHTML = summary.items.map((item, idx) => `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            ${item.modifiers && item.modifiers.length ? `<div class="cart-item-modifiers">${item.modifiers.join(', ')}</div>` : ''}
            <div class="cart-item-price">৳${item.itemTotal.toLocaleString()}</div>
          </div>
          <div class="quantity-stepper" style="padding: 2px;">
            <button class="stepper-btn" onclick="window.store.updateCartItemQty(${idx}, ${item.quantity - 1})" style="width: 26px; height: 26px; font-size: 14px;">−</button>
            <span class="stepper-val" style="font-size: 13px; min-width: 18px;">${item.quantity}</span>
            <button class="stepper-btn" onclick="window.store.updateCartItemQty(${idx}, ${item.quantity + 1})" style="width: 26px; height: 26px; font-size: 14px;">+</button>
          </div>
          <button class="cart-item-remove" onclick="window.store.updateCartItemQty(${idx}, 0)" title="Remove">✕</button>
        </div>
      `).join('');
    }

    document.getElementById('bill-subtotal').textContent = `৳${summary.subtotal.toLocaleString()}`;
    document.getElementById('bill-discount').textContent = `-৳${summary.discountAmount.toLocaleString()}`;
    document.getElementById('bill-vat').textContent = `৳${summary.taxVat.toFixed(1)}`;
    document.getElementById('bill-service').textContent = `৳${summary.serviceCharge.toFixed(1)}`;
    document.getElementById('bill-delivery').textContent = `৳${summary.deliveryFee.toFixed(1)}`;
    document.getElementById('bill-total').textContent = `৳${summary.total.toFixed(0)}`;
  }

  async openCheckoutModal() {
    const summary = window.store.getCartSummary(this.orderType);
    if (summary.items.length === 0) {
      window.app.showToast('Your cart is empty! Add delicious items first.', 'warning');
      return;
    }

    // --- Customer Authentication Gate ---
    if (!window.store.isLoggedIn()) {
      window.app.showToast('Please sign in or create an account to place your order!', 'warning');
      window.authComponent.openLoginModal({
        reason: 'checkout',
        onLoginSuccess: () => {
          this.openCheckoutModal();
        }
      });
      return;
    }

    const modal = document.getElementById('modal-checkout');
    const body = document.getElementById('checkout-modal-content');
    if (!modal || !body) return;

    const tables = await window.store.db.collection('tables').find();
    const currentUser = window.store.currentUser || {};
    const defaultName = currentUser.name || 'Asif Rahman';
    const defaultPhone = currentUser.phone || '+880 1711-234567';
    const defaultAddress = currentUser.deliveryAddress || 'House 42, Road 11, Block D, Banani, Dhaka';

    body.innerHTML = `
      <!-- Order Type Selector -->
      <div class="order-type-tabs" id="checkout-order-type-tabs">
        <div class="order-type-tab ${this.orderType === 'Dine-In' ? 'active' : ''}" data-type="Dine-In">
          <span>🍽️</span>
          <span>Dine-In</span>
        </div>
        <div class="order-type-tab ${this.orderType === 'Takeaway' ? 'active' : ''}" data-type="Takeaway">
          <span>🥡</span>
          <span>Takeaway</span>
        </div>
        <div class="order-type-tab ${this.orderType === 'Delivery' ? 'active' : ''}" data-type="Delivery">
          <span>🛵</span>
          <span>Dhaka Delivery</span>
        </div>
      </div>

      <!-- Dine In Specific -->
      <div id="dinein-options" style="display: ${this.orderType === 'Dine-In' ? 'block' : 'none'}; margin-bottom: 16px;">
        <label class="form-label">Select Table Number</label>
        <select class="form-select" id="checkout-table-select">
          ${tables.map(t => `<option value="${t.number}">${t.number} (${t.zone} - ${t.capacity} Seats)</option>`).join('')}
        </select>
      </div>

      <!-- Delivery Specific -->
      <div id="delivery-options" style="display: ${this.orderType === 'Delivery' ? 'block' : 'none'}; margin-bottom: 16px;">
        <label class="form-label">Dhaka Delivery Address *</label>
        <input type="text" class="form-input" id="checkout-address" placeholder="House/Apt, Road, Area (e.g. Banani, Gulshan, Dhanmondi)" value="${defaultAddress}" />
      </div>

      <!-- Contact Info -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Customer Name *</label>
          <input type="text" class="form-input" id="checkout-name" value="${defaultName}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Mobile Number *</label>
          <input type="tel" class="form-input" id="checkout-phone" value="${defaultPhone}" required />
        </div>
      </div>

      <!-- Promo Code -->
      <div class="promo-code-bar">
        <input type="text" class="form-input" id="checkout-promo-input" placeholder="Promo code (e.g. KACCHI20, DHAKA10)" value="${summary.activePromoCode || ''}" />
        <button type="button" class="btn btn-secondary" id="btn-apply-promo">Apply</button>
      </div>

      <!-- Bangladeshi Payment Methods -->
      <label class="form-label">Select Payment Gateway</label>
      <div class="payment-methods-grid" id="checkout-payment-methods">
        <div class="payment-method-card ${this.selectedPayment === 'bKash' ? 'selected' : ''}" data-pay="bKash">
          <span class="payment-icon">📱</span>
          <span class="payment-name">bKash Pay</span>
        </div>
        <div class="payment-method-card ${this.selectedPayment === 'Nagad' ? 'selected' : ''}" data-pay="Nagad">
          <span class="payment-icon">⚡</span>
          <span class="payment-name">Nagad / Rocket</span>
        </div>
        <div class="payment-method-card ${this.selectedPayment === 'Cards' ? 'selected' : ''}" data-pay="Cards">
          <span class="payment-icon">💳</span>
          <span class="payment-name">Debit/Credit Card</span>
        </div>
        <div class="payment-method-card ${this.selectedPayment === 'Cash' ? 'selected' : ''}" data-pay="Cash">
          <span class="payment-icon">💵</span>
          <span class="payment-name">Cash on Delivery</span>
        </div>
      </div>

      <!-- Total Price Bar -->
      <div style="background: var(--bg-surface-elevated); padding: 14px 18px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-subtle);">
        <div>
          <span style="font-size: 12px; color: var(--text-muted);">Amount Payable</span>
          <div style="font-size: 22px; font-weight: 800; color: var(--primary-light);" id="checkout-payable-amount">
            ৳${summary.total.toFixed(0)}
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-lg" id="btn-confirm-checkout">
          <span>🚀 Place Order & Pay</span>
        </button>
      </div>
    `;

    body.querySelectorAll('#checkout-order-type-tabs .order-type-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        body.querySelectorAll('#checkout-order-type-tabs .order-type-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.orderType = tab.dataset.type;

        document.getElementById('dinein-options').style.display = this.orderType === 'Dine-In' ? 'block' : 'none';
        document.getElementById('delivery-options').style.display = this.orderType === 'Delivery' ? 'block' : 'none';

        const updated = window.store.getCartSummary(this.orderType);
        document.getElementById('checkout-payable-amount').textContent = `৳${updated.total.toFixed(0)}`;
        this.renderCartDrawer();
      });
    });

    body.querySelectorAll('#checkout-payment-methods .payment-method-card').forEach(card => {
      card.addEventListener('click', () => {
        body.querySelectorAll('#checkout-payment-methods .payment-method-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedPayment = card.dataset.pay;
      });
    });

    body.querySelector('#btn-apply-promo').addEventListener('click', () => {
      const code = body.querySelector('#checkout-promo-input').value;
      const res = window.store.applyPromoCode(code);
      if (res.success) {
        window.app.showToast(res.message, 'success');
        const updated = window.store.getCartSummary(this.orderType);
        document.getElementById('checkout-payable-amount').textContent = `৳${updated.total.toFixed(0)}`;
        this.renderCartDrawer();
      } else {
        window.app.showToast(res.message, 'danger');
      }
    });

    body.querySelector('#btn-confirm-checkout').addEventListener('click', async () => {
      const name = body.querySelector('#checkout-name').value.trim();
      const phone = body.querySelector('#checkout-phone').value.trim();
      const address = body.querySelector('#checkout-address')?.value.trim();
      const table = body.querySelector('#checkout-table-select')?.value;

      const summary = window.store.getCartSummary(this.orderType);

      const orderPayload = {
        type: this.orderType,
        customerName: name,
        customerPhone: phone,
        deliveryAddress: this.orderType === 'Delivery' ? address : null,
        tableNumber: this.orderType === 'Dine-In' ? table : null,
        paymentMethod: this.selectedPayment,
        items: summary.items,
        subtotal: summary.subtotal,
        taxVat: summary.taxVat,
        serviceCharge: summary.serviceCharge,
        deliveryFee: summary.deliveryFee,
        discountAmount: summary.discountAmount,
        total: summary.total
      };

      const createdOrder = await window.store.submitOrder(orderPayload);

      window.app.closeModal('modal-checkout');
      window.app.toggleCart(false);
      window.app.showToast(`🎉 Order ${createdOrder.orderNumber} placed successfully (৳${createdOrder.totalAmount.toLocaleString()})!`, 'success');
      
      window.app.navigate('tracking');
    });

    window.app.openModal('modal-checkout');
  }

  // --- Live Order Tracker View ---
  async renderTracker() {
    const container = document.getElementById('view-tracking');
    if (!container) return;

    if (!this.activeTrackingOrder) {
      const latestOrder = await window.store.db.collection('orders').findOne({}, { sort: { createdAt: -1 } });
      this.activeTrackingOrder = latestOrder;
    }

    const order = this.activeTrackingOrder;

    if (!order) {
      container.innerHTML = `
        <div class="tracker-container">
          <div class="tracker-card" style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 48px; margin-bottom: 12px;">📍</div>
            <h2 style="color: #fff; font-size: 22px; margin-bottom: 8px;">No Active Orders Tracking</h2>
            <p style="color: var(--text-muted);">Place an order from our Bengali menu to track real-time kitchen and rider progress.</p>
          </div>
        </div>
      `;
      return;
    }

    const stages = ['New', 'Preparing', 'Ready to Serve', 'Completed'];
    if (order.type === 'Delivery') {
      stages[2] = 'Out for Delivery';
    }

    const currentStageIdx = stages.indexOf(order.status) > -1 ? stages.indexOf(order.status) : 1;
    const progressPercent = (currentStageIdx / (stages.length - 1)) * 100;

    container.innerHTML = `
      <div class="tracker-container">
        <div class="tracker-card">
          <div class="tracker-header">
            <div>
              <span style="font-size: 12px; color: var(--primary); font-weight: 700; text-transform: uppercase;">Live Order Tracking</span>
              <div class="tracker-order-id">${order.orderNumber} • ${order.type} ${order.tableNumber ? `(${order.tableNumber})` : ''}</div>
            </div>
            <div class="tracker-eta-badge">
              <span>⏱️</span>
              <span>Estimated: ~${order.status === 'Completed' ? 'Delivered' : '15-20 Mins'}</span>
            </div>
          </div>

          <!-- Multi-stage Visual Progress Bar -->
          <div class="progress-timeline">
            <div class="progress-timeline-bar" style="width: ${progressPercent}%;"></div>
            ${stages.map((stage, idx) => {
              const isCompleted = idx < currentStageIdx;
              const isActive = idx === currentStageIdx;
              const icons = ['📝', '🍳', order.type === 'Delivery' ? '🛵' : '🍽️', '✅'];
              return `
                <div class="timeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
                  <div class="step-circle">${icons[idx]}</div>
                  <span class="step-label">${stage}</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Driver or Kitchen Dispatch Radar -->
          <div class="delivery-radar-card" style="margin-bottom: 24px;">
            <div class="driver-avatar">${order.type === 'Delivery' ? '🛵' : '👨‍🍳'}</div>
            <div class="driver-info">
              <div class="driver-name">${order.type === 'Delivery' ? (order.driverName || 'Mehedi Hasan (Delivery Rider #04)') : 'Master Chef Masud (Biryani & Grill Station)'}</div>
              <div class="driver-status">
                ${order.status === 'New' ? 'Ticket received in kitchen, handi preparing...' : 
                  order.status === 'Preparing' ? 'Kacchi / Curry on active dum and woodfired cooking!' :
                  order.status === 'Out for Delivery' ? 'Rider dispatched on Dhaka roads!' :
                  order.status === 'Ready to Serve' ? 'Plated and ready to serve at your dining table!' : 'Order completed & enjoyed!'}
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-advance-status" title="Simulate Kitchen Stage Advancement">
              ⚡ Advance Stage (Demo)
            </button>
          </div>

          <!-- Order Item Breakdown in Taka -->
          <div style="border-top: 1px solid var(--border-subtle); padding-top: 20px;">
            <h4 style="color: #fff; font-size: 15px; margin-bottom: 12px;">Ordered Culinary Selection</h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13.5px;">
                  <div>
                    <span style="font-weight: 700; color: var(--primary-light);">${item.quantity}x</span>
                    <strong style="color: #fff;">${item.name}</strong>
                    ${item.modifiers && item.modifiers.length ? `<div style="font-size: 11px; color: var(--text-muted);">${item.modifiers.join(', ')}</div>` : ''}
                  </div>
                  <span style="font-weight: 700; color: #fff;">৳${(item.itemTotal || (item.unitPrice * item.quantity)).toLocaleString()}</span>
                </div>
              `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px dashed var(--border-medium); font-size: 16px; font-weight: 800; color: #fff;">
              <span>Total Paid (${order.paymentMethod})</span>
              <span style="color: var(--primary-light);">৳${order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const advBtn = document.getElementById('btn-advance-status');
    if (advBtn) {
      advBtn.addEventListener('click', async () => {
        const nextStatusMap = {
          'New': 'Preparing',
          'Preparing': order.type === 'Delivery' ? 'Out for Delivery' : 'Ready to Serve',
          'Out for Delivery': 'Completed',
          'Ready to Serve': 'Completed',
          'Completed': 'New'
        };
        const nextStatus = nextStatusMap[order.status] || 'Preparing';

        await window.store.db.collection('orders').updateOne(
          { _id: order._id },
          { $set: { status: nextStatus } }
        );

        order.status = nextStatus;
        window.store.audio.playKitchenBell();
        this.renderTracker();
        window.app.showToast(`Order status updated to "${nextStatus}"`, 'info');
      });
    }
  }
}

window.OrderingComponent = OrderingComponent;
