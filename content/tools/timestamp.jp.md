+++
title = "タイムスタンプ変換"
description = "Unix epoch、ISO 8601、ローカル時刻の相互変換。"
template = "tool.html"
weight = 40
+++

<div class="tool-controls">
  <button type="button" data-action="now">現在</button>
  <button type="button" data-action="clear">クリア</button>
</div>

<label class="tool-field">
  <span>入力（epoch 秒／ミリ秒、または日付文字列）</span>
  <textarea id="ts-input" spellcheck="false" placeholder="1714867200 / 2026-05-05T00:00:00Z / 2026-05-05"></textarea>
</label>

<div class="tool-grid">
  <label class="tool-field">
    <span>Unix epoch（秒）</span>
    <input id="ts-secs" type="text" readonly>
  </label>
  <label class="tool-field">
    <span>Unix epoch（ミリ秒）</span>
    <input id="ts-ms" type="text" readonly>
  </label>
  <label class="tool-field">
    <span>ISO 8601（UTC）</span>
    <input id="ts-iso" type="text" readonly>
  </label>
  <label class="tool-field">
    <span>ローカル時刻</span>
    <input id="ts-local" type="text" readonly>
  </label>
</div>

<label class="tool-field">
  <span>相対時刻</span>
  <input id="ts-rel" type="text" readonly>
</label>

<p class="tool-status" id="ts-status" aria-live="polite"></p>

<script>
(function () {
  const LOCALE = 'ja';
  const input = document.getElementById('ts-input');
  const out = {
    secs: document.getElementById('ts-secs'),
    ms: document.getElementById('ts-ms'),
    iso: document.getElementById('ts-iso'),
    local: document.getElementById('ts-local'),
    rel: document.getElementById('ts-rel'),
  };
  const status = document.getElementById('ts-status');
  const labels = { ok: '解析しました', empty: '時刻を入力してください。', invalid: '時刻フォーマットを解析できませんでした。' };

  function setStatus(msg, kind) { status.textContent = msg || ''; status.dataset.kind = kind || ''; }
  function clearOut() { Object.values(out).forEach(el => el.value = ''); }
  function parse(s) {
    s = s.trim();
    if (!s) return null;
    if (/^-?\d+$/.test(s)) {
      const n = Number(s);
      const ms = Math.abs(n) >= 1e12 ? n : n * 1000;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  function relative(d) {
    const diff = (d.getTime() - Date.now()) / 1000;
    const abs = Math.abs(diff);
    const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
    if (abs < 60) return rtf.format(Math.round(diff), 'second');
    if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day');
    if (abs < 86400 * 365) return rtf.format(Math.round(diff / (86400 * 30)), 'month');
    return rtf.format(Math.round(diff / (86400 * 365)), 'year');
  }
  function render() {
    const src = input.value;
    if (!src.trim()) { clearOut(); setStatus(''); return; }
    const d = parse(src);
    if (!d) { clearOut(); setStatus(labels.invalid, 'err'); return; }
    out.secs.value = String(Math.round(d.getTime() / 1000));
    out.ms.value = String(d.getTime());
    out.iso.value = d.toISOString();
    out.local.value = d.toLocaleString(LOCALE);
    out.rel.value = relative(d);
    setStatus(labels.ok, 'ok');
  }
  document.querySelector('.tool-controls').addEventListener('click', function (e) {
    const action = e.target.dataset && e.target.dataset.action;
    if (action === 'now') { input.value = new Date().toISOString(); render(); }
    if (action === 'clear') { input.value = ''; clearOut(); setStatus(''); }
  });
  input.addEventListener('input', render);
})();
</script>
