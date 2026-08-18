/**
 * FlavourCraft - Role-Based Access Control (RBAC) Component
 */

class RbacComponent {
  constructor() {
    this.rolePermissions = {
      'Admin': {
        name: 'Executive Admin',
        allowedViews: ['menu', 'reservations', 'tracking', 'kds', 'inventory', 'analytics', 'staff'],
        badgeClass: 'admin',
        description: 'Complete operational, financial and system authority.'
      },
      'Manager': {
        name: 'Operations Manager',
        allowedViews: ['menu', 'reservations', 'tracking', 'kds', 'inventory', 'analytics', 'staff'],
        badgeClass: 'manager',
        description: 'Operations supervision, billing oversight, and analytics.'
      },
      'Kitchen': {
        name: 'Kitchen Chef & Ustad',
        allowedViews: ['kds', 'inventory', 'menu'],
        badgeClass: 'kitchen',
        description: 'Live order queue management, recipe formulation, and stock monitoring.'
      },
      'Cashier': {
        name: 'Cashier & Front Desk',
        allowedViews: ['menu', 'reservations', 'tracking'],
        badgeClass: 'staff',
        description: 'Front desk billing and guest order management.'
      },
      'Staff': {
        name: 'Dining Floor Staff',
        allowedViews: ['menu', 'reservations', 'tracking'],
        badgeClass: 'staff',
        description: 'Dining floor hospitality and order assistance.'
      },
      'Rider': {
        name: 'Delivery Fleet Rider',
        allowedViews: ['menu', 'tracking'],
        badgeClass: 'staff',
        description: 'Live dispatch radar and food delivery.'
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
      sidebarCard.title = 'Click to Sign In or Switch Profile';
      sidebarCard.addEventListener('click', () => {
        if (window.authComponent) {
          window.authComponent.openLoginModal();
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

    // Smartly show/hide sidebar section header titles
    document.querySelectorAll('.nav-section-title').forEach(sectionTitle => {
      let sibling = sectionTitle.nextElementSibling;
      let hasVisibleChild = false;
      while (sibling && !sibling.classList.contains('nav-section-title')) {
        if (sibling.classList.contains('nav-item') && sibling.style.display !== 'none') {
          hasVisibleChild = true;
          break;
        }
        sibling = sibling.nextElementSibling;
      }
      sectionTitle.style.display = hasVisibleChild ? 'block' : 'none';
    });

    // If current active view is not allowed for this role, redirect to public menu
    if (window.app && window.app.currentView && !perm.allowedViews.includes(window.app.currentView)) {
      window.app.navigate('menu');
    }
  }
}

window.rbacComponent = new RbacComponent();
