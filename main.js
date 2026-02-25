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

  // ── ADD TO BAG (FEEDBACK) ──
  document.querySelectorAll('.product-card__atc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const orig = btn.textContent;
      btn.textContent = '✓ Added';
      btn.style.background = '#1a1a1a';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
      }, 1800);
      // Update cart badge
      const badge = document.querySelector('.cart-badge');
      if (badge) badge.textContent = parseInt(badge.textContent || 0) + 1;
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

});
