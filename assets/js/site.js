/* Scooter — scootermedia.ae — small, dependency-free enhancements */
(function () {
  'use strict';

  // Mobile menu
  var hdr = document.querySelector('.hdr');
  var menuBtn = document.querySelector('.menu-btn');
  if (hdr && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = hdr.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Hero video: sound toggle; skip autoplay when user prefers reduced motion
  var video = document.querySelector('.hero-v video');
  var sound = document.querySelector('.sound');
  if (video) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.removeAttribute('autoplay');
      try { video.pause(); } catch (e) {}
    }
    // Keep the reel playing continuously: restart if the browser pauses it
    // (tab switch, low-power mode, autoplay hiccups) and loop without a gap.
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var kick = function () { if (!reduce && video.paused) { var p = video.play(); if (p && p.catch) p.catch(function () {}); } };
    video.addEventListener('ended', function () { video.currentTime = 0; kick(); });
    video.addEventListener('pause', function () { setTimeout(kick, 300); });
    video.addEventListener('canplay', kick);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
    ['touchstart', 'click', 'scroll'].forEach(function (ev) { window.addEventListener(ev, kick, { once: true, passive: true }); });
    kick();
    var reelBtn = document.querySelector('[data-act="reel"]');
    if (reelBtn) reelBtn.addEventListener('click', function (e) {
      e.preventDefault();
      video.currentTime = 0; video.muted = false;
      if (sound) { sound.setAttribute('aria-pressed', 'true'); sound.setAttribute('aria-label', 'Turn sound off'); }
      var p = video.play(); if (p && p.catch) p.catch(function () { window.open(reelBtn.href, '_blank', 'noopener'); });
    });
    if (sound) {
      sound.addEventListener('click', function () {
        video.muted = !video.muted;
        sound.setAttribute('aria-pressed', video.muted ? 'false' : 'true');
        sound.setAttribute('aria-label', video.muted ? 'Turn sound on' : 'Turn sound off');
        if (!video.muted) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
      });
    }
  }

  // Clients wall
  var wall = document.querySelector('.wall');
  if (wall) {
    var tiles = Array.prototype.slice.call(wall.querySelectorAll('.tile'));
    var total = tiles.length;
    var seen = {};
    var current = null;
    var filter = 'all';
    var el = function (s) { return document.querySelector(s); };
    var sheetNum = el('.sheet .num'), sheetName = el('.sheet .name'), sheetType = el('.sheet .type'), sheetNote = el('.sheet .note');
    var countEl = el('.toolbar .count'), bar = el('.progress span');

    var visible = function () { return tiles.filter(function (t) { return !t.hidden; }); };
    var render = function () {
      var n = Object.keys(seen).length;
      if (countEl) countEl.textContent = n + ' of ' + total + ' explored';
      if (bar) bar.style.width = Math.round(n / total * 100) + '%';
    };
    var open = function (t) {
      if (current) current.classList.remove('on');
      current = t;
      t.classList.add('on', 'seen');
      seen[t.dataset.idx] = true;
      if (sheetNum) sheetNum.textContent = 'No. ' + String(+t.dataset.idx + 1).padStart(2, '0') + ' / ' + total;
      if (sheetName) sheetName.textContent = t.dataset.name;
      if (sheetType) sheetType.textContent = t.dataset.type;
      if (sheetNote) sheetNote.textContent = t.dataset.note || '';
      render();
    };
    tiles.forEach(function (t) {
      t.addEventListener('click', function () { open(t); });
      t.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) open(t); });
      t.addEventListener('focus', function () { open(t); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.seg button'), function (b) {
      b.addEventListener('click', function () {
        filter = b.dataset.filter;
        Array.prototype.forEach.call(document.querySelectorAll('.seg button'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        tiles.forEach(function (t) {
          var ag = t.dataset.type === 'Partner';
          t.hidden = !(filter === 'all' || (filter === 'agency' ? ag : !ag));
        });
      });
    });
    var step = function (d) {
      var v = visible(); if (!v.length) return;
      var i = current ? v.indexOf(current) : -1;
      open(v[(i + d + v.length) % v.length]);
    };
    var prev = el('[data-act="prev"]'), next = el('[data-act="next"]'), spin = el('[data-act="spin"]');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    if (spin) spin.addEventListener('click', function () {
      var v = visible(); if (!v.length) return;
      var t = v[Math.floor(Math.random() * v.length)];
      open(t); t.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    render();
  }

  // Contact form → WhatsApp (primary) or email
  var form = document.querySelector('#brief');
  if (form) {
    var build = function () {
      var f = new FormData(form);
      var lines = [
        'New brief via scootermedia.ae',
        'Project: ' + (f.get('type') || ''),
        'Name: ' + (f.get('name') || ''),
        'Company: ' + (f.get('company') || ''),
        'Email: ' + (f.get('email') || ''),
        'Phone: ' + (f.get('phone') || ''),
        '',
        (f.get('brief') || '')
      ];
      return lines.join('\n');
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      window.open('https://wa.me/919051222997?text=' + encodeURIComponent(build()), '_blank', 'noopener');
    });
    var mail = document.querySelector('[data-act="email"]');
    if (mail) mail.addEventListener('click', function () {
      if (!form.reportValidity()) return;
      var f = new FormData(form);
      window.location.href = 'mailto:hello@scootermedia.co?subject=' + encodeURIComponent('Brief: ' + (f.get('type') || 'Project') + ' — ' + (f.get('company') || f.get('name') || '')) + '&body=' + encodeURIComponent(build());
    });
  }
  // Click-to-play YouTube tiles (Work, Originals): load the player only when asked
  document.querySelectorAll('.vid-play[data-yt]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-yt') + '?autoplay=1&rel=0';
      f.title = b.getAttribute('aria-label').replace(/^Play /, '');
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      b.parentNode.replaceChild(f, b); f.focus();
    });
  });
  // Real estate reels: play self-hosted video on tap, one at a time
  var reels = document.querySelectorAll('.reel-frame video');
  document.querySelectorAll('.reel-play').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.parentNode.querySelector('video');
      reels.forEach(function (o) { if (o !== v) o.pause(); });
      v.controls = true; b.hidden = true; v.play(); v.focus();
    });
  });
  reels.forEach(function (v) {
    v.addEventListener('play', function () { reels.forEach(function (o) { if (o !== v) o.pause(); }); });
  });
  // Count-up numbers (About stats): run once when scrolled into view
  var counters = document.querySelectorAll('.countup[data-to]');
  if (counters.length) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var run = function (el) {
      var to = +el.getAttribute('data-to'), dur = 1800, t0 = null;
      var step = function (t) {
        if (!t0) t0 = t;
        var k = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!reduce && 'IntersectionObserver' in window) {
      counters.forEach(function (el) { el.textContent = '0'; });
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); run(e.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { io.observe(el); });
    }
  }
  // Work: sideways film scroller with previous / next buttons
  document.querySelectorAll('.vscroll').forEach(function (sc) {
    var nav = sc.previousElementSibling;
    if (!nav || !nav.classList.contains('vscroll-nav')) return;
    var btns = nav.querySelectorAll('.vs-btn');
    var colW = function () { var f = sc.querySelector('.vid'); return f ? f.getBoundingClientRect().width + 24 : sc.clientWidth / 3; };
    var update = function () {
      btns[0].disabled = sc.scrollLeft <= 2;
      btns[1].disabled = sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 2;
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function () { sc.scrollBy({ left: colW() * +b.getAttribute('data-dir'), behavior: 'smooth' }); });
    });
    sc.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
