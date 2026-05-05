+++
title = "JSON フォーマッタ"
description = "JSON 文字列を整形・圧縮・検証します。"
template = "tool.html"
weight = 10
+++

<div class="tool-controls">
  <label for="json-indent">インデント</label>
  <select id="json-indent">
    <option value="2" selected>スペース 2</option>
    <option value="4">スペース 4</option>
    <option value="\t">タブ</option>
  </select>
  <button type="button" data-action="format">整形</button>
  <button type="button" data-action="minify">圧縮</button>
  <button type="button" data-action="copy">結果をコピー</button>
  <button type="button" data-action="clear">クリア</button>
</div>

<div class="tool-grid">
  <label class="tool-field">
    <span>入力</span>
    <textarea id="json-input" spellcheck="false" placeholder='{"hello":"world"}'></textarea>
  </label>
  <label class="tool-field">
    <span>出力</span>
    <textarea id="json-output" spellcheck="false" readonly></textarea>
  </label>
</div>

<p class="tool-status" id="json-status" aria-live="polite"></p>

<script>
(function () {
  const input = document.getElementById('json-input');
  const output = document.getElementById('json-output');
  const indentSel = document.getElementById('json-indent');
  const status = document.getElementById('json-status');
  const labels = { ok: '有効な JSON', empty: 'JSON を入力してください。', copied: 'クリップボードにコピーしました', copyFail: 'コピーに失敗しました' };

  function indent() {
    const v = indentSel.value;
    return v === '\\t' ? '\t' : parseInt(v, 10);
  }
  function setStatus(msg, kind) {
    status.textContent = msg || '';
    status.dataset.kind = kind || '';
  }
  function format(min) {
    const src = input.value.trim();
    if (!src) { output.value = ''; setStatus(labels.empty, 'warn'); return; }
    try {
      const parsed = JSON.parse(src);
      output.value = min ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent());
      setStatus(labels.ok, 'ok');
    } catch (e) {
      output.value = '';
      setStatus(String(e.message || e), 'err');
    }
  }
  document.querySelector('.tool-controls').addEventListener('click', async function (e) {
    const action = e.target.dataset && e.target.dataset.action;
    if (!action) return;
    if (action === 'format' || action === 'minify') {
      if (!input.value.trim() && input.placeholder) input.value = input.placeholder;
      format(action === 'minify');
    }
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(''); }
    if (action === 'copy') {
      if (!output.value) return;
      try { await navigator.clipboard.writeText(output.value); setStatus(labels.copied, 'ok'); }
      catch (_) { setStatus(labels.copyFail, 'err'); }
    }
  });
  input.addEventListener('input', function () { if (input.value.trim()) format(false); else { output.value=''; setStatus(''); } });
})();
</script>
