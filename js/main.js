/* PampamAInd · Landing v2 · interacciones (JS vanilla) */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktop = window.matchMedia('(min-width: 1025px)');

  /* ---------- 1. Header sticky ---------- */
  var header = doc.getElementById('siteHeader');

  /* ---------- 5. Texto que se "enciende" ---------- */
  var enciende = doc.getElementById('enciende');
  var words = [];
  if (enciende) {
    var parts = enciende.textContent.trim().split(/\s+/);
    enciende.textContent = '';
    parts.forEach(function (word, i) {
      var span = doc.createElement('span');
      span.className = 'w';
      span.textContent = word;
      enciende.appendChild(span);
      if (i < parts.length - 1) enciende.appendChild(doc.createTextNode(' '));
      words.push(span);
    });
  }

  function updateEnciende() {
    if (!words.length) return;
    if (reduceMotion.matches) {
      words.forEach(function (w) { w.classList.add('lit'); });
      return;
    }
    var vh = window.innerHeight;
    var rect = enciende.getBoundingClientRect();
    // 0 cuando la frase entra por abajo (85% del alto), 1 cuando llega al 40%.
    var progress = (vh * 0.85 - rect.top) / (vh * 0.45);
    progress = Math.max(0, Math.min(1, progress));
    var lit = Math.round(progress * words.length);
    words.forEach(function (w, i) { w.classList.toggle('lit', i < lit); });
  }

  /* ---------- 7. Parallax sutil del arco del hero ---------- */
  var arch = doc.getElementById('heroArch');
  var hero = arch ? arch.closest('.hero') : null;

  function updateParallax() {
    if (!arch) return;
    if (reduceMotion.matches || !desktop.matches) {
      arch.style.transform = '';
      return;
    }
    var h = hero.offsetHeight || 1;
    var p = Math.max(0, Math.min(1, window.scrollY / h));
    arch.style.transform = 'translate3d(0,' + (p * 20).toFixed(1) + 'px,0)';
  }

  /* Un solo manejador de scroll, con requestAnimationFrame */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
      updateEnciende();
      updateParallax();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 2. Menú overlay ---------- */
  var toggle = doc.getElementById('menuToggle');
  var overlay = doc.getElementById('menuOverlay');
  var closeBtn = doc.getElementById('menuClose');

  function focusables() {
    return Array.prototype.slice.call(
      overlay.querySelectorAll('a[href], button:not([disabled])')
    );
  }

  function openMenu() {
    overlay.hidden = false;
    // forzar reflow para que la transición de opacidad corra
    void overlay.offsetWidth;
    overlay.classList.add('open');
    body.classList.add('no-scroll');
    toggle.setAttribute('aria-expanded', 'true');
    var first = overlay.querySelector('.menu-nav a');
    if (first) first.focus();
    doc.addEventListener('keydown', onMenuKey);
  }

  function closeMenu(returnFocus) {
    overlay.classList.remove('open');
    overlay.hidden = true;
    body.classList.remove('no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
    doc.removeEventListener('keydown', onMenuKey);
    if (returnFocus) toggle.focus();
  }

  function onMenuKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu(true);
      return;
    }
    if (e.key !== 'Tab') return;
    var items = focusables();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && doc.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && doc.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (toggle && overlay) {
    toggle.addEventListener('click', function () {
      if (overlay.hidden) openMenu(); else closeMenu(true);
    });
    closeBtn.addEventListener('click', function () { closeMenu(true); });
    overlay.querySelectorAll('.menu-nav a').forEach(function (a) {
      // Se cierra antes de la navegación por ancla, así el scroll ya no está bloqueado.
      a.addEventListener('click', function () { closeMenu(false); });
    });
  }

  /* ---------- 4. Reveal on scroll ---------- */
  doc.querySelectorAll('[data-reveal-group]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.classList.add('reveal');
      child.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  var revealEls = doc.querySelectorAll('.reveal');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. Scroll suave + foco al llegar a un ancla ---------- */
  // El desplazamiento suave lo resuelve CSS (scroll-behavior + scroll-margin-top).
  // Acá solo movemos el foco al destino para teclado y lectores de pantalla.
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id ? doc.getElementById(id) : null;
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    window.setTimeout(function () { target.focus({ preventScroll: true }); }, 0);
  });
})();
