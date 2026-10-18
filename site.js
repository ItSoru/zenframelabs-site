// Pulls the latest Zenframe Assistant release from GitHub so the version,
// download button and changelog update by themselves on every release.
(function () {
  var REPO = 'ItSoru/zenframe-assistant';
  function $(sel) { return document.querySelectorAll('[data-zf="' + sel + '"]'); }
  function setText(sel, text) { $(sel).forEach(function (el) { el.textContent = text; }); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  // Turns release notes like "- **Title.** Details" into changelog rows.
  function parseNotes(md) {
    var rows = [];
    String(md || '').split(/\r?\n/).forEach(function (line) {
      var m = /^\s*[-*]\s+(.*)$/.exec(line);
      if (!m) return;
      var item = m[1].trim(), title = '', detail = item;
      var b = /^\*\*(.+?)\*\*\s*(.*)$/.exec(item);
      if (b) { title = b[1].replace(/[.:]\s*$/, ''); detail = b[2]; }
      detail = detail.replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
      if (!title) { title = detail; detail = ''; }
      rows.push({ t: title, d: detail });
    });
    return rows;
  }

  fetch('https://api.github.com/repos/' + REPO + '/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (rel) {
      if (!rel || !rel.tag_name) return;
      var v = rel.tag_name.replace(/^v/, '');
      setText('pill', 'Zenframe Assistant ' + v + ' is out');
      setText('ver', 'Version ' + v);
      setText('dl', 'Download ' + v);
      setText('getline', 'Zenframe Assistant ' + v);
      var zip = (rel.assets || []).filter(function (a) { return /\.zip$/i.test(a.name); })[0];
      if (zip) $('dl').forEach(function (a) { a.href = zip.browser_download_url; });
      var rows = parseNotes(rel.body);
      var list = $('changes')[0];
      if (list && rows.length >= 2) {
        list.innerHTML = rows.slice(0, 6).map(function (r) {
          return '<li style="display: flex; gap: 16px; padding: 14px 0; border-bottom: 1px solid #1C1924">' +
            '<span style="flex: 0 0 auto; margin-top: 7px; width: 8px; height: 8px; border-radius: 50%; background: #B8A5F8"></span>' +
            '<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 700; font-size: 16px">' + esc(r.t) + '</span>' +
            (r.d ? '<span style="font-size: 15px; line-height: 1.55; color: #A49FB4">' + esc(r.d) + '</span>' : '') + '</div></li>';
        }).join('');
      }
    })
    .catch(function () { /* offline or rate-limited: the built-in text stays */ });
})();
