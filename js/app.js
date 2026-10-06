/* RoomMate - App Core Logic & Helpers */

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconClass = type === 'success' ? 'ri-checkbox-circle-fill' : (type === 'error' ? 'ri-error-warning-fill' : 'ri-information-fill');
  
  toast.innerHTML = `
    <i class="${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

// --- FAVORITES MANAGER (localStorage) ---
const FAV_KEY = 'roommate_favourites';

function getFavorites() {
  try {
    const saved = localStorage.getItem(FAV_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error reading favorites from localStorage', e);
    return [];
  }
}

function isFavorite(id) {
  const favs = getFavorites();
  return favs.includes(Number(id));
}

function toggleFavorite(id) {
  const numericId = Number(id);
  let favs = getFavorites();
  let added = false;

  if (favs.includes(numericId)) {
    favs = favs.filter(favId => favId !== numericId);
    showToast('Removed from Favourites', 'info');
  } else {
    favs.push(numericId);
    showToast('Saved to Favourites!', 'success');
    added = true;
  }

  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  updateFavBadge();

  // Update heart buttons on current page if rendered
  document.querySelectorAll(`.card-fav-btn[data-id="${numericId}"]`).forEach(btn => {
    if (added) {
      btn.classList.add('is-fav');
      btn.innerHTML = '<i class="ri-heart-3-fill"></i>';
    } else {
      btn.classList.remove('is-fav');
      btn.innerHTML = '<i class="ri-heart-3-line"></i>';
    }
  });

  return added;
}

function updateFavBadge() {
  const badge = document.getElementById('fav-count-badge');
  if (badge) {
    const favs = getFavorites();
    badge.textContent = favs.length;
    badge.style.display = favs.length > 0 ? 'inline-block' : 'none';
  }
}

// --- CARD HTML GENERATOR ---
function createPropertyCardHtml(p) {
  const fav = isFavorite(p.id);
  const heartIcon = fav ? 'ri-heart-3-fill' : 'ri-heart-3-line';
  const favClass = fav ? 'is-fav' : '';
  const statusBadge = p.available 
    ? `<span class="badge badge-available"><i class="ri-checkbox-circle-line"></i> Available</span>` 
    : `<span class="badge badge-occupied"><i class="ri-close-circle-line"></i> Occupied</span>`;
  
  // Format facilities badges
  const facilityBadges = p.facilities.slice(0, 4).map(f => `
    <span class="facility-badge"><i class="${getFacilityIcon(f)}"></i> ${f}</span>
  `).join('');

  return `
    <div class="property-card">
      <div class="card-image-wrap">
        <img src="${p.images[0]}" alt="${p.title}" class="card-image" loading="lazy">
        <div class="card-badges">
          <span class="badge badge-type">${p.type}</span>
          ${statusBadge}
        </div>
        <button class="card-fav-btn ${favClass}" data-id="${p.id}" onclick="toggleFavorite(${p.id}); event.stopPropagation();" title="Save to Favourites">
          <i class="${heartIcon}"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="card-header-meta">
          <span class="card-location"><i class="ri-map-pin-line"></i> ${p.location}</span>
          <span class="card-rating"><i class="ri-star-fill text-warning"></i> ${p.rating} (${p.reviewsCount})</span>
        </div>
        <h3 class="card-title">${p.title}</h3>
        <div class="card-price">₹${p.rent.toLocaleString('en-IN')} <span>/ month</span></div>
        <div class="card-facilities">
          ${facilityBadges}
        </div>
        <div class="card-footer">
          <span class="badge badge-gender"><i class="ri-user-smile-line"></i> ${p.gender}</span>
          <a href="property-details.html?id=${p.id}" class="btn btn-sm btn-primary">View Details <i class="ri-arrow-right-line"></i></a>
        </div>
      </div>
    </div>
  `;
}

function getFacilityIcon(name) {
  const icons = {
    'Wi-Fi': 'ri-wifi-line',
    'AC': 'ri-temp-cold-line',
    'Food': 'ri-restaurant-line',
    'Laundry': 'ri-t-shirt-air-line',
    'Parking': 'ri-parking-box-line',
    'CCTV': 'ri-shield-check-line',
    'Power Backup': 'ri-flashlight-line'
  };
  return icons[name] || 'ri-check-line';
}

// --- CONTACT OWNER MODAL ---
function setupContactModal() {
  const modalHtml = `
    <div class="modal-overlay" id="contact-modal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-owner-title">Contact Property Owner</h3>
          <button class="modal-close" onclick="closeContactModal()"><i class="ri-close-line"></i></button>
        </div>
        <div class="modal-body">
          <div style="background: var(--primary-light); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <strong id="modal-owner-name" style="color: var(--primary); font-size: 1.05rem; display: block;">Owner Name</strong>
              <small id="modal-owner-response" class="text-muted">Responds within 15 mins</small>
            </div>
            <a id="modal-owner-phone-link" href="#" class="btn btn-sm btn-accent"><i class="ri-phone-fill"></i> <span id="modal-owner-phone">Call Owner</span></a>
          </div>

          <form id="contact-form" onsubmit="handleContactSubmit(event)">
            <input type="hidden" id="modal-property-id" value="">
            <div class="form-group">
              <label>Your Name</label>
              <input type="text" id="contact-user-name" class="form-control" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
              <label>Your Phone / WhatsApp Number</label>
              <input type="tel" id="contact-user-phone" class="form-control" placeholder="Enter 10-digit mobile number" required>
            </div>
            <div class="form-group">
              <label>Message for Owner</label>
              <textarea id="contact-user-msg" class="form-control" placeholder="Hi, I am interested in this accommodation. Is it available for visit?" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block"><i class="ri-send-plane-fill"></i> Send Inquiry Message</button>
          </form>
        </div>
      </div>
    </div>
  `;

  if (!document.getElementById('contact-modal')) {
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

function openContactModal(propertyId) {
  setupContactModal();
  const property = PROPERTIES_DATA.find(p => p.id === Number(propertyId));
  if (!property) return;

  document.getElementById('modal-owner-title').textContent = `Inquire about ${property.title}`;
  document.getElementById('modal-owner-name').textContent = property.owner.name;
  document.getElementById('modal-owner-response').textContent = property.owner.responseTime;
  document.getElementById('modal-owner-phone').textContent = property.owner.phone;
  document.getElementById('modal-owner-phone-link').href = `tel:${property.owner.phone}`;
  document.getElementById('modal-property-id').value = property.id;

  // Pre-fill user if logged in
  const currentUser = getCurrentUser();
  if (currentUser) {
    document.getElementById('contact-user-name').value = currentUser.name || '';
    document.getElementById('contact-user-phone').value = currentUser.phone || '';
  }

  const modal = document.getElementById('contact-modal');
  modal.classList.add('active');
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contact-user-name').value.trim();
  const phone = document.getElementById('contact-user-phone').value.trim();
  const msg = document.getElementById('contact-user-msg').value.trim();

  if (!name || !phone || !msg) {
    showToast('Please complete all required fields.', 'error');
    return;
  }

  showToast(`Inquiry sent to property owner! They will call you at ${phone}.`, 'success');
  closeContactModal();
}

// --- INIT ON DOM READY ---
document.addEventListener('DOMContentLoaded', () => {
  updateFavBadge();

  // Setup mobile navigation toggle
  const navToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  }

  // Active navigation link highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
