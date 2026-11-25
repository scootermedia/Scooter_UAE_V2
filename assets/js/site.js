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

  // Frozen header: over the homepage video it is see-through, then turns solid on scroll
  if (hdr && hdr.classList.contains('hdr--overlay')) {
    var solid = function () { hdr.classList.toggle('is-solid', window.scrollY > 24); };
    window.addEventListener('scroll', solid, { passive: true });
    solid();
  }

  // Hero video: sound toggle; skip autoplay when user prefers reduced motion
  var video = document.querySelector('.film video, .hero-v video');
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
    // Preselect the offer from links like /contact/?type=real-estate
    var want = (location.search.match(/[?&]type=([a-z-]+)/) || [])[1];
    var map = { 'real-estate': 't-real-estate', 'original-content': 't-original' };
    if (want && map[want]) { var r = document.getElementById(map[want]); if (r) r.checked = true; }
    var build = function () {
      var f = new FormData(form);
      var lines = [
        'New brief via scootermedia.ae',
        'Project: ' + (f.get('type') || ''),
        'Name: ' + (f.get('name') || ''),
        'Company: ' + (f.get('company') || ''),
        'Email: ' + (f.get('email') || ''),
        'Phone: ' + (f.get('phone') || ''),
        'Budget range (private): ' + (f.get('budget') || ''),
        '',
        (f.get('brief') || '')
      ];
      return lines.join('\n');
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      window.open('https://wa.me/971585752997?text=' + encodeURIComponent(build()), '_blank', 'noopener');
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
  // Calm reveal: elements marked .rv fade up once as they enter the view
  var rv = document.querySelectorAll('.rv');
  if (rv.length) {
    if ('IntersectionObserver' in window) {
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); ro.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      rv.forEach(function (el) { ro.observe(el); });
    } else { rv.forEach(function (el) { el.classList.add('in-view'); }); }
  }

  // "Watch the showreel": swap the hero loop for the full showreel with sound
  document.querySelectorAll('[data-reel-target]').forEach(function (b) {
    b.addEventListener('click', function () {
      var panel = document.querySelector(b.getAttribute('data-reel-target'));
      if (!panel) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-yt') + '?autoplay=1&rel=0';
      f.title = 'Scooter showreel';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      panel.innerHTML = ''; panel.appendChild(f);
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Statement: words light up one by one as the reader scrolls through it
  document.querySelectorAll('[data-words]').forEach(function (el) {
    if (calm) return;
    var html = el.innerHTML.replace(/(<[^>]+>)|([^<\s]+)/g, function (m, tag, word) { return tag ? tag : '<span class="sw">' + word + '</span>'; });
    el.innerHTML = html; el.classList.add('split');
    var words = el.querySelectorAll('.sw');
    var light = function () {
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      var n = Math.round(p * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    };
    window.addEventListener('scroll', light, { passive: true }); window.addEventListener('resize', light); light();
  });

  // Muted loops (real estate panel): play only while on screen
  var loops = document.querySelectorAll('video[data-autoplay]');
  if (loops.length && 'IntersectionObserver' in window && !calm) {
    var lo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { v.preload = 'auto'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else { v.pause(); } });
    }, { threshold: 0.25 });
    loops.forEach(function (v) { lo.observe(v); });
  }

  // Work gallery: on wide screens the slides move sideways while the page scrolls down
  document.querySelectorAll('.hscroll').forEach(function (sec) {
    var track = sec.querySelector('.hscroll-track');
    if (!track || calm) return;
    var mq = window.matchMedia('(min-width: 900px)');
    var dist = 0;
    var setup = function () {
      if (!mq.matches) { sec.classList.remove('pinned'); track.style.transform = ''; return; }
      sec.classList.add('pinned');
      dist = Math.max(0, track.scrollWidth - track.clientWidth);
      sec.style.setProperty('--hs-h', (window.innerHeight + dist) + 'px');
      move();
    };
    var move = function () {
      if (!sec.classList.contains('pinned')) return;
      var r = sec.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, -r.top / Math.max(1, sec.offsetHeight - window.innerHeight)));
      track.style.transform = 'translate3d(' + (-p * dist) + 'px,0,0)';
    };
    window.addEventListener('scroll', move, { passive: true });
    window.addEventListener('resize', setup);
    if (mq.addEventListener) mq.addEventListener('change', setup);
    setup();
  });
  // "Who it's for": swap the audience word every few seconds
  document.querySelectorAll('.rot').forEach(function (r) {
    var ws = r.querySelectorAll('.rot-w'); if (ws.length < 2) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var i = 0;
    setInterval(function () {
      if (document.hidden) return;
      var cur = ws[i]; i = (i + 1) % ws.length; var nxt = ws[i];
      cur.classList.remove('on'); cur.classList.add('out');
      nxt.classList.remove('out'); nxt.classList.add('on');
      setTimeout(function () { cur.classList.remove('out'); }, 750);
    }, 2600);
  });
  // YouTube thumbnails: if the HD image is missing (YouTube serves a 120px placeholder), use the standard one
  document.querySelectorAll('img[src*="i.ytimg.com"][src*="maxresdefault"]').forEach(function (im) {
    var fix = function () { if (im.naturalWidth && im.naturalWidth <= 120) im.src = im.src.replace('maxresdefault', 'hqdefault'); };
    if (im.complete) fix(); else im.addEventListener('load', fix);
  });
})();
