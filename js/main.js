/* PampamAInd · Landing v3 · interacciones (JS vanilla) */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  doc.documentElement.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Header: borde y desenfoque al hacer scroll ---------- */
  var header = doc.getElementById('siteHeader');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú overlay (tablet y celular) ---------- */
  var toggle = doc.getElementById('menuToggle');
  var overlay = doc.getElementById('menuOverlay');
  var closeBtn = doc.getElementById('menuClose');

  function focusables() {
    return Array.prototype.slice.call(overlay.querySelectorAll('a[href], button:not([disabled])'));
  }
  function openMenu() {
    overlay.hidden = false;
    void overlay.offsetWidth; // reflow para la transición
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
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); return; }
    if (e.key !== 'Tab') return;
    var items = focusables();
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (toggle && overlay) {
    toggle.addEventListener('click', function () { if (overlay.hidden) openMenu(); else closeMenu(true); });
    closeBtn.addEventListener('click', function () { closeMenu(true); });
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    // Si se agranda la ventana con el menú abierto, se cierra.
    window.matchMedia('(min-width: 1101px)').addEventListener('change', function (m) {
      if (m.matches && !overlay.hidden) closeMenu(false);
    });
  }

  /* ---------- Pestañas "Para quién" ---------- */
  doc.querySelectorAll('.tabs').forEach(function (tabs) {
    var list = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      list.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        doc.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    }
    list.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = list[(i + 1) % list.length];
        else if (e.key === 'ArrowLeft') next = list[(i - 1 + list.length) % list.length];
        else if (e.key === 'Home') next = list[0];
        else if (e.key === 'End') next = list[list.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  });

  /* ---------- Aparición al hacer scroll ---------- */
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
          // Quitar el retardo escalonado para que el hover responda al instante.
          window.setTimeout(function () { entry.target.style.transitionDelay = ''; }, 900);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Foco al destino de un ancla (teclado y lectores de pantalla) ---------- */
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
