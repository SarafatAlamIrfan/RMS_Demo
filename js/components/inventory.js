/**
 * FlavourCraft - Inventory, Recipe Costing & Stock Alert Component
 * Bangladeshi Dhaka Modern Restaurant Edition (Prices in ৳ BDT)
 */

class InventoryComponent {
  constructor() {
    this.activeTab = 'stock';
    this.searchQuery = '';
  }

  async render() {
    const container = document.getElementById('view-inventory');
    if (!container) return;

    const inventory = await window.store.db.collection('inventory').find();
    const recipes = await window.store.db.collection('recipes').find();
    const wasteList = await window.store.db.collection('waste').find();

    const lowStockItems = inventory.filter(i => i.currentStock <= i.threshold);
    const totalInventoryValue = inventory.reduce((s, i) => s + (i.currentStock * i.costPerUnit), 0);
    const totalWasteCost = wasteList.reduce((s, w) => s + (w.costLoss || 0), 0);

    container.innerHTML = `
      <!-- Stats Row -->
      <div class="inventory-header-stats">
        <div class="inv-stat-card">
          <div class="inv-stat-icon ${lowStockItems.length > 0 ? 'danger' : 'success'}">
            ${lowStockItems.length > 0 ? '⚠️' : '✅'}
          </div>
          <div>
            <div class="inv-stat-val" style="color: ${lowStockItems.length > 0 ? 'var(--color-danger)' : 'var(--color-success)'};">
              ${lowStockItems.length}
            </div>
            <div class="inv-stat-label">Low Stock Ingredients</div>
          </div>
        </div>

        <div class="inv-stat-card">
          <div class="inv-stat-icon success">📦</div>
          <div>
            <div class="inv-stat-val">${inventory.length}</div>
            <div class="inv-stat-label">Raw Spices & Ingredients</div>
          </div>
        </div>

        <div class="inv-stat-card">
          <div class="inv-stat-icon warning">💰</div>
          <div>
            <div class="inv-stat-val">৳${Math.round(totalInventoryValue).toLocaleString()}</div>
            <div class="inv-stat-label">Total Stock Valuation</div>
          </div>
        </div>

        <div class="inv-stat-card">
          <div class="inv-stat-icon danger">🗑️</div>
          <div>
            <div class="inv-stat-val">৳${Math.round(totalWasteCost).toLocaleString()}</div>
            <div class="inv-stat-label">Kitchen Waste Loss Logged</div>
          </div>
        </div>
      </div>

      <!-- Low Stock Warning Banner -->
      ${lowStockItems.length > 0 ? `
        <div class="low-stock-alert-banner">
          <div class="low-stock-alert-content">
            <i>🚨</i>
            <div>
              <div class="low-stock-alert-title">Critical Ingredient Stock Alert (${lowStockItems.length} items below safety buffer)</div>
              <div class="low-stock-alert-desc">
                ${lowStockItems.map(i => `<strong>${i.name}</strong> (${i.currentStock} ${i.unit} left)`).join(' • ')}
              </div>
            </div>
          </div>
          <button class="btn btn-danger btn-sm" id="btn-restock-all-low">
            ⚡ Quick Reorder All (${lowStockItems.length})
          </button>
        </div>
      ` : ''}

      <!-- Inventory Sub-Tabs -->
      <div class="inventory-tabs" id="inventory-sub-tabs">
        <button class="inventory-tab-btn ${this.activeTab === 'stock' ? 'active' : ''}" data-tab="stock">
          📦 Raw Stock Inventory (${inventory.length})
        </button>
        <button class="inventory-tab-btn ${this.activeTab === 'recipes' ? 'active' : ''}" data-tab="recipes">
          📊 Recipe Costing & Profit Margins
        </button>
        <button class="inventory-tab-btn ${this.activeTab === 'waste' ? 'active' : ''}" data-tab="waste">
          🗑️ Food Waste Log (${wasteList.length})
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="inventory-tab-content">
        ${this.activeTab === 'stock' ? this._renderStockTab(inventory) : 
          this.activeTab === 'recipes' ? this._renderRecipesTab(recipes) : 
          this._renderWasteTab(wasteList, inventory)}
      </div>
    `;

    this._attachEvents();
  }

