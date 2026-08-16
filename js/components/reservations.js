/**
 * FlavourCraft - Table Reservation System Component
 * Bangladeshi Dhaka Modern Restaurant Edition (Prices in ৳ BDT)
 */

class ReservationsComponent {
  constructor() {
    this.selectedPartySize = 2;
    this.selectedSeating = 'Gulshan Dining Hall';
    this.selectedTimeSlot = '20:00';
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  async render() {
    const container = document.getElementById('view-reservations');
    if (!container) return;

    const timeSlots = [
      { time: '13:00', label: '1:00 PM (Lunch)', isPeak: false },
      { time: '14:30', label: '2:30 PM', isPeak: false },
      { time: '18:00', label: '6:00 PM (Evening)', isPeak: false },
      { time: '19:30', label: '7:30 PM', isPeak: true },
      { time: '20:00', label: '8:00 PM (Dinner)', isPeak: true },
      { time: '20:30', label: '8:30 PM (Peak)', isPeak: true },
      { time: '21:00', label: '9:00 PM (Peak)', isPeak: true },
      { time: '22:00', label: '10:00 PM (Late)', isPeak: false }
    ];

    container.innerHTML = `
      <div class="reservation-container">
        <div class="reservation-hero">
          <h1>Reserve Your Dining Table</h1>
          <p>Experience Dhaka's premier modern culinary destination. Book your banquet or intimate dinner in seconds.</p>
        </div>

        <div class="reservation-grid">
          <!-- Reservation Form -->
          <div class="glass-card">
            <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 20px;">1. Select Date & Party Size</h3>
            
            <div class="form-row" style="margin-bottom: 20px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Reservation Date</label>
                <input type="date" class="form-input" id="res-date" value="${this.selectedDate}" min="${new Date().toISOString().split('T')[0]}" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Number of Guests</label>
              <div class="party-size-chips" id="party-size-chips">
                ${[1, 2, 4, 6, 8, 12].map(size => `
                  <div class="party-chip ${this.selectedPartySize === size ? 'selected' : ''}" data-size="${size}">
                    ${size} ${size === 1 ? 'Guest' : 'Guests'}
                  </div>
                `).join('')}
              </div>
            </div>

            <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px;">2. Seating Zone Preference</h3>
            <div class="seating-preference-grid" id="seating-preference-grid">
              <div class="seating-card ${this.selectedSeating === 'Gulshan Dining Hall' ? 'selected' : ''}" data-seating="Gulshan Dining Hall">
                <span class="seating-icon">🍽️</span>
                <span class="seating-name">Gulshan Dining Hall</span>
                <span class="seating-desc">Central luxurious dining with ambient mood chandeliers.</span>
              </div>
              <div class="seating-card ${this.selectedSeating === 'Banani Skyline Lounge' ? 'selected' : ''}" data-seating="Banani Skyline Lounge">
                <span class="seating-icon">🏙️</span>
                <span class="seating-name">Banani Skyline Lounge</span>
                <span class="seating-desc">Floor-to-ceiling glass panoramic Dhaka city skyline view.</span>
              </div>
              <div class="seating-card ${this.selectedSeating === 'Garden Terrace Patio' ? 'selected' : ''}" data-seating="Garden Terrace Patio">
                <span class="seating-icon">🌿</span>
                <span class="seating-name">Garden Terrace Patio</span>
                <span class="seating-desc">Open air lush green terrace with fountain lighting.</span>
              </div>
              <div class="seating-card ${this.selectedSeating === 'Nawab VIP Private Salon' ? 'selected' : ''}" data-seating="Nawab VIP Private Salon">
                <span class="seating-icon">👑</span>
                <span class="seating-name">Nawab VIP Private Salon</span>
                <span class="seating-desc">Dedicated royal butler service & bespoke Kacchi banquet.</span>
              </div>
            </div>

            <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px;">3. Preferred Time Slot</h3>
            <div class="time-slots-grid" id="time-slots-grid">
              ${timeSlots.map(slot => `
                <div class="time-slot-btn ${this.selectedTimeSlot === slot.time ? 'selected' : ''}" data-time="${slot.time}" data-peak="${slot.isPeak}">
                  ${slot.label} ${slot.isPeak ? '🔥' : ''}
                </div>
              `).join('')}
            </div>

            <div class="peak-deposit-alert" id="peak-deposit-alert" style="display: ${this._isCurrentSlotPeak() ? 'flex' : 'none'};">
              <i>⚡</i>
              <div>
                <strong>Dhaka Dinner Rush Notice:</strong>
                <p>A ৳500 refundable deposit secures your table during peak dinner hours (7:30 PM – 9:30 PM).</p>
              </div>
            </div>

            <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px;">4. Guest Contact</h3>
            <form id="reservation-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Full Name *</label>
                  <input type="text" class="form-input" id="res-name" placeholder="e.g. Asif Rahman" value="${window.store.currentUser ? window.store.currentUser.name : ''}" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Mobile Number (For SMS Confirmation) *</label>
                  <input type="tel" class="form-input" id="res-phone" placeholder="+880 1711-XXXXXX" value="${window.store.currentUser ? (window.store.currentUser.phone || '') : ''}" required />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address (For e-Pass & QR) *</label>
                <input type="email" class="form-input" id="res-email" placeholder="asif@dhaka.com" value="${window.store.currentUser ? (window.store.currentUser.email || '') : ''}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Special Requests (Occasion, Dietary, Birthday)</label>
                <textarea class="form-textarea" id="res-notes" rows="2" placeholder="Birthday celebration, high chair, extra Borhani setup..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
                <span>✨ Confirm & Generate e-Pass</span>
              </button>
            </form>
          </div>

          <!-- Real-Time Reservation Pass Preview -->
          <div>
            <div class="reservation-pass-card" id="reservation-pass-preview">
              <div class="pass-header">
                <div>
                  <span style="font-size: 11px; text-transform: uppercase; color: var(--primary); font-weight: 800;">FlavourCraft Dhaka Guest Pass</span>
                  <div class="pass-code" id="pass-code">FC-DHK-PENDING</div>
                </div>
                <div class="badge badge-amber" id="pass-status">HOLDING</div>
              </div>
              <div class="pass-body">
                <div class="pass-row">
                  <span class="pass-label">Guest</span>
                  <span class="pass-val" id="pass-name">Your Name</span>
                </div>
                <div class="pass-row">
                  <span class="pass-label">Date & Time</span>
                  <span class="pass-val" id="pass-datetime">${this.selectedDate} @ ${this.selectedTimeSlot}</span>
                </div>
                <div class="pass-row">
                  <span class="pass-label">Party Size</span>
                  <span class="pass-val" id="pass-guests">${this.selectedPartySize} Guests</span>
                </div>
                <div class="pass-row">
                  <span class="pass-label">Seating Zone</span>
                  <span class="pass-val" id="pass-seating">${this.selectedSeating}</span>
                </div>
                <div class="pass-row">
                  <span class="pass-label">Deposit Required</span>
                  <span class="pass-val" id="pass-deposit" style="color: var(--primary-light);">৳${this._isCurrentSlotPeak() ? '500' : '0'}</span>
                </div>
              </div>
              <div class="pass-qr-container">
                <div class="pass-qr-mock">
                  <svg viewBox="0 0 100 100" width="80" height="80">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="25" height="25" fill="black" />
                    <rect x="15" y="15" width="15" height="15" fill="white" />
                    <rect x="18" y="18" width="9" height="9" fill="black" />
                    <rect x="65" y="10" width="25" height="25" fill="black" />
                    <rect x="70" y="15" width="15" height="15" fill="white" />
                    <rect x="73" y="18" width="9" height="9" fill="black" />
                    <rect x="10" y="65" width="25" height="25" fill="black" />
                    <rect x="15" y="70" width="15" height="15" fill="white" />
                    <rect x="18" y="73" width="9" height="9" fill="black" />
                    <circle cx="50" cy="50" r="10" fill="black" />
                    <rect x="40" y="20" width="6" height="20" fill="black" />
                    <rect x="55" y="60" width="20" height="8" fill="black" />
                    <rect x="70" y="45" width="12" height="12" fill="black" />
                  </svg>
                </div>
                <span style="font-size: 11px; color: var(--text-muted);">Instant SMS & Email Confirmation with QR Entry</span>
              </div>
            </div>

            <!-- Existing Bookings Table -->
            <div class="glass-card" style="margin-top: 24px;">
              <h4 style="color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 12px;">Recent Confirmed Bookings (Dhaka)</h4>
              <div id="recent-reservations-list" style="display: flex; flex-direction: column; gap: 8px;">
                <!-- Populated dynamically -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this._attachEvents();
    this._loadRecentReservations();
  }

  _isCurrentSlotPeak() {
    return ['19:30', '20:00', '20:30', '21:00'].includes(this.selectedTimeSlot);
  }

  _attachEvents() {
    document.querySelectorAll('#party-size-chips .party-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#party-size-chips .party-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        this.selectedPartySize = parseInt(chip.dataset.size);
        document.getElementById('pass-guests').textContent = `${this.selectedPartySize} Guests`;
      });
    });

    document.querySelectorAll('#seating-preference-grid .seating-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('#seating-preference-grid .seating-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedSeating = card.dataset.seating;
        document.getElementById('pass-seating').textContent = this.selectedSeating;
      });
    });

    document.querySelectorAll('#time-slots-grid .time-slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#time-slots-grid .time-slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedTimeSlot = btn.dataset.time;
        const isPeak = btn.dataset.peak === 'true';
        document.getElementById('peak-deposit-alert').style.display = isPeak ? 'flex' : 'none';
        document.getElementById('pass-deposit').textContent = `৳${isPeak ? '500' : '0'}`;
        document.getElementById('pass-datetime').textContent = `${this.selectedDate} @ ${this.selectedTimeSlot}`;
      });
    });

    const dateInput = document.getElementById('res-date');
    if (dateInput) {
      dateInput.addEventListener('change', () => {
        this.selectedDate = dateInput.value;
        document.getElementById('pass-datetime').textContent = `${this.selectedDate} @ ${this.selectedTimeSlot}`;
      });
    }

    const nameInput = document.getElementById('res-name');
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        document.getElementById('pass-name').textContent = nameInput.value || 'Your Name';
      });
    }

    const form = document.getElementById('reservation-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const guestName = document.getElementById('res-name').value.trim();
        const guestPhone = document.getElementById('res-phone').value.trim();
        const guestEmail = document.getElementById('res-email').value.trim();
        const specialRequest = document.getElementById('res-notes').value.trim();
        const bookingCode = `FC-DHK-${Math.floor(1000 + Math.random() * 9000)}`;
        const isPeak = this._isCurrentSlotPeak();

        const newRes = {
          bookingCode,
          guestName,
          guestPhone,
          guestEmail,
          partySize: this.selectedPartySize,
          date: this.selectedDate,
          timeSlot: this.selectedTimeSlot,
          tablePreference: this.selectedSeating,
          depositPaid: isPeak ? 500 : 0,
          status: 'Confirmed',
          specialRequest
        };

        await window.store.db.collection('reservations').insertOne(newRes);

        document.getElementById('pass-code').textContent = bookingCode;
        const statusBadge = document.getElementById('pass-status');
        statusBadge.className = 'badge badge-success';
        statusBadge.textContent = 'CONFIRMED ✓';

        window.store.audio.playKitchenBell();
        window.app.showToast(`🎉 Reservation confirmed! Booking ID ${bookingCode}. SMS sent to ${guestPhone}`, 'success');
        
        form.reset();
        this._loadRecentReservations();
      });
    }
  }

  async _loadRecentReservations() {
    const list = document.getElementById('recent-reservations-list');
    if (!list) return;

    const resList = await window.store.db.collection('reservations').find({}, { sort: { createdAt: -1 }, limit: 4 });
    list.innerHTML = resList.map(r => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); font-size: 12.5px;">
        <div>
          <strong style="color: #fff;">${r.guestName}</strong> (${r.partySize}p)
          <div style="font-size: 11px; color: var(--text-muted);">${r.date} @ ${r.timeSlot} • ${r.tablePreference}</div>
        </div>
        <span class="badge badge-success" style="font-size: 10px;">${r.bookingCode}</span>
      </div>
    `).join('');
  }
}

window.ReservationsComponent = ReservationsComponent;
