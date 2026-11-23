/* =========================================================
   Portfolio — interacciones
   ========================================================= */
(() => {
  const body = document.body;

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileMenu.setAttribute('aria-hidden', String(!open));
    body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Header: se oculta al bajar, aparece al subir ---------- */
  const header = document.querySelector('.site-header');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = Math.max(0, window.scrollY);
    if (y <= 10 || body.classList.contains('menu-open')) {
      header.classList.remove('is-hidden');
      lastY = y;
      return;
    }
    const hide = y > lastY && y > 180;
    header.classList.toggle('is-hidden', hide);
    lastY = y;
  }, { passive: true });

  /* ---------- Ir al inicio (#top) ---------- */
  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (body.classList.contains('menu-open')) setMenu(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', '#top');
    });
  });

  /* ---------- Insignias onduladas (stats) ---------- */
  const scallopPath = (bumps = 14, r = 33, amp = 2.2, cx = 36, cy = 36) => {
    const steps = 240;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const rr = r + amp * Math.cos(t * bumps);
      const x = cx + rr * Math.cos(t);
      const y = cy + rr * Math.sin(t);
      d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2);
    }
    return d + 'Z';
  };
  const ringPath = scallopPath();
  document.querySelectorAll('.badge').forEach((badge) => {
    badge.insertAdjacentHTML(
      'afterbegin',
      `<svg class="badge-ring" viewBox="0 0 72 72"><path d="${ringPath}"/></svg>`
    );
  });

  /* ---------- Aparición al hacer scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Galería / slideshow ---------- */
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    const slides = [...gallery.querySelectorAll('.slide')];
    const dotsWrap = gallery.querySelector('.gallery-dots');
    let index = 0;
    let timer;

    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
      b.addEventListener('click', () => { go(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    const go = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('is-active', n === index));
      dots.forEach((d, n) => d.setAttribute('aria-selected', String(n === index)));
    };
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), 6000);
    };

    gallery.querySelectorAll('.gallery-btn').forEach((btn) =>
      btn.addEventListener('click', () => { go(index + Number(btn.dataset.dir)); restart(); })
    );

    // Swipe en móvil (solo gestos claramente horizontales)
    let startX = null;
    let startY = null;
    gallery.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    gallery.addEventListener('touchend', (e) => {
      if (startX === null || startY === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        go(index + (dx < 0 ? 1 : -1));
        restart();
      }
      startX = null;
      startY = null;
    });

    go(0);
    restart();
  }

  /* ---------- Acordeón FAQ ---------- */
  document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Newsletter (demo, sin backend) ---------- */
  const form = document.querySelector('.newsletter-form');
  if (form) {
    const msg = form.querySelector('.form-msg');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = 'Introduce un correo electrónico válido.';
        form.email.focus();
        return;
      }
      // ✏️ Conecta aquí tu servicio (Mailchimp, Formspree, etc.)
      msg.textContent = '¡Gracias por suscribirte!';
      form.reset();
    });
  }

  /* ---------- Año del footer ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

