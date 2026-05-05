+++
title = "ハッシュ"
description = "テキストの SHA-1、SHA-256、SHA-384、SHA-512 ハッシュ値（hex）を計算します。"
template = "tool.html"
weight = 50
+++

<div class="tool-controls">
  <button type="button" data-action="clear">クリア</button>
</div>

<label class="tool-field">
  <span>入力</span>
  <textarea id="hash-input" spellcheck="false" placeholder="ハッシュするテキストを入力"></textarea>
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
  const out = {
    'SHA-1': document.getElementById('hash-sha1'),
    'SHA-256': document.getElementById('hash-sha256'),
    'SHA-384': document.getElementById('hash-sha384'),
    'SHA-512': document.getElementById('hash-sha512'),
  };
  const status = document.getElementById('hash-status');
  const labels = { ok: '完了', err: 'ハッシュ計算に失敗しました' };

  function setStatus(msg, kind) { status.textContent = msg || ''; status.dataset.kind = kind || ''; }
  function clearOut() { Object.values(out).forEach(el => el.value = ''); }
  function hex(buf) { return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''); }
  let token = 0;
  async function render() {
    const src = input.value;
    if (!src) { clearOut(); setStatus(''); return; }
    const my = ++token;
    try {
      const bytes = new TextEncoder().encode(src);
      const algos = Object.keys(out);
      const digests = await Promise.all(algos.map(a => crypto.subtle.digest(a, bytes)));
      if (my !== token) return;
      algos.forEach((a, i) => out[a].value = hex(digests[i]));
      setStatus(labels.ok, 'ok');
    } catch (e) {
      if (my !== token) return;
      clearOut();
      setStatus(labels.err, 'err');
    }
  }
  document.querySelector('.tool-controls').addEventListener('click', function (e) {
    if (e.target.dataset && e.target.dataset.action === 'clear') {
      input.value = ''; clearOut(); setStatus('');
    }
  });
  input.addEventListener('input', render);
})();
</script>
