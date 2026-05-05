+++
title = "雜湊計算"
description = "計算文字的 SHA-1、SHA-256、SHA-384、SHA-512 雜湊值；支援 HMAC 模式（搭配密鑰）。"
template = "tool.html"
weight = 50
+++

<div class="tool-controls">
  <label>模式
    <select id="hash-mode">
      <option value="hash" selected>Hash</option>
      <option value="hmac">HMAC</option>
    </select>
  </label>
  <button type="button" data-action="clear">清除</button>
</div>

<label class="tool-field" id="hash-key-field" hidden>
  <span>密鑰（HMAC）</span>
  <textarea id="hash-key" spellcheck="false" placeholder="輸入 HMAC 密鑰"></textarea>
</label>

<label class="tool-field">
  <span>輸入</span>
  <textarea id="hash-input" spellcheck="false" placeholder="輸入要雜湊的文字"></textarea>
</label>

<div class="tool-grid">
  <label class="tool-field">
    <span>SHA-1</span>
    <input id="hash-sha1" type="text" readonly>
  </label>
  <label class="tool-field">
    <span>SHA-256</span>
    <input id="hash-sha256" type="text" readonly>
  </label>
  <label class="tool-field">
    <span>SHA-384</span>
    <input id="hash-sha384" type="text" readonly>
  </label>
  <label class="tool-field">
    <span>SHA-512</span>
    <input id="hash-sha512" type="text" readonly>
  </label>
</div>

<p class="tool-status" id="hash-status" aria-live="polite"></p>

<script>
(function () {
  const input = document.getElementById('hash-input');
  const key = document.getElementById('hash-key');
  const keyField = document.getElementById('hash-key-field');
  const mode = document.getElementById('hash-mode');
  const out = {
    'SHA-1': document.getElementById('hash-sha1'),
    'SHA-256': document.getElementById('hash-sha256'),
    'SHA-384': document.getElementById('hash-sha384'),
    'SHA-512': document.getElementById('hash-sha512'),
  };
  const status = document.getElementById('hash-status');
  const labels = { ok: '完成', err: '計算失敗' };

  function setStatus(msg, kind) { status.textContent = msg || ''; status.dataset.kind = kind || ''; }
  function clearOut() { Object.values(out).forEach(el => el.value = ''); }
  function hex(buf) { return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''); }
  async function digest(algo, bytes) { return await crypto.subtle.digest(algo, bytes); }
  async function hmac(algo, keyBytes, msgBytes) {
    const k = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: { name: algo } }, false, ['sign']);
    return await crypto.subtle.sign('HMAC', k, msgBytes);
  }
  let token = 0;
  async function render() {
    const src = input.value;
    const isHmac = mode.value === 'hmac';
    if (!src) { clearOut(); setStatus(''); return; }
    const my = ++token;
    try {
      const msgBytes = new TextEncoder().encode(src);
      const algos = Object.keys(out);
      let results;
      if (isHmac) {
        const keyBytes = new TextEncoder().encode(key.value);
        results = await Promise.all(algos.map(a => hmac(a, keyBytes, msgBytes)));
      } else {
        results = await Promise.all(algos.map(a => digest(a, msgBytes)));
      }
      if (my !== token) return;
      algos.forEach((a, i) => out[a].value = hex(results[i]));
      setStatus(labels.ok, 'ok');
    } catch (e) {
      if (my !== token) return;
      clearOut();
      setStatus(labels.err, 'err');
    }
  }
  function applyMode() {
    keyField.hidden = mode.value !== 'hmac';
    render();
  }
  document.querySelector('.tool-controls').addEventListener('click', function (e) {
    if (e.target.dataset && e.target.dataset.action === 'clear') {
      input.value = ''; key.value = ''; clearOut(); setStatus('');
    }
  });
  mode.addEventListener('change', applyMode);
  input.addEventListener('input', render);
  key.addEventListener('input', render);
})();
</script>
