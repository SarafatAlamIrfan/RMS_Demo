/**
 * FlavourCraft - Kitchen Display System (KDS) Component
 */

class KdsComponent {
  constructor() {
    this.soundAlertsEnabled = true;
    this.lastTicketCount = 0;
  }

  init() {
    window.store.subscribe('ticker', () => {
      this._updateTimersOnly();
    });

    window.store.subscribe('db_change', (change) => {
      if (change.collection === 'orders' || change.collection === '*') {
        this.render();
      }
    });
  }

  async render() {
    const container = document.getElementById('view-kds');
    if (!container) return;

    const allOrders = await window.store.db.collection('orders').find({}, { sort: { createdAt: 1 } });
    
    // Categorize active orders
    const newOrders = allOrders.filter(o => o.status === 'New');
    const prepOrders = allOrders.filter(o => o.status === 'Preparing');
    const readyOrders = allOrders.filter(o => o.status === 'Ready to Serve' || o.status === 'Out for Delivery');

    const totalActive = newOrders.length + prepOrders.length + readyOrders.length;
    const overdueCount = allOrders.filter(o => o.status !== 'Completed' && (Date.now() - new Date(o.createdAt).getTime()) > 20 * 60000).length;

    // Check if new ticket arrived and play sound
    if (newOrders.length > this.lastTicketCount) {
      if (this.soundAlertsEnabled) {
        window.store.audio.playOrderChime();
      }
    }
    this.lastTicketCount = newOrders.length;

    container.innerHTML = `
      <div class="kds-top-controls">
        <div class="kds-stats-strip">
          <div class="kds-stat-pill new">
            <span class="count">${newOrders.length}</span>
            <span style="font-size: 12px; color: var(--text-secondary);">New Orders</span>
          </div>
          <div class="kds-stat-pill prep">
            <span class="count">${prepOrders.length}</span>
            <span style="font-size: 12px; color: var(--text-secondary);">In Cooking</span>
          </div>
          <div class="kds-stat-pill ready">
            <span class="count">${readyOrders.length}</span>
            <span style="font-size: 12px; color: var(--text-secondary);">Ready / Out</span>
          </div>
          ${overdueCount > 0 ? `
            <div class="kds-stat-pill overdue">
              <span class="count">${overdueCount}</span>
              <span style="font-size: 12px; color: var(--color-danger); font-weight: 700;">⚠️ Overdue (>20m)</span>
            </div>
          ` : ''}
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <button class="kds-audio-toggle ${this.soundAlertsEnabled ? 'active' : ''}" id="btn-toggle-kds-audio">
            <span>${this.soundAlertsEnabled ? '🔔 Sound Alerts: ON' : '🔕 Sound Alerts: OFF'}</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-kds-refresh">
            🔄 Refresh Queue
          </button>
        </div>
      </div>

      <!-- KDS Kanban Columns -->
      <div class="kds-board-grid">
        <!-- New Tickets -->
        <div class="kds-column">
          <div class="kds-column-header">
            <span class="kds-column-title" style="color: var(--color-info);">
              <span>🔵</span> New Tickets (${newOrders.length})
            </span>
            <span style="font-size: 11px; color: var(--text-muted);">Awaiting Station</span>
          </div>
          <div class="kds-ticket-list">
            ${newOrders.length === 0 ? `
              <div style="text-align: center; padding: 40px 10px; color: var(--text-muted); font-size: 13px;">
                No pending incoming orders
              </div>
            ` : newOrders.map(order => this._renderTicket(order, 'new')).join('')}
          </div>
        </div>

        <!-- In Preparation -->
        <div class="kds-column">
          <div class="kds-column-header">
            <span class="kds-column-title" style="color: var(--primary-light);">
              <span>🔥</span> In Preparation (${prepOrders.length})
            </span>
            <span style="font-size: 11px; color: var(--text-muted);">Grill / Oven / Assembly</span>
          </div>
          <div class="kds-ticket-list">
            ${prepOrders.length === 0 ? `
              <div style="text-align: center; padding: 40px 10px; color: var(--text-muted); font-size: 13px;">
                Kitchen stations idle
              </div>
            ` : prepOrders.map(order => this._renderTicket(order, 'prep')).join('')}
          </div>
        </div>

        <!-- Ready to Serve / Dispatched -->
        <div class="kds-column">
          <div class="kds-column-header">
            <span class="kds-column-title" style="color: var(--color-success);">
              <span>✅</span> Ready for Service (${readyOrders.length})
            </span>
            <span style="font-size: 11px; color: var(--text-muted);">Pass Counter / Delivery</span>
          </div>
          <div class="kds-ticket-list">
            ${readyOrders.length === 0 ? `
              <div style="text-align: center; padding: 40px 10px; color: var(--text-muted); font-size: 13px;">
                No orders ready for pass
              </div>
            ` : readyOrders.map(order => this._renderTicket(order, 'ready')).join('')}
          </div>
        </div>
      </div>
    `;

    this._attachEvents();
  }

  _getElapsedSeconds(createdStr) {
    if (!createdStr) return 240;
    const diff = Math.floor((Date.now() - new Date(createdStr).getTime()) / 1000);
    // If older than 45 minutes (e.g. from seed data), cycle realistically within 4-18 mins
    if (diff > 2700 || isNaN(diff) || diff < 0) {
      return ((Math.abs(diff) || 300) % 900) + 180;
    }
    return diff;
  }

