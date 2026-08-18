/**
 * FlavourCraft - Digital Interactive Menu Component
 * Hero Banner: "Experience the True Taste of Dhaka!"
 * Chef's Special Recommendations + Full Catalog in ৳ BDT
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
    const chefSpecials = dishes.filter(d => 
      ['dish_01', 'dish_04', 'dish_06', 'dish_07', 'dish_08'].includes(d._id)
    );

    const categories = [
      'All',
      'Kacchi & Biryani',
      'Beef, Mutton & Chicken',
      'Fish & Seafood',
      'Kabab & Street Food',
      'Drinks & Desserts'
    ];

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
            <p class="section-sub-title">Signature royal recipes perfected by Head Chef Rony and Managing Director Sadia Islam Dia</p>
          </div>
        </div>

        <div class="specials-grid">
          ${chefSpecials.map(dish => this._renderSpecialCard(dish)).join('')}
        </div>
      </div>

      <!-- Full Menu Catalog Section -->
      <div class="menu-catalog-section" id="menu-catalog-section">
        <div class="section-header-row" style="margin-top: 40px;">
          <div class="section-title-box">
            <h2 class="section-main-title">Explore Our Full Menu</h2>
            <p class="section-sub-title">Authentic dishes prepared fresh with Baghabari pure ghee, tender Bengal meats & wild spices</p>
          </div>
        </div>

        <!-- Categories Navigation -->
        <div class="category-filter-bar" id="category-filter-bar">
          ${categories.map(cat => `
            <button class="category-pill ${this.activeCategory === cat ? 'active' : ''}" data-category="${cat}">
              ${this._getCategoryIcon(cat)} ${cat}
            </button>
          `).join('')}
        </div>

        <!-- Dietary Filters Row -->
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
      </div>
    `;

    this._attachEvents();
  }

  _renderSpecialCard(dish) {
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
        </div>
      </div>
    `;
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
        const matchSku = dish.sku && dish.sku.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchSku) return false;
      }
      return true;
    });
  }

  _renderDishCards(dishes) {
    const filtered = this._filterDishes(dishes);
    if (filtered.length === 0) {
      return `
        <div class="empty-menu-state" style="grid-column: 1/-1; text-align:center; padding: 40px;">
          <span style="font-size: 40px;">🍲</span>
          <h3 style="margin-top: 10px; color: var(--text-primary);">No dishes found</h3>
          <p style="color: var(--text-muted); font-size: 13px;">Try adjusting your search query or dietary filters</p>
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

    // Category filter click
    document.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.category;
        this.activeCategory = cat;
        this.render();
      });
    });

    // Dietary filter toggle
    document.querySelectorAll('.dietary-tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tag = e.currentTarget.dataset.dietary;
        if (this.activeDietary.includes(tag)) {
          this.activeDietary = this.activeDietary.filter(t => t !== tag);
        } else {
          this.activeDietary.push(tag);
        }
        this.render();
      });
    });

    // Global Search listener from topbar
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        const grid = document.getElementById('dishes-grid');
        if (grid) {
          window.store.db.collection('menu').find().then(dishes => {
            grid.innerHTML = this._renderDishCards(dishes);
            this._rebindCardButtons();
          });
        }
      };
    }

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
  }

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
          <h3 style="font-size: 18px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">${dish.name}</h3>
          <div style="font-size: 16px; font-weight: 800; color: var(--primary);">৳${dish.price.toLocaleString()}</div>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${dish.description}</p>
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
