+++
title = "JWT 解碼"
description = "解碼 JSON Web Token 的 header 與 payload。僅在本地解析，不會驗證簽章。"
template = "tool.html"
weight = 30
+++

<p class="tool-note">⚠️ 此工具只解碼，不驗證簽章。請勿將正式環境的 token 貼到任何網站。</p>

<div class="tool-controls">
  <button type="button" data-action="decode">解碼</button>
  <button type="button" data-action="clear">清除</button>
</div>

<label class="tool-field">
  <span>JWT</span>
  <textarea id="jwt-input" spellcheck="false" placeholder="eyJhbGciOi..."></textarea>
</label>

<div class="tool-grid">
  <label class="tool-field">
    <span>Header</span>
    <textarea id="jwt-header" spellcheck="false" readonly></textarea>
  </label>
  <label class="tool-field">
    <span>Payload</span>
    <textarea id="jwt-payload" spellcheck="false" readonly></textarea>
  </label>
</div>

<div class="tool-field">
  <span>Claims 摘要</span>
  <ul id="jwt-claims" class="tool-claims"></ul>
</div>

<p class="tool-status" id="jwt-status" aria-live="polite"></p>

<script>
(function () {
  const input = document.getElementById('jwt-input');
  const header = document.getElementById('jwt-header');
  const payload = document.getElementById('jwt-payload');
  const claims = document.getElementById('jwt-claims');
  const status = document.getElementById('jwt-status');
  const labels = { ok: '解碼成功', empty: '請貼上 JWT。', bad: 'JWT 格式錯誤（應為 header.payload.signature）。', badPart: '無法解析的區段：', expired: '已過期', notYet: '尚未生效', valid: '有效' };

  function setStatus(msg, kind) { status.textContent = msg || ''; status.dataset.kind = kind || ''; }
  function b64UrlDecode(seg) {
    let s = seg.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }
  function fmt(json) { try { return JSON.stringify(JSON.parse(json), null, 2); } catch { return json; } }
  function tsToLocal(t) {
    if (typeof t !== 'number') return null;
    const ms = t < 1e12 ? t * 1000 : t;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d.toLocaleString();
  }
  function summarize(p) {
    claims.innerHTML = '';
    let obj;
    try { obj = JSON.parse(p); } catch { return; }
    const now = Math.floor(Date.now() / 1000);
    const rows = [];
    if (obj.iss) rows.push(['iss', obj.iss]);
    if (obj.sub) rows.push(['sub', obj.sub]);
    if (obj.aud) rows.push(['aud', Array.isArray(obj.aud) ? obj.aud.join(', ') : obj.aud]);
    if (typeof obj.iat === 'number') rows.push(['iat', tsToLocal(obj.iat) || obj.iat]);
    if (typeof obj.nbf === 'number') {
      const tag = now < obj.nbf ? labels.notYet : labels.valid;
      rows.push(['nbf', (tsToLocal(obj.nbf) || obj.nbf) + ' · ' + tag]);
    }
    if (typeof obj.exp === 'number') {
      const tag = now > obj.exp ? labels.expired : labels.valid;
      rows.push(['exp', (tsToLocal(obj.exp) || obj.exp) + ' · ' + tag]);
    }
    rows.forEach(([k, v]) => {
      const li = document.createElement('li');
      li.innerHTML = '<code>' + k + '</code>: ' + String(v).replace(/[<>]/g, c => c === '<' ? '&lt;' : '&gt;');
      claims.appendChild(li);
    });
  }
  function decode() {
    const src = input.value.trim();
    header.value = ''; payload.value = ''; claims.innerHTML = '';
    if (!src) { setStatus(labels.empty, 'warn'); return; }
    const parts = src.split('.');
    if (parts.length < 2) { setStatus(labels.bad, 'err'); return; }
    try { header.value = fmt(b64UrlDecode(parts[0])); }
    catch (e) { setStatus(labels.badPart + 'header', 'err'); return; }
    try { const p = b64UrlDecode(parts[1]); payload.value = fmt(p); summarize(p); }
    catch (e) { setStatus(labels.badPart + 'payload', 'err'); return; }
    setStatus(labels.ok, 'ok');
  }
  document.querySelector('.tool-controls').addEventListener('click', function (e) {
    const action = e.target.dataset && e.target.dataset.action;
    if (action === 'decode') decode();
    if (action === 'clear') { input.value = ''; header.value = ''; payload.value = ''; claims.innerHTML = ''; setStatus(''); }
  });
  input.addEventListener('input', function () { if (input.value.trim()) decode(); });
})();
</script>
