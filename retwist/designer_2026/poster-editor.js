// poster-editor.js
// ponytail: drag+resize editor for .content-section poster images; persists to localStorage
(function () {
  'use strict';

  const KEY = 'pe_v1';
  const sections = Array.from(document.querySelectorAll('.content-section'));
  let state = JSON.parse(localStorage.getItem(KEY) || '{}');
  let enabled = false;
  const teardowns = [];

  // Re-apply saved positions on load
  sections.forEach((_, i) => restore(i));

  function restore(i) {
    const img = imgOf(i); if (!img) return;
    const s = state[i] || {};
    img.style.width = s.w || '';
    img.style.transform = (s.tx || s.ty)
      ? `translate(${s.tx || 0}px,${s.ty || 0}px)` : '';
  }

  function imgOf(i) { return sections[i] && sections[i].querySelector('.content-image img'); }

  function persist(i, patch) {
    Object.assign(state[i] = state[i] || {}, patch);
    localStorage.setItem(KEY, JSON.stringify(state));
    refreshPanel();
  }

  // ── Panel ────────────────────────────────────────────────────
  const panel = mkEl('div');
  panel.style.cssText =
    'position:fixed;bottom:16px;right:16px;z-index:99999;background:#111;color:#fff;' +
    'border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,.6);font:13px/1.5 monospace;width:260px';

  const hdr = mkEl('div');
  hdr.style.cssText = 'background:#000;padding:9px 14px;cursor:pointer;user-select:none;border-radius:6px 6px 0 0';
  hdr.innerHTML = '<b>Poster Editor</b><span id="pe-mode" style="float:right;color:#22D3EE">● off</span>';

  const body = mkEl('div');
  body.style.cssText = 'padding:10px 14px;display:none';

  const tip = mkEl('div');
  tip.style.cssText = 'font-size:11px;color:#888;margin-bottom:8px;line-height:1.6';
  tip.textContent = '拖曳圖片移動；右下角方塊調整大小';

  const stateEl = mkEl('div');
  stateEl.id = 'pe-state';
  stateEl.style.cssText = 'font-size:11px;color:#aaa;white-space:pre;margin-bottom:8px;' +
    'background:#1a1a1a;padding:6px 8px;border-radius:3px';

  const expBtn = mkBtn('Export CSS', '#22D3EE', '#000', doExport);
  const rstBtn = mkBtn('Reset All',  '#333',    '#fff', doReset);

  body.append(tip, stateEl, expBtn, rstBtn);
  panel.append(hdr, body);
  document.body.appendChild(panel);

  hdr.addEventListener('click', () => {
    enabled = !enabled;
    document.getElementById('pe-mode').textContent = enabled ? '● on' : '● off';
    body.style.display = enabled ? 'block' : 'none';
    enabled ? enableEdit() : disableEdit();
  });

  // ── Enable editing ────────────────────────────────────────────
  function enableEdit() {
    sections.forEach((sec, i) => {
      const img = imgOf(i); if (!img) return;
      const ci = sec.querySelector('.content-image');

      sec.style.outline = '2px dashed rgba(34,211,238,.4)';
      img.style.cursor  = 'move';

      // Drag image to translate
      let ox, oy, otx, oty;
      function onDown(e) {
        if (e.target.dataset.peResize) return;
        e.preventDefault();
        const pt = e.touches ? e.touches[0] : e;
        ox = pt.clientX; oy = pt.clientY;
        otx = (state[i] && state[i].tx) || 0;
        oty = (state[i] && state[i].ty) || 0;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mouseup',   onUp);
        document.addEventListener('touchend',  onUp);
      }
      function onMove(e) {
        e.preventDefault();
        const pt = e.touches ? e.touches[0] : e;
        const tx = Math.round(otx + pt.clientX - ox);
        const ty = Math.round(oty + pt.clientY - oy);
        img.style.transform = `translate(${tx}px,${ty}px)`;
        persist(i, { tx, ty });
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup',   onUp);
        document.removeEventListener('touchend',  onUp);
      }
      img.addEventListener('mousedown',  onDown);
      img.addEventListener('touchstart', onDown, { passive: false });

      teardowns.push(() => {
        img.removeEventListener('mousedown',  onDown);
        img.removeEventListener('touchstart', onDown);
        sec.style.outline = '';
        img.style.cursor  = '';
      });

      // Resize handle (bottom-right corner triangle)
      if (getComputedStyle(ci).position === 'static') ci.style.position = 'relative';
      const rh = mkEl('div');
      rh.dataset.peResize = '1';
      rh.title = '拖曳調整大小';
      rh.style.cssText =
        'position:absolute;right:0;bottom:0;width:22px;height:22px;' +
        'background:#22D3EE;cursor:se-resize;z-index:6;' +
        'clip-path:polygon(100% 0,100% 100%,0 100%)';
      ci.appendChild(rh);

      let sw0, mx0;
      rh.addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        sw0 = parseFloat(getComputedStyle(img).width);
        mx0 = e.clientX;
        function onRM(e) {
          const w = Math.max(60, Math.round(sw0 + e.clientX - mx0));
          img.style.width = w + 'px';
          persist(i, { w: w + 'px' });
        }
        function onRU() {
          document.removeEventListener('mousemove', onRM);
          document.removeEventListener('mouseup',   onRU);
        }
        document.addEventListener('mousemove', onRM);
        document.addEventListener('mouseup',   onRU);
      });
      teardowns.push(() => { if (rh.parentElement) rh.parentElement.removeChild(rh); });
    });
    refreshPanel();
  }

  function disableEdit() {
    teardowns.forEach(fn => fn());
    teardowns.length = 0;
  }

  // ── Panel state display ───────────────────────────────────────
  function refreshPanel() {
    const el = document.getElementById('pe-state');
    if (!el) return;
    el.textContent = sections.map((_, i) => {
      const s = state[i] || {};
      return '[' + (i + 1) + '] w:' + (s.w || '原始') +
             '  x:' + (s.tx || 0) + 'px  y:' + (s.ty || 0) + 'px';
    }).join('\n');
  }

  // ── Export CSS ────────────────────────────────────────────────
  function doExport() {
    const lines = sections.map((sec, i) => {
      const s = state[i]; if (!s) return '';
      // ponytail: nth-child index is stable for current DOM; recount if sections are reordered
      const idx = Array.prototype.indexOf.call(document.body.children, sec) + 1;
      const sel = 'body > section:nth-child(' + idx + ') .content-image img';
      const rules = [];
      if (s.w)           rules.push('width: ' + s.w);
      if (s.tx || s.ty)  rules.push('transform: translate(' + (s.tx || 0) + 'px,' + (s.ty || 0) + 'px)');
      return rules.length ? sel + ' { ' + rules.join('; ') + '; }' : '';
    }).filter(Boolean).join('\n');

    prompt('複製以下 CSS 貼入 <style>：', lines || '/* 尚未調整任何區塊 */');
  }

  // ── Reset ─────────────────────────────────────────────────────
  function doReset() {
    if (!confirm('重置所有海報位置與大小？')) return;
    state = {};
    localStorage.removeItem(KEY);
    sections.forEach((_, i) => restore(i));
    refreshPanel();
  }

  // ── Helpers ───────────────────────────────────────────────────
  function mkEl(tag) { return document.createElement(tag); }
  function mkBtn(text, bg, fg, fn) {
    const b = mkEl('button');
    b.textContent = text;
    b.style.cssText =
      'margin-top:5px;width:100%;background:' + bg + ';color:' + fg + ';border:0;' +
      'padding:7px;cursor:pointer;border-radius:3px;font-weight:700;font-size:12px';
    b.addEventListener('click', fn);
    return b;
  }

  refreshPanel();
})();
