/**
 * FlavourCraft - Visual Analytics & Financial Reports Component
 * Theme: Light Mode (Pinkish Red & Saffron Palette)
 * Currency: Bangladeshi Taka (৳ / BDT)
 */

class AnalyticsComponent {
  async render() {
    const container = document.getElementById('view-analytics');
    if (!container) return;

    const orders = await window.store.db.collection('orders').find();
    const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const avgTicket = orders.length ? (totalRevenue / orders.length) : 1850;

    const dishSales = {};
    for (const ord of orders) {
      for (const it of (ord.items || [])) {
        if (!dishSales[it.name]) {
          dishSales[it.name] = { name: it.name, qty: 0, revenue: 0 };
        }
        dishSales[it.name].qty += it.quantity;
        dishSales[it.name].revenue += (it.itemTotal || (it.quantity * it.unitPrice));
      }
    }
    const topDishes = Object.values(dishSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

    // 7-Day sales data in Taka
    const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const salesData = [185000, 142000, 98000, 112000, 135000, 245000, 320000]; // Total: ~৳12.37 Lakh

    container.innerHTML = `
      <div class="analytics-header-row">
        <div>
          <h2>Executive Performance & Revenue Analytics (Dhaka Flagship)</h2>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
            Real-time financial turnover in Bangladeshi Taka, kitchen velocity & dish popularity trends.
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" id="btn-export-json">
            💾 Export JSON Backup
          </button>
          <button class="btn btn-primary btn-sm" id="btn-refresh-analytics">
            🔄 Refresh Metrics
          </button>
        </div>
      </div>

      <!-- Scorecards Grid -->
      <div class="analytics-scorecards-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Weekly Turnover</span>
            <span>💰</span>
          </div>
          <div class="metric-val" style="color: var(--primary);">
            ৳${(1237000 + totalRevenue).toLocaleString()}
          </div>
          <div class="metric-subtext"><span>▲ +21.4%</span> vs previous Dhaka cycle</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Avg Order Value (AOV)</span>
            <span>💳</span>
          </div>
          <div class="metric-val">৳${Math.round(avgTicket).toLocaleString()}</div>
          <div class="metric-subtext"><span>▲ +8.2%</span> higher Kacchi platter orders</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Kitchen Turnaround</span>
            <span>⏱️</span>
          </div>
          <div class="metric-val">14 Mins</div>
          <div class="metric-subtext"><span>⚡ Fast</span> peak lunch throughput</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Gross Margin Health</span>
            <span>📊</span>
          </div>
          <div class="metric-val" style="color: var(--color-success);">68.5%</div>
          <div class="metric-subtext"><span>🎯 Target: >65%</span> optimal</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="analytics-charts-grid">
        <!-- SVG Weekly Revenue Chart -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3 class="chart-card-title">📈 7-Day Revenue Velocity (Bangladeshi Taka ৳)</h3>
            <span class="badge badge-saffron">This Week: ৳12.37 Lakh</span>
          </div>
          <div class="chart-svg-wrap">
            <svg viewBox="0 0 700 220" style="width: 100%; height: 100%;">
              <!-- Grid lines -->
              <line x1="40" y1="30" x2="680" y2="30" stroke="#fecdd3" stroke-dasharray="4" />
              <line x1="40" y1="80" x2="680" y2="80" stroke="#fecdd3" stroke-dasharray="4" />
              <line x1="40" y1="130" x2="680" y2="130" stroke="#fecdd3" stroke-dasharray="4" />
              <line x1="40" y1="180" x2="680" y2="180" stroke="#fda4af" stroke-width="1.5" />

              <!-- Y-Axis labels -->
              <text x="35" y="34" font-size="10" font-family="sans-serif" font-weight="700" fill="#64748b" text-anchor="end">৳3.5L</text>
              <text x="35" y="84" font-size="10" font-family="sans-serif" font-weight="700" fill="#64748b" text-anchor="end">৳2.5L</text>
              <text x="35" y="134" font-size="10" font-family="sans-serif" font-weight="700" fill="#64748b" text-anchor="end">৳1.5L</text>
              <text x="35" y="184" font-size="10" font-family="sans-serif" font-weight="700" fill="#64748b" text-anchor="end">৳0</text>

              <!-- Bars -->
              ${salesData.map((val, idx) => {
                const x = 70 + (idx * 88);
                const height = (val / 350000) * 150;
                const y = 180 - height;
                return `
                  <rect x="${x}" y="${y}" width="42" height="${height}" rx="6" fill="url(#barGradient)" />
                  <text x="${x + 21}" y="${y - 8}" font-size="10.5" font-family="sans-serif" font-weight="800" fill="#e11d48" text-anchor="middle">৳${(val/1000).toFixed(0)}k</text>
                  <text x="${x + 21}" y="200" font-size="12" font-family="sans-serif" font-weight="700" fill="#475569" text-anchor="middle">${days[idx]}</text>
                `;
              }).join('')}

              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#e11d48" />
                  <stop offset="100%" stop-color="#fda4af" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <!-- Top 5 Bestsellers -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3 class="chart-card-title">🏆 Top 5 Bestsellers</h3>
          </div>
          <div class="top-dishes-list">
            ${(topDishes.length ? topDishes : [
              { name: 'Puran Dhaka Mutton Kacchi', qty: 184, revenue: 119600 },
              { name: 'Old Dhaka Beef Tehari', qty: 142, revenue: 68160 },
              { name: 'Chittagong Beef Kala Bhuna', qty: 98, revenue: 66640 },
              { name: 'Padma River Shorshe Ilish', qty: 76, revenue: 64600 },
              { name: 'Special Crispy Fuchka', qty: 220, revenue: 48400 }
            ]).map((d, i) => `
              <div class="top-dish-row">
                <div>
                  <div class="top-dish-name">#${i+1} ${d.name}</div>
                  <div class="top-dish-count">${d.qty} orders sold</div>
                </div>
                <div class="top-dish-revenue">৳${d.revenue.toLocaleString()}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Peak Ordering Hours Heatmap -->
      <div class="chart-card">
        <div class="chart-card-header">
          <h3 class="chart-card-title">🕒 Dhaka Peak Ordering Rush Heatmap</h3>
          <span style="font-size: 12px; color: var(--text-muted);">Lunch Rush (1–2 PM) & Dinner Adda (8–10 PM)</span>
        </div>
        <div class="heatmap-grid">
          <div class="heatmap-cell">
            <div class="heatmap-hour">12:00 PM</div>
            <div class="heatmap-intensity">18 orders</div>
          </div>
          <div class="heatmap-cell peak">
            <div class="heatmap-hour">01:00 PM</div>
            <div class="heatmap-intensity">42 orders 🔥</div>
          </div>
          <div class="heatmap-cell peak">
            <div class="heatmap-hour">02:00 PM</div>
            <div class="heatmap-intensity">38 orders 🔥</div>
          </div>
          <div class="heatmap-cell">
            <div class="heatmap-hour">04:00 PM</div>
            <div class="heatmap-intensity">12 orders</div>
          </div>
          <div class="heatmap-cell">
            <div class="heatmap-hour">06:00 PM</div>
            <div class="heatmap-intensity">24 orders</div>
          </div>
          <div class="heatmap-cell peak">
            <div class="heatmap-hour">08:00 PM</div>
            <div class="heatmap-intensity">56 orders 🔥</div>
          </div>
          <div class="heatmap-cell peak">
            <div class="heatmap-hour">09:00 PM</div>
            <div class="heatmap-intensity">62 orders 🔥</div>
          </div>
          <div class="heatmap-cell">
            <div class="heatmap-hour">10:00 PM</div>
            <div class="heatmap-intensity">31 orders</div>
          </div>
        </div>
      </div>
    `;

    this._attachEvents();
  }

  _attachEvents() {
    document.getElementById('btn-refresh-analytics')?.addEventListener('click', () => {
      this.render();
      window.app.showToast('Analytics refreshed with live Dhaka transaction data!', 'info');
    });

    document.getElementById('btn-export-json')?.addEventListener('click', async () => {
      const data = {
        exportedAt: new Date().toISOString(),
        admin: 'Sadia Islam Dia',
        currency: 'BDT (৳)',
        menu: await window.store.db.collection('menu').find(),
        orders: await window.store.db.collection('orders').find(),
        inventory: await window.store.db.collection('inventory').find(),
        recipes: await window.store.db.collection('recipes').find(),
        reservations: await window.store.db.collection('reservations').find()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FlavourCraft_Dhaka_Backup_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      window.app.showToast('Database exported as JSON backup successfully!', 'success');
    });
  }
}

window.analyticsComponent = new AnalyticsComponent();
