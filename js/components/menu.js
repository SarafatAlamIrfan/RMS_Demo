/**
 * FlavourCraft - Digital Interactive Menu Component
 * Bangladeshi Modern Dhaka Restaurant Edition (Prices in ৳ BDT)
 */

class MenuComponent {
  constructor() {
    this.activeCategory = 'All';
    this.activeDietary = [];
    this.searchQuery = '';
    this.customizingDish = null;
  }

  async render() {
    const container = document.getElementById('view-menu');
    if (!container) return;

    const dishes = await window.store.db.collection('menu').find();
    const categories = [
      'All',
      'Kacchi & Biryani',
      'Beef, Mutton & Chicken',
      'Fish & Seafood',
      'Kabab & Street Food',
      'Drinks & Desserts'
    ];

    container.innerHTML = `
      <div class="menu-header-banner">
        <h1>Bangladeshi Traditional & Modern Feast</h1>
        <p>Beloved authentic Dhaka dishes, royal Kacchi, flavorful beef kala bhuna, Padma river Hilsha, street-style crispy fuchka, and refreshing Borhani.</p>
      </div>

      <!-- Categories Navigation -->
      <div class="category-filter-bar" id="category-filter-bar">
        ${categories.map(cat => `
          <button class="category-pill ${this.activeCategory === cat ? 'active' : ''}" data-category="${cat}">
            ${this._getCategoryIcon(cat)} ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Filters & Search Controls -->
      <div class="menu-controls-row">
        <div class="dietary-tags-row">
          <button class="dietary-tag-btn ${this.activeDietary.includes('Spicy') ? 'active spicy' : ''}" data-dietary="Spicy">
            🌶️ Naga Spicy
          </button>
          <button class="dietary-tag-btn ${this.activeDietary.includes('Vegetarian') ? 'active' : ''}" data-dietary="Vegetarian">
            🌱 Vegetarian
          </button>
          <button class="dietary-tag-btn ${this.activeDietary.includes('Vegan') ? 'active' : ''}" data-dietary="Vegan">
            🌿 Vegan
          </button>
          <button class="dietary-tag-btn ${this.activeDietary.includes('100% Halal') || this.activeDietary.includes('Halal') ? 'active halal' : ''}" data-dietary="100% Halal">
            ✨ 100% Halal
          </button>
          <button class="dietary-tag-btn ${this.activeDietary.includes('Gluten-Free') ? 'active' : ''}" data-dietary="Gluten-Free">
            🌾 Gluten-Free
          </button>
        </div>
      </div>

      <!-- Dishes Grid -->
      <div class="menu-grid" id="dishes-grid">
        ${this._renderDishCards(dishes)}
      </div>
    `;

    this._attachEvents();
  }

  _getCategoryIcon(cat) {
    const icons = {
      'All': '✨',
      'Kacchi & Biryani': '🍚',
      'Beef, Mutton & Chicken': '🥩',
      'Fish & Seafood': '🐟',
      'Kabab & Street Food': '🍢',
      'Drinks & Desserts': '🍮'
    };
    return icons[cat] || '🍽️';
  }

  _filterDishes(dishes) {
    return dishes.filter(dish => {
      if (this.activeCategory !== 'All' && dish.category !== this.activeCategory) {
        return false;
      }
      if (this.activeDietary.length > 0) {
        const hasAllTags = this.activeDietary.every(tag => {
          if (tag === 'Spicy') return dish.spiceLevel > 0;
          return dish.tags && dish.tags.includes(tag);
        });
        if (!hasAllTags) return false;
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchName = dish.name.toLowerCase().includes(q);
        const matchDesc = dish.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }

  _renderDishCards(dishes) {
    const filtered = this._filterDishes(dishes);
    if (filtered.length === 0) {
      return `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
          <h3 style="color: #fff; font-size: 20px; margin-bottom: 6px;">No Bengali Dishes Found</h3>
          <p style="color: var(--text-muted); font-size: 14px;">Try selecting another category or resetting filters.</p>
        </div>
      `;
    }

    return filtered.map(dish => `
      <div class="menu-card" data-dish-id="${dish._id}">
        <div class="menu-card-img-wrap">
          <img src="${dish.image}" alt="${dish.name}" class="menu-card-img" loading="lazy" />
          <div class="menu-card-badge-container">
            ${(dish.tags || []).map(t => `<span class="badge ${t === 'Vegetarian' || t === 'Vegan' ? 'badge-success' : 'badge-amber'}">${t}</span>`).join('')}
          </div>
          <button class="menu-card-fav-btn" title="Add to favorites">♥</button>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-header">
            <h3 class="menu-card-title">${dish.name}</h3>
            <span class="menu-card-price">৳${dish.price.toLocaleString()}</span>
          </div>
          <p class="menu-card-desc">${dish.description}</p>
          <div class="menu-card-footer">
            <div class="spice-meter">
              ${dish.spiceLevel > 0 ? '🌶️'.repeat(dish.spiceLevel) + ` <span style="font-size:10px; color:var(--text-muted);">${dish.spiceLevel === 3 ? '(Naga Hot)' : dish.spiceLevel === 2 ? '(Medium)' : '(Mild)'}</span>` : '<span style="color: var(--text-muted); font-size: 11px;">⏱️ ' + dish.prepTimeMinutes + 'm prep</span>'}
            </div>
            <button class="add-btn customize-btn" data-dish-id="${dish._id}">
              <span>+ Customize</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  _attachEvents() {
    document.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.dataset.category;
        document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._updateGrid();
      });
    });

    document.querySelectorAll('.dietary-tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.dietary;
        if (this.activeDietary.includes(tag)) {
          this.activeDietary = this.activeDietary.filter(t => t !== tag);
          btn.classList.remove('active');
        } else {
          this.activeDietary.push(tag);
          btn.classList.add('active');
        }
        this._updateGrid();
      });
    });

    document.querySelectorAll('.customize-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dishId = btn.dataset.dishId;
        this.openCustomizer(dishId);
      });
    });
  }

  async _updateGrid() {
    const dishes = await window.store.db.collection('menu').find();
    const grid = document.getElementById('dishes-grid');
    if (grid) {
      grid.innerHTML = this._renderDishCards(dishes);
      grid.querySelectorAll('.customize-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const dishId = btn.dataset.dishId;
          this.openCustomizer(dishId);
        });
      });
    }
  }

  setSearchQuery(q) {
    this.searchQuery = q;
    this._updateGrid();
  }

  async openCustomizer(dishId) {
    const dish = await window.store.db.collection('menu').findOne({ _id: dishId });
    if (!dish) return;

    this.customizingDish = dish;
    const modal = document.getElementById('modal-customizer');
    const body = document.getElementById('customizer-modal-content');
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="customizer-item-preview">
        <img src="${dish.image}" alt="${dish.name}" class="customizer-img" />
        <div class="customizer-meta">
          <h3>${dish.name}</h3>
          <p>${dish.description}</p>
          <div style="font-size: 20px; font-weight: 800; color: var(--primary-light);" id="customizer-base-price">
            Base: ৳${dish.price.toLocaleString()}
          </div>
        </div>
      </div>

      <!-- Modifiers in Taka -->
      <div class="customizer-section-title">Dhaka Chef Customizations & Sides</div>
      <div class="modifier-options-grid">
        <label class="modifier-option">
          <div>
            <input type="checkbox" class="mod-checkbox" data-name="Extra Spiced Biryani Aloo" data-price="60" />
            <span>Extra Biryani Aloo</span>
          </div>
          <span class="modifier-price">+৳60</span>
        </label>
        <label class="modifier-option">
          <div>
            <input type="checkbox" class="mod-checkbox" data-name="Chilled Smoked Borhani (Cup)" data-price="80" />
            <span>Borhani Glass</span>
          </div>
          <span class="modifier-price">+৳80</span>
        </label>
        <label class="modifier-option">
          <div>
            <input type="checkbox" class="mod-checkbox" data-name="Crispy Mutton Jali Kabab" data-price="140" />
            <span>Mutton Jali Kabab</span>
          </div>
          <span class="modifier-price">+৳140</span>
        </label>
        <label class="modifier-option">
          <div>
            <input type="checkbox" class="mod-checkbox" data-name="Sylheti Naga Morich Fire Dip" data-price="50" />
            <span>Naga Fire Dip</span>
          </div>
          <span class="modifier-price">+৳50</span>
        </label>
      </div>

      <!-- Spice Level Preference -->
      <div class="customizer-section-title">Spice Heat Level</div>
      <div style="display: flex; gap: 10px; margin-bottom: 16px;">
        <label class="party-chip selected" style="padding: 8px 14px; font-size: 13px;">
          <input type="radio" name="cust-spice" value="Mild / Shahi" checked style="display:none;" /> Shahi Mild
        </label>
        <label class="party-chip" style="padding: 8px 14px; font-size: 13px;">
          <input type="radio" name="cust-spice" value="Dhaka Standard 🌶️" style="display:none;" /> 🌶️ Dhaka Regular
        </label>
        <label class="party-chip" style="padding: 8px 14px; font-size: 13px;">
          <input type="radio" name="cust-spice" value="Naga Extreme 🔥" style="display:none;" /> 🌶️🔥 Naga Fiery
        </label>
      </div>

      <!-- Special Chef Instructions -->
      <div class="form-group">
        <label class="form-label">Chef Instructions / Notes</label>
        <input type="text" class="form-input" id="cust-special-notes" placeholder="e.g. Extra beresta, less mustard, more lime..." />
      </div>

      <!-- Quantity & Total -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border-subtle); margin-top: 16px;">
        <div class="quantity-stepper">
          <button class="stepper-btn" id="stepper-dec">−</button>
          <span class="stepper-val" id="cust-quantity">1</span>
          <button class="stepper-btn" id="stepper-inc">+</button>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 12px; color: var(--text-muted);">Total Price</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--primary-light);" id="cust-live-total">
            ৳${dish.price.toLocaleString()}
          </div>
        </div>
      </div>
    `;

    body.querySelectorAll('input[name="cust-spice"]').forEach(radio => {
      radio.closest('.party-chip').addEventListener('click', function() {
        body.querySelectorAll('input[name="cust-spice"]').forEach(r => r.closest('.party-chip').classList.remove('selected'));
        this.classList.add('selected');
        radio.checked = true;
      });
    });

    let quantity = 1;
    const calcTotal = () => {
      let modsTotal = 0;
      body.querySelectorAll('.mod-checkbox:checked').forEach(cb => {
        modsTotal += parseFloat(cb.dataset.price);
      });
      const total = (dish.price + modsTotal) * quantity;
      document.getElementById('cust-live-total').textContent = `৳${total.toLocaleString()}`;
    };

    body.querySelectorAll('.mod-checkbox').forEach(cb => {
      cb.addEventListener('change', calcTotal);
    });

    body.querySelector('#stepper-inc').addEventListener('click', () => {
      quantity++;
      body.querySelector('#cust-quantity').textContent = quantity;
      calcTotal();
    });

    body.querySelector('#stepper-dec').addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        body.querySelector('#cust-quantity').textContent = quantity;
        calcTotal();
      }
    });

    document.getElementById('btn-add-to-cart-confirm').onclick = () => {
      const selectedMods = [];
      body.querySelectorAll('.mod-checkbox:checked').forEach(cb => {
        selectedMods.push({ name: cb.dataset.name, price: parseFloat(cb.dataset.price) });
      });

      const selectedSpice = body.querySelector('input[name="cust-spice"]:checked')?.value || 'Standard';
      if (selectedSpice !== 'Mild / Shahi') {
        selectedMods.push({ name: `Spice: ${selectedSpice}`, price: 0 });
      }

      const notes = body.querySelector('#cust-special-notes').value.trim();

      window.store.addToCart(dish, quantity, selectedMods, notes);
      window.app.closeModal('modal-customizer');
      window.app.showToast(`Added ${quantity}x ${dish.name} to order (৳${((dish.price + selectedMods.reduce((s,m)=>s+m.price,0))*quantity).toLocaleString()})`, 'success');
    };

    window.app.openModal('modal-customizer');
  }
}

window.MenuComponent = MenuComponent;
