/**
 * FlavourCraft - Main Application Controller & Router
 */

class Application {
  constructor() {
    this.currentView = 'menu';
    this.components = {};
  }

  async init() {
    // Initialize Components
    this.components = {
      menu: new window.MenuComponent(),
      reservations: new window.ReservationsComponent(),
      ordering: new window.OrderingComponent(),
      tracking: { render: () => this.components.ordering.renderTracker() },
      kds: window.kdsComponent,
      inventory: window.inventoryComponent,
      analytics: window.analyticsComponent,
      rbac: window.rbacComponent,
      auth: window.authComponent
    };

    // 1. Initialize Store First
    await window.store.init();

    // 2. Initialize Components
    this.components.ordering.init();
    this.components.kds.init();
    this.components.rbac.init();
    if (this.components.auth) this.components.auth.init();

    // 3. Setup global UI listeners
    this._attachGlobalEvents();

    // 4. Apply initial role restrictions & topbar auth badge
    window.rbacComponent.applyRoleRestrictions(window.store.currentRole, window.store.currentUser);
    if (this.components.auth) this.components.auth.renderTopbarAuthBadge();

    // 5. Render Initial View
    this.navigate(this.currentView);
    this.components.ordering.renderCartDrawer();
  }

  navigate(viewName) {
    this.currentView = viewName;

    // Update active nav links
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewName);
    });

    // Update view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update Topbar titles
    const titles = {
      'menu': { title: 'Dhaka Heritage & Contemporary Menu', desc: 'Crafted with prime local meats, Baghabari ghee & wild Sylheti spices' },
      'reservations': { title: 'Table Reservation System', desc: 'Reserve dining tables in Gulshan, Banani, and Nawab VIP salons' },
      'tracking': { title: 'Live Dhaka Order Tracker', desc: 'Real-time kitchen preparation timeline and dispatch radar' },
      'kds': { title: 'Kitchen Display System (KDS)', desc: 'Live ticket queue, color-coded urgency countdowns & authentic recipes' },
      'inventory': { title: 'Inventory & Recipe Costing', desc: 'Automatic stock deductions in Taka, safety alerts & dish profit margins' },
      'analytics': { title: 'Executive Analytics & Reports', desc: 'Turnover in BDT ৳, Dhaka peak hour heatmaps, top bestsellers & database export' }
    };

    const header = titles[viewName] || { title: 'FlavourCraft Dhaka Operations', desc: 'Restaurant Management Suite' };
    document.getElementById('topbar-page-title').textContent = header.title;
    document.getElementById('topbar-page-desc').textContent = header.desc;

    // --- Role Access Control Verification ---
    const hasAccess = window.store.hasPermission(viewName);
    if (!hasAccess) {
      if (window.authComponent && targetSection) {
        window.authComponent.renderStaffLockScreen(targetSection, viewName);
      }
      return;
    }

    // Render target component
    if (this.components[viewName] && typeof this.components[viewName].render === 'function') {
      this.components[viewName].render();
    }
  }

  toggleCart(forceState = null) {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    if (forceState !== null) {
      drawer.classList.toggle('open', forceState);
    } else {
      drawer.classList.toggle('open');
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✓',
      danger: '⚠️',
      warning: '⚡',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  setTheme(themeName, showToast = true) {
    this.currentTheme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('flavourcraft_theme', themeName);

    const iconEl = document.getElementById('theme-toggle-icon');
    const textEl = document.getElementById('theme-toggle-text');

    if (iconEl && textEl) {
      if (themeName === 'light') {
        iconEl.textContent = '🌙';
        textEl.textContent = 'Dark Mode';
      } else {
        iconEl.textContent = '☀️';
        textEl.textContent = 'Light Mode';
      }
    }

    if (showToast) {
      this.showToast(`Switched to ${themeName === 'light' ? '☀️ Light Porcelain' : '🌙 Dark Obsidian'} theme`, 'info');
    }
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme, true);
  }

  _attachGlobalEvents() {
    // Theme Switcher Toggle Button
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Navigation clicks
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.dataset.view;
        this.navigate(view);
      });
    });

    // Cart Toggle
    document.getElementById('btn-toggle-cart')?.addEventListener('click', () => {
      this.toggleCart();
    });
    document.getElementById('btn-close-cart')?.addEventListener('click', () => {
      this.toggleCart(false);
    });

    // Checkout Button in Cart Drawer
    document.getElementById('btn-checkout-drawer')?.addEventListener('click', () => {
      this.components.ordering.openCheckoutModal();
    });

    // Role Switcher Select
    document.getElementById('topbar-role-select')?.addEventListener('change', (e) => {
      const selectedRole = e.target.value;
      window.store.setRole(selectedRole);
      this.showToast(`Switched active view profile to "${selectedRole}"`, 'info');
    });

    // Topbar Search Input
    document.getElementById('global-search-input')?.addEventListener('input', (e) => {
      const q = e.target.value;
      if (this.currentView === 'menu') {
        this.components.menu.setSearchQuery(q);
      } else if (this.currentView === 'pos') {
        this.components.pos.searchQuery = q;
        this.components.pos.render();
      }
    });

    // Global Modal Close Backdrops
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) modal.classList.remove('active');
      });
    });

    // Low stock alert subscriber
    window.store.subscribe('low_stock_triggered', (items) => {
      window.store.audio.playUrgentAlert();
      this.showToast(`🚨 Low Stock Warning: ${items.map(i => i.name).join(', ')} below threshold!`, 'danger');
    });
  }
}

window.app = new Application();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
