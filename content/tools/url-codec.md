+++
title = "URL 編碼／解碼"
description = "對 URL 字串或 URL 元件進行百分比編碼／解碼。"
template = "tool.html"
weight = 25
+++

<div class="tool-controls">
  <label>模式
    <select id="url-mode">
      <option value="component" selected>元件（encodeURIComponent）</option>
      <option value="uri">完整 URI（encodeURI）</option>
    </select>
  </label>
  <button type="button" data-action="encode">編碼</button>
  <button type="button" data-action="decode">解碼</button>
  <button type="button" data-action="swap">↕ 交換</button>
  <button type="button" data-action="copy">複製結果</button>
  <button type="button" data-action="clear">清除</button>
</div>

<div class="tool-grid">
  <label class="tool-field">
    <span>輸入</span>
    <textarea id="url-input" spellcheck="false" placeholder="輸入 URL 或要編碼的字串"></textarea>
  </label>
  <label class="tool-field">
    <span>輸出</span>
    <textarea id="url-output" spellcheck="false" readonly></textarea>
  </label>
</div>

<p class="tool-status" id="url-status" aria-live="polite"></p>

<script>
(function () {
  const input = document.getElementById('url-input');
  const output = document.getElementById('url-output');
  const mode = document.getElementById('url-mode');
  const status = document.getElementById('url-status');
  const labels = { ok: '完成', empty: '請輸入內容。', copied: '已複製到剪貼簿', copyFail: '複製失敗', invalid: '無效的百分比編碼字串' };

  function setStatus(msg, kind) { status.textContent = msg || ''; status.dataset.kind = kind || ''; }
  function enc(s) { return mode.value === 'uri' ? encodeURI(s) : encodeURIComponent(s); }
  function dec(s) { return mode.value === 'uri' ? decodeURI(s) : decodeURIComponent(s); }
  function encode() {
    const src = input.value;
    if (!src) { output.value = ''; setStatus(labels.empty, 'warn'); return; }
    try { output.value = enc(src); setStatus(labels.ok, 'ok'); }
    catch (e) { setStatus(String(e.message || e), 'err'); }
  }
  function decode() {
    const src = input.value;
    if (!src) { output.value = ''; setStatus(labels.empty, 'warn'); return; }
    try { output.value = dec(src); setStatus(labels.ok, 'ok'); }
    catch (e) { output.value = ''; setStatus(labels.invalid, 'err'); }
  }
  document.querySelector('.tool-controls').addEventListener('click', async function (e) {
    const action = e.target.dataset && e.target.dataset.action;
    if (!action) return;
    if (action === 'encode') encode();
    if (action === 'decode') decode();
    if (action === 'swap') { const t = input.value; input.value = output.value; output.value = t; setStatus(''); }
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(''); }
    if (action === 'copy') {
      if (!output.value) return;
      try { await navigator.clipboard.writeText(output.value); setStatus(labels.copied, 'ok'); }
      catch (_) { setStatus(labels.copyFail, 'err'); }
    }
  });
})();
</script>
