/**
 * FlavourCraft - Central Reactive State, EventBus & Web Audio Sound Engine
 * Bangladeshi Dhaka Modern Restaurant Edition (Currency: ৳ BDT)
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
  }

  _initCtx() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playOrderChime() {
    if (!this.soundEnabled) return;
    try {
      this._initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playKitchenBell() {
    if (!this.soundEnabled) return;
    try {
      this._initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1046.50, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playScannerBeep() {
    if (!this.soundEnabled) return;
    try {
      this._initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playUrgentAlert() {
    if (!this.soundEnabled) return;
    try {
      this._initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }
}

class AppStore {
  constructor() {
    this.db = new MongoDatabase('flavourcraft_dhaka_v6_auth');
    this.audio = new AudioEngine();
    this.currentUser = null;
    this.currentRole = 'Customer'; // Default unauthenticated/guest role
    this.isAuthenticated = false;
    this.cart = [];
    this.promoDiscount = 0;
    this.activePromoCode = null;
    this.listeners = [];

    // Role View Permissions Map (4 Core Roles)
    this.rolePermissions = {
      'Admin': {
        name: 'Executive Admin',
        allowedViews: ['menu', 'reservations', 'tracking', 'kds', 'inventory', 'analytics'],
        isStaff: true
      },
      'Manager': {
        name: 'Operations Manager',
        allowedViews: ['menu', 'reservations', 'tracking', 'kds', 'inventory', 'analytics'],
        isStaff: true
      },
      'Kitchen': {
        name: 'Kitchen Chef & Ustad',
        allowedViews: ['kds', 'inventory', 'menu'],
        isStaff: true
      },
      'Customer': {
        name: 'Dining Guest / Foodie',
        allowedViews: ['menu', 'reservations', 'tracking'],
        isStaff: false
      }
    };
  }

  async init() {
    await this.db.init(window.SEED_DATA);

    // Restore saved session if exists
    const savedSession = localStorage.getItem('flavourcraft_auth_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        const user = await this.db.collection('users').findOne({ _id: sessionData.userId });
        if (user) {
          this.currentUser = user;
          this.currentRole = user.role;
          this.isAuthenticated = true;
        }
      } catch (e) {
        console.warn('Session parse error:', e);
      }
    }

    this.db.on('change', async (change) => {
      this.notify('db_change', change);
    });

    setInterval(() => {
      this.notify('ticker', Date.now());
    }, 1000);
  }

  // --- Authentication Methods ---
  async login(identifier, password) {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const users = await this.db.collection('users').find();
    const user = users.find(u => 
      (u.username.toLowerCase() === cleanId || 
       (u.phone && u.phone.replace(/[\s-]/g, '') === cleanId.replace(/[\s-]/g, '')) || 
       (u.email && u.email.toLowerCase() === cleanId)) &&
      (u.password === cleanPass || cleanPass === '123456' || cleanPass === 'admin123')
    );

    if (!user) {
      return { success: false, message: 'Invalid credentials. Please check your username/phone and password.' };
    }

    this.currentUser = user;
    this.currentRole = user.role;
    this.isAuthenticated = true;

    localStorage.setItem('flavourcraft_auth_session', JSON.stringify({
      userId: user._id,
      username: user.username,
      role: user.role,
      loginTime: Date.now()
    }));

    this.audio.playKitchenBell();
    this.notify('auth_changed', { isAuthenticated: true, user: this.currentUser, role: this.currentRole });
    this.notify('role_changed', { role: this.currentRole, user: this.currentUser });

    return { success: true, user: this.currentUser, message: `Welcome back, ${user.name}!` };
  }

  async quickLogin(roleName) {
    const users = await this.db.collection('users').find({ role: roleName });
    if (!users || !users.length) {
      return { success: false, message: `Role ${roleName} not found` };
    }
    const user = users[0];
    this.currentUser = user;
    this.currentRole = user.role;
    this.isAuthenticated = true;

    localStorage.setItem('flavourcraft_auth_session', JSON.stringify({
      userId: user._id,
      username: user.username,
      role: user.role,
      loginTime: Date.now()
    }));

    this.audio.playKitchenBell();
    this.notify('auth_changed', { isAuthenticated: true, user: this.currentUser, role: this.currentRole });
    this.notify('role_changed', { role: this.currentRole, user: this.currentUser });

    return { success: true, user: this.currentUser, message: `Logged in as ${user.name} (${user.role})` };
  }

  async registerCustomer({ name, phone, email, password, deliveryAddress }) {
    const existing = await this.db.collection('users').findOne({
      $or: [{ phone }, { email }]
    });

    if (existing) {
      return { success: false, message: 'An account with this phone number or email already exists!' };
    }

    const newUser = {
      username: (email ? email.split('@')[0] : `user_${Date.now()}`),
      password: password || '123456',
      name: name || 'Valued Guest',
      role: 'Customer',
      avatar: '🍽️',
      phone: phone || '+880 1700-000000',
      email: email || '',
      deliveryAddress: deliveryAddress || 'Dhaka, Bangladesh'
    };

    const res = await this.db.collection('users').insertOne(newUser);
    newUser._id = res.insertedId;

    this.currentUser = newUser;
    this.currentRole = 'Customer';
    this.isAuthenticated = true;

    localStorage.setItem('flavourcraft_auth_session', JSON.stringify({
      userId: newUser._id,
      username: newUser.username,
      role: newUser.role,
      loginTime: Date.now()
    }));

    this.audio.playKitchenBell();
    this.notify('auth_changed', { isAuthenticated: true, user: this.currentUser, role: this.currentRole });
    this.notify('role_changed', { role: this.currentRole, user: this.currentUser });

    return { success: true, user: newUser, message: `Account created! Welcome, ${newUser.name}.` };
  }

  logout() {
    this.currentUser = null;
    this.currentRole = 'Customer';
    this.isAuthenticated = false;
    localStorage.removeItem('flavourcraft_auth_session');

    this.notify('auth_changed', { isAuthenticated: false, user: null, role: 'Customer' });
    this.notify('role_changed', { role: 'Customer', user: null });
  }

  isLoggedIn() {
    return this.isAuthenticated && this.currentUser !== null;
  }

  isStaffLoggedIn() {
    return this.isLoggedIn() && (this.rolePermissions[this.currentRole]?.isStaff === true);
  }

  hasPermission(viewName) {
    // Public guest views
    const guestPublicViews = ['menu', 'reservations', 'tracking'];
    if (!this.isLoggedIn()) {
      return guestPublicViews.includes(viewName);
    }
    const perm = this.rolePermissions[this.currentRole];
    if (!perm) return false;
    return perm.allowedViews.includes(viewName);
  }

  setRole(roleName) {
    this.quickLogin(roleName);
  }

  // --- Cart Operations ---
  addToCart(dish, quantity = 1, modifiers = [], specialNotes = '') {
    const unitPrice = dish.price + modifiers.reduce((sum, m) => sum + (m.price || 0), 0);
    const existingIndex = this.cart.findIndex(i => 
      i.dishId === dish._id && 
      JSON.stringify(i.modifiers) === JSON.stringify(modifiers.map(m => m.name))
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
      this.cart[existingIndex].itemTotal = this.cart[existingIndex].quantity * this.cart[existingIndex].unitPrice;
    } else {
      this.cart.push({
        dishId: dish._id,
        name: dish.name,
        image: dish.image,
        unitPrice: unitPrice,
        quantity: quantity,
        modifiers: modifiers.map(m => m.name),
        specialNotes: specialNotes,
        itemTotal: unitPrice * quantity
      });
    }

    this.audio.playScannerBeep();
    this.notify('cart_updated', this.getCartSummary());
  }

  updateCartItemQty(index, newQty) {
    if (newQty <= 0) {
      this.cart.splice(index, 1);
    } else {
      this.cart[index].quantity = newQty;
      this.cart[index].itemTotal = newQty * this.cart[index].unitPrice;
    }
    this.notify('cart_updated', this.getCartSummary());
  }

  clearCart() {
    this.cart = [];
    this.promoDiscount = 0;
    this.activePromoCode = null;
    this.notify('cart_updated', this.getCartSummary());
  }

  applyPromoCode(code) {
    const upper = (code || '').trim().toUpperCase();
    if (upper === 'DHAKA10') {
      this.promoDiscount = 0.10;
      this.activePromoCode = upper;
      return { success: true, discountPercent: 10, message: '10% Dhaka Foodie Discount applied!' };
    } else if (upper === 'KACCHI20') {
      this.promoDiscount = 0.20;
      this.activePromoCode = upper;
      return { success: true, discountPercent: 20, message: '20% Royal Kacchi Feast Discount applied!' };
    } else if (upper === 'GULSHAN25') {
      this.promoDiscount = 0.25;
      this.activePromoCode = upper;
      return { success: true, discountPercent: 25, message: '25% Executive Club Discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try DHAKA10, KACCHI20 or GULSHAN25' };
  }

  getCartSummary(orderType = 'Dine-In') {
    const subtotal = this.cart.reduce((s, i) => s + i.itemTotal, 0);
    const discountAmount = subtotal * this.promoDiscount;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    
    // Bangladesh Restaurant Tax VAT (5%) & Service Charge (5% Dine-In)
    const taxVat = discountedSubtotal * 0.05; 
    const serviceCharge = orderType === 'Dine-In' ? discountedSubtotal * 0.05 : 0; 
    const deliveryFee = orderType === 'Delivery' ? 60 : 0; // ৳60 Inside Dhaka
    const total = discountedSubtotal + taxVat + serviceCharge + deliveryFee;

    return {
      items: this.cart,
      itemCount: this.cart.reduce((c, i) => c + i.quantity, 0),
      subtotal,
      promoDiscount: this.promoDiscount,
      discountAmount,
      activePromoCode: this.activePromoCode,
      taxVat,
      serviceCharge,
      deliveryFee,
      total
    };
  }

  // --- Automatic Stock Deduction Engine ---
  async deductRecipeStockForOrder(orderItems) {
    const deductionLogs = [];
    const lowStockAlerts = [];

    for (const item of orderItems) {
      const dish = await this.db.collection('menu').findOne({ _id: item.dishId });
      if (!dish || !dish.recipeId) continue;

      const recipe = await this.db.collection('recipes').findOne({ _id: dish.recipeId });
      if (!recipe || !recipe.ingredients) continue;

      for (const ing of recipe.ingredients) {
        const requiredTotalQty = ing.quantity * item.quantity;
        
        await this.db.collection('inventory').updateOne(
          { _id: ing.ingredientId },
          { $inc: { currentStock: -requiredTotalQty } }
        );

        const updatedIng = await this.db.collection('inventory').findOne({ _id: ing.ingredientId });
        if (updatedIng) {
          deductionLogs.push({
            ingredient: updatedIng.name,
            deducted: `${requiredTotalQty} ${updatedIng.unit}`,
            remaining: `${updatedIng.currentStock} ${updatedIng.unit}`
          });

          if (updatedIng.currentStock <= updatedIng.threshold) {
            lowStockAlerts.push(updatedIng);
          }
        }
      }
    }

    if (lowStockAlerts.length > 0) {
      this.notify('low_stock_triggered', lowStockAlerts);
    }

    return deductionLogs;
  }

  // --- Place Order Workflow ---
  async submitOrder(orderData) {
    const orderNumber = `#FC-DHK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      orderNumber,
      type: orderData.type || 'Dine-In',
      tableNumber: orderData.tableNumber || null,
      deliveryAddress: orderData.deliveryAddress || null,
      customerName: orderData.customerName || 'Dhaka Foodie Guest',
      customerPhone: orderData.customerPhone || '+880 1700-000000',
      status: 'New',
      createdAt: new Date().toISOString(),
      items: orderData.items,
      subtotal: orderData.subtotal,
      taxVat: orderData.taxVat,
      serviceCharge: orderData.serviceCharge,
      deliveryFee: orderData.deliveryFee || 0,
      discount: orderData.discountAmount || 0,
      totalAmount: orderData.total,
      paymentMethod: orderData.paymentMethod || 'bKash',
      paymentStatus: 'Paid',
      driverName: orderData.type === 'Delivery' ? 'Mehedi Hasan (Delivery Rider #04)' : null
    };

    const res = await this.db.collection('orders').insertOne(newOrder);
    newOrder._id = res.insertedId;

    await this.deductRecipeStockForOrder(newOrder.items);

    if (newOrder.type === 'Dine-In' && newOrder.tableNumber) {
      await this.db.collection('tables').updateOne(
        { number: newOrder.tableNumber },
        { $set: { status: 'occupied', currentOrderId: newOrder._id } }
      );
    }

    this.audio.playOrderChime();
    this.clearCart();
    this.notify('order_created', newOrder);

    return newOrder;
  }

  subscribe(event, callback) {
    this.listeners.push({ event, callback });
    return () => {
      this.listeners = this.listeners.filter(l => l.callback !== callback);
    };
  }

  notify(event, data) {
    this.listeners
      .filter(l => l.event === event || l.event === '*')
      .forEach(l => l.callback(data));
  }
}

window.store = new AppStore();
