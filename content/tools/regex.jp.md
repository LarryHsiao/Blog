+++
title = "正規表現テスター"
description = "JavaScript の正規表現をリアルタイムでテストし、マッチ位置とキャプチャグループを表示します。"
template = "tool.html"
weight = 80
+++

<div class="regex-layout">
  <div class="regex-left">
    <label class="tool-field">
      <span>パターン</span>
      <div class="regex-pattern-row">
        <input type="text" id="regex-pattern" spellcheck="false" placeholder="例：(\w+)@(\w+\.\w+)">
        <button type="button" class="tool-clear-btn" data-action="clear">クリア</button>
      </div>
    </label>
    <div class="tool-field">
      <span>フラグ</span>
      <div class="regex-flags">
        <label><input type="checkbox" class="regex-flag" value="g" checked> g</label>
        <label><input type="checkbox" class="regex-flag" value="i"> i</label>
        <label><input type="checkbox" class="regex-flag" value="m"> m</label>
        <label><input type="checkbox" class="regex-flag" value="s"> s</label>
        <label><input type="checkbox" class="regex-flag" value="u"> u</label>
        <label><input type="checkbox" class="regex-flag" value="y"> y</label>
        <details class="regex-flags-info">
          <summary aria-label="フラグの説明">ⓘ</summary>
          <dl>
            <dt>g</dt><dd>グローバル — 全てのマッチを検索。なしの場合は最初のみ。</dd>
            <dt>i</dt><dd>大文字小文字を区別しない。</dd>
            <dt>m</dt><dd>マルチライン — <code>^</code> と <code>$</code> が各行の先頭・末尾にマッチ。</dd>
            <dt>s</dt><dd>ドットオール — <code>.</code> が改行文字にもマッチ。</dd>
            <dt>u</dt><dd>Unicode — <code>\u{...}</code>、<code>\p{...}</code> を有効化。無効なエスケープには厳格。</dd>
            <dt>y</dt><dd>スティッキー — <code>lastIndex</code> から開始する位置で必ずマッチ。前方検索しない。</dd>
          </dl>
        </details>
      </div>
    </div>
    <label class="tool-field regex-text-field">
      <span>テスト文字列</span>
      <textarea id="regex-text" spellcheck="false" placeholder="マッチさせる内容を貼り付け"></textarea>
    </label>
  </div>
  <div class="regex-right">
    <div class="tool-field">
      <span>ハイライト結果</span>
      <pre id="regex-highlighted" class="regex-highlighted"></pre>
    </div>
    <div class="tool-field">
      <span>マッチ詳細</span>
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
  const labels = { invalid: '無効な正規表現：', none: 'マッチなし', count: n => `${n} 件マッチ`, capped: '（先頭 500 件のみ表示）' };
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
