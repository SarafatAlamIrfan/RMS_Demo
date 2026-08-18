/**
 * FlavourCraft - Staff & Team Management Component
 * Access: Executive Admin (Sadia Islam Dia) & Operations Manager (Sarafat Alam Irfan)
 * Business Rule: Manager CANNOT create, edit, or delete Admin accounts (Strict Role Protection)
 */

class StaffComponent {
  constructor() {
    this.searchQuery = '';
    this.activeDepartment = 'All';
  }

  async render() {
    const container = document.getElementById('view-staff');
    if (!container) return;

    const currentUser = window.store.currentUser;
    const currentRole = window.store.currentRole;

    const isCurrentAdmin = currentRole === 'Admin';
    const isCurrentManager = currentRole === 'Manager';

    if (!isCurrentAdmin && !isCurrentManager) {
      container.innerHTML = `
        <div class="staff-lock-screen">
          <div class="staff-lock-card">
            <div class="lock-icon-wrapper">🔒</div>
            <h2 class="staff-lock-title">Access Restricted</h2>
            <p class="staff-lock-desc">Staff Management is strictly restricted to authorized Executive Admins and Operations Managers.</p>
          </div>
        </div>
      `;
      return;
    }

    const allUsers = await window.store.db.collection('users').find();
    const staffMembers = allUsers.filter(u => u.role !== 'Customer');

    const totalStaff = staffMembers.length;
    const totalAdmins = staffMembers.filter(u => u.role === 'Admin').length;
    const totalManagers = staffMembers.filter(u => u.role === 'Manager').length;
    const totalKitchen = staffMembers.filter(u => u.role === 'Kitchen').length;
    const totalFloor = staffMembers.filter(u => ['Cashier', 'Staff', 'Rider'].includes(u.role)).length;

    container.innerHTML = `
      <div class="staff-mgmt-container">
        
        <!-- Header & Action Row -->
        <div class="staff-header-row">
          <div>
            <h2 class="staff-main-title">👥 Staff & Workforce Management</h2>
            <p class="staff-sub-title">
              ${isCurrentAdmin ? 
                'Executive Admin Portal: Full management authority over all team roles, credentials, and access levels.' : 
                'Operations Manager Portal: Supervision over operational staff (Admin accounts are read-only and protected).'
              }
            </p>
          </div>

          <button class="btn btn-primary" id="btn-add-staff" style="box-shadow: var(--shadow-md);">
            <span>➕ Add New Staff Member</span>
          </button>
        </div>

        <!-- Metrics Scorecards Grid -->
        <div class="staff-metrics-grid">
          <div class="staff-metric-card">
            <div class="staff-metric-icon">👥</div>
            <div class="staff-metric-info">
              <span class="staff-metric-val">${totalStaff}</span>
              <span class="staff-metric-lbl">Total Active Workforce</span>
            </div>
          </div>
          <div class="staff-metric-card">
            <div class="staff-metric-icon">👑</div>
            <div class="staff-metric-info">
              <span class="staff-metric-val">${totalAdmins}</span>
              <span class="staff-metric-lbl">Executive Board & Admins</span>
            </div>
          </div>
          <div class="staff-metric-card">
            <div class="staff-metric-icon">👨‍💼</div>
            <div class="staff-metric-info">
              <span class="staff-metric-val">${totalManagers}</span>
              <span class="staff-metric-lbl">Operations Managers</span>
            </div>
          </div>
          <div class="staff-metric-card">
            <div class="staff-metric-icon">🍳</div>
            <div class="staff-metric-info">
              <span class="staff-metric-val">${totalKitchen}</span>
              <span class="staff-metric-lbl">Master Chefs & Kitchen</span>
            </div>
          </div>
          <div class="staff-metric-card">
            <div class="staff-metric-icon">🛵</div>
            <div class="staff-metric-info">
              <span class="staff-metric-val">${totalFloor}</span>
              <span class="staff-metric-lbl">Front Desk & Dispatch</span>
            </div>
          </div>
        </div>

        <!-- Staff Directory Table Card -->
        <div class="data-table-card" style="margin-top: 24px;">
          <div class="table-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <h4 class="table-card-title">📋 Restaurant Staff Directory (${staffMembers.length})</h4>
              <span style="font-size: 12px; color: var(--text-secondary);">Role permissions, shifts & credential status</span>
            </div>
            
            <div style="font-size: 12px; color: var(--text-muted);">
              Current Operator: <strong style="color: var(--heading-color);">${currentUser?.name || 'Staff'}</strong> 
              <span class="badge badge-${isCurrentAdmin ? 'primary' : 'manager'}" style="margin-left: 4px;">${currentRole}</span>
            </div>
          </div>

          <div class="table-responsive">
            <table class="inventory-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Role / Authority</th>
                  <th>Username</th>
                  <th>Contact Info</th>
                  <th>Assigned Shift</th>
                  <th>Status</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${staffMembers.map(staff => {
                  const isStaffAdmin = staff.role === 'Admin';
                  const isProtectedFromManager = isCurrentManager && isStaffAdmin;
                  const isSelf = currentUser && staff._id === currentUser._id;

                  return `
                    <tr>
                      <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <div style="font-size: 24px; width: 36px; height: 36px; background: #fff5f7; border: 1px solid var(--border-subtle); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center;">
                            ${staff.avatar || (isStaffAdmin ? '👩‍💼' : staff.role === 'Manager' ? '👨‍💼' : staff.role === 'Kitchen' ? '🍳' : '👤')}
                          </div>
                          <div>
                            <strong style="color: var(--heading-color); font-size: 14px;">${staff.name}</strong>
                            <div style="font-size: 11.5px; color: var(--text-muted);">${staff.department || 'Operations Team'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-${isStaffAdmin ? 'primary' : staff.role === 'Manager' ? 'saffron' : staff.role === 'Kitchen' ? 'amber' : 'neutral'}" style="font-weight: 800;">
                          ${staff.role}
                        </span>
                      </td>
                      <td>
                        <code style="font-family: var(--font-mono); font-size: 12.5px; font-weight: 700; color: var(--heading-color); background: #f8fafc; padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-subtle);">
                          ${staff.username}
                        </code>
                      </td>
                      <td>
                        <div style="font-size: 12.5px; color: var(--heading-color); font-weight: 600;">${staff.phone || 'N/A'}</div>
                        <div style="font-size: 11.5px; color: var(--text-secondary);">${staff.email || ''}</div>
                      </td>
                      <td>
                        <span style="font-size: 12.5px; color: var(--text-secondary); font-weight: 600;">
                          ${staff.shift || 'Full Day / Regular'}
                        </span>
                      </td>
                      <td>
                        <span class="badge badge-success" style="font-size: 11px;">🟢 Active</span>
                      </td>
                      <td style="text-align: right;">
                        ${isProtectedFromManager ? `
                          <span class="badge badge-neutral" title="Managers cannot edit or delete Executive Admins" style="cursor: not-allowed; opacity: 0.85;">
                            🛡️ Protected (Admin)
                          </span>
                        ` : `
                          <div style="display: inline-flex; gap: 6px;">
                            <button class="btn-xs btn-edit-staff" data-staff-id="${staff._id}" title="Edit details or password">
                              ✏️ Edit
                            </button>
                            ${!isSelf ? `
                              <button class="btn-xs btn-danger btn-delete-staff" data-staff-id="${staff._id}" title="Remove staff member">
                                🗑️ Delete
                              </button>
                            ` : `
                              <span style="font-size: 11px; color: var(--text-muted); padding: 4px 6px;">(You)</span>
                            `}
                          </div>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this._attachEvents(isCurrentAdmin);
  }

  _attachEvents(isCurrentAdmin) {
    // Add Staff Button
    document.getElementById('btn-add-staff')?.addEventListener('click', () => {
      this.openStaffModal(null, isCurrentAdmin);
    });

    // Edit Staff Buttons
    document.querySelectorAll('.btn-edit-staff').forEach(btn => {
      btn.onclick = async (e) => {
        const staffId = e.currentTarget.dataset.staffId;
        const staff = await window.store.db.collection('users').findOne({ _id: staffId });
        if (staff) {
          this.openStaffModal(staff, isCurrentAdmin);
        }
      };
    });

    // Delete Staff Buttons
    document.querySelectorAll('.btn-delete-staff').forEach(btn => {
      btn.onclick = async (e) => {
        const staffId = e.currentTarget.dataset.staffId;
        this.deleteStaff(staffId);
      };
    });
  }

  // --- Add / Edit Staff Modal ---
  async openStaffModal(existingStaff = null, isCurrentAdmin = false) {
    const isEdit = !!existingStaff;
    const modal = document.getElementById('modal-generic');
    const title = document.getElementById('generic-modal-title');
    const body = document.getElementById('generic-modal-body');

    if (!modal || !title || !body) return;

    title.textContent = isEdit ? `✏️ Edit Staff: ${existingStaff.name}` : `➕ Add New Staff Member`;

    // Role options: Admin can create all roles; Manager CANNOT create Admin role!
    const availableRoles = isCurrentAdmin 
      ? ['Admin', 'Manager', 'Kitchen', 'Cashier', 'Staff', 'Rider']
      : ['Manager', 'Kitchen', 'Cashier', 'Staff', 'Rider'];

    body.innerHTML = `
      <form id="form-staff-crud">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-input" id="sf-name" value="${isEdit ? existingStaff.name : ''}" placeholder="e.g. Tanvir Hossain" required />
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Role *</label>
            <select class="form-select" id="sf-role" ${isEdit && existingStaff.role === 'Admin' && !isCurrentAdmin ? 'disabled' : ''} required>
              ${availableRoles.map(r => `
                <option value="${r}" ${isEdit && existingStaff.role === r ? 'selected' : ''}>${r}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Username / Staff ID *</label>
            <input type="text" class="form-input" id="sf-username" value="${isEdit ? existingStaff.username : ''}" placeholder="e.g. tanvir" required />
          </div>
          <div class="form-group">
            <label class="form-label">Security Password ${isEdit ? '(Leave blank to keep current)' : '*'}</label>
            <input type="password" class="form-input" id="sf-password" placeholder="${isEdit ? '••••••••' : 'Enter password'}" ${isEdit ? '' : 'required'} />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Mobile Number *</label>
            <input type="tel" class="form-input" id="sf-phone" value="${isEdit ? (existingStaff.phone || '') : ''}" placeholder="+880 1710-XXXXXX" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" id="sf-email" value="${isEdit ? (existingStaff.email || '') : ''}" placeholder="staff@flavourcraft.bd" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Department / Designation</label>
            <input type="text" class="form-input" id="sf-dept" value="${isEdit ? (existingStaff.department || '') : ''}" placeholder="e.g. Dining Floor Lead" />
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Shift</label>
            <select class="form-select" id="sf-shift">
              <option value="Morning Shift (10 AM - 4 PM)" ${isEdit && existingStaff.shift?.includes('Morning') ? 'selected' : ''}>Morning Shift (10 AM - 4 PM)</option>
              <option value="Evening & Dinner Shift (4 PM - 12 AM)" ${isEdit && existingStaff.shift?.includes('Evening') ? 'selected' : ''}>Evening & Dinner Shift (4 PM - 12 AM)</option>
              <option value="Full Day & All Access" ${!isEdit || existingStaff.shift?.includes('Full') ? 'selected' : ''}>Full Day & All Access</option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 14px;">
          <span>${isEdit ? '💾 Save Staff Changes' : '✨ Register Staff Member'}</span>
        </button>
      </form>
    `;

    modal.classList.add('active');

    const form = document.getElementById('form-staff-crud');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('sf-name').value.trim();
      const role = document.getElementById('sf-role').value;
      const username = document.getElementById('sf-username').value.trim().toLowerCase();
      const password = document.getElementById('sf-password').value.trim();
      const phone = document.getElementById('sf-phone').value.trim();
      const email = document.getElementById('sf-email').value.trim();
      const department = document.getElementById('sf-dept').value.trim();
      const shift = document.getElementById('sf-shift').value;

      // Enforce: Manager cannot assign Admin role
      if (!isCurrentAdmin && role === 'Admin') {
        window.app.showToast('Access Denied: Managers cannot create or assign Admin accounts.', 'danger');
        return;
      }

      const avatarIcons = {
        'Admin': '👩‍💼',
        'Manager': '👨‍💼',
        'Kitchen': '🍳',
        'Cashier': '💵',
        'Staff': '🍽️',
        'Rider': '🛵'
      };

      if (isEdit) {
        // Enforce: Manager cannot edit Admin
        if (!isCurrentAdmin && existingStaff.role === 'Admin') {
          window.app.showToast('Access Denied: Managers cannot edit Executive Admin accounts.', 'danger');
          return;
        }

        const updateFields = {
          name,
          role,
          username,
          phone,
          email,
          department: department || `${role} Department`,
          shift,
          avatar: existingStaff.avatar || avatarIcons[role] || '👤'
        };

        if (password) {
          updateFields.password = password;
        }

        await window.store.db.collection('users').updateOne(
          { _id: existingStaff._id },
          { $set: updateFields }
        );

        window.app.showToast(`Staff member "${name}" updated successfully!`, 'success');
      } else {
        const newStaff = {
          _id: 'usr_' + Date.now(),
          name,
          role,
          username,
          password: password || 'staff123',
          phone,
          email,
          department: department || `${role} Department`,
          shift,
          avatar: avatarIcons[role] || '👤',
          status: 'Active',
          createdAt: new Date().toISOString()
        };

        await window.store.db.collection('users').insertOne(newStaff);
        window.app.showToast(`Staff member "${name}" registered as ${role}!`, 'success');
      }

      modal.classList.remove('active');
      this.render();
    };
  }

  // --- Delete Staff Handler ---
  async deleteStaff(staffId) {
    const currentUser = window.store.currentUser;
    const currentRole = window.store.currentRole;
    const isCurrentAdmin = currentRole === 'Admin';

    const staff = await window.store.db.collection('users').findOne({ _id: staffId });
    if (!staff) return;

    if (currentUser && staff._id === currentUser._id) {
      window.app.showToast('Action Denied: You cannot delete your own active account.', 'danger');
      return;
    }

    if (staff.role === 'Admin' && !isCurrentAdmin) {
      window.app.showToast('Access Denied: Operations Managers cannot delete Executive Admin accounts.', 'danger');
      return;
    }

    if (confirm(`Are you sure you want to remove staff member "${staff.name}" (${staff.role}) from the system?`)) {
      await window.store.db.collection('users').deleteOne({ _id: staffId });
      window.app.showToast(`Staff member "${staff.name}" removed by ${currentUser?.name || 'Staff'}.`, 'info');
      this.render();
    }
  }
}

window.staffComponent = new StaffComponent();
