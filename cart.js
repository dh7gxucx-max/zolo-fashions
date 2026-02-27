/* ─────────────────────────────────────────────────────────────
   ZoloFash Cart — cart.js
   Handles: localStorage persistence, badge sync, drawer render,
            open/close, product extraction, qty/remove controls
───────────────────────────────────────────────────────────── */

const CART_KEY = 'zolo_cart';

/* ── STORAGE ── */

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  syncBadge();
  renderDrawer();
}

function makeId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function addItem(product) {
  const cart = getCart();
  const id = makeId(product.name);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id,
      name:     product.name,
      price:    product.price,
      priceFmt: product.priceFmt,
      img:      product.img,
      qty:      1
    });
  }
  saveCart(cart);
}

function removeItem(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function setQty(id, qty) {
  if (qty <= 0) { removeItem(id); return; }
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) { item.qty = qty; saveCart(cart); }
}

/* ── BADGE ── */

function syncBadge() {
  const total = getCart().reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = total;
  });
}

/* ── DRAWER RENDER ── */

function renderDrawer() {
  const body  = document.getElementById('cartBody');
  const foot  = document.getElementById('cartFoot');
  const count = document.getElementById('cartDrawerCount');
  const total = document.getElementById('cartTotal');
  if (!body) return;

  const cart     = getCart();
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalAmt = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (count) count.textContent = '(' + totalQty + ')';
  if (total) total.textContent = '₹' + totalAmt.toLocaleString('en-IN');

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>Your bag is empty.<br>Add some items to get started.</p>
        <a href="catalog.html">Shop Now</a>
      </div>`;
    if (foot) foot.classList.remove('is-visible');
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item__img" src="${item.img}" alt="${item.name}"
           onerror="this.style.background='#f0f0f0';this.removeAttribute('src')">
      <div class="cart-item__info">
        <p class="cart-item__name">${item.name}</p>
        <div class="cart-item__controls">
          <button class="cart-item__qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span class="cart-item__qty">${item.qty}</span>
          <button class="cart-item__qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
        <p class="cart-item__price">${item.priceFmt}</p>
      </div>
      <button class="cart-item__remove" data-action="remove" data-id="${item.id}">Remove</button>
    </div>
  `).join('');

  if (foot) foot.classList.add('is-visible');
}

/* ── OPEN / CLOSE ── */

function openCart() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer) return;
  renderDrawer();
  drawer.classList.add('is-open');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer) return;
  drawer.classList.remove('is-open');
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

/* ── DATA EXTRACTION ── */

function extractProduct(btn) {
  const card = btn.closest('.product-card');
  if (!card) return null;

  const name = card.dataset.name
    || card.querySelector('.product-card__name')?.textContent?.trim()
    || 'Unknown Product';

  let price = parseInt(card.dataset.price, 10);
  if (!price) {
    const txt = card.querySelector('.price-current')?.textContent || '';
    price = parseInt(txt.replace(/[^\d]/g, ''), 10) || 0;
  }

  const priceFmt = card.dataset.priceFmt
    || card.querySelector('.price-current')?.textContent?.trim()
    || ('₹' + price.toLocaleString('en-IN'));

  const img = card.dataset.img
    || card.querySelector('.product-card__photo')?.src
    || '';

  return { name, price, priceFmt, img };
}

/* ── INIT ── */

document.addEventListener('DOMContentLoaded', () => {
  syncBadge();
  renderDrawer();

  // Open drawer on cart button click
  document.querySelector('.action-btn--cart')
    ?.addEventListener('click', openCart);

  // Close on overlay or X
  document.getElementById('cartOverlay')
    ?.addEventListener('click', closeCart);
  document.getElementById('cartClose')
    ?.addEventListener('click', closeCart);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  // "Add to Bag" — delegated on document (works on any page, incl. dynamically added cards)
  document.addEventListener('click', e => {
    const btn = e.target.closest('.product-card__atc');
    if (!btn) return;
    e.stopPropagation();

    const product = extractProduct(btn);
    if (!product || !product.name) return;

    addItem(product);
    openCart();

    // Visual feedback
    const orig = btn.textContent;
    btn.textContent = '✓ Added';
    setTimeout(() => { btn.textContent = orig; }, 1800);
  });

  // Qty +/− and Remove inside drawer (delegated)
  document.getElementById('cartBody')
    ?.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id     = btn.dataset.id;
      const action = btn.dataset.action;
      const cart   = getCart();
      const item   = cart.find(i => i.id === id);

      if (action === 'inc' && item) {
        item.qty += 1;
        saveCart(cart);
      } else if (action === 'dec' && item) {
        item.qty -= 1;
        if (item.qty <= 0) saveCart(cart.filter(i => i.id !== id));
        else saveCart(cart);
      } else if (action === 'remove') {
        saveCart(cart.filter(i => i.id !== id));
      }
    });
});

/* ── PUBLIC API (for Quick View in catalog.html) ── */
window.ZoloCart = { addItem, openCart };
