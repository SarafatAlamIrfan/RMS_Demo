/**
 * FlavourCraft - Visual Analytics & Financial Reports Component
 * Bangladeshi Dhaka Modern Restaurant Edition (Prices in ৳ BDT)
 */

class AnalyticsComponent {
  async render() {
    const container = document.getElementById('view-analytics');
    if (!container) return;

    const orders = await window.store.db.collection('orders').find();
    const wasteList = await window.store.db.collection('waste').find();

    const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const avgTicket = orders.length ? (totalRevenue / orders.length) : 0;
    const totalWasteLoss = wasteList.reduce((s, w) => s + (w.costLoss || 0), 0);

    const dishSales = {};
    for (const ord of orders) {
      for (const it of ord.items) {
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
          <h2 style="font-family: var(--font-heading); font-size: 24px; font-weight: 800; color: #fff;">
            Executive Performance & Revenue Analytics (Dhaka Flagship)
          </h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Real-time financial turnover in Bangladeshi Taka, kitchen velocity & dish popularity trends.</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" id="btn-export-json">
            💾 Export MongoDB JSON
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
          <div class="metric-val" style="color: var(--primary-light);">৳${(1237000 + totalRevenue).toLocaleString()}</div>
          <div class="metric-subtext"><span>▲ +21.4%</span> vs previous Dhaka cycle</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Avg Order Value (AOV)</span>
            <span>💳</span>
          </div>
          <div class="metric-val">৳${Math.round(avgTicket || 1850).toLocaleString()}</div>
          <div class="metric-subtext"><span>▲ +8.2%</span> higher Kacchi platter orders</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Table Turnover Velocity</span>
            <span>⏱️</span>
          </div>
          <div class="metric-val">42 Mins</div>
          <div class="metric-subtext" style="color: var(--color-success);"><span>⚡ Prime</span> high banquet throughput</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Gross Margin Health</span>
            <span>📊</span>
          </div>
          <div class="metric-val">68.5%</div>
          <div class="metric-subtext"><span>🎯 Target: >65%</span> optimal</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="analytics-charts-grid">
        <!-- SVG Weekly Revenue Chart -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3 class="chart-card-title">📈 7-Day Revenue Velocity (Bangladeshi Taka ৳)</h3>
            <span class="badge badge-amber">This Week: ৳12.37 Lakh</span>
          </div>
          <div class="svg-chart-container">
            ${this._renderSvgChart(days, salesData)}
          </div>
        </div>

        <!-- Top Selling Dishes Ranking -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3 class="chart-card-title">🏆 Top 5 Best-Selling Dishes (Dhaka)</h3>
          </div>
          <div class="top-dishes-list">
            ${topDishes.map((dish, i) => `
              <div class="top-dish-row">
                <span class="top-dish-rank">#${i + 1}</span>
                <div class="top-dish-info">
                  <div class="top-dish-name">${dish.name}</div>
                  <div class="top-dish-sales">${dish.qty} platters sold this week</div>
                </div>
                <div class="top-dish-revenue">৳${dish.revenue.toLocaleString()}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Peak Ordering Hours Heatmap -->
      <div class="chart-card">
        <div class="chart-card-header">
          <h3 class="chart-card-title">🔥 Dhaka Peak Dining Hours & Kitchen Rush Heatmap</h3>
          <span style="font-size: 12px; color: var(--text-muted);">Hourly order density</span>
        </div>
        <div class="peak-hours-grid">
          <div class="peak-hour-cell heat-low">
            <div class="peak-hour-time">1:00 PM (Lunch)</div>
            <div class="peak-hour-traffic">24 Orders</div>
          </div>
          <div class="peak-hour-cell heat-medium">
            <div class="peak-hour-time">2:30 PM</div>
            <div class="peak-hour-traffic">36 Orders</div>
          </div>
          <div class="peak-hour-cell heat-low">
            <div class="peak-hour-time">6:00 PM (Tea/Adda)</div>
            <div class="peak-hour-traffic">18 Orders</div>
          </div>
          <div class="peak-hour-cell heat-medium">
            <div class="peak-hour-time">8:00 PM (Dinner)</div>
            <div class="peak-hour-traffic">54 Orders</div>
          </div>
          <div class="peak-hour-cell heat-high">
            <div class="peak-hour-time">9:00 PM (Peak)</div>
            <div class="peak-hour-traffic">78 Orders</div>
          </div>
          <div class="peak-hour-cell heat-high">
            <div class="peak-hour-time">10:15 PM (Late)</div>
            <div class="peak-hour-traffic">62 Orders</div>
          </div>
        </div>
      </div>
    `;

    this._attachEvents();
  }

  _renderSvgChart(labels, data) {
    const maxVal = Math.max(...data) * 1.15;
    const width = 500;
    const height = 200;
    const barWidth = 36;
    const spacing = width / labels.length;

    return `
      <svg viewBox="0 0 ${width} ${height + 30}">
        <line x1="0" y1="40" x2="${width}" y2="40" class="chart-grid-line" />
        <line x1="0" y1="90" x2="${width}" y2="90" class="chart-grid-line" />
        <line x1="0" y1="140" x2="${width}" y2="140" class="chart-grid-line" />
        <line x1="0" y1="190" x2="${width}" y2="190" stroke="rgba(255,255,255,0.15)" />

        ${data.map((val, i) => {
          const barHeight = (val / maxVal) * 160;
          const x = i * spacing + (spacing - barWidth) / 2;
          const y = 190 - barHeight;
          return `
            <g>
              <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" class="chart-bar" />
              <text x="${x + barWidth / 2}" y="${y - 8}" fill="#fbbf24" font-size="10" font-weight="700" text-anchor="middle">৳${Math.round(val/1000)}k</text>
              <text x="${x + barWidth / 2}" y="215" class="chart-axis-label" text-anchor="middle">${labels[i]}</text>
            </g>
          `;
        }).join('')}
      </svg>
    `;
  }

  _attachEvents() {
    const refreshBtn = document.getElementById('btn-refresh-analytics');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.render();
        window.app.showToast('Analytics scorecards updated with latest orders', 'info');
      });
    }

    const exportBtn = document.getElementById('btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        const payload = {};
        for (const [cName, col] of Object.entries(window.store.db.collections)) {
          payload[cName] = col.documents;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `flavourcraft_dhaka_mongodb_export_${Date.now()}.json`);
        dlAnchorElem.click();
        window.app.showToast('MongoDB database exported as JSON successfully!', 'success');
      });
    }
  }
}

window.analyticsComponent = new AnalyticsComponent();
