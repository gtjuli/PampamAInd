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

  /* ---------- Acompañante: la pareja del isotipo baja con el scroll ---------- */
  var rail = doc.getElementById('dancerRail');
  var dancer = doc.getElementById('dancer');
  if (rail && dancer) {
    var stopTimer = null;
    var hideTimer = null;
    var dancerTick = false;
    var updateDancer = function () {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      rail.style.setProperty('--p', p.toFixed(4));
      // El "baile": un vaivén suave de lado a lado a medida que avanza (solo se desplaza; el logo no se rota ni se deforma).
      var sway = reduceMotion.matches ? 0 : Math.sin(p * Math.PI * 16) * 14;
      rail.style.setProperty('--sway', sway.toFixed(1) + 'px');
      dancerTick = false;
    };
    var onDancerScroll = function () {
      if (!dancerTick) { dancerTick = true; window.requestAnimationFrame(updateDancer); }
      // En celular la pareja solo aparece mientras se hace scroll (ver CSS).
      rail.classList.add('is-scrolling');
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(function () { rail.classList.remove('is-scrolling'); }, 900);
      if (reduceMotion.matches) return;
      dancer.classList.add('is-moving');
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(function () { dancer.classList.remove('is-moving'); }, 180);
    };
    window.addEventListener('scroll', onDancerScroll, { passive: true });
    window.addEventListener('resize', updateDancer);
    updateDancer();
  }

  /* ---------- Formulario de contacto ---------- */
  // TODO: pegar acá el endpoint del servicio de formularios (por ejemplo Formspree:
  // 'https://formspree.io/f/xxxxxxx'). Mientras esté vacío, el formulario arma el
  // mail con los datos y abre el programa de correo de la persona.
  var FORM_ENDPOINT = '';
  var FALLBACK_EMAIL = 'hola@pampamaind.com'; // TODO: confirmar mail

  var form = doc.getElementById('contactForm');
  if (form) {
    var statusEl = doc.getElementById('formStatus');
    var thanks = doc.getElementById('formThanks');
    var submitBtn = form.querySelector('.form-submit');

    var setError = function (name, msg) {
      var input = form.elements[name];
      doc.getElementById('e-' + name).textContent = msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };
    var validate = function () {
      var nombre = form.nombre.value.trim();
      var contacto = form.contacto.value.trim();
      var looksMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto);
      var looksPhone = contacto.replace(/\D/g, '').length >= 8;
      var okN = setError('nombre', nombre ? '' : 'Decinos cómo te llamás.');
      var okC = setError('contacto', contacto ? ((looksMail || looksPhone) ? '' : 'Revisá el número o el mail: parece incompleto.') : 'Dejanos un WhatsApp o un mail para responderte.');
      if (!okN) form.nombre.focus(); else if (!okC) form.contacto.focus();
      return okN && okC;
    };
    // Al corregir un campo con error, se revalida en el momento.
    ['nombre', 'contacto'].forEach(function (name) {
      form.elements[name].addEventListener('input', function () {
        if (this.getAttribute('aria-invalid') === 'true') {
          if (name === 'nombre') setError('nombre', this.value.trim() ? '' : 'Decinos cómo te llamás.');
          else {
            var v = this.value.trim();
            var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || v.replace(/\D/g, '').length >= 8;
            setError('contacto', ok ? '' : 'Revisá el número o el mail: parece incompleto.');
          }
        }
      });
    });

    var showThanks = function (nombre, text) {
      doc.getElementById('thanksName').textContent = nombre.split(' ')[0];
      if (text) doc.getElementById('thanksText').textContent = text;
      form.hidden = true;
      thanks.hidden = false;
      thanks.focus();
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      if (form.web.value) return; // bot
      if (!validate()) return;

      var data = {
        nombre: form.nombre.value.trim(),
        contacto: form.contacto.value.trim(),
        negocio: form.negocio.value,
        servicio: form.servicio.value,
        mensaje: form.mensaje.value.trim()
      };

      if (!FORM_ENDPOINT) {
        var body = 'Nombre: ' + data.nombre + '\nContacto: ' + data.contacto +
          '\nNegocio: ' + data.negocio + '\nNecesito: ' + data.servicio +
          (data.mensaje ? '\n\n' + data.mensaje : '');
        window.location.href = 'mailto:' + FALLBACK_EMAIL +
          '?subject=' + encodeURIComponent('Consulta desde la web: ' + data.servicio) +
          '&body=' + encodeURIComponent(body);
        showThanks(data.nombre, 'Se abrió tu programa de correo con la consulta lista. Envialo y te respondemos en el día hábil.');
        return;
      }

      submitBtn.disabled = true;
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        showThanks(data.nombre);
      }).catch(function () {
        statusEl.textContent = 'No pudimos enviar la consulta. Probá de nuevo en un momento.';
      }).then(function () {
        submitBtn.disabled = false;
      });
    });
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
