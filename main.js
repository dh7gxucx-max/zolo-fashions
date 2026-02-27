// ═══════════════════════════════════════════
// ZOLO FASHIONS — Interactions
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── SEARCH TOGGLE ──
  const searchToggle = document.getElementById('searchToggle');
  const searchClose  = document.getElementById('searchClose');
  const searchBar    = document.getElementById('searchBar');
  const searchInput  = document.getElementById('searchInput');

  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', () => {
      searchBar.classList.add('is-open');
      setTimeout(() => searchInput && searchInput.focus(), 260);
    });
  }
  if (searchClose && searchBar) {
    searchClose.addEventListener('click', () => searchBar.classList.remove('is-open'));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') searchBar && searchBar.classList.remove('is-open');
  });

  // ── MOBILE BURGER ──
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      document.body.style.overflow = open ? 'hidden' : '';
      const spans = burger.querySelectorAll('span');
      if (open) {
        spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
        spans[1].style.cssText = 'opacity:0';
        spans[2].style.cssText = 'transform:rotate(-45deg) translate(4px,-4px)';
      } else {
        spans.forEach(s => (s.style.cssText = ''));
      }
    });
  }

  // ── STICKY HEADER ──
  const header = document.getElementById('header');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) {
      header.style.boxShadow = y > 10
        ? '0 2px 20px rgba(0,0,0,.08)'
        : 'none';
    }
    lastY = y;
  }, { passive: true });

  // ── FILTER TABS ──
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // ── COLOR SWATCHES ──
  document.querySelectorAll('.product-card__colors').forEach(wrap => {
    wrap.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        wrap.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
      });
      swatch.addEventListener('mouseenter', () => {
        const tooltip = document.createElement('span');
        tooltip.className = 'swatch-tooltip';
        tooltip.textContent = swatch.dataset.color || '';
        tooltip.style.cssText = `
          position:absolute;bottom:100%;left:50%;transform:translateX(-50%);
          background:#0D0D0D;color:#fff;font-size:10px;padding:3px 7px;
          white-space:nowrap;pointer-events:none;margin-bottom:4px;z-index:10;
        `;
        swatch.style.position = 'relative';
        swatch.appendChild(tooltip);
      });
      swatch.addEventListener('mouseleave', () => {
        const t = swatch.querySelector('.swatch-tooltip');
        if (t) t.remove();
      });
    });
  });

  // ── SCROLL REVEAL (simple) ──
  const revealEls = document.querySelectorAll(
    '.product-card, .value-item, .review-card, .vip__tier, .look, .cat-item'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    io.observe(el);
  });

  // ── NEWSLETTER SUBMIT ──
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const btn   = newsletterForm.querySelector('button');
      if (input && input.value && input.value.includes('@')) {
        btn.textContent = '✓ Subscribed!';
        btn.disabled = true;
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  // ═══════════════════════════════════════════
  // AUTH SYSTEM (localStorage-based)
  // ═══════════════════════════════════════════

  const AUTH_KEY = 'zolo_user';
  const USERS_KEY = 'zolo_users';

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)); }
    catch { return null; }
  }
  function setCurrentUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
  function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
  }

  // Update account icon: if logged in, link to dashboard
  const user = getCurrentUser();
  const accountLink = document.querySelector('a[aria-label="Account"]');
  if (accountLink) {
    accountLink.href = user ? 'dashboard.html' : 'login.html';
  }

  // ── PASSWORD TOGGLE ──
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.auth-password-wrap, .auth-input-wrap');
      const inp = wrap ? wrap.querySelector('input') : null;
      if (!inp) return;
      const isPass = inp.type === 'password';
      inp.type = isPass ? 'text' : 'password';
      // Update button text or icon
      if (btn.textContent.trim()) {
        btn.textContent = isPass ? 'Hide' : 'Show';
      } else {
        const eyeOpen = btn.querySelector('.eye-open');
        const eyeClosed = btn.querySelector('.eye-closed');
        if (eyeOpen && eyeClosed) {
          eyeOpen.style.display = isPass ? 'none' : '';
          eyeClosed.style.display = isPass ? '' : 'none';
        }
      }
    });
  });

  // ── LOGIN FORM ──
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    // If already logged in, redirect to dashboard
    if (getCurrentUser()) {
      window.location.href = 'dashboard.html';
      return;
    }
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const errorEl = document.getElementById('authError');

      if (!email || !password) {
        if (errorEl) { errorEl.textContent = 'Please fill in all fields.'; errorEl.style.display = 'block'; }
        return;
      }

      const users = getUsers();
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        setCurrentUser({ name: found.name, email: found.email, phone: found.phone || '' });
        window.location.href = 'dashboard.html';
      } else {
        if (errorEl) { errorEl.textContent = 'Invalid email or password. Please try again.'; errorEl.style.display = 'block'; }
      }
    });
  }

  // ── REGISTER FORM ──
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    if (getCurrentUser()) {
      window.location.href = 'dashboard.html';
      return;
    }
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirmPassword') ? document.getElementById('confirmPassword').value : password;
      const agree = document.getElementById('agreeTerms');
      const errorEl = registerForm.closest('.auth-card').querySelector('.auth-error');
      const successEl = registerForm.closest('.auth-card').querySelector('.auth-success');

      function showErr(msg) {
        if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
        if (successEl) successEl.style.display = 'none';
      }
      function showOk(msg) {
        if (successEl) { successEl.textContent = msg; successEl.style.display = 'block'; }
        if (errorEl) errorEl.style.display = 'none';
      }

      if (!name || !email || !password) { showErr('Please fill in all required fields.'); return; }
      if (password.length < 8) { showErr('Password must be at least 8 characters.'); return; }
      if (password !== confirm) { showErr('Passwords do not match.'); return; }
      if (agree && !agree.checked) { showErr('You must agree to the Terms and Privacy Policy.'); return; }

      const users = getUsers();
      if (users.find(u => u.email === email)) { showErr('An account with this email already exists.'); return; }

      users.push({ name, email, phone, password });
      saveUsers(users);
      setCurrentUser({ name, email, phone });

      showOk('Account created! Redirecting...');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    });
  }

  // ── DASHBOARD ──
  const dashGrid = document.querySelector('.dash-grid');
  if (dashGrid) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = 'login.html';
      return;
    }

    // Populate user info
    const dashName = document.getElementById('dashName');
    const dashEmail = document.getElementById('dashEmail');
    const dashAvatar = document.getElementById('dashAvatar');
    const dashWelcome = document.getElementById('dashWelcome');
    if (dashName) dashName.textContent = currentUser.name || 'User';
    if (dashEmail) dashEmail.textContent = currentUser.email || '';
    if (dashAvatar) dashAvatar.textContent = (currentUser.name || 'U').charAt(0).toUpperCase();
    if (dashWelcome) dashWelcome.textContent = 'Welcome back, ' + (currentUser.name || 'User').split(' ')[0] + '!';

    // Populate profile form
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    if (profileName) profileName.value = currentUser.name || '';
    if (profileEmail) profileEmail.value = currentUser.email || '';
    if (profilePhone) profilePhone.value = currentUser.phone || '';

    // Tab navigation
    document.querySelectorAll('.dash-nav__item[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.dash-nav__item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('panel-' + tab);
        if (panel) panel.classList.add('active');
      });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Profile save
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = profileName ? profileName.value.trim() : currentUser.name;
        const phone = profilePhone ? profilePhone.value.trim() : '';
        const dob = document.getElementById('profileDob') ? document.getElementById('profileDob').value : '';
        const gender = profileForm.querySelector('input[name="gender"]:checked');

        // Update current user
        const updated = { ...currentUser, name, phone };
        setCurrentUser(updated);

        // Update in users list
        const users = getUsers();
        const idx = users.findIndex(u => u.email === currentUser.email);
        if (idx >= 0) {
          users[idx].name = name;
          users[idx].phone = phone;
          saveUsers(users);
        }

        // Update UI
        if (dashName) dashName.textContent = name;
        if (dashAvatar) dashAvatar.textContent = name.charAt(0).toUpperCase();
        if (dashWelcome) dashWelcome.textContent = 'Welcome back, ' + name.split(' ')[0] + '!';
        const saved = document.getElementById('profileSaved');
        if (saved) {
          saved.style.display = 'inline';
          setTimeout(() => { saved.style.display = 'none'; }, 2500);
        }
      });
    }

    // Password change
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const curr = document.getElementById('currentPass') ? document.getElementById('currentPass').value : '';
        const newP = document.getElementById('newPass') ? document.getElementById('newPass').value : '';
        const users = getUsers();
        const idx = users.findIndex(u => u.email === currentUser.email);

        if (idx < 0 || users[idx].password !== curr) {
          alert('Current password is incorrect.');
          return;
        }
        if (newP.length < 8) {
          alert('New password must be at least 8 characters.');
          return;
        }
        users[idx].password = newP;
        saveUsers(users);
        alert('Password updated successfully.');
        passwordForm.reset();
      });
    }

    // Address management
    const addAddressBtn = document.getElementById('addAddressBtn');
    const addressFormEl = document.getElementById('addressForm');
    const cancelAddress = document.getElementById('cancelAddress');
    const newAddressForm = document.getElementById('newAddressForm');
    const addressList = document.getElementById('addressList');

    function getAddresses() {
      try { return JSON.parse(localStorage.getItem('zolo_addresses_' + currentUser.email)) || []; }
      catch { return []; }
    }
    function saveAddresses(addrs) {
      localStorage.setItem('zolo_addresses_' + currentUser.email, JSON.stringify(addrs));
    }
    function renderAddresses() {
      const addrs = getAddresses();
      if (!addressList) return;
      if (addrs.length === 0) {
        addressList.innerHTML = '<div class="dash-empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><p>No saved addresses yet.</p></div>';
        return;
      }
      addressList.innerHTML = addrs.map((a, i) => `
        <div class="dash-address-card">
          <strong>${a.name}</strong>
          <p>${a.line1}${a.line2 ? ', ' + a.line2 : ''}<br>${a.city}, ${a.state} — ${a.pin}</p>
          <p style="font-size:12px;color:#777">${a.phone}</p>
          <div class="dash-address-card__actions">
            <button class="delete-addr" data-idx="${i}">Delete</button>
          </div>
        </div>
      `).join('');
      addressList.querySelectorAll('.delete-addr').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          const a = getAddresses();
          a.splice(idx, 1);
          saveAddresses(a);
          renderAddresses();
        });
      });
    }
    renderAddresses();

    if (addAddressBtn && addressFormEl) {
      addAddressBtn.addEventListener('click', () => { addressFormEl.style.display = 'block'; });
    }
    if (cancelAddress && addressFormEl) {
      cancelAddress.addEventListener('click', () => { addressFormEl.style.display = 'none'; newAddressForm && newAddressForm.reset(); });
    }
    if (newAddressForm) {
      newAddressForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const addr = {
          name:  document.getElementById('addrName').value.trim(),
          phone: document.getElementById('addrPhone').value.trim(),
          line1: document.getElementById('addrLine1').value.trim(),
          line2: document.getElementById('addrLine2').value.trim(),
          city:  document.getElementById('addrCity').value.trim(),
          state: document.getElementById('addrState').value.trim(),
          pin:   document.getElementById('addrPin').value.trim(),
        };
        const addrs = getAddresses();
        addrs.push(addr);
        saveAddresses(addrs);
        renderAddresses();
        addressFormEl.style.display = 'none';
        newAddressForm.reset();
      });
    }
  }

});
