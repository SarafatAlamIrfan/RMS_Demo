/**
 * FlavourCraft Dhaka - Frontend API Client (PHP & MySQL Backend Bridge)
 * Simple, beginner-friendly HTTP fetch client with seamless fallback
 */

class FlavourCraftApiClient {
  constructor(baseUrl = 'api') {
    this.baseUrl = baseUrl;
    this.isServerAvailable = false;
    this._checkServer();
  }

  async _checkServer() {
    try {
      const res = await fetch(`${this.baseUrl}/menu.php`, { method: 'GET' });
      this.isServerAvailable = res.ok;
    } catch (e) {
      this.isServerAvailable = false;
    }
  }

  // --- 1. Authentication ---
  async login(username, password) {
    if (!this.isServerAvailable) {
      // Local fallback
      return window.store.login(username, password);
    }
    try {
      const res = await fetch(`${this.baseUrl}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return await res.json();
    } catch (e) {
      return window.store.login(username, password);
    }
  }

  async registerCustomer(customerData) {
    if (!this.isServerAvailable) {
      return window.store.registerCustomer(customerData);
    }
    try {
      const res = await fetch(`${this.baseUrl}/auth.php?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      return await res.json();
    } catch (e) {
      return window.store.registerCustomer(customerData);
    }
  }

  // --- 2. Menu ---
  async getMenu() {
    if (this.isServerAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/menu.php`);
        const data = await res.json();
        if (data.success && data.menu) return data.menu;
      } catch (e) {}
    }
    return window.store.db.collection('menu').find();
  }

  // --- 3. Orders & KDS ---
  async placeOrder(orderPayload) {
    if (this.isServerAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/orders.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        const data = await res.json();
        if (data.success) {
          window.store.submitOrder(orderPayload);
          return data;
        }
      } catch (e) {}
    }
    return window.store.submitOrder(orderPayload);
  }

  async updateOrderStatus(orderId, newStatus) {
    if (this.isServerAvailable) {
      try {
        await fetch(`${this.baseUrl}/orders.php?action=update_status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: orderId, status: newStatus })
        });
      } catch (e) {}
    }
    return window.store.updateOrderStatus(orderId, newStatus);
  }

  // --- 4. Table Reservations ---
  async createReservation(reservationPayload) {
    if (this.isServerAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/reservations.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reservationPayload)
        });
        const data = await res.json();
        if (data.success) {
          window.store.createReservation(reservationPayload);
          return data;
        }
      } catch (e) {}
    }
    return window.store.createReservation(reservationPayload);
  }

  // --- 5. Inventory Restock ---
  async restockAll() {
    if (this.isServerAvailable) {
      try {
        await fetch(`${this.baseUrl}/inventory.php?action=restock`, { method: 'POST' });
      } catch (e) {}
    }
    return window.store.reorderAllLowStock();
  }
}

window.apiClient = new FlavourCraftApiClient();
