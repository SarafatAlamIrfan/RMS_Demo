/**
 * FlavourCraft - Role-Based Access Control (RBAC) Component
 */

class RbacComponent {
  constructor() {
    this.rolePermissions = {
      'Admin': {
        name: 'Executive Admin',
        allowedViews: ['menu', 'reservations', 'tracking', 'kds', 'floor', 'pos', 'inventory', 'analytics'],
        badgeClass: 'admin',
        description: 'Complete operational, financial and system authority.'
      },
      'Manager': {
        name: 'Restaurant Floor Manager',
        allowedViews: ['menu', 'reservations', 'tracking', 'kds', 'floor', 'pos', 'inventory', 'analytics'],
        badgeClass: 'manager',
        description: 'Floor supervision, table allocation, billing overrides and reports.'
      },
      'Cashier': {
        name: 'POS Billing Cashier',
        allowedViews: ['pos', 'floor', 'menu', 'tracking'],
        badgeClass: 'cashier',
        description: 'Cash register operations, split bills, and receipt generation.'
      },
      'Kitchen': {
        name: 'Line & Head Chef',
        allowedViews: ['kds', 'inventory', 'menu'],
        badgeClass: 'kitchen',
        description: 'Live order queue management, recipe formulation, and waste logs.'
      },
      'Delivery': {
        name: 'Delivery Dispatch Rider',
        allowedViews: ['tracking', 'menu'],
        badgeClass: 'rider',
        description: 'Dispatched order tracking and delivery confirmation.'
      },
      'Customer': {
        name: 'Dining Guest / Foodie',
        allowedViews: ['menu', 'reservations', 'tracking'],
        badgeClass: 'customer',
        description: 'Online ordering, table bookings and live order tracker.'
      }
    };
  }

  init() {
    window.store.subscribe('role_changed', ({ role, user }) => {
      this.applyRoleRestrictions(role, user);
    });

    window.store.subscribe('auth_changed', () => {
      this.applyRoleRestrictions(window.store.currentRole, window.store.currentUser);
    });

    const sidebarCard = document.querySelector('.user-profile-card');
    if (sidebarCard) {
      sidebarCard.style.cursor = 'pointer';
      sidebarCard.title = 'Click to Sign In or Switch Staff Profile';
      sidebarCard.addEventListener('click', () => {
        if (!window.store.isLoggedIn()) {
          window.authComponent.openLoginModal();
        } else {
          window.authComponent.openLoginModal({ tab: 'staff' });
        }
      });
    }
  }

  applyRoleRestrictions(roleName, user) {
    const isLoggedIn = window.store.isLoggedIn();
    const perm = this.rolePermissions[roleName] || this.rolePermissions['Customer'];

    // Update Topbar and Sidebar Profile
    const userNameEl = document.getElementById('sidebar-user-name');
    const userRoleEl = document.getElementById('sidebar-user-role');
    const userAvatarEl = document.getElementById('sidebar-user-avatar');

    if (isLoggedIn && user) {
      if (userNameEl) userNameEl.textContent = user.name;
      if (userRoleEl) userRoleEl.textContent = perm.name;
      if (userAvatarEl) userAvatarEl.textContent = user.avatar || '👤';
    } else {
      if (userNameEl) userNameEl.textContent = 'Guest Foodie';
      if (userRoleEl) userRoleEl.textContent = 'Click to Sign In 🔑';
      if (userAvatarEl) userAvatarEl.textContent = '🍽️';
    }

    // Filter sidebar navigation items
    document.querySelectorAll('.nav-item').forEach(nav => {
      const targetView = nav.dataset.view;
      if (targetView) {
        if (perm.allowedViews.includes(targetView)) {
          nav.style.display = 'flex';
        } else {
          nav.style.display = 'none';
        }
      }
    });
  }
}

window.rbacComponent = new RbacComponent();
