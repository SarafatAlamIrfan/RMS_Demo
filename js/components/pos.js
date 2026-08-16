/**
 * FlavourCraft - Rapid POS & Thermal Billing Component
 * Bangladeshi Dhaka Modern Restaurant Edition (Prices in ৳ BDT)
 */

class PosComponent {
  constructor() {
    this.activeCategory = 'All';
    this.selectedTable = 'T-01';
    this.posCart = [];
    this.discountPercent = 0;
    this.searchQuery = '';
  }

  async render() {
    const container = document.getElementById('view-pos');
    if (!container) return;

    const dishes = await window.store.db.collection('menu').find();
    const tables = await window.store.db.collection('tables').find();
    const categories = [
      'All',
      'Kacchi & Biryani',
      'Beef, Mutton & Chicken',
      'Fish & Seafood',
      'Kabab & Street Food',
      'Drinks & Desserts'
    ];

    container.innerHTML = `
      <div class="pos-layout">
        <!-- Left: Catalog & Search Grid -->
        <div class="pos-catalog-panel">
          <div class="pos-search-bar">
            <div class="pos-search-input-wrap">
              <span>🔍</span>
              <input type="text" id="pos-search-input" placeholder="Search dish name, SKU or barcode..." value="${this.searchQuery}" />
            </div>
            <button class="barcode-scanner-btn" id="btn-simulate-scan">
              <span>📷 Scan SKU Barcode</span>
            </button>
          </div>

          <!-- Category Quick Tabs -->
          <div class="pos-cat-tabs" id="pos-cat-tabs">
            ${categories.map(cat => `
              <button class="pos-cat-btn ${this.activeCategory === cat ? 'active' : ''}" data-cat="${cat}">
                ${cat}
              </button>
            `).join('')}
          </div>

          <!-- POS Items Touch Grid -->
          <div class="pos-items-grid" id="pos-items-grid">
            ${this._renderPosItems(dishes)}
          </div>
        </div>

        <!-- Right: Register Ticket & Billing Calculations -->
        <div class="pos-ticket-panel">
          <div class="pos-ticket-header">
            <div>
              <span style="font-size: 11px; text-transform: uppercase; color: var(--primary); font-weight: 800;">Dhaka POS Terminal #01</span>
              <h3 style="color: #fff; font-size: 17px; font-weight: 800;">Current Dine-In Ticket</h3>
            </div>
            <div>
              <select class="pos-table-selector" id="pos-table-select">
                ${tables.map(t => `<option value="${t.number}" ${this.selectedTable === t.number ? 'selected' : ''}>Table ${t.number}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Ticket Line Items -->
          <div class="pos-ticket-items" id="pos-ticket-items-list">
            ${this._renderTicketItems()}
          </div>

          <!-- Billing Calculations -->
          <div class="pos-ticket-calculations">
            <div class="pos-calc-row">
              <span>Subtotal</span>
              <span id="pos-calc-subtotal">৳0</span>
            </div>
            <div class="pos-calc-row">
              <span>Discount (${this.discountPercent}%)</span>
              <span id="pos-calc-discount">-৳0</span>
            </div>
            <div class="pos-calc-row">
              <span>VAT (5% Mushak-6.3)</span>
              <span id="pos-calc-vat">৳0</span>
            </div>
            <div class="pos-calc-row">
              <span>Service Charge (5%)</span>
              <span id="pos-calc-service">৳0</span>
            </div>
            <div class="pos-calc-row grand-total">
              <span>TOTAL PAYABLE</span>
              <span class="amount" id="pos-calc-total">৳0</span>
            </div>
          </div>

          <!-- POS Quick Actions Grid -->
          <div class="pos-actions-grid">
            <button class="btn btn-secondary btn-sm" id="btn-pos-discount">
              🏷️ Promo / Discount
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-pos-split">
              ➗ Split Bill
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-pos-clear" style="color: var(--color-danger);">
              🗑️ Clear
            </button>
            <button class="btn btn-primary btn-sm" id="btn-pos-pay">
              💵 Settle & Print Receipt
            </button>
          </div>
        </div>
      </div>
    `;

    this._attachEvents();
    this._updateCalculations();
  }

  _renderPosItems(dishes) {
    const filtered = dishes.filter(d => {
      if (this.activeCategory !== 'All' && d.category !== this.activeCategory) return false;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchName = d.name.toLowerCase().includes(q);
        const matchSku = (d.sku || '').toLowerCase().includes(q);
        if (!matchName && !matchSku) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      return `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No dishes match search query</div>`;
    }

    return filtered.map(dish => `
      <div class="pos-item-btn" data-dish-id="${dish._id}">
        <span class="pos-item-sku">${dish.sku || 'SKU'}</span>
        <div class="pos-item-name">${dish.name}</div>
        <div class="pos-item-price">৳${dish.price.toLocaleString()}</div>
      </div>
    `).join('');
  }

  _renderTicketItems() {
    if (this.posCart.length === 0) {
      return `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted); font-size: 13px;">
          Tap items to add to current register ticket
        </div>
      `;
    }

    return this.posCart.map((item, idx) => `
      <div class="pos-ticket-row">
        <div class="pos-row-info">
          <div class="pos-row-name">${item.name}</div>
          <div style="font-size: 11px; color: var(--primary-light);">৳${item.unitPrice.toLocaleString()} each</div>
        </div>
        <div class="pos-row-qty-controls">
          <button class="pos-qty-btn" onclick="window.posComponent.updateQty(${idx}, ${item.quantity - 1})">−</button>
          <span style="font-weight: 700; font-size: 13px; min-width: 18px; text-align: center;">${item.quantity}</span>
          <button class="pos-qty-btn" onclick="window.posComponent.updateQty(${idx}, ${item.quantity + 1})">+</button>
        </div>
        <div style="font-weight: 700; font-size: 13.5px; margin-left: 12px; min-width: 55px; text-align: right;">
          ৳${(item.quantity * item.unitPrice).toLocaleString()}
        </div>
      </div>
    `).join('');
  }

  _updateCalculations() {
    const subtotal = this.posCart.reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
    const discountAmount = subtotal * (this.discountPercent / 100);
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const vat = discountedSubtotal * 0.05;
    const service = discountedSubtotal * 0.05;
    const grandTotal = discountedSubtotal + vat + service;

    const subtotalEl = document.getElementById('pos-calc-subtotal');
    const discEl = document.getElementById('pos-calc-discount');
    const vatEl = document.getElementById('pos-calc-vat');
    const servEl = document.getElementById('pos-calc-service');
    const totalEl = document.getElementById('pos-calc-total');

    if (subtotalEl) subtotalEl.textContent = `৳${subtotal.toLocaleString()}`;
    if (discEl) discEl.textContent = `-৳${discountAmount.toFixed(0)}`;
    if (vatEl) vatEl.textContent = `৳${vat.toFixed(1)}`;
    if (servEl) servEl.textContent = `৳${service.toFixed(1)}`;
    if (totalEl) totalEl.textContent = `৳${grandTotal.toFixed(0)}`;
  }

  async addToPos(dishId) {
    const dish = await window.store.db.collection('menu').findOne({ _id: dishId });
    if (!dish) return;

    const existing = this.posCart.find(i => i.dishId === dish._id);
    if (existing) {
      existing.quantity++;
    } else {
      this.posCart.push({
        dishId: dish._id,
        name: dish.name,
        unitPrice: dish.price,
        quantity: 1
      });
    }

    window.store.audio.playScannerBeep();
    const list = document.getElementById('pos-ticket-items-list');
    if (list) list.innerHTML = this._renderTicketItems();
    this._updateCalculations();
  }

  updateQty(index, newQty) {
    if (newQty <= 0) {
      this.posCart.splice(index, 1);
    } else {
      this.posCart[index].quantity = newQty;
    }
    const list = document.getElementById('pos-ticket-items-list');
    if (list) list.innerHTML = this._renderTicketItems();
    this._updateCalculations();
  }

  setSelectedTable(tableNumber) {
    this.selectedTable = tableNumber;
    const select = document.getElementById('pos-table-select');
    if (select) select.value = tableNumber;
  }

  _attachEvents() {
    document.querySelectorAll('.pos-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dishId = btn.dataset.dishId;
        this.addToPos(dishId);
      });
    });

    document.querySelectorAll('#pos-cat-tabs .pos-cat-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        document.querySelectorAll('#pos-cat-tabs .pos-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.dataset.cat;
        const dishes = await window.store.db.collection('menu').find();
        const grid = document.getElementById('pos-items-grid');
        if (grid) {
          grid.innerHTML = this._renderPosItems(dishes);
          this._rebindGrid();
        }
      });
    });

    const searchInput = document.getElementById('pos-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', async () => {
        this.searchQuery = searchInput.value;
        const dishes = await window.store.db.collection('menu').find();
        const grid = document.getElementById('pos-items-grid');
        if (grid) {
          grid.innerHTML = this._renderPosItems(dishes);
          this._rebindGrid();
        }
      });
    }

    const scanBtn = document.getElementById('btn-simulate-scan');
    if (scanBtn) {
      scanBtn.addEventListener('click', async () => {
        const dishes = await window.store.db.collection('menu').find();
        const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
        this.addToPos(randomDish._id);
        window.app.showToast(`⚡ Barcode Scanned: [${randomDish.sku}] ${randomDish.name}`, 'info');
      });
    }

    const tableSelect = document.getElementById('pos-table-select');
    if (tableSelect) {
      tableSelect.addEventListener('change', () => {
        this.selectedTable = tableSelect.value;
      });
    }

    const clearBtn = document.getElementById('btn-pos-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.posCart = [];
        this.discountPercent = 0;
        const list = document.getElementById('pos-ticket-items-list');
        if (list) list.innerHTML = this._renderTicketItems();
        this._updateCalculations();
        window.app.showToast('Register ticket cleared', 'info');
      });
    }

    const discBtn = document.getElementById('btn-pos-discount');
    if (discBtn) {
      discBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-generic');
        const title = document.getElementById('generic-modal-title');
        const body = document.getElementById('generic-modal-body');

        title.textContent = '🏷️ Apply Staff / VIP Promo Discount';
        body.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <label class="form-label">Select Discount Level</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
              <button class="btn btn-secondary" onclick="window.posComponent.setDiscount(5)">5% Staff</button>
              <button class="btn btn-secondary" onclick="window.posComponent.setDiscount(10)">10% Member</button>
              <button class="btn btn-secondary" onclick="window.posComponent.setDiscount(20)">20% VIP</button>
            </div>
            <div class="form-group" style="margin-top: 10px;">
              <label class="form-label">Or Custom Percentage (%)</label>
              <input type="number" class="form-input" id="custom-discount-val" placeholder="e.g. 15" min="0" max="100" />
            </div>
            <button class="btn btn-primary" onclick="window.posComponent.setDiscount(document.getElementById('custom-discount-val').value)">
              Apply Custom Discount
            </button>
          </div>
        `;
        window.app.openModal('modal-generic');
      });
    }

    const splitBtn = document.getElementById('btn-pos-split');
    if (splitBtn) {
      splitBtn.addEventListener('click', () => {
        const subtotal = this.posCart.reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
        const total = (subtotal * (1 - this.discountPercent/100)) * 1.10;

        const modal = document.getElementById('modal-generic');
        const title = document.getElementById('generic-modal-title');
        const body = document.getElementById('generic-modal-body');

        title.textContent = '➗ Split Bill Calculator (Dhaka)';
        body.innerHTML = `
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 13px; color: var(--text-muted);">Total Bill to Split</span>
            <div style="font-size: 28px; font-weight: 800; color: var(--primary-light);">৳${total.toFixed(0)}</div>
          </div>
          <div class="form-group">
            <label class="form-label">Number of Guests Splitting</label>
            <div style="display: flex; gap: 8px;">
              ${[2, 3, 4, 5, 6].map(n => `
                <button class="party-chip" style="flex:1;" onclick="document.getElementById('split-result').textContent = '৳' + Math.round(${total} / ${n}) + ' per guest';">
                  ${n}p
                </button>
              `).join('')}
            </div>
          </div>
          <div style="background: var(--bg-surface-elevated); padding: 18px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle); margin-top: 16px;">
            <span style="font-size: 12px; color: var(--text-muted);">Individual Share</span>
            <div style="font-size: 24px; font-weight: 800; color: #fff;" id="split-result">
              ৳${Math.round(total / 2)} per guest
            </div>
          </div>
        `;
        window.app.openModal('modal-generic');
      });
    }

    const payBtn = document.getElementById('btn-pos-pay');
    if (payBtn) {
      payBtn.addEventListener('click', () => {
        if (this.posCart.length === 0) {
          window.app.showToast('Please add items to register ticket first!', 'warning');
          return;
        }
        this.openThermalReceipt();
      });
    }
  }

  _rebindGrid() {
    document.querySelectorAll('.pos-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dishId = btn.dataset.dishId;
        this.addToPos(dishId);
      });
    });
  }

  setDiscount(percent) {
    this.discountPercent = parseFloat(percent) || 0;
    this._updateCalculations();
    window.app.closeModal('modal-generic');
    window.app.showToast(`Applied ${this.discountPercent}% discount`, 'success');
  }

  async openThermalReceipt() {
    const subtotal = this.posCart.reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
    const discountAmount = subtotal * (this.discountPercent / 100);
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const vat = discountedSubtotal * 0.05;
    const service = discountedSubtotal * 0.05;
    const grandTotal = discountedSubtotal + vat + service;
    const orderNumber = `#FC-DHK-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload = {
      orderNumber,
      type: 'Dine-In',
      tableNumber: this.selectedTable,
      customerName: `Table ${this.selectedTable} Walk-in`,
      status: 'New',
      items: this.posCart.map(i => ({
        dishId: i.dishId,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        itemTotal: i.quantity * i.unitPrice
      })),
      subtotal,
      taxVat: vat,
      serviceCharge: service,
      discountAmount,
      total: grandTotal,
      paymentMethod: 'POS bKash / Card / Cash',
      paymentStatus: 'Paid'
    };

    await window.store.submitOrder(orderPayload);

    const modal = document.getElementById('modal-generic');
    const title = document.getElementById('generic-modal-title');
    const body = document.getElementById('generic-modal-body');

    title.textContent = '🧾 Mushak-6.3 Thermal POS Receipt';
    body.innerHTML = `
      <div class="thermal-receipt-wrap" id="printable-receipt">
        <div class="receipt-header">
          <div class="receipt-brand">FLAVOURCRAFT DHAKA</div>
          <div style="font-size: 11px;">Modern Bangladeshi Fine Dining</div>
          <div style="font-size: 10px;">House 42, Road 11, Banani, Dhaka</div>
          <div style="font-size: 10px;">Tel: +880 2-9881122 • BIN: 00192834-0101</div>
          <div style="font-size: 10px; margin-top: 2px; font-weight:700;">MUSHAK-6.3 TAX INVOICE</div>
        </div>

        <div class="receipt-divider"></div>

        <div style="font-size: 11px; margin-bottom: 6px;">
          <div>Ticket: <strong>${orderNumber}</strong></div>
          <div>Table: <strong>${this.selectedTable}</strong> | Server: Tanvir</div>
          <div>Date: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}</div>
        </div>

        <div class="receipt-double-divider"></div>

        <table class="receipt-items-table">
          <thead>
            <tr>
              <th>QTY/ITEM</th>
              <th style="text-align: right;">PRICE</th>
            </tr>
          </thead>
          <tbody>
            ${this.posCart.map(i => `
              <tr>
                <td>${i.quantity}x ${i.name}</td>
                <td style="text-align: right;">৳${(i.quantity * i.unitPrice).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="receipt-divider"></div>

        <div class="receipt-row">
          <span>Subtotal</span>
          <span>৳${subtotal.toLocaleString()}</span>
        </div>
        ${this.discountPercent > 0 ? `
          <div class="receipt-row">
            <span>Discount (${this.discountPercent}%)</span>
            <span>-৳${discountAmount.toFixed(0)}</span>
          </div>
        ` : ''}
        <div class="receipt-row">
          <span>VAT (5% Mushak-6.3)</span>
          <span>৳${vat.toFixed(1)}</span>
        </div>
        <div class="receipt-row">
          <span>Service Charge (5%)</span>
          <span>৳${service.toFixed(1)}</span>
        </div>

        <div class="receipt-double-divider"></div>

        <div class="receipt-row bold">
          <span>NET PAYABLE</span>
          <span>৳${grandTotal.toFixed(0)}</span>
        </div>

        <div class="receipt-divider"></div>

        <div class="receipt-row">
          <span>Payment Mode:</span>
          <span>bKash / Cards / Cash (PAID)</span>
        </div>

        <div class="receipt-footer">
          <div>*** DHONNOBAD / THANK YOU ***</div>
          <div style="font-size: 9px; margin-top: 4px;">Visit Again for Dhaka's Finest Kacchi & Fish</div>
        </div>
      </div>

      <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn btn-secondary" onclick="window.app.closeModal('modal-generic')">Close</button>
        <button class="btn btn-primary" onclick="window.print()">🖨️ Print Invoice</button>
      </div>
    `;

    window.app.openModal('modal-generic');

    this.posCart = [];
    this.discountPercent = 0;
    const list = document.getElementById('pos-ticket-items-list');
    if (list) list.innerHTML = this._renderTicketItems();
    this._updateCalculations();
  }
}

window.posComponent = new PosComponent();
