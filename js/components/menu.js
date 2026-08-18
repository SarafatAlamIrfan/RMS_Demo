/**
 * FlavourCraft - Digital Interactive Menu Component
 * Hero Banner: "Experience the True Taste of Dhaka!"
 * Chef's Special Recommendations + Full Catalog in ৳ BDT
 * Full CRUD Capabilities for Executive Admin (Sadia Islam Dia) & Manager (Sarafat Alam Irfan)
 */

class MenuComponent {
  constructor() {
    this.activeCategory = 'All Categories';
    this.activeDietary = [];
    this.searchQuery = '';
    this.customizingDish = null;
  }

  setSearchQuery(q) {
    this.searchQuery = q;
    const grid = document.getElementById('dishes-grid');
    if (grid) {
      window.store.db.collection('menu').find().then(dishes => {
        grid.innerHTML = this._renderDishCards(dishes);
        this._rebindCardButtons();
      });
    }
  }

  async render() {
    const container = document.getElementById('view-menu');
    if (!container) return;

    const dishes = await window.store.db.collection('menu').find();
    const chefSpecials = dishes.filter(d => 
      ['dish_01', 'dish_04', 'dish_06', 'dish_chn_01', 'dish_08'].includes(d._id)
    );

    const categories = [
      'All Categories',
      'Bengali Food',
      'Chinese',
      'Appetizer',
      'Drinks & Coffee',
      'Dessert'
    ];

    const canManage = ['Admin', 'Manager'].includes(window.store.currentRole);

    container.innerHTML = `
      <!-- Hero Banner Matching Reference Design -->
      <div class="dhaka-hero-banner">
        <div class="hero-content">
          <h1 class="hero-title">
            Experience the <span class="hero-saffron">True Taste of Dhaka!</span>
          </h1>
          <p class="hero-subtitle">
            From mouth-watering Old Dhaka Kacchi to spicy Chinese dishes and freshly brewed coffee, we bring your favorite food right to your table.
          </p>
          <div class="hero-actions">
            <button class="hero-btn btn-order-online" id="btn-hero-order">
              <span>🍽️</span> <span>Order Online</span>
            </button>
            <button class="hero-btn btn-book-table" id="btn-hero-book">
              <span>📅</span> <span>Book a Table</span>
            </button>
            <button class="hero-btn btn-track-order" id="btn-hero-track">
              <span>📍</span> <span>Track Live Order</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Chef's Special Recommendations Section -->
      <div class="chefs-specials-section">
        <div class="section-header-row">
          <div class="section-title-box">
            <h2 class="section-main-title">Chef's Special Recommendations</h2>
            <p class="section-sub-title">Signature recipes perfected by Head Chef Rony, Manager Sarafat Alam Irfan & Admin Sadia Islam Dia</p>
          </div>
        </div>

        <div class="specials-grid">
          ${chefSpecials.map(dish => this._renderSpecialCard(dish, canManage)).join('')}
        </div>
      </div>

      <!-- Full Menu Catalog Section -->
      <div class="menu-catalog-section" id="menu-catalog-section">
        <div class="section-header-row" style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
          <div class="section-title-box">
            <h2 class="section-main-title">Explore Our Full Menu</h2>
            <p class="section-sub-title">Authentic dishes prepared fresh with Baghabari pure ghee, tender meats & wild spices</p>
          </div>

          ${canManage ? `
            <div>
              <button class="btn btn-primary" id="btn-add-new-dish" style="box-shadow: var(--shadow-md);">
                <span>➕ Add New Dish (Admin / Manager)</span>
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Categories Navigation -->
        <div class="category-filter-bar" id="category-filter-bar">
          ${categories.map(cat => `
            <button class="category-pill ${this.activeCategory === cat ? 'active' : ''}" data-category="${cat}">
              ${this._getCategoryIcon(cat)} ${cat}
            </button>
          `).join('')}
        </div>

        <!-- Dishes Grid -->
        <div class="menu-grid" id="dishes-grid">
          ${this._renderDishCards(dishes, canManage)}
        </div>
      </div>
    `;

    this._attachEvents();
  }

  _renderSpecialCard(dish, canManage) {
    return `
      <div class="special-card">
        <div class="special-badge">⭐ Chef Pick</div>
        <div class="special-img-wrapper">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy" />
        </div>
        <div class="special-body">
          <div class="special-cat">${dish.category}</div>
          <h3 class="special-title">${dish.name}</h3>
          <p class="special-desc">${dish.description}</p>
          <div class="special-footer">
            <div class="special-price">৳${dish.price.toLocaleString()}</div>
            <button class="btn btn-primary btn-sm btn-add-dish" data-dish-id="${dish._id}">
              <span>+ Add</span>
            </button>
          </div>

          ${canManage ? `
            <div class="admin-dish-bar">
              <button class="btn-xs btn-edit-dish" data-dish-id="${dish._id}">✏️ Edit</button>
              <button class="btn-xs btn-danger btn-delete-dish" data-dish-id="${dish._id}">🗑️ Delete</button>
              <button class="btn-xs ${dish.isAvailable ? 'btn-success' : 'btn-warning'} btn-toggle-avail" data-dish-id="${dish._id}">
                ${dish.isAvailable ? '🟢 Available' : '🔴 Sold Out'}
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  _getCategoryIcon(cat) {
    const icons = {
      'All Categories': '🍽️',
      'Bengali Food': '🍛',
      'Chinese': '🥢',
      'Appetizer': '🍤',
      'Drinks & Coffee': '☕',
      'Dessert': '🍨'
    };
    return icons[cat] || '🍽️';
  }

  _filterDishes(dishes) {
    return dishes.filter(dish => {
      if (this.activeCategory !== 'All Categories' && this.activeCategory !== 'All' && dish.category !== this.activeCategory) {
        return false;
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchName = dish.name.toLowerCase().includes(q);
        const matchDesc = dish.description.toLowerCase().includes(q);
        const matchSku = dish.sku && dish.sku.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchSku) return false;
      }
      return true;
    });
  }

  _renderDishCards(dishes, canManage = null) {
    if (canManage === null) {
      canManage = ['Admin', 'Manager'].includes(window.store.currentRole);
    }
    const filtered = this._filterDishes(dishes);
    if (filtered.length === 0) {
      return `
        <div class="empty-menu-state" style="grid-column: 1/-1; text-align:center; padding: 40px;">
          <span style="font-size: 40px;">🍲</span>
          <h3 style="margin-top: 10px; color: var(--heading-color);">No dishes found</h3>
          <p style="color: var(--text-secondary); font-size: 13px;">Try adjusting your search query or dietary filters</p>
        </div>
      `;
    }

    return filtered.map(dish => `
      <div class="menu-card" data-dish-id="${dish._id}">
        <div class="menu-card-image-wrap">
          <img src="${dish.image}" alt="${dish.name}" class="menu-card-img" loading="lazy" />
          <span class="menu-card-sku">${dish.sku || 'FC-DHK'}</span>
          ${dish.spiceLevel > 0 ? `
            <div class="spice-meter-badge" title="Spice Level: ${dish.spiceLevel}/3">
              ${'🔥'.repeat(dish.spiceLevel)}
            </div>
          ` : ''}
          ${!dish.isAvailable ? `<div class="sold-out-overlay">Sold Out</div>` : ''}
        </div>

        <div class="menu-card-content">
          <div class="menu-card-tags">
            ${(dish.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>

          <h3 class="menu-card-title">${dish.name}</h3>
          <p class="menu-card-desc">${dish.description}</p>

          <div class="menu-card-bottom">
            <div class="menu-card-price">
              <span class="currency-symbol">৳</span>
              <span class="price-val">${dish.price.toLocaleString()}</span>
            </div>

            <div class="menu-card-actions">
              <button class="btn-customize-item" data-dish-id="${dish._id}" title="Customize Add-ons & Spices">
                <span>⚙️ Options</span>
              </button>
              <button class="btn-add-to-cart ${!dish.isAvailable ? 'disabled' : ''}" data-dish-id="${dish._id}" ${!dish.isAvailable ? 'disabled' : ''}>
                <span>+ Add</span>
              </button>
            </div>
          </div>

          ${canManage ? `
            <div class="admin-dish-bar">
              <button class="btn-xs btn-edit-dish" data-dish-id="${dish._id}">✏️ Edit</button>
              <button class="btn-xs btn-danger btn-delete-dish" data-dish-id="${dish._id}">🗑️ Delete</button>
              <button class="btn-xs ${dish.isAvailable ? 'btn-success' : 'btn-warning'} btn-toggle-avail" data-dish-id="${dish._id}">
                ${dish.isAvailable ? '🟢 Available' : '🔴 Sold Out'}
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  _attachEvents() {
    // Hero CTA Buttons
    document.getElementById('btn-hero-order')?.addEventListener('click', () => {
      const section = document.getElementById('menu-catalog-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });

    document.getElementById('btn-hero-book')?.addEventListener('click', () => {
      window.app.navigate('reservations');
    });

    document.getElementById('btn-hero-track')?.addEventListener('click', () => {
      window.app.navigate('tracking');
    });

    // Add New Dish button (Admin / Manager)
    document.getElementById('btn-add-new-dish')?.addEventListener('click', () => {
      this.openDishFormModal();
    });

    // Category filter click
    document.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.category;
        this.activeCategory = cat;
        this.render();
      });
    });

    this._rebindCardButtons();
  }

  _rebindCardButtons() {
    // Quick Add button
    document.querySelectorAll('.btn-add-to-cart, .btn-add-dish').forEach(btn => {
      btn.onclick = async (e) => {
        const dishId = e.currentTarget.dataset.dishId;
        const dish = await window.store.db.collection('menu').findOne({ _id: dishId });
        if (dish && dish.isAvailable) {
          window.store.addToCart(dish, 1, []);
          window.app.showToast(`Added ${dish.name} to feast cart!`, 'success');
        }
      };
    });

    // Customize button
    document.querySelectorAll('.btn-customize-item').forEach(btn => {
      btn.onclick = async (e) => {
        const dishId = e.currentTarget.dataset.dishId;
        const dish = await window.store.db.collection('menu').findOne({ _id: dishId });
        if (dish) {
          this.openCustomizer(dish);
        }
      };
    });

    // Admin & Manager: Edit Dish
    document.querySelectorAll('.btn-edit-dish').forEach(btn => {
      btn.onclick = async (e) => {
        const dishId = e.currentTarget.dataset.dishId;
        const dish = await window.store.db.collection('menu').findOne({ _id: dishId });
        if (dish) {
          this.openDishFormModal(dish);
        }
      };
    });

    // Admin & Manager: Delete Dish
    document.querySelectorAll('.btn-delete-dish').forEach(btn => {
      btn.onclick = async (e) => {
        const dishId = e.currentTarget.dataset.dishId;
        const dish = await window.store.db.collection('menu').findOne({ _id: dishId });
        if (dish) {
          if (confirm(`Are you sure you want to delete "${dish.name}" from the menu?`)) {
            await window.store.db.collection('menu').deleteOne({ _id: dishId });
            window.app.showToast(`Dish "${dish.name}" removed by ${window.store.currentUser?.name || 'Staff'}`, 'info');
            this.render();
          }
        }
      };
    });

    // Admin & Manager: Toggle Availability
    document.querySelectorAll('.btn-toggle-avail').forEach(btn => {
      btn.onclick = async (e) => {
        const dishId = e.currentTarget.dataset.dishId;
        const dish = await window.store.db.collection('menu').findOne({ _id: dishId });
        if (dish) {
          const newStatus = !dish.isAvailable;
          await window.store.db.collection('menu').updateOne(
            { _id: dishId },
            { $set: { isAvailable: newStatus } }
          );
          window.app.showToast(`"${dish.name}" marked as ${newStatus ? 'Available' : 'Sold Out'}`, 'success');
          this.render();
        }
      };
    });
  }

  // --- Dish Modal: Create & Edit Dish (Admin & Manager) ---
  async openDishFormModal(existingDish = null) {
    const isEdit = !!existingDish;
    const modal = document.getElementById('modal-generic');
    const title = document.getElementById('generic-modal-title');
    const body = document.getElementById('generic-modal-body');

    if (!modal || !title || !body) return;

    title.textContent = isEdit ? `✏️ Edit Dish: ${existingDish.name}` : `➕ Add New Culinary Dish`;

    const categories = [
      'Bengali Food',
      'Chinese',
      'Appetizer',
      'Drinks & Coffee',
      'Dessert'
    ];

    const currentTags = existingDish ? (existingDish.tags || []) : ['100% Halal'];

    body.innerHTML = `
      <form id="dish-crud-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Dish Name *</label>
            <input type="text" class="form-input" id="df-name" value="${isEdit ? existingDish.name : ''}" placeholder="e.g. Shahi Mutton Rezala" required />
          </div>
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select class="form-select" id="df-category">
              ${categories.map(c => `<option value="${c}" ${isEdit && existingDish.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Selling Price (৳ BDT) *</label>
            <input type="number" class="form-input" id="df-price" value="${isEdit ? existingDish.price : ''}" placeholder="e.g. 580" min="10" required />
          </div>
          <div class="form-group">
            <label class="form-label">SKU / Item Code</label>
            <input type="text" class="form-input" id="df-sku" value="${isEdit ? (existingDish.sku || '') : ('FC-DHK-' + Math.floor(100 + Math.random() * 900))}" placeholder="FC-DHK-XXX" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description *</label>
          <textarea class="form-textarea" id="df-desc" rows="2" placeholder="Rich aroma, tender cuts cooked in clay pot..." required>${isEdit ? existingDish.description : ''}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Image URL / Asset Path</label>
            <input type="text" class="form-input" id="df-image" value="${isEdit ? existingDish.image : 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'}" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label class="form-label">Spice Heat Level</label>
            <select class="form-select" id="df-spice">
              <option value="0" ${isEdit && existingDish.spiceLevel === 0 ? 'selected' : ''}>🟢 0 - Shahi Mild (Non-Spicy)</option>
              <option value="1" ${isEdit && existingDish.spiceLevel === 1 ? 'selected' : ''}>🌶️ 1 - Dhaka Regular</option>
              <option value="2" ${isEdit && existingDish.spiceLevel === 2 ? 'selected' : ''}>🔥🔥 2 - Spicy</option>
              <option value="3" ${isEdit && existingDish.spiceLevel === 3 ? 'selected' : ''}>🔥🔥🔥 3 - Sylheti Naga Fire</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Dietary Tags</label>
          <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 6px;">
            ${['100% Halal', 'Spicy', 'Vegetarian', 'Vegan', 'Gluten-Free'].map(tag => `
              <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" class="df-tag-cb" value="${tag}" ${currentTags.includes(tag) ? 'checked' : ''} />
                <span>${tag}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="form-group" style="display: flex; align-items: center; gap: 10px;">
          <input type="checkbox" id="df-available" style="width: 18px; height: 18px;" ${!isEdit || existingDish.isAvailable ? 'checked' : ''} />
          <label for="df-available" style="font-size: 13.5px; font-weight: 700; cursor: pointer;">In-Stock & Available for Customers</label>
        </div>

        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 14px;">
          <span>${isEdit ? '💾 Update Menu Dish' : '✨ Add Dish to Live Menu'}</span>
        </button>
      </form>
    `;

    modal.classList.add('active');

    const form = document.getElementById('dish-crud-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('df-name').value.trim();
      const category = document.getElementById('df-category').value;
      const price = parseFloat(document.getElementById('df-price').value) || 0;
      const sku = document.getElementById('df-sku').value.trim();
      const description = document.getElementById('df-desc').value.trim();
      const image = document.getElementById('df-image').value.trim();
      const spiceLevel = parseInt(document.getElementById('df-spice').value) || 0;
      const isAvailable = document.getElementById('df-available').checked;
      const tags = Array.from(document.querySelectorAll('.df-tag-cb:checked')).map(cb => cb.value);

      const actor = window.store.currentUser?.name || 'Authorized Staff';

      if (isEdit) {
        await window.store.db.collection('menu').updateOne(
          { _id: existingDish._id },
          {
            $set: {
              name,
              category,
              price,
              sku,
              description,
              image,
              spiceLevel,
              isAvailable,
              tags
            }
          }
        );
        window.app.showToast(`Dish "${name}" updated successfully by ${actor}!`, 'success');
      } else {
        const newDish = {
          _id: 'dish_' + Date.now(),
          sku: sku || ('FC-DHK-' + Math.floor(100 + Math.random() * 900)),
          name,
          category,
          price,
          description,
          image: image || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
          spiceLevel,
          isAvailable,
          tags,
          createdAt: new Date().toISOString()
        };
        await window.store.db.collection('menu').insertOne(newDish);
        window.app.showToast(`New dish "${name}" added to menu by ${actor}!`, 'success');
      }

      modal.classList.remove('active');
      this.render();
    };
  }

  // --- Customer Dish Customizer Modal ---
  openCustomizer(dish) {
    this.customizingDish = dish;
    const modal = document.getElementById('modal-item-customizer');
    const content = document.getElementById('customizer-modal-content');
    if (!modal || !content) return;

    let selectedModifiers = [];
    let selectedSpice = dish.spiceLevel || 1;
    let quantity = 1;

    const availableModifiers = [
      { id: 'mod_aloo', name: 'Extra Spiced Biryani Aloo (1 pc)', price: 60 },
      { id: 'mod_borhani', name: 'Chilled Classic Borhani (250ml)', price: 80 },
      { id: 'mod_jali_kabab', name: 'Crispy Mutton Jali Kabab (1 pc)', price: 140 },
      { id: 'mod_naga_dip', name: 'Sylheti Naga Morich Fire Sauce', price: 50 },
      { id: 'mod_salad', name: 'Fresh Cucumber & Lebu Tok Salad', price: 40 }
    ];

    const updatePrice = () => {
      const modsTotal = selectedModifiers.reduce((sum, m) => sum + m.price, 0);
      const total = (dish.price + modsTotal) * quantity;
      const el = document.getElementById('customizer-total-price');
      if (el) el.textContent = `৳${total.toLocaleString()}`;
    };

    content.innerHTML = `
      <div class="customizer-header-card">
        <img src="${dish.image}" alt="${dish.name}" class="customizer-dish-thumb" />
        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--heading-color); margin-bottom: 4px;">${dish.name}</h3>
          <div style="font-size: 16px; font-weight: 800; color: var(--primary);">৳${dish.price.toLocaleString()}</div>
          <p style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">${dish.description}</p>
        </div>
      </div>

      <div class="customizer-section">
        <label class="form-label">Select Spice Heat Level</label>
        <div class="spice-selector-row">
          <button class="spice-btn ${selectedSpice === 0 ? 'selected' : ''}" data-spice="0">
            <span>🟢</span> <span>Shahi Mild</span>
          </button>
          <button class="spice-btn ${selectedSpice === 1 ? 'selected' : ''}" data-spice="1">
            <span>🌶️</span> <span>Dhaka Regular</span>
          </button>
          <button class="spice-btn ${selectedSpice === 2 ? 'selected' : ''}" data-spice="2">
            <span>🔥🔥</span> <span>Naga Fiery</span>
          </button>
        </div>
      </div>

      <div class="customizer-section">
        <label class="form-label">Add-ons & Extras</label>
        <div class="modifiers-list">
          ${availableModifiers.map(mod => `
            <label class="modifier-option">
              <input type="checkbox" class="mod-checkbox" value="${mod.id}" data-name="${mod.name}" data-price="${mod.price}" />
              <div class="modifier-info">
                <span class="mod-name">${mod.name}</span>
                <span class="mod-price">+৳${mod.price}</span>
              </div>
            </label>
          `).join('')}
        </div>
      </div>

      <div class="customizer-footer">
        <div class="stepper-box">
          <button class="btn btn-secondary btn-sm" id="btn-qty-minus">-</button>
          <span id="customizer-qty-val" style="font-weight: 800; font-size: 16px; width: 24px; text-align: center;">1</span>
          <button class="btn btn-secondary btn-sm" id="btn-qty-plus">+</button>
        </div>
        <button class="btn btn-primary" id="btn-confirm-custom-add" style="flex:1;">
          <span>Add to Order • </span>
          <span id="customizer-total-price">৳${dish.price.toLocaleString()}</span>
        </button>
      </div>
    `;

    modal.classList.add('active');

    // Spice selection
    content.querySelectorAll('.spice-btn').forEach(b => {
      b.onclick = (e) => {
        content.querySelectorAll('.spice-btn').forEach(btn => btn.classList.remove('selected'));
        b.classList.add('selected');
        selectedSpice = parseInt(b.dataset.spice);
      };
    });

    // Checkbox selection
    content.querySelectorAll('.mod-checkbox').forEach(cb => {
      cb.onchange = () => {
        selectedModifiers = Array.from(content.querySelectorAll('.mod-checkbox:checked')).map(box => ({
          id: box.value,
          name: box.dataset.name,
          price: parseFloat(box.dataset.price)
        }));
        updatePrice();
      };
    });

    // Steppers
    content.querySelector('#btn-qty-minus').onclick = () => {
      if (quantity > 1) {
        quantity--;
        content.querySelector('#customizer-qty-val').textContent = quantity;
        updatePrice();
      }
    };
    content.querySelector('#btn-qty-plus').onclick = () => {
      quantity++;
      content.querySelector('#customizer-qty-val').textContent = quantity;
      updatePrice();
    };

    // Confirm Add
    content.querySelector('#btn-confirm-custom-add').onclick = () => {
      window.store.addToCart(dish, quantity, selectedModifiers, selectedSpice);
      modal.classList.remove('active');
      window.app.showToast(`Added ${quantity}x ${dish.name} (Customized) to cart!`, 'success');
    };

    modal.querySelector('.modal-close').onclick = () => {
      modal.classList.remove('active');
    };
  }
}

window.MenuComponent = MenuComponent;
