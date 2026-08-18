/**
 * FlavourCraft - Table Reservation System Component
 * Theme: Light Mode (Pinkish Red & Saffron Palette)
 * Single Restaurant Floor Specification (Prices in ৳ BDT)
 */

class ReservationsComponent {
  constructor() {
    this.selectedPartySize = 2;
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

    const pastBookings = await window.store.db.collection('reservations').find({}, { sort: { createdAt: -1 }, limit: 4 });

    container.innerHTML = `
      <div class="reservation-container">
        <div class="reservation-hero">
          <h1>Reserve Your Table</h1>
          <p>Book your dining table or intimate dinner in seconds with real-time confirmation.</p>
        </div>

        <div class="reservation-grid">
          <!-- Reservation Form -->
          <div class="glass-card">
            <h3 class="step-section-title">1. Select Date & Party Size</h3>
            
            <div class="form-row" style="margin-bottom: 20px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Reservation Date</label>
                <input type="date" class="form-input" id="res-date" value="${this.selectedDate}" min="${new Date().toISOString().split('T')[0]}" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 24px;">
              <label class="form-label">Number of Guests</label>
              <div class="party-size-chips" id="party-size-chips">
                ${[1, 2, 4, 6, 8, 12].map(size => `
                  <div class="party-chip ${this.selectedPartySize === size ? 'selected' : ''}" data-size="${size}">
                    ${size} ${size === 1 ? 'Guest' : 'Guests'}
                  </div>
                `).join('')}
              </div>
            </div>

            <h3 class="step-section-title">2. Preferred Time Slot</h3>
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
                <strong>Dinner Rush Notice:</strong>
                <p>A ৳500 refundable deposit secures your table during peak dinner hours (7:30 PM – 9:30 PM).</p>
              </div>
            </div>

            <h3 class="step-section-title">3. Guest Contact & Notes</h3>
            <form id="reservation-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Full Name *</label>
                  <input type="text" class="form-input" id="res-name" placeholder="e.g. Asif Rahman" value="${window.store.currentUser ? window.store.currentUser.name : ''}" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Mobile Number *</label>
                  <input type="tel" class="form-input" id="res-phone" placeholder="+880 1711-XXXXXX" value="${window.store.currentUser ? (window.store.currentUser.phone || '') : ''}" required />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" class="form-input" id="res-email" placeholder="asif@gmail.com" value="${window.store.currentUser ? (window.store.currentUser.email || '') : ''}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Special Requests (Occasion, Dietary, High Chair)</label>
                <textarea class="form-textarea" id="res-notes" rows="2" placeholder="Birthday celebration, high chair, extra Borhani setup..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
                <span>✨ Confirm Table Reservation</span>
              </button>
            </form>
          </div>

          <!-- Real-Time Reservation Pass Preview -->
          <div>
            <div class="reservation-pass-card" id="reservation-pass-preview">
              <div class="pass-header">
                <div>
                  <span style="font-size: 11px; text-transform: uppercase; color: var(--accent-saffron-light); font-weight: 800;">FlavourCraft Guest Pass</span>
                  <div class="pass-code" id="pass-code">FC-DHK-PENDING</div>
                </div>
                <div class="badge badge-warning" id="pass-status">HOLDING</div>
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
                  <span class="pass-label">Deposit Required</span>
                  <span class="pass-val" id="pass-deposit" style="color: var(--accent-saffron-light);">৳${this._isCurrentSlotPeak() ? '500' : '0'}</span>
                </div>
              </div>
            </div>

            <!-- Recent Confirmed Bookings -->
            <div class="recent-bookings-box">
              <div class="recent-bookings-title">
                <span>📅</span> <span>Recent Confirmed Bookings</span>
              </div>
              ${(pastBookings.length ? pastBookings : [
                { guestName: 'Farhan Kabir', partySize: 4, reservationDate: '2026-08-19', timeSlot: '20:00', code: 'FC-DHK-801' },
                { guestName: 'Nusrat Jahan', partySize: 2, reservationDate: '2026-08-19', timeSlot: '19:30', code: 'FC-DHK-802' }
              ]).map(b => `
                <div class="recent-booking-item">
                  <div>
                    <div class="recent-guest-name">${b.guestName} (${b.partySize} Guests)</div>
                    <div class="recent-guest-meta">${b.reservationDate} @ ${b.timeSlot}</div>
                  </div>
                  <span class="badge badge-success">${b.bookingCode || b.code || 'CONFIRMED'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this._attachEvents();
  }

  _isCurrentSlotPeak() {
    return ['19:30', '20:00', '20:30', '21:00'].includes(this.selectedTimeSlot);
  }

  _attachEvents() {
    // Date change
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        this.selectedDate = e.target.value;
        this._updatePassPreview();
      });
    }

    // Party size chips
    document.querySelectorAll('#party-size-chips .party-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('#party-size-chips .party-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        this.selectedPartySize = parseInt(chip.dataset.size);
        this._updatePassPreview();
      });
    });

    // Time slot buttons
    document.querySelectorAll('#time-slots-grid .time-slot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#time-slots-grid .time-slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedTimeSlot = btn.dataset.time;
        
        const isPeak = this._isCurrentSlotPeak();
        const alertBox = document.getElementById('peak-deposit-alert');
        if (alertBox) {
          alertBox.style.display = isPeak ? 'flex' : 'none';
        }
        this._updatePassPreview();
      });
    });

    // Name input live reflection
    document.getElementById('res-name')?.addEventListener('input', (e) => {
      const el = document.getElementById('pass-name');
      if (el) el.textContent = e.target.value || 'Your Name';
    });

    // Form Submission
    const form = document.getElementById('reservation-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('res-name').value;
        const phone = document.getElementById('res-phone').value;
        const email = document.getElementById('res-email').value;
        const notes = document.getElementById('res-notes').value;

        const bookingCode = `FC-DHK-${Math.floor(100 + Math.random() * 900)}`;
        const deposit = this._isCurrentSlotPeak() ? 500 : 0;

        const newBooking = {
          _id: `res_${Date.now()}`,
          bookingCode: bookingCode,
          guestName: name,
          guestPhone: phone,
          guestEmail: email,
          partySize: this.selectedPartySize,
          reservationDate: this.selectedDate,
          timeSlot: this.selectedTimeSlot,
          depositPaid: deposit,
          status: 'Confirmed',
          specialRequest: notes,
          createdAt: new Date().toISOString()
        };

        await window.store.db.collection('reservations').insertOne(newBooking);

        // Update pass preview to confirmed
        document.getElementById('pass-code').textContent = bookingCode;
        document.getElementById('pass-status').textContent = 'CONFIRMED';
        document.getElementById('pass-status').className = 'badge badge-success';

        window.store.audio.playKitchenBell();
        window.app.showToast(`Table confirmed! Booking Reference: ${bookingCode}`, 'success');

        setTimeout(() => {
          this.render();
        }, 1500);
      });
    }
  }

  _updatePassPreview() {
    const dtEl = document.getElementById('pass-datetime');
    const gEl = document.getElementById('pass-guests');
    const dEl = document.getElementById('pass-deposit');

    if (dtEl) dtEl.textContent = `${this.selectedDate} @ ${this.selectedTimeSlot}`;
    if (gEl) gEl.textContent = `${this.selectedPartySize} Guests`;
    if (dEl) dEl.textContent = `৳${this._isCurrentSlotPeak() ? '500' : '0'}`;
  }
}

window.ReservationsComponent = ReservationsComponent;
