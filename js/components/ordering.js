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
  async renderTracker(specificOrderId = null) {
    const container = document.getElementById('view-tracking');
    if (!container) return;

    const allOrders = await window.store.db.collection('orders').find({}, { sort: { createdAt: -1 } });

    if (specificOrderId) {
      this.activeTrackingOrderId = specificOrderId;
    }

    let order = null;
    if (this.activeTrackingOrderId) {
      order = allOrders.find(o => o._id === this.activeTrackingOrderId);
    }
    if (!order && allOrders.length > 0) {
      order = allOrders[0];
      this.activeTrackingOrderId = order._id;
    }

    if (!order) {
      container.innerHTML = `
        <div class="tracker-container">
          <div class="tracker-card" style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 48px; margin-bottom: 12px;">📍</div>
            <h2 style="color: var(--heading-color); font-size: 22px; margin-bottom: 8px;">No Active Orders Tracking</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">Place an order from our menu to track real-time kitchen and delivery progress.</p>
            <button class="btn btn-primary" onclick="window.app.navigate('menu')">Browse Menu & Order</button>
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
        <!-- 1. Live Active Order Tracking Card -->
        <div class="tracker-card">
          <div class="tracker-header">
            <div>
              <span style="font-size: 11.5px; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Live Active Order</span>
              <div class="tracker-order-id">${order.orderNumber} • ${order.type} ${order.tableNumber ? `(${order.tableNumber})` : ''}</div>
            </div>
            <div class="badge badge-${order.status === 'Completed' ? 'success' : order.status === 'New' ? 'amber' : 'primary'}" style="font-size: 13px; padding: 6px 14px;">
              ⏱️ ${order.status === 'Completed' ? 'Order Delivered / Served' : 'Estimated: ~15-20 Mins'}
            </div>
          </div>

          <!-- Multi-stage Visual Progress Bar -->
          <div class="timeline-progress-bar">
            ${stages.map((stage, idx) => {
              const isCompleted = idx < currentStageIdx;
              const isActive = idx === currentStageIdx;
              const icons = ['📝', '🍳', order.type === 'Delivery' ? '🛵' : '🍽️', '✅'];
              return `
                <div class="timeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
                  <div class="timeline-dot">${icons[idx]}</div>
                  <span class="timeline-label">${stage}</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Driver / Kitchen Station Radar Box -->
          <div class="rider-radar-box">
            <div class="rider-avatar">${order.type === 'Delivery' ? '🛵' : '👨‍🍳'}</div>
            <div class="rider-info" style="flex: 1;">
              <h4>${order.type === 'Delivery' ? (order.driverName || 'Mehedi Hasan (Delivery Rider #04)') : 'Chef Rony (Kacchi & Grill Master)'}</h4>
              <p>
                ${order.status === 'New' ? 'Ticket received in kitchen station. Preparing ingredients...' : 
                  order.status === 'Preparing' ? 'Kacchi / Curry on active woodfired dum and flame cooking!' :
                  order.status === 'Out for Delivery' ? 'Rider dispatched on Dhaka roads heading to your address!' :
                  order.status === 'Ready to Serve' ? 'Plated and ready to be served at your table!' : 'Order completed & enjoyed!'}
              </p>
            </div>
          </div>

          <!-- Ordered Items Summary -->
          <div style="border-top: 1px solid var(--border-subtle); padding-top: 20px; margin-top: 20px;">
            <h4 style="color: var(--heading-color); font-size: 15px; font-weight: 800; margin-bottom: 14px;">Ordered Culinary Selection</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${(order.items || []).map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13.5px;">
                  <div>
                    <span style="font-weight: 800; color: var(--primary); margin-right: 6px;">${item.quantity}x</span>
                    <strong style="color: var(--heading-color);">${item.name}</strong>
                    ${item.modifiers && item.modifiers.length ? `<div style="font-size: 11.5px; color: var(--primary); margin-top: 2px;">${item.modifiers.join(', ')}</div>` : ''}
                  </div>
                  <span style="font-weight: 800; font-family: var(--font-mono); color: var(--heading-color);">
                    ৳${(item.itemTotal || (item.unitPrice * item.quantity)).toLocaleString()}
                  </span>
                </div>
              `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 14px; border-top: 1px dashed var(--border-medium); font-size: 16px; font-weight: 900; color: var(--heading-color);">
              <span>Total Paid (${order.paymentMethod || 'bKash Pay'})</span>
              <span style="color: var(--primary); font-family: var(--font-heading); font-size: 20px;">৳${(order.totalAmount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <!-- 2. Previous Orders History List -->
        <div class="data-table-card" style="margin-top: 32px;">
          <div class="table-card-header">
            <h4 class="table-card-title">📜 Previous Orders History (${allOrders.length})</h4>
            <span style="font-size: 12px; color: var(--text-secondary);">Select any previous order to view live status</span>
          </div>
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
            ${allOrders.map(ord => {
              const isCurrent = ord._id === order._id;
              const itemsListStr = (ord.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ');
              return `
                <div style="background: ${isCurrent ? '#fff1f2' : '#ffffff'}; border: 1.5px solid ${isCurrent ? 'var(--primary)' : 'var(--border-subtle)'}; border-radius: var(--radius-md); padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; transition: var(--transition-fast);">
                  <div style="flex: 1; min-width: 240px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                      <strong style="font-family: var(--font-mono); font-size: 15px; color: var(--heading-color);">${ord.orderNumber}</strong>
                      <span class="badge badge-${ord.type === 'Delivery' ? 'saffron' : 'primary'}">${ord.type} ${ord.tableNumber ? `• ${ord.tableNumber}` : ''}</span>
                      <span class="badge badge-${ord.status === 'Completed' ? 'success' : ord.status === 'New' ? 'amber' : 'primary'}">${ord.status}</span>
                    </div>
                    <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4; margin-bottom: 2px;">
                      ${itemsListStr}
                    </div>
                    <div style="font-size: 11.5px; color: var(--text-muted);">
                      Paid via ${ord.paymentMethod || 'Cash'} • Total: <strong>৳${(ord.totalAmount || 0).toLocaleString()}</strong>
                    </div>
                  </div>
                  <div>
                    <button class="btn btn-${isCurrent ? 'primary' : 'secondary'} btn-sm" onclick="window.app.components.ordering.renderTracker('${ord._id}')">
                      ${isCurrent ? '📍 Tracking Now' : 'Track Order ➔'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
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
        this.renderTracker(order._id);
        window.app.showToast(`Order status updated to "${nextStatus}"`, 'info');
      });
    }
  }
}

window.OrderingComponent = OrderingComponent;
