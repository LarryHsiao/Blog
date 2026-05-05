+++
title = "GUID Generator"
description = "Generate v4 GUIDs (UUIDs) using the browser's cryptographic RNG."
template = "tool.html"
weight = 60
+++

<div class="tool-controls">
  <label>Version
    <select id="uuid-version">
      <option value="v4" selected>v4 (random)</option>
      <option value="v7">v7 (time-ordered)</option>
    </select>
  </label>
  <button type="button" data-action="one">Generate</button>
  <button type="button" data-action="ten">Generate 10</button>
  <button type="button" data-action="copy">Copy all</button>
  <button type="button" data-action="clear">Clear</button>
  <label><input type="checkbox" id="uuid-upper"> Uppercase</label>
</div>

<label class="tool-field">
  <span>Output (one per line)</span>
  <textarea id="uuid-output" spellcheck="false" readonly></textarea>
</label>

<p class="tool-status" id="uuid-status" aria-live="polite"></p>

<script>
(function () {
  const output = document.getElementById('uuid-output');
  const upper = document.getElementById('uuid-upper');
  const version = document.getElementById('uuid-version');
  const status = document.getElementById('uuid-status');
  const labels = { copied: 'Copied to clipboard', copyFail: 'Copy failed', empty: 'No UUIDs generated yet.' };

  function setStatus(msg, kind) { status.textContent = msg || ''; status.dataset.kind = kind || ''; }
  function fmt(s) { return upper.checked ? s.toUpperCase() : s.toLowerCase(); }
  function uuidv7() {
    const ms = Date.now();
    const bytes = new Uint8Array(16);
    bytes[0] = Math.floor(ms / 0x10000000000) & 0xff;
    bytes[1] = Math.floor(ms / 0x100000000) & 0xff;
    bytes[2] = (ms >>> 24) & 0xff;
    bytes[3] = (ms >>> 16) & 0xff;
    bytes[4] = (ms >>> 8) & 0xff;
    bytes[5] = ms & 0xff;
    crypto.getRandomValues(bytes.subarray(6));
    bytes[6] = (bytes[6] & 0x0f) | 0x70;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
  }
  function gen() { return version.value === 'v7' ? uuidv7() : crypto.randomUUID(); }
  function append(n) {
    const lines = [];
    for (let i = 0; i < n; i++) lines.push(fmt(gen()));
    output.value = output.value ? output.value + '\n' + lines.join('\n') : lines.join('\n');
    setStatus('');
  }
  document.querySelector('.tool-controls').addEventListener('click', async function (e) {
    const action = e.target.dataset && e.target.dataset.action;
    if (action === 'one') append(1);
    if (action === 'ten') append(10);
    if (action === 'clear') { output.value = ''; setStatus(''); }
    if (action === 'copy') {
      if (!output.value) { setStatus(labels.empty, 'warn'); return; }
      try { await navigator.clipboard.writeText(output.value); setStatus(labels.copied, 'ok'); }
      catch (_) { setStatus(labels.copyFail, 'err'); }
    }
  });
  upper.addEventListener('change', function () {
    if (!output.value) return;
    output.value = output.value.split('\n').map(fmt).join('\n');
  });
})();
</script>