  _renderStockTab(inventory) {
    return `
      <div class="data-table-card">
        <div style="padding: 16px 20px; background: var(--bg-surface-elevated); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <h4 style="color: #fff; font-size: 15px;">Real-Time Stock Levels & Automatic Recipe Deductions</h4>
          <button class="btn btn-primary btn-sm" id="btn-add-stock-modal">
            + Restock Ingredient
          </button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Ingredient Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Safety Threshold</th>
              <th>Stock Status Gauge</th>
              <th>Cost / Unit</th>
              <th>Total Stock Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${inventory.map(item => {
              const ratio = Math.min(100, (item.currentStock / (item.threshold * 2)) * 100);
              const isLow = item.currentStock <= item.threshold;
              return `
                <tr>
                  <td>
                    <strong style="color: #fff;">${item.name}</strong>
                    ${isLow ? '<span class="badge badge-danger" style="margin-left: 6px; font-size: 10px;">LOW</span>' : ''}
                  </td>
                  <td><span class="badge badge-amber">${item.category}</span></td>
                  <td style="font-weight: 800; font-family: var(--font-mono); font-size: 14px; color: ${isLow ? 'var(--color-danger)' : '#fff'};">
                    ${item.currentStock.toLocaleString()} ${item.unit}
                  </td>
                  <td style="color: var(--text-muted); font-size: 13px;">${item.threshold.toLocaleString()} ${item.unit}</td>
                  <td style="width: 160px;">
                    <div class="stock-level-bar-wrap">
                      <div class="stock-progress-track">
                        <div class="stock-progress-fill ${isLow ? 'low' : ratio < 70 ? 'medium' : 'high'}" style="width: ${ratio}%;"></div>
                      </div>
                    </div>
                  </td>
                  <td style="font-family: var(--font-mono);">৳${item.costPerUnit.toFixed(2)}</td>
                  <td style="font-family: var(--font-mono); font-weight: 700; color: var(--primary-light);">
                    ৳${Math.round(item.currentStock * item.costPerUnit).toLocaleString()}
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.inventoryComponent.quickAddStock('${item._id}', 1000)">
                      + Restock
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  _renderRecipesTab(recipes) {
    return `
      <div class="data-table-card">
        <div style="padding: 16px 20px; background: var(--bg-surface-elevated); border-bottom: 1px solid var(--border-subtle);">
          <h4 style="color: #fff; font-size: 15px;">Dhaka Dish Recipe Formulations & Profit Margins</h4>
          <p style="font-size: 12px; color: var(--text-muted);">Real-time food cost % and gross margin per portion calculated dynamically from raw spice and meat batch costs.</p>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Dish & Recipe</th>
              <th>Selling Price</th>
              <th>Raw Food Cost</th>
              <th>Gross Margin</th>
              <th>Food Cost %</th>
              <th>Ingredient Recipe Breakdown</th>
            </tr>
          </thead>
          <tbody>
            ${recipes.map(rec => {
              const rawCost = rec.ingredients.reduce((s, ing) => s + (ing.quantity * ing.unitCost), 0);
              const margin = rec.sellingPrice - rawCost;
              const foodCostPercent = (rawCost / rec.sellingPrice) * 100;
              const isHealthy = foodCostPercent <= 35;

              return `
                <tr>
                  <td><strong style="color: #fff; font-size: 14px;">${rec.dishName}</strong></td>
                  <td style="font-family: var(--font-mono); font-size: 15px; font-weight: 800; color: var(--primary-light);">৳${rec.sellingPrice.toLocaleString()}</td>
                  <td style="font-family: var(--font-mono); font-weight: 700; color: #fff;">৳${Math.round(rawCost).toLocaleString()}</td>
                  <td style="font-family: var(--font-mono); font-weight: 700; color: var(--color-success);">+৳${Math.round(margin).toLocaleString()}</td>
                  <td>
                    <span class="margin-pill ${isHealthy ? 'healthy' : 'tight'}">
                      ${foodCostPercent.toFixed(1)}% ${isHealthy ? '🎯 Optimal' : '⚠️ Review'}
                    </span>
                  </td>
                  <td>
                    <div style="font-size: 11.5px; color: var(--text-secondary); max-width: 320px; line-height: 1.4;">
                      ${rec.ingredients.map(i => `${i.quantity}${i.unit} ${i.name}`).join(', ')}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  _renderWasteTab(wasteList, inventory) {
    return `
      <div class="data-table-card">
        <div style="padding: 16px 20px; background: var(--bg-surface-elevated); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <h4 style="color: #fff; font-size: 15px;">Kitchen Food Waste & Spoilage Log (Dhaka)</h4>
          <button class="btn btn-danger btn-sm" id="btn-log-waste-modal">
            + Log Food Waste
          </button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>Wasted Ingredient</th>
              <th>Quantity Lost</th>
              <th>Reason Code</th>
              <th>Financial Loss</th>
              <th>Logged By</th>
            </tr>
          </thead>
          <tbody>
            ${wasteList.length === 0 ? `
              <tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px;">Zero food waste recorded today!</td></tr>
            ` : wasteList.map(w => `
              <tr>
                <td style="font-size: 12px; color: var(--text-muted);">${new Date(w.createdAt).toLocaleString()}</td>
                <td><strong style="color: #fff;">${w.ingredientName}</strong></td>
                <td style="font-family: var(--font-mono);">${w.quantity} ${w.unit}</td>
                <td><span class="badge badge-amber">${w.reason}</span></td>
                <td style="font-family: var(--font-mono); font-weight: 800; color: var(--color-danger);">-৳${w.costLoss.toLocaleString()}</td>
                <td>${w.loggedBy || 'Staff'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  _attachEvents() {
    document.querySelectorAll('#inventory-sub-tabs .inventory-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.tab;
        this.render();
      });
    });

    const restockAllBtn = document.getElementById('btn-restock-all-low');
    if (restockAllBtn) {
      restockAllBtn.addEventListener('click', async () => {
        const inventory = await window.store.db.collection('inventory').find();
        const lowItems = inventory.filter(i => i.currentStock <= i.threshold);

        for (const item of lowItems) {
          const replenishment = item.unit === 'pcs' ? 50 : 3000;
          await window.store.db.collection('inventory').updateOne(
            { _id: item._id },
            { $inc: { currentStock: replenishment } }
          );
        }

        window.store.audio.playKitchenBell();
        window.app.showToast(`Restocked ${lowItems.length} ingredients to safe capacity!`, 'success');
        this.render();
      });
    }

    const addStockBtn = document.getElementById('btn-add-stock-modal');
    if (addStockBtn) {
      addStockBtn.addEventListener('click', async () => {
        const inventory = await window.store.db.collection('inventory').find();
        const modal = document.getElementById('modal-generic');
        const title = document.getElementById('generic-modal-title');
        const body = document.getElementById('generic-modal-body');

        title.textContent = '📦 Restock Ingredient Inventory (Dhaka)';
        body.innerHTML = `
          <div class="form-group">
            <label class="form-label">Select Ingredient</label>
            <select class="form-select" id="restock-item-select">
              ${inventory.map(i => `<option value="${i._id}">${i.name} (Current: ${i.currentStock} ${i.unit})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Quantity to Add</label>
            <input type="number" class="form-input" id="restock-qty-input" placeholder="e.g. 2000" value="2000" min="1" />
          </div>
          <button class="btn btn-primary btn-lg" style="width: 100%; margin-top: 12px;" id="btn-submit-restock">
            Confirm Inventory Delivery
          </button>
        `;

        body.querySelector('#btn-submit-restock').addEventListener('click', async () => {
          const id = body.querySelector('#restock-item-select').value;
          const qty = parseFloat(body.querySelector('#restock-qty-input').value) || 0;

          await window.store.db.collection('inventory').updateOne(
            { _id: id },
            { $inc: { currentStock: qty } }
          );

          window.app.closeModal('modal-generic');
          window.app.showToast(`Added ${qty} units to stock successfully!`, 'success');
          this.render();
        });

        window.app.openModal('modal-generic');
      });
    }

    const logWasteBtn = document.getElementById('btn-log-waste-modal');
    if (logWasteBtn) {
      logWasteBtn.addEventListener('click', async () => {
        const inventory = await window.store.db.collection('inventory').find();
        const modal = document.getElementById('modal-generic');
        const title = document.getElementById('generic-modal-title');
        const body = document.getElementById('generic-modal-body');

        title.textContent = '🗑️ Record Kitchen Spoilage / Waste (Dhaka)';
        body.innerHTML = `
          <div class="form-group">
            <label class="form-label">Ingredient</label>
            <select class="form-select" id="waste-item-select">
              ${inventory.map(i => `<option value="${i._id}" data-cost="${i.costPerUnit}" data-name="${i.name}" data-unit="${i.unit}">${i.name} (৳${i.costPerUnit}/${i.unit})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Quantity Wasted</label>
            <input type="number" class="form-input" id="waste-qty-input" placeholder="e.g. 500" value="200" min="1" />
          </div>
          <div class="form-group">
            <label class="form-label">Reason for Spoilage</label>
            <select class="form-select" id="waste-reason-select">
              <option value="Overcooked / Burned in Handi">Overcooked / Burned in Handi</option>
              <option value="Shelf Life Expired">Shelf Life Expired</option>
              <option value="Prep Drop / Spill">Prep Drop / Spill</option>
              <option value="Quality Rejection">Quality / Freshness Rejection</option>
            </select>
          </div>
          <button class="btn btn-danger btn-lg" style="width: 100%; margin-top: 12px;" id="btn-submit-waste">
            Log Waste & Deduct Stock
          </button>
        `;

        body.querySelector('#btn-submit-waste').addEventListener('click', async () => {
          const select = body.querySelector('#waste-item-select');
          const opt = select.options[select.selectedIndex];
          const ingId = select.value;
          const ingName = opt.dataset.name;
          const unit = opt.dataset.unit;
          const costPerUnit = parseFloat(opt.dataset.cost);
          const qty = parseFloat(body.querySelector('#waste-qty-input').value) || 0;
          const reason = body.querySelector('#waste-reason-select').value;
          const costLoss = qty * costPerUnit;

          await window.store.db.collection('waste').insertOne({
            ingredientId: ingId,
            ingredientName: ingName,
            quantity: qty,
            unit: unit,
            reason: reason,
            costLoss: costLoss,
            loggedBy: window.store.currentUser ? window.store.currentUser.name : 'Chef Masud'
          });

          await window.store.db.collection('inventory').updateOne(
            { _id: ingId },
            { $inc: { currentStock: -qty } }
          );

          window.app.closeModal('modal-generic');
          window.app.showToast(`Logged food waste of ৳${costLoss.toFixed(0)}`, 'warning');
          this.render();
        });

        window.app.openModal('modal-generic');
      });
    }
  }

  async quickAddStock(ingId, amount) {
    await window.store.db.collection('inventory').updateOne(
      { _id: ingId },
      { $inc: { currentStock: amount } }
    );
    window.app.showToast(`Restocked +${amount} units`, 'success');
    this.render();
  }
}

window.inventoryComponent = new InventoryComponent();
