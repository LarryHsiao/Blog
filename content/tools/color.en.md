+++
title = "Color Converter"
description = "Convert between HEX, RGB, and HSL with a native picker."
template = "tool.html"
weight = 70
+++

<div class="tool-controls">
  <input type="color" id="color-picker" value="#e3bc5e">
  <input type="text" id="color-input" placeholder="#ff5733 / rgb(255,87,51) / hsl(11,100%,60%) / red" spellcheck="false">
  <button type="button" data-action="clear">Clear</button>
</div>

<div class="tool-grid">
  <label class="tool-field">
    <span>HEX</span>
    <input id="color-hex" type="text" readonly>
  </label>
  <label class="tool-field">
    <span>RGB</span>
    <input id="color-rgb" type="text" readonly>
  </label>
  <label class="tool-field">
    <span>HSL</span>
    <input id="color-hsl" type="text" readonly>
  </label>
</div>

<p class="tool-status" id="color-status" aria-live="polite"></p>

<script>
(function () {
  const picker = document.getElementById('color-picker');
  const input = document.getElementById('color-input');
  const out = {
    hex: document.getElementById('color-hex'),
    rgb: document.getElementById('color-rgb'),
    hsl: document.getElementById('color-hsl'),
  };
  const status = document.getElementById('color-status');
  const labels = { ok: 'Parsed', invalid: 'Could not parse that color string.' };

  function setStatus(msg, kind) { status.textContent = msg || ''; status.dataset.kind = kind || ''; }
  function clearOut() { Object.values(out).forEach(el => el.value = ''); }
  function parse(s) {
    const el = document.createElement('div');
    el.style.color = '';
    el.style.color = s;
    if (!el.style.color) return null;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);
    const m = computed.match(/^rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*([\d.]+))?\)$/);
    if (!m) return null;
    return { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]), a: m[4] !== undefined ? +m[4] : 1 };
  }
  function toHex({ r, g, b, a }) {
    const h = n => n.toString(16).padStart(2, '0');
    const base = '#' + h(r) + h(g) + h(b);
    return a < 1 ? base + h(Math.round(a * 255)) : base;
  }
  function toRgb({ r, g, b, a }) {
    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
  }
  function toHsl({ r, g, b, a }) {
    const R = r / 255, G = g / 255, B = b / 255;
    const max = Math.max(R, G, B), min = Math.min(R, G, B);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === R) h = ((G - B) / d + (G < B ? 6 : 0));
      else if (max === G) h = ((B - R) / d + 2);
      else h = ((R - G) / d + 4);
      h *= 60;
    }
    const H = Math.round(h), S = Math.round(s * 100), L = Math.round(l * 100);
    return a < 1 ? `hsla(${H}, ${S}%, ${L}%, ${a})` : `hsl(${H}, ${S}%, ${L}%)`;
  }
  function render(s, fromPicker) {
    const c = parse(s);
    if (!c) { clearOut(); setStatus(labels.invalid, 'err'); return; }
    out.hex.value = toHex(c);
    out.rgb.value = toRgb(c);
    out.hsl.value = toHsl(c);
    setStatus(labels.ok, 'ok');
    if (!fromPicker) {
      const hex6 = '#' + [c.r, c.g, c.b].map(n => n.toString(16).padStart(2, '0')).join('');
      picker.value = hex6;
    }
  }
  input.addEventListener('input', function () {
    const v = input.value.trim();
    if (!v) { clearOut(); setStatus(''); return; }
    render(v, false);
  });
  picker.addEventListener('input', function () {
    input.value = picker.value;
    render(picker.value, true);
  });
  document.querySelector('.tool-controls').addEventListener('click', function (e) {
    if (e.target.dataset && e.target.dataset.action === 'clear') {
      input.value = ''; clearOut(); setStatus('');
    }
  });
  render(picker.value, true);
  input.value = picker.value;
})();
</script>
