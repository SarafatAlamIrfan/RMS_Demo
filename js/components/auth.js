/**
 * FlavourCraft - Authentication & Access Gate Controller
 * Handles Customer Login, Staff/Admin Portal, Registration & Role Switching
 */

class AuthComponent {
  constructor() {
    this.activeTab = 'customer'; // 'customer', 'staff', 'register'
    this.pendingCallback = null;
  }

  init() {
    this.renderTopbarAuthBadge();

    window.store.subscribe('auth_changed', () => {
      this.renderTopbarAuthBadge();
    });

    window.store.subscribe('role_changed', () => {
      this.renderTopbarAuthBadge();
    });

    this._attachGlobalListeners();
  }

  renderTopbarAuthBadge() {
    const container = document.getElementById('topbar-auth-container');
    if (!container) return;

    const isLoggedIn = window.store.isLoggedIn();
    const user = window.store.currentUser;

    if (!isLoggedIn) {
      container.innerHTML = `
        <button class="btn btn-primary btn-sm" id="btn-open-login" style="padding: 6px 14px; font-size: 13px;">
          <span>🔑</span>
          <span>Sign In / Register</span>
        </button>
      `;

      document.getElementById('btn-open-login')?.addEventListener('click', () => {
        this.openLoginModal();
      });
    } else {
      container.innerHTML = `
        <div class="topbar-auth-pill">
          <button class="auth-user-btn" id="btn-auth-user-dropdown">
            <span class="auth-user-avatar">${user.avatar || '👤'}</span>
            <span style="font-weight: 700;">${user.name}</span>
            <span class="auth-user-role">${user.role}</span>
            <span style="font-size: 10px; opacity: 0.7;">▼</span>
          </button>

          <div class="auth-dropdown-menu" id="auth-dropdown-menu">
            <div class="dropdown-user-header">
              <div class="dropdown-user-name">${user.name}</div>
              <div class="dropdown-user-contact">${user.phone || user.email || user.username}</div>
            </div>

            <button class="dropdown-item" id="dropdown-switch-role">
              <span>🎭</span>
              <span>Switch Profile / Role</span>
            </button>

            ${user.role === 'Customer' ? `
              <button class="dropdown-item" onclick="window.app.navigate('tracking'); window.authComponent.toggleDropdown(false);">
                <span>📍</span>
                <span>Live Order Tracker</span>
              </button>
              <button class="dropdown-item" onclick="window.app.navigate('reservations'); window.authComponent.toggleDropdown(false);">
                <span>📅</span>
                <span>Table Bookings</span>
              </button>
            ` : user.role === 'Kitchen' ? `
              <button class="dropdown-item" onclick="window.app.navigate('kds'); window.authComponent.toggleDropdown(false);">
                <span>🍳</span>
                <span>Kitchen Display (KDS)</span>
              </button>
              <button class="dropdown-item" onclick="window.app.navigate('inventory'); window.authComponent.toggleDropdown(false);">
                <span>📦</span>
                <span>Inventory & Recipes</span>
              </button>
            ` : `
              <button class="dropdown-item" onclick="window.app.navigate('analytics'); window.authComponent.toggleDropdown(false);">
                <span>📊</span>
                <span>Executive Analytics</span>
              </button>
              <button class="dropdown-item" onclick="window.app.navigate('inventory'); window.authComponent.toggleDropdown(false);">
                <span>📦</span>
                <span>Inventory & Recipes</span>
              </button>
            `}

            <div style="height: 1px; background: var(--border-subtle); margin: 4px 0;"></div>

            <button class="dropdown-item danger" id="dropdown-btn-logout">
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      `;

      document.getElementById('btn-auth-user-dropdown')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });

      document.getElementById('dropdown-switch-role')?.addEventListener('click', () => {
        this.toggleDropdown(false);
        this.openLoginModal({ tab: 'staff' });
      });

