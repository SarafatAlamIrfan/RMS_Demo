/**
 * FlavourCraft - Visual Floor & Table Management Component
 */

class FloorComponent {
  constructor() {
    this.selectedZone = 'All';
  }

  async render() {
    const container = document.getElementById('view-floor');
    if (!container) return;

    const tables = await window.store.db.collection('tables').find();
    const orders = await window.store.db.collection('orders').find();

    const counts = {
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      dirty: tables.filter(t => t.status === 'dirty').length
    };

    container.innerHTML = `
      <div class="floor-container">
        <!-- Floor Controls & Legend Bar -->
        <div class="floor-controls-bar">
          <div class="floor-legend">
            <div class="legend-item">
              <span class="legend-dot available"></span>
              <span>Available (${counts.available})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot occupied"></span>
              <span>Occupied (${counts.occupied})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot reserved"></span>
              <span>Reserved (${counts.reserved})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot dirty"></span>
              <span>Needs Cleaning (${counts.dirty})</span>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm" id="btn-quick-clean-all">
              🧹 Clean All Dirty Tables
            </button>
            <button class="btn btn-primary btn-sm" id="btn-floor-refresh">
              🔄 Refresh Floor Plan
            </button>
          </div>
        </div>

        <!-- Visual 2D Restaurant Floor Plan Canvas -->
        <div class="floor-canvas-wrapper">
          <div class="floor-zone-tag zone-main">🍽️ Gulshan Dining Hall</div>
          <div class="floor-zone-tag zone-window">🏙️ Banani Skyline Lounge</div>
          <div class="floor-zone-tag zone-outdoor">🌿 Garden Terrace Patio</div>
          <div class="floor-zone-tag zone-vip">👑 Nawab VIP Private Salon</div>

          <div class="floor-grid" id="floor-tables-grid">
            ${tables.map(table => {
              const activeOrder = orders.find(o => o.tableNumber === table.number && o.status !== 'Completed');
              return this._renderTableNode(table, activeOrder);
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this._attachEvents();
  }

  _renderTableNode(table, activeOrder) {
    let statusClass = `status-${table.status}`;
    let shapeClass = `shape-${table.shape || 'square'}`;

    return `
      <div class="table-node ${statusClass} ${shapeClass}" data-table-id="${table._id}" data-table-num="${table.number}">
        <div class="table-node-number">${table.number}</div>
        <div class="table-node-capacity">
          <span>👥 ${table.capacity} Seats</span>
          <span style="font-size: 10px; color: var(--text-muted);">• ${table.zone}</span>
        </div>
        <div class="table-node-status-badge">
          ${table.status === 'dirty' ? '🧹 Clean Me' : table.status.toUpperCase()}
        </div>

        ${activeOrder ? `
          <div class="table-order-amount">
            ${activeOrder.orderNumber} (৳${activeOrder.totalAmount.toLocaleString()})
          </div>
        ` : table.reservedFor ? `
          <div style="font-size: 11px; color: var(--primary-light); text-align: center; line-height: 1.2;">
            ${table.reservedFor}
          </div>
        ` : `
          <div style="font-size: 11px; color: var(--text-muted);">
            Server: ${table.activeServer || 'Tanvir'}
          </div>
        `}
      </div>
    `;
  }

  _attachEvents() {
    // Table node click -> Open Quick Action Drawer
    document.querySelectorAll('.table-node').forEach(node => {
      node.addEventListener('click', () => {
        const tableId = node.dataset.tableId;
        this.openTableActions(tableId);
      });
    });

    // Clean All Dirty Tables
    const cleanAllBtn = document.getElementById('btn-quick-clean-all');
    if (cleanAllBtn) {
      cleanAllBtn.addEventListener('click', async () => {
        await window.store.db.collection('tables').updateMany(
          { status: 'dirty' },
          { $set: { status: 'available' } }
        );
        window.app.showToast('All dirty tables marked clean and ready for seating!', 'success');
        this.render();
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById('btn-floor-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.render();
        window.app.showToast('Floor layout synced', 'info');
      });
    }
  }

  async openTableActions(tableId) {
    const table = await window.store.db.collection('tables').findOne({ _id: tableId });
    if (!table) return;

    const activeOrder = await window.store.db.collection('orders').findOne({
      tableNumber: table.number,
      status: { $ne: 'Completed' }
    });

    const modal = document.getElementById('modal-generic');
    const title = document.getElementById('generic-modal-title');
    const body = document.getElementById('generic-modal-body');

    title.textContent = `🪑 Floor Operations: Table ${table.number}`;
    body.innerHTML = `
      <div class="table-action-header">
        <div class="table-action-badge">${table.number}</div>
        <div>
          <h3 style="color: #fff; font-size: 18px; margin-bottom: 2px;">${table.zone} • ${table.capacity} Guests</h3>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="badge ${table.status === 'available' ? 'badge-success' : table.status === 'occupied' ? 'badge-info' : table.status === 'dirty' ? 'badge-danger' : 'badge-amber'}">
              Status: ${table.status.toUpperCase()}
            </span>
            <span style="font-size: 12px; color: var(--text-muted);">Assigned Server: ${table.activeServer || 'Tanvir'}</span>
          </div>
        </div>
      </div>

      ${activeOrder ? `
        <div style="background: var(--bg-surface-elevated); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px; border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="color: #fff; font-size: 14px;">Active POS Order: ${activeOrder.orderNumber}</strong>
            <span class="badge badge-amber">${activeOrder.status}</span>
          </div>
          <div style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 8px;">
            Customer: ${activeOrder.customerName} (${activeOrder.customerPhone || 'Walk-in'})
          </div>
          <div style="font-size: 14px; font-weight: 700; color: var(--primary-light);">
            Running Balance: ৳${activeOrder.totalAmount.toLocaleString()}
          </div>
        </div>
      ` : ''}

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 16px;">
        <button class="btn btn-secondary" onclick="window.floorComponent.setTableStatus('${table._id}', 'available')">
          🟢 Mark Available
        </button>
        <button class="btn btn-secondary" onclick="window.floorComponent.setTableStatus('${table._id}', 'occupied')">
          🔵 Seat Guests (Occupied)
        </button>
        <button class="btn btn-secondary" onclick="window.floorComponent.setTableStatus('${table._id}', 'reserved')">
          🟠 Mark Reserved
        </button>
        <button class="btn btn-secondary" onclick="window.floorComponent.setTableStatus('${table._id}', 'dirty')">
          🟡 Mark Needs Cleaning
        </button>
      </div>

      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn btn-primary" onclick="window.floorComponent.openPosForTable('${table.number}')">
          💳 Open POS for Table ${table.number}
        </button>
      </div>
    `;

    window.app.openModal('modal-generic');
  }

  async setTableStatus(tableId, newStatus) {
    await window.store.db.collection('tables').updateOne(
      { _id: tableId },
      { $set: { status: newStatus } }
    );

    window.app.closeModal('modal-generic');
    window.app.showToast(`Table status updated to "${newStatus}"`, 'success');
    this.render();
  }

  openPosForTable(tableNumber) {
    window.app.closeModal('modal-generic');
    window.app.navigate('pos');
    if (window.posComponent) {
      window.posComponent.setSelectedTable(tableNumber);
    }
  }
}

window.floorComponent = new FloorComponent();
