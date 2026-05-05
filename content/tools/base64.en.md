+++
title = "Base64 Encode / Decode"
description = "Convert between plain text and Base64, with optional URL-safe variant."
template = "tool.html"
weight = 20
+++

<div class="tool-controls">
  <label><input type="checkbox" id="b64-urlsafe"> URL-safe</label>
  <button type="button" data-action="encode">Encode</button>
  <button type="button" data-action="decode">Decode</button>
  <button type="button" data-action="swap">↕ Swap</button>
  <button type="button" data-action="copy">Copy output</button>
  <button type="button" data-action="clear">Clear</button>
</div>

<div class="tool-grid">
  <label class="tool-field">
    <span>Input</span>
    <textarea id="b64-input" spellcheck="false" placeholder="Plain text or Base64 string"></textarea>
  </label>
  <label class="tool-field">
    <span>Output</span>
    <textarea id="b64-output" spellcheck="false" readonly></textarea>
  </label>
</div>

<p class="tool-status" id="b64-status" aria-live="polite"></p>

<script>
(function () {
  const input = document.getElementById('b64-input');
  const output = document.getElementById('b64-output');
  const status = document.getElementById('b64-status');
  const urlSafe = document.getElementById('b64-urlsafe');
  const labels = { ok: 'Done', empty: 'Enter some text first.', copied: 'Copied to clipboard', copyFail: 'Copy failed', invalid: 'Not a valid Base64 string' };

  function setStatus(msg, kind) { status.textContent = msg || ''; status.dataset.kind = kind || ''; }
  function toUrlSafe(s) { return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function fromUrlSafe(s) {
    let r = s.replace(/-/g, '+').replace(/_/g, '/');
    while (r.length % 4) r += '=';
    return r;
  }
  function encode() {
    const src = input.value;
    if (!src) { output.value = ''; setStatus(labels.empty, 'warn'); return; }
    try {
      const bytes = new TextEncoder().encode(src);
      let bin = '';
      bytes.forEach(b => bin += String.fromCharCode(b));
      let out = btoa(bin);
      if (urlSafe.checked) out = toUrlSafe(out);
      output.value = out;
      setStatus(labels.ok, 'ok');
    } catch (e) { setStatus(String(e.message || e), 'err'); }
  }
  function decode() {
    const src = input.value.trim();
    if (!src) { output.value = ''; setStatus(labels.empty, 'warn'); return; }
    try {
      const cleaned = urlSafe.checked || /[-_]/.test(src) ? fromUrlSafe(src) : src;
      const bin = atob(cleaned);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      output.value = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      setStatus(labels.ok, 'ok');
    } catch (e) { output.value = ''; setStatus(labels.invalid, 'err'); }
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
