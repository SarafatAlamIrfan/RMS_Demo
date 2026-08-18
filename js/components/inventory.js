/**
 * FlavourCraft - Inventory, Recipe Costing & Stock Alert Component
 * Theme: Light Mode (Pinkish Red & Saffron Palette)
 * Currency: Bangladeshi Taka (৳ / BDT)
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
    const menuItems = await window.store.db.collection('menu').find();

    const lowStockItems = inventory.filter(i => i.currentStock <= i.threshold);
    const totalInventoryValue = inventory.reduce((s, i) => s + (i.currentStock * i.costPerUnit), 0);

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
          <div class="inv-stat-icon info">📦</div>
          <div>
            <div class="inv-stat-val" style="color: var(--heading-color);">${inventory.length}</div>
            <div class="inv-stat-label">Raw Spices & Ingredients</div>
          </div>
        </div>

        <div class="inv-stat-card">
          <div class="inv-stat-icon warning">💰</div>
          <div>
            <div class="inv-stat-val" style="color: var(--heading-color);">৳${Math.round(totalInventoryValue).toLocaleString()}</div>
            <div class="inv-stat-label">Total Stock Valuation</div>
          </div>
        </div>

        <div class="inv-stat-card">
          <div class="inv-stat-icon success">🍽️</div>
          <div>
            <div class="inv-stat-val" style="color: var(--heading-color);">${menuItems.length}</div>
            <div class="inv-stat-label">Active Signature Dishes</div>
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
          <span>📦</span> <span>Raw Stock Inventory (${inventory.length})</span>
        </button>
        <button class="inventory-tab-btn ${this.activeTab === 'recipes' ? 'active' : ''}" data-tab="recipes">
          <span>📊</span> <span>Recipe Costing & Profit Margins (${recipes.length})</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="inventory-tab-content">
        ${this.activeTab === 'stock' ? this._renderStockTab(inventory) : this._renderRecipesTab(recipes)}
      </div>
    `;

    this._attachEvents();
  }

  _renderStockTab(inventory) {
    return `
      <div class="data-table-card">
        <div class="table-card-header">
          <h4 class="table-card-title">Real-Time Stock Levels & Automatic Recipe Deductions</h4>
          <button class="btn btn-primary btn-sm" id="btn-add-stock-modal">
            + Restock Ingredient
          </button>
        </div>
        <div class="table-responsive">
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
                      <span class="ingredient-name-text">${item.name}</span>
                      ${isLow ? '<span class="badge badge-danger" style="margin-left: 6px; font-size: 10px;">LOW</span>' : ''}
                    </td>
                    <td><span class="badge badge-saffron">${item.category}</span></td>
                    <td>
                      <span class="stock-num-text ${isLow ? 'low' : ''}">
                        ${item.currentStock.toLocaleString()} ${item.unit}
                      </span>
                    </td>
                    <td style="color: var(--text-muted); font-weight: 600; font-size: 13px;">
                      ${item.threshold.toLocaleString()} ${item.unit}
                    </td>
                    <td style="width: 140px;">
                      <div class="stock-progress-track">
                        <div class="stock-progress-fill ${isLow ? 'low' : ratio < 70 ? 'medium' : 'high'}" style="width: ${ratio}%;"></div>
                      </div>
                    </td>
                    <td style="font-family: var(--font-mono); font-weight: 700; color: var(--text-primary);">
                      ৳${item.costPerUnit.toFixed(2)}
                    </td>
                    <td style="font-family: var(--font-mono); font-weight: 800; color: var(--primary);">
                      ৳${Math.round(item.currentStock * item.costPerUnit).toLocaleString()}
                    </td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="window.inventoryComponent.quickAddStock('${item._id}', 2000)">
                        + Restock
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  _renderRecipesTab(recipes) {
    return `
      <div class="data-table-card">
        <div class="table-card-header">
          <div>
            <h4 class="table-card-title">Dhaka Dish Recipe Formulations & Profit Margins</h4>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Real-time food cost % and gross margin per portion calculated dynamically from raw spice and meat batch costs.</p>
          </div>
        </div>
        <div class="table-responsive">
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
                    <td><span class="ingredient-name-text">${rec.dishName}</span></td>
                    <td style="font-family: var(--font-mono); font-size: 15px; font-weight: 800; color: var(--primary);">
                      ৳${rec.sellingPrice.toLocaleString()}
                    </td>
                    <td style="font-family: var(--font-mono); font-weight: 700; color: var(--text-primary);">
                      ৳${Math.round(rawCost).toLocaleString()}
                    </td>
                    <td style="font-family: var(--font-mono); font-weight: 800; color: var(--color-success);">
                      +৳${Math.round(margin).toLocaleString()}
                    </td>
                    <td>
                      <span class="margin-pill ${isHealthy ? 'healthy' : 'tight'}">
                        ${foodCostPercent.toFixed(1)}% ${isHealthy ? '🎯 Optimal' : '⚠️ Review'}
                      </span>
                    </td>
                    <td>
                      <div style="font-size: 12px; color: var(--text-secondary); max-width: 320px; line-height: 1.4;">
                        ${rec.ingredients.map(i => `${i.quantity}${i.unit} ${i.name}`).join(', ')}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async quickAddStock(ingredientId, amount) {
    const item = await window.store.db.collection('inventory').findOne({ _id: ingredientId });
    if (item) {
      const newStock = item.currentStock + amount;
      await window.store.db.collection('inventory').updateOne(
        { _id: ingredientId },
        { $set: { currentStock: newStock } }
      );
      window.app.showToast(`Restocked ${item.name} (+${amount} ${item.unit})!`, 'success');
      this.render();
    }
  }

  _attachEvents() {
    // Tab switching
    document.querySelectorAll('#inventory-sub-tabs .inventory-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.activeTab = tab;
        this.render();
      });
    });

    // Quick Reorder All
    document.getElementById('btn-restock-all-low')?.addEventListener('click', async () => {
      const low = await window.store.db.collection('inventory').find({
        $expr: (doc) => doc.currentStock <= doc.threshold
      });
      for (const item of low) {
        await window.store.db.collection('inventory').updateOne(
          { _id: item._id },
          { $set: { currentStock: item.threshold * 3 } }
        );
      }
      window.app.showToast('All low-stock items restocked to safe buffer levels!', 'success');
      this.render();
    });

    // Open Restock Modal
    document.getElementById('btn-add-stock-modal')?.addEventListener('click', async () => {
      const inventory = await window.store.db.collection('inventory').find();
      const modal = document.getElementById('modal-generic');
      const title = document.getElementById('generic-modal-title');
      const body = document.getElementById('generic-modal-body');

      if (!modal || !title || !body) return;

      title.textContent = '📦 Restock Raw Ingredients';
      body.innerHTML = `
        <div class="form-group">
          <label class="form-label">Select Ingredient</label>
          <select class="form-select" id="restock-item-select">
            ${inventory.map(i => `<option value="${i._id}">${i.name} (Current: ${i.currentStock} ${i.unit})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity to Add</label>
          <input type="number" class="form-input" id="restock-qty-input" placeholder="e.g. 5000" min="1" value="5000" />
        </div>
        <button class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;" id="btn-submit-restock">
          Confirm Restock & Update Inventory
        </button>
      `;

      modal.classList.add('active');

      document.getElementById('btn-submit-restock').onclick = async () => {
        const iid = document.getElementById('restock-item-select').value;
        const qty = parseFloat(document.getElementById('restock-qty-input').value) || 0;
        if (qty > 0) {
          await this.quickAddStock(iid, qty);
          modal.classList.remove('active');
        }
      };
    });
  }
}

window.inventoryComponent = new InventoryComponent();
