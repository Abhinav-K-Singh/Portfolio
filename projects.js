/* Renders project cards (home), the Project Lab (projects.html) and project
   detail pages (project.html) from projects-data.js. No content lives here. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var page = document.body.getAttribute('data-page');
  var ALL = (window.PROJECTS || []).slice().sort(function (a, b) {
    return (b.date || '').localeCompare(a.date || '');
  });
  var CAT = { work: 'Work', hobby: 'Hobby', study: 'Study' };
  var STATUS = { 'shipped': 'Shipped', 'in-progress': 'In progress', 'archived': 'Archived' };

  /* theme persistence on every page */
  try { var saved = localStorage.getItem('theme'); if (saved) document.documentElement.setAttribute('data-theme', saved); } catch (e) {}
  new MutationObserver(function () {
    try { localStorage.setItem('theme', document.documentElement.getAttribute('data-theme') || ''); } catch (e) {}
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* helpers (all text goes through textContent, never innerHTML) */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function safeUrl(u) { return /^https?:\/\//i.test(u || '') ? u : null; }
  function monthLabel(d) {
    if (!d) return '';
    var m = /^(\d{4})-(\d{2})$/.exec(d);
    if (!m) return d;
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m[2] - 1] + ' ' + m[1];
  }
  function arch(flow) {
    var box = el('div', 'arch');
    (flow || []).forEach(function (f, i) {
      if (i) box.appendChild(el('span', 'lc'));
      var tone = /^[bsg]$/.test(f.tone) ? f.tone : 'b';
      box.appendChild(el('span', 'an ' + tone, f.label));
    });
    return box;
  }
  function chips(list, cls) {
    var box = el('div', cls || 'pm');
    (list || []).forEach(function (t) { box.appendChild(el('span', null, t)); });
    return box;
  }
  function card(p) {
    var a = el('a', 'proj');
    a.href = 'project.html?id=' + encodeURIComponent(p.id);
    var top = el('div', 'ptop');
    top.appendChild(el('span', 'cat ' + p.category, CAT[p.category] || p.category));
    if (p.status && p.status !== 'shipped') top.appendChild(el('span', 'stat', STATUS[p.status] || p.status));
    a.appendChild(top);
    a.appendChild(el('span', 'stack', (p.stack || []).join(' · ')));
    a.appendChild(el('h3', null, p.title));
    if (p.flow && p.flow.length) a.appendChild(arch(p.flow));
    a.appendChild(el('p', 'sum', p.summary));
    a.appendChild(chips(p.tags));
    a.appendChild(el('span', 'open', 'View details →'));
    return a;
  }
  function fill(box, list, emptyMsg) {
    box.textContent = '';
    if (!list.length) { box.appendChild(el('p', 'empty', emptyMsg)); return; }
    list.forEach(function (p) { box.appendChild(card(p)); });
  }

  /* shared chrome for pages without script.js */
  if (page !== 'home') {
    var theme = $('#theme');
    if (theme) theme.addEventListener('click', function () {
      var r = document.documentElement, cur = r.getAttribute('data-theme');
      var dark = cur ? cur === 'dark' : (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
      r.setAttribute('data-theme', dark ? 'light' : 'dark');
    });
    var hdr = $('#hdr'), burger = $('#burger');
    if (burger) burger.addEventListener('click', function () {
      var o = hdr.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o);
    });
    var prog = $('#prog');
    if (prog) {
      var onScroll = function () {
        var h = document.documentElement.scrollHeight - innerHeight;
        prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
      };
      addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
  }

  /* ---------- home: featured cards ---------- */
  if (page === 'home') {
    var feat = $('#featured');
    if (feat) fill(feat, ALL.filter(function (p) { return p.featured; }).slice(0, 4), 'No featured projects yet.');
  }

  /* ---------- Project Lab ---------- */
  if (page === 'lab') {
    var grid = $('#grid'), catBox = $('#labcats'), q = $('#q'), sql = $('#labsql'), cnt = $('#labcnt');
    var cur = 'all';
    var cats = ['all', 'work', 'hobby', 'study'];
    var wanted = (new URLSearchParams(location.search).get('cat') || '').toLowerCase();
    if (cats.indexOf(wanted) > -1) cur = wanted;

    function draw() {
      var term = (q.value || '').trim().toLowerCase();
      var rows = ALL.filter(function (p) {
        if (cur !== 'all' && p.category !== cur) return false;
        if (!term) return true;
        return [p.title, p.summary, (p.stack || []).join(' '), (p.tags || []).join(' ')].join(' ').toLowerCase().indexOf(term) > -1;
      });
      sql.textContent = '';
      function kw(t) { return el('span', 'kw', t); }
      sql.appendChild(kw('SELECT')); sql.appendChild(document.createTextNode(' * '));
      sql.appendChild(kw('FROM')); sql.appendChild(document.createTextNode(' abhinav.projects'));
      var conds = [];
      if (cur !== 'all') conds.push(['category = ', "'" + cur + "'"]);
      if (term) conds.push(['search ', "LIKE '%" + term.replace(/'/g, '') + "%'"]);
      conds.forEach(function (c, i) {
        sql.appendChild(document.createTextNode('\n'));
        sql.appendChild(kw(i ? 'AND' : 'WHERE'));
        sql.appendChild(document.createTextNode(' ' + c[0]));
        sql.appendChild(el('span', 'str', c[1]));
      });
      sql.appendChild(document.createTextNode(';'));
      var msg = cur === 'all' && !term ? 'No projects yet.' : 'Nothing matches yet. New ' + (cur === 'all' ? '' : cur + ' ') + 'projects land here as I build them.';
      fill(grid, rows, msg);
      cnt.textContent = '(' + rows.length + (rows.length === 1 ? ' row)' : ' rows)');
      catBox.querySelectorAll('.fbtn').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.c === cur); });
    }
    cats.forEach(function (c) {
      var n = ALL.filter(function (p) { return c === 'all' || p.category === c; }).length;
      var b = el('button', 'fbtn', (c === 'all' ? 'all' : c) + ' · ' + n);
      b.type = 'button'; b.dataset.c = c;
      b.addEventListener('click', function () { cur = c; draw(); });
      catBox.appendChild(b);
    });
    q.addEventListener('input', draw);
    draw();
  }

  /* ---------- project detail ---------- */
  if (page === 'detail') {
    var root = $('#project');
    var id = new URLSearchParams(location.search).get('id');
    var idx = -1;
    ALL.forEach(function (p, i) { if (p.id === id) idx = i; });
    root.textContent = '';
    if (idx < 0) {
      var nf = el('div', 'nf');
      nf.appendChild(el('span', 'label', '404 · row not found'));
      nf.appendChild(el('h1', null, 'No such project'));
      nf.appendChild(el('p', 'lede', 'That project id does not exist in the Project Lab.'));
      var back = el('a', 'btn primary', '← All projects'); back.href = 'projects.html';
      nf.appendChild(back);
      root.appendChild(nf);
    } else {
      var p = ALL[idx];
      document.title = p.title + ' | Abhinav Kumar Singh';
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute('content', p.summary || p.title);

      var crumb = el('a', 'crumb', '← Project Lab'); crumb.href = 'projects.html';
      root.appendChild(crumb);

      var head = el('header', 'phead');
      var meta = el('div', 'ptop');
      meta.appendChild(el('span', 'cat ' + p.category, CAT[p.category] || p.category));
      meta.appendChild(el('span', 'stat', STATUS[p.status] || p.status || ''));
      if (p.date) meta.appendChild(el('span', 'stat', monthLabel(p.date)));
      head.appendChild(meta);
      head.appendChild(el('h1', 'ptitle', p.title));
      head.appendChild(el('p', 'lede', p.summary));
      if (p.flow && p.flow.length) head.appendChild(arch(p.flow));
      root.appendChild(head);

      if (p.metrics && p.metrics.length) {
        var m = el('div', 'metrics auto');
        p.metrics.forEach(function (x) {
          var d = el('div'); d.appendChild(el('strong', null, x.value)); d.appendChild(el('span', null, x.label)); m.appendChild(d);
        });
        root.appendChild(m);
      }

      var body = el('div', 'pbody');
      var main = el('div', 'pmain');
      (p.sections || []).forEach(function (s) {
        var sec = el('section', 'psec');
        if (s.heading) sec.appendChild(el('h2', null, s.heading));
        if (s.body) sec.appendChild(el('p', null, s.body));
        if (s.bullets && s.bullets.length) {
          var ul = el('ul'); s.bullets.forEach(function (b) { ul.appendChild(el('li', null, b)); }); sec.appendChild(ul);
        }
        main.appendChild(sec);
      });
      body.appendChild(main);

      var side = el('aside', 'pside');
      function block(title, node) { var b = el('div', 'pblock'); b.appendChild(el('span', 'label', title)); b.appendChild(node); side.appendChild(b); }
      if (p.role) block('Role', el('p', null, p.role));
      if (p.stack && p.stack.length) block('Stack', chips(p.stack, 'chips'));
      if (p.tags && p.tags.length) block('Tags', chips(p.tags, 'chips'));
      var good = (p.links || []).filter(function (l) { return safeUrl(l.url); });
      if (good.length) {
        var lk = el('div', 'links');
        good.forEach(function (l) {
          var a = el('a', 'btn', l.label + ' ↗'); a.href = l.url; a.target = '_blank'; a.rel = 'noopener'; lk.appendChild(a);
        });
        block('Links', lk);
      }
      body.appendChild(side);
      root.appendChild(body);

      var nav = el('nav', 'pnav'); nav.setAttribute('aria-label', 'More projects');
      [[ALL[idx - 1], '← Newer'], [ALL[idx + 1], 'Older →']].forEach(function (x) {
        if (!x[0]) { nav.appendChild(el('span')); return; }
        var a = el('a', 'pn');
        a.href = 'project.html?id=' + encodeURIComponent(x[0].id);
        a.appendChild(el('span', 'label', x[1])); a.appendChild(el('b', null, x[0].title));
        nav.appendChild(a);
      });
      root.appendChild(nav);
    }
  }
})();
