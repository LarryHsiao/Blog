+++
title = "URL Encode / Decode"
description = "Percent-encode and decode URL strings or URL components."
template = "tool.html"
weight = 25
+++

<div class="tool-controls">
  <label>Mode
    <select id="url-mode">
      <option value="component" selected>Component (encodeURIComponent)</option>
      <option value="uri">Full URI (encodeURI)</option>
    </select>
  </label>
  <button type="button" data-action="encode">Encode</button>
  <button type="button" data-action="decode">Decode</button>
  <button type="button" data-action="swap">↕ Swap</button>
  <button type="button" data-action="copy">Copy output</button>
  <button type="button" data-action="clear">Clear</button>
</div>

<div class="tool-grid">
  <label class="tool-field">
    <span>Input</span>
    <textarea id="url-input" spellcheck="false" placeholder="Paste a URL or text to encode"></textarea>
  </label>
  <label class="tool-field">
    <span>Output</span>
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
  const labels = { ok: 'Done', empty: 'Enter some text first.', copied: 'Copied to clipboard', copyFail: 'Copy failed', invalid: 'Invalid percent-encoded string' };

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
