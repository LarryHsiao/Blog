+++
title = "正規表達式測試"
description = "即時測試 JavaScript 正規表達式，並標示符合位置與捕獲群組。"
template = "tool.html"
weight = 80
+++

<div class="regex-layout">
  <div class="regex-left">
    <label class="tool-field">
      <span>Pattern</span>
      <div class="regex-pattern-row">
        <input type="text" id="regex-pattern" spellcheck="false" placeholder="例如：(\w+)@(\w+\.\w+)">
        <button type="button" class="tool-clear-btn" data-action="clear">清除</button>
      </div>
    </label>
    <div class="tool-field">
      <span>Flags</span>
      <div class="regex-flags">
        <label><input type="checkbox" class="regex-flag" value="g" checked> g</label>
        <label><input type="checkbox" class="regex-flag" value="i"> i</label>
        <label><input type="checkbox" class="regex-flag" value="m"> m</label>
        <label><input type="checkbox" class="regex-flag" value="s"> s</label>
        <label><input type="checkbox" class="regex-flag" value="u"> u</label>
        <label><input type="checkbox" class="regex-flag" value="y"> y</label>
        <details class="regex-flags-info">
          <summary aria-label="旗標說明">ⓘ</summary>
          <dl>
            <dt>g</dt><dd>全域 — 找出所有符合，否則只取第一個。</dd>
            <dt>i</dt><dd>不分大小寫。</dd>
            <dt>m</dt><dd>多行 — <code>^</code> 與 <code>$</code> 對應每一行的開頭與結尾。</dd>
            <dt>s</dt><dd>單行 — <code>.</code> 也會對應換行字元。</dd>
            <dt>u</dt><dd>Unicode — 啟用 <code>\u{...}</code>、<code>\p{...}</code>，並對非法跳脫嚴格處理。</dd>
            <dt>y</dt><dd>黏著 — 比對必須從 <code>lastIndex</code> 開始，不會向前搜尋。</dd>
          </dl>
        </details>
      </div>
    </div>
    <label class="tool-field regex-text-field">
      <span>測試文字</span>
      <textarea id="regex-text" spellcheck="false" placeholder="貼上要比對的內容"></textarea>
    </label>
  </div>
  <div class="regex-right">
    <div class="tool-field">
      <span>標示結果</span>
      <pre id="regex-highlighted" class="regex-highlighted"></pre>
    </div>
    <div class="tool-field">
      <span>符合明細</span>
      <ol id="regex-matches" class="regex-matches"></ol>
    </div>
  </div>
</div>

<p class="tool-status" id="regex-status" aria-live="polite"></p>

<script>
(function () {
  const patternEl = document.getElementById('regex-pattern');
  const textEl = document.getElementById('regex-text');
  const flagEls = document.querySelectorAll('.regex-flag');
  const highlighted = document.getElementById('regex-highlighted');
  const matchesEl = document.getElementById('regex-matches');
  const status = document.getElementById('regex-status');
  const labels = { invalid: '無效的正規表達式：', none: '沒有符合', count: n => `${n} 個符合`, capped: '（僅顯示前 500 個）' };
  const MAX = 500;

  function setStatus(msg, kind) { status.textContent = msg || ''; status.dataset.kind = kind || ''; }
  function esc(s) { return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]); }
  function flagsString() { return Array.from(flagEls).filter(i => i.checked).map(i => i.value).join(''); }

  function render() {
    const pattern = patternEl.value;
    const text = textEl.value;
    matchesEl.innerHTML = '';
    highlighted.innerHTML = '';
    if (!pattern) { setStatus(''); return; }
    let re;
    try { re = new RegExp(pattern, flagsString()); }
    catch (e) { setStatus(labels.invalid + e.message, 'err'); return; }
    if (!text) { setStatus(''); return; }
    const isGlobal = re.flags.includes('g');
    let matches = [];
    try {
      if (isGlobal) {
        for (const m of text.matchAll(re)) {
          matches.push(m);
          if (matches.length >= MAX) break;
        }
      } else {
        const m = re.exec(text);
        if (m) matches.push(m);
      }
    } catch (e) { setStatus(labels.invalid + e.message, 'err'); return; }

    let cursor = 0;
    let html = '';
    for (const m of matches) {
      const idx = m.index;
      html += esc(text.slice(cursor, idx));
      html += '<mark>' + esc(m[0]) + '</mark>';
      cursor = idx + (m[0].length || 1);
    }
    html += esc(text.slice(cursor));
    highlighted.innerHTML = html;

    if (matches.length === 0) { setStatus(labels.none, 'warn'); return; }
    matches.forEach((m, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<code>${esc(m[0])}</code> <span class="regex-meta">@ ${m.index}</span>`;
      if (m.length > 1) {
        const ul = document.createElement('ul');
        for (let g = 1; g < m.length; g++) {
          const gli = document.createElement('li');
          const v = m[g];
          gli.innerHTML = `Group ${g}: ` + (v === undefined ? '<em>undefined</em>' : '<code>' + esc(v) + '</code>');
          ul.appendChild(gli);
        }
        li.appendChild(ul);
      }
      if (m.groups) {
        const ul = document.createElement('ul');
        for (const [name, val] of Object.entries(m.groups)) {
          const gli = document.createElement('li');
          gli.innerHTML = `<em>${esc(name)}</em>: ` + (val === undefined ? '<em>undefined</em>' : '<code>' + esc(val) + '</code>');
          ul.appendChild(gli);
        }
        li.appendChild(ul);
      }
      matchesEl.appendChild(li);
    });
    let msg = labels.count(matches.length);
    if (matches.length === MAX) msg += ' ' + labels.capped;
    setStatus(msg, 'ok');
  }

  patternEl.addEventListener('input', render);
  textEl.addEventListener('input', render);
  flagEls.forEach(el => el.addEventListener('change', render));
  document.querySelector('.tool-clear-btn').addEventListener('click', function () {
    patternEl.value = ''; textEl.value = '';
    matchesEl.innerHTML = ''; highlighted.innerHTML = ''; setStatus('');
  });
})();
</script>