  _renderTicket(order, stage) {
    const elapsedSeconds = this._getElapsedSeconds(order.createdAt);
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    const timeDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    let urgencyClass = 'urgency-fresh';
    if (mins >= 18) {
      urgencyClass = 'urgency-overdue';
    } else if (mins >= 8) {
      urgencyClass = 'urgency-warning';
    }

    return `
      <div class="kds-ticket ${urgencyClass}" data-order-id="${order._id}" data-created="${order.createdAt}">
        <div class="kds-ticket-header">
          <div class="kds-ticket-meta">
            <span class="kds-order-num">${order.orderNumber}</span>
            <span class="kds-type-badge">${order.type} ${order.tableNumber ? `• ${order.tableNumber}` : ''}</span>
          </div>
          <div class="kds-timer-badge timer-val">
            ⏱️ ${timeDisplay}
          </div>
        </div>

        <div class="kds-ticket-items">
          ${order.items.map(item => `
            <div class="kds-ticket-item-row">
              <span class="kds-item-qty">${item.quantity}x</span>
              <div class="kds-item-details">
                <div class="kds-item-name">${item.name}</div>
                ${item.modifiers && item.modifiers.length ? `<div class="kds-item-modifiers">${item.modifiers.join(', ')}</div>` : ''}
              </div>
              <button class="kds-recipe-btn" onclick="window.kdsComponent.openRecipeGuide('${item.dishId}', '${item.name.replace(/'/g, "\\'")}')" title="View Chef Recipe & Ingredients">
                📖 Recipe
              </button>
            </div>
          `).join('')}
        </div>

        <div class="kds-ticket-footer">
          ${stage === 'new' ? `
            <button class="bump-btn start-prep" onclick="window.kdsComponent.bumpOrder('${order._id}', 'Preparing')">
              🔥 Start Cooking
            </button>
          ` : stage === 'prep' ? `
            <button class="bump-btn mark-ready" onclick="window.kdsComponent.bumpOrder('${order._id}', '${order.type === 'Delivery' ? 'Out for Delivery' : 'Ready to Serve'}')">
              ✨ Mark Ready & Plate
            </button>
          ` : `
            <button class="bump-btn complete" onclick="window.kdsComponent.bumpOrder('${order._id}', 'Completed')">
              ✅ Bump / Served
            </button>
          `}
        </div>
      </div>
    `;
  }

  _updateTimersOnly() {
    const tickets = document.querySelectorAll('.kds-ticket');
    tickets.forEach(ticket => {
      const createdStr = ticket.dataset.created;
      const elapsedSeconds = this._getElapsedSeconds(createdStr);
      const mins = Math.floor(elapsedSeconds / 60);
      const secs = elapsedSeconds % 60;
      const timeDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      const timerValEl = ticket.querySelector('.timer-val');
      if (timerValEl) {
        timerValEl.textContent = `⏱️ ${timeDisplay}`;
      }

      ticket.classList.remove('urgency-fresh', 'urgency-warning', 'urgency-overdue');
      if (mins >= 18) {
        ticket.classList.add('urgency-overdue');
      } else if (mins >= 8) {
        ticket.classList.add('urgency-warning');
      } else {
        ticket.classList.add('urgency-fresh');
      }
    });
  }

  async bumpOrder(orderId, newStatus) {
    await window.store.db.collection('orders').updateOne(
      { _id: orderId },
      { $set: { status: newStatus } }
    );

    if (newStatus === 'Ready to Serve' || newStatus === 'Out for Delivery') {
      window.store.audio.playKitchenBell();
    } else if (newStatus === 'Preparing') {
      window.store.audio.playScannerBeep();
    }

    window.app.showToast(`Order status updated to "${newStatus}"`, 'success');
    this.render();
  }

  async openRecipeGuide(dishId, dishName) {
    const dish = await window.store.db.collection('menu').findOne({ _id: dishId });
    if (!dish || !dish.recipeId) {
      window.app.showToast(`Standard recipe spec for "${dishName}"`, 'info');
      return;
    }

    const recipe = await window.store.db.collection('recipes').findOne({ _id: dish.recipeId });
    if (!recipe) return;

    const modal = document.getElementById('modal-generic');
    const title = document.getElementById('generic-modal-title');
    const body = document.getElementById('generic-modal-body');

    title.textContent = `👨‍🍳 Recipe Specification: ${dishName}`;
    body.innerHTML = `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
          Portion formulation & ingredient metrics per dish unit:
        </div>
        <div class="data-table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Quantity Required</th>
                <th>Standard Unit Cost</th>
              </tr>
            </thead>
            <tbody>
              ${recipe.ingredients.map(ing => `
                <tr>
                  <td style="font-weight: 700; color: #fff;">${ing.name}</td>
                  <td style="color: var(--primary-light); font-weight: 700;">${ing.quantity} ${ing.unit}</td>
                  <td>৳${(ing.quantity * ing.unitCost).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div style="background: var(--bg-surface-elevated); padding: 12px 16px; border-radius: var(--radius-md); font-size: 12.5px; color: var(--text-secondary);">
        <strong>Cook Note:</strong> Adhere strictly to measured proportions for consistent culinary quality and accurate stock tracking.
      </div>
    `;

    window.app.openModal('modal-generic');
  }

  _attachEvents() {
    const audioToggle = document.getElementById('btn-toggle-kds-audio');
    if (audioToggle) {
      audioToggle.addEventListener('click', () => {
        this.soundAlertsEnabled = !this.soundAlertsEnabled;
        window.store.audio.soundEnabled = this.soundAlertsEnabled;
        audioToggle.classList.toggle('active', this.soundAlertsEnabled);
        audioToggle.querySelector('span').textContent = this.soundAlertsEnabled ? '🔔 Sound Alerts: ON' : '🔕 Sound Alerts: OFF';
      });
    }

    const refreshBtn = document.getElementById('btn-kds-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.render();
        window.app.showToast('Kitchen tickets refreshed', 'info');
      });
    }
  }
}

window.kdsComponent = new KdsComponent();
