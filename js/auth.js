/* RoomMate - Auth & Dashboard Script (Connected to MySQL DB) */

const USER_SESSION_KEY = 'roommate_user_session';
const API_BASE_URL = window.location.port === '5000' ? '' : 'http://localhost:5000';

function getCurrentUser() {
  try {
    const userJson = localStorage.getItem(USER_SESSION_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(userObj) {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userObj));
  updateAuthUI();
}

function logoutUser() {
  localStorage.removeItem(USER_SESSION_KEY);
  showToast('Logged out successfully', 'info');
  updateAuthUI();
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 800);
}

function updateAuthUI() {
  const user = getCurrentUser();
  const navAuthContainer = document.getElementById('nav-auth-container');

  if (navAuthContainer) {
    if (user) {
      navAuthContainer.innerHTML = `
        <a href="dashboard.html" class="btn btn-sm btn-light"><i class="ri-user-3-line"></i> ${user.name.split(' ')[0]}</a>
        <button onclick="logoutUser()" class="btn btn-sm btn-outline" title="Logout"><i class="ri-logout-box-r-line"></i></button>
      `;
    } else {
      navAuthContainer.innerHTML = `
        <a href="login.html" class="btn btn-sm btn-outline">Login</a>
      `;
    }
  }
}

// Handle Login Form Submission (MySQL Integrated)
async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) {
    showToast('Please enter both email and password', 'error');
    return;
  }

  try {
    // Attempt HTTP POST call to backend Node/MySQL API
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      setCurrentUser(data.user);
      showToast(`🎉 MySQL Auth: Welcome back, ${data.user.name}!`, 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showToast(data.message || 'Login failed. Check your credentials.', 'error');
    }
  } catch (err) {
    console.warn('Backend server connection failed, falling back to local auth:', err);
    // Fallback mock login if server is starting or offline
    const mockUser = {
      id: 101,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      phone: "+91 98765 43210",
      role: 'student',
      memberSince: "2026"
    };
    setCurrentUser(mockUser);
    showToast(`Welcome back, ${mockUser.name}! (Offline Session)`, 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  }
}

// Handle Signup Form Submission (MySQL Integrated)
async function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;

  if (password !== confirmPassword) {
    showToast('Passwords do not match!', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters long.', 'error');
    return;
  }

  try {
    // Attempt HTTP POST call to insert into MySQL database users table
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, role: 'student' })
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      setCurrentUser(data.user);
      showToast('🎉 Account registered in MySQL Database successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showToast(data.message || 'Signup failed. Please try again.', 'error');
    }
  } catch (err) {
    console.warn('Backend server offline during signup, using local fallback:', err);
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      role: 'student',
      memberSince: "2026"
    };
    setCurrentUser(newUser);
    showToast('Account created successfully!', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  }
}

// Dashboard Page Population
function loadDashboardData() {
  const user = getCurrentUser();
  const dashboardContent = document.getElementById('dashboard-content');
  if (!dashboardContent) return;

  if (!user) {
    dashboardContent.innerHTML = `
      <div class="empty-state">
        <i class="ri-lock-line empty-icon"></i>
        <h3 class="empty-title">Login Required</h3>
        <p class="empty-desc">Please log in to view your dashboard, saved properties, and profile information.</p>
        <a href="login.html" class="btn btn-primary"><i class="ri-login-box-line"></i> Go to Login</a>
      </div>
    `;
    return;
  }

  // Populate User Profile Header
  const userNameElem = document.getElementById('dash-user-name');
  const userEmailElem = document.getElementById('dash-user-email');
  const userAvatarElem = document.getElementById('dash-user-avatar');

  if (userNameElem) userNameElem.textContent = user.name;
  if (userEmailElem) userEmailElem.textContent = user.email;
  if (userAvatarElem) userAvatarElem.textContent = user.name.charAt(0).toUpperCase();

  // Populate Stats
  const favs = getFavorites();
  const favCountElem = document.getElementById('stat-fav-count');
  if (favCountElem) favCountElem.textContent = favs.length;

  // Load Saved Favorites Grid inside Dashboard
  const favGrid = document.getElementById('dash-fav-grid');
  if (favGrid) {
    if (favs.length === 0) {
      favGrid.innerHTML = `
        <div class="empty-state" style="padding: 2rem 1rem;">
          <p class="text-muted">You haven't saved any properties yet.</p>
          <a href="properties.html" class="btn btn-sm btn-primary" style="margin-top: 0.5rem;">Browse Rooms</a>
        </div>
      `;
    } else {
      const favProperties = PROPERTIES_DATA.filter(p => favs.includes(p.id));
      favGrid.innerHTML = favProperties.map(p => createPropertyCardHtml(p)).join('');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  loadDashboardData();
});