      document.getElementById('dropdown-btn-logout')?.addEventListener('click', () => {
        this.toggleDropdown(false);
        window.store.logout();
        window.app.showToast('You have been signed out.', 'info');
        window.app.navigate('menu');
      });
    }
  }

  toggleDropdown(forceState = null) {
    const menu = document.getElementById('auth-dropdown-menu');
    if (!menu) return;
    if (forceState !== null) {
      menu.classList.toggle('active', forceState);
    } else {
      menu.classList.toggle('active');
    }
  }

  openLoginModal({ tab = 'customer', reason = '', onLoginSuccess = null } = {}) {
    this.activeTab = tab;
    this.pendingCallback = onLoginSuccess;

    const modal = document.getElementById('modal-auth');
    const content = document.getElementById('auth-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <!-- Reason banner if triggered by action -->
      ${reason === 'checkout' ? `
        <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid var(--primary); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 16px; display: flex; gap: 10px; align-items: center;">
          <span style="font-size: 20px;">🛒</span>
          <div>
            <strong style="color: #fff; font-size: 13px;">Login Required for Checkout</strong>
            <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Please sign in or register to place your Dhaka feast order and track live rider delivery.</p>
          </div>
        </div>
      ` : reason === 'staff_gate' ? `
        <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid var(--color-danger); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 16px; display: flex; gap: 10px; align-items: center;">
          <span style="font-size: 20px;">🔒</span>
          <div>
            <strong style="color: #fff; font-size: 13px;">Staff & Admin Authentication Required</strong>
            <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Please log in with authorized staff credentials to access operational views.</p>
          </div>
        </div>
      ` : ''}

      <!-- One-Click Demo Quick Login Pills Bar -->
      <div class="demo-quick-login-box">
        <div class="demo-quick-login-title">
          <span>⚡ One-Click Demo Role Login</span>
          <span style="font-size: 10px; color: var(--text-muted);">Click any role to test</span>
        </div>
        <div class="demo-pills-grid">
          <button class="demo-pill-btn" onclick="window.authComponent.handleQuickLogin('Admin')">
            <span>👑</span> <span>Sadia (Admin)</span>
          </button>
          <button class="demo-pill-btn" onclick="window.authComponent.handleQuickLogin('Manager')">
            <span>👨‍💼</span> <span>Sarafat (Manager)</span>
          </button>
          <button class="demo-pill-btn" onclick="window.authComponent.handleQuickLogin('Kitchen')">
            <span>🍳</span> <span>Chef Rony (Kitchen)</span>
          </button>
          <button class="demo-pill-btn" onclick="window.authComponent.handleQuickLogin('Customer')">
            <span>🍽️</span> <span>Asif (Customer)</span>
          </button>
        </div>
      </div>

      <!-- Auth Navigation Tabs -->
      <div class="auth-tabs" id="auth-modal-tabs">
        <button class="auth-tab-btn ${this.activeTab === 'customer' ? 'active' : ''}" data-tab="customer">
          🍽️ Customer Login
        </button>
        <button class="auth-tab-btn ${this.activeTab === 'staff' ? 'active' : ''}" data-tab="staff">
          👔 Staff / Admin
        </button>
        <button class="auth-tab-btn ${this.activeTab === 'register' ? 'active' : ''}" data-tab="register">
          📝 Register (New)
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="auth-tab-form-body">
        ${this._renderTabForm()}
      </div>
    `;

    content.querySelectorAll('#auth-modal-tabs .auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        content.querySelectorAll('#auth-modal-tabs .auth-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = btn.dataset.tab;
        document.getElementById('auth-tab-form-body').innerHTML = this._renderTabForm();
        this._bindFormEvents();
      });
    });

    this._bindFormEvents();
    window.app.openModal('modal-auth');
  }

  _renderTabForm() {
    if (this.activeTab === 'customer') {
      return `
        <form id="form-customer-login">
          <div class="form-group">
            <label class="form-label">Mobile Number / Email *</label>
            <input type="text" class="form-input" id="auth-cust-id" placeholder="+880 1711-234567 or asif.rahman@gmail.com" value="+880 1711-234567" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password *</label>
            <input type="password" class="form-input" id="auth-cust-pass" placeholder="Enter your password" value="customer123" required />
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Default demo password: <code>customer123</code></div>
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
            <span>🚀 Sign In & Continue</span>
          </button>
        </form>
      `;
    } else if (this.activeTab === 'staff') {
      return `
        <form id="form-staff-login">
          <div class="form-group">
            <label class="form-label">Staff Username or Email *</label>
            <input type="text" class="form-input" id="auth-staff-id" placeholder="admin, manager, cashier, kitchen, rider" value="admin" required />
          </div>
          <div class="form-group">
            <label class="form-label">Staff Security Password *</label>
            <input type="password" class="form-input" id="auth-staff-pass" placeholder="••••••••" value="admin123" required />
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Admin Sadia: <code>admin123</code> • Staff: <code>manager123</code> / <code>cashier123</code></div>
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
            <span>🛡️ Authenticate & Unlock Portal</span>
          </button>
        </form>
      `;
    } else {
      return `
        <form id="form-register-customer">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="reg-name" placeholder="e.g. Asif Rahman" required />
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Number *</label>
              <input type="tel" class="form-input" id="reg-phone" placeholder="+880 1711-XXXXXX" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email Address (Optional)</label>
            <input type="email" class="form-input" id="reg-email" placeholder="asif@gmail.com" />
          </div>
          <div class="form-group">
            <label class="form-label">Delivery Address in Dhaka *</label>
            <input type="text" class="form-input" id="reg-address" placeholder="House, Road, Area (e.g. Banani, Gulshan, Dhanmondi)" value="House 42, Road 11, Banani, Dhaka" required />
          </div>
          <div class="form-group">
            <label class="form-label">Create Password *</label>
            <input type="password" class="form-input" id="reg-pass" placeholder="At least 6 characters" value="123456" required />
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
            <span>✨ Create Customer Account</span>
          </button>
        </form>
      `;
    }
  }

  _bindFormEvents() {
    const custForm = document.getElementById('form-customer-login');
    if (custForm) {
      custForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('auth-cust-id').value.trim();
        const pass = document.getElementById('auth-cust-pass').value.trim();
        const res = await window.store.login(id, pass);
        if (res.success) {
          window.app.closeModal('modal-auth');
          window.app.showToast(res.message, 'success');
          if (this.pendingCallback) {
            const cb = this.pendingCallback;
            this.pendingCallback = null;
            cb(res.user);
          }
        } else {
          window.app.showToast(res.message, 'danger');
        }
      });
    }

    const staffForm = document.getElementById('form-staff-login');
    if (staffForm) {
      staffForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('auth-staff-id').value.trim();
        const pass = document.getElementById('auth-staff-pass').value.trim();
        const res = await window.store.login(id, pass);
        if (res.success) {
          window.app.closeModal('modal-auth');
          window.app.showToast(res.message, 'success');
          if (this.pendingCallback) {
            const cb = this.pendingCallback;
            this.pendingCallback = null;
            cb(res.user);
          } else {
            // If logging in from staff gate, re-render current view
            window.app.navigate(window.app.currentView);
          }
        } else {
          window.app.showToast(res.message, 'danger');
        }
      });
    }

    const regForm = document.getElementById('form-register-customer');
    if (regForm) {
      regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const address = document.getElementById('reg-address').value.trim();
        const pass = document.getElementById('reg-pass').value.trim();

        const res = await window.store.registerCustomer({
          name,
          phone,
          email,
          deliveryAddress: address,
          password: pass
        });

        if (res.success) {
          window.app.closeModal('modal-auth');
          window.app.showToast(res.message, 'success');
          if (this.pendingCallback) {
            const cb = this.pendingCallback;
            this.pendingCallback = null;
            cb(res.user);
          }
        } else {
          window.app.showToast(res.message, 'danger');
        }
      });
    }
  }

  async handleQuickLogin(roleName) {
    const res = await window.store.quickLogin(roleName);
    if (res.success) {
      window.app.closeModal('modal-auth');
      window.app.showToast(res.message, 'success');
      if (this.pendingCallback) {
        const cb = this.pendingCallback;
        this.pendingCallback = null;
        cb(res.user);
      } else {
        window.app.navigate(window.app.currentView);
      }
    } else {
      window.app.showToast(res.message, 'danger');
    }
  }

  // --- Staff Locked View Overlay ---
  renderStaffLockScreen(container, viewName) {
    const viewTitles = {
      'kds': 'Kitchen Display System (KDS)',
      'inventory': 'Inventory & Recipe Costing',
      'analytics': 'Executive Performance Analytics'
    };

    const title = viewTitles[viewName] || 'Staff Operations Portal';

    container.innerHTML = `
      <div class="staff-lock-screen">
        <div class="staff-lock-card">
          <div class="lock-icon-wrapper">🔒</div>
          <h2 class="staff-lock-title">${title}</h2>
          <p class="staff-lock-desc">
            This module is restricted to authorized restaurant staff, floor managers, and Admin <strong>Sadia Islam Dia</strong>. Please sign in with staff credentials to continue.
          </p>
          <div class="staff-lock-actions">
            <button class="btn btn-primary btn-lg" onclick="window.authComponent.openLoginModal({ tab: 'staff', reason: 'staff_gate' })">
              <span>🛡️ Sign In with Staff Credentials</span>
            </button>
            <button class="btn btn-secondary" onclick="window.app.navigate('menu')">
              <span>← Return to Public Menu</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _attachGlobalListeners() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.topbar-auth-pill')) {
        this.toggleDropdown(false);
      }
    });
  }
}

window.authComponent = new AuthComponent();
