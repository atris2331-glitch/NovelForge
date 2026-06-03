// ── Decorative Elements (Stickers & Text Boxes) ──
let _decorSerial = 0;
const decorElements = {}; // key -> [{id,type,content,x,y,w,h,fontSize,color,rotation}]

const _fdDrag = { active:false, el:null, data:null, startMX:0, startMY:0, ox:0, oy:0 };
const _fdResize = { active:false, el:null, data:null, sx:0, sy:0, ow:0, oh:0, ox:0, oy:0, dir:'rh-se' };

function ctxInsertSticker(emoji) {
  closeCtxMenu();
  const pageEl = _freeImgTargetPageEl || document.querySelector('[data-free-img-key]');
  if (!pageEl) return;
  const key = pageEl.dataset.freeImgKey || pageEl.dataset.decorKey || pageEl.id || 'page0';
  if (!decorElements[key]) decorElements[key] = [];
  const id = 'fd_' + (++_decorSerial);
  const d = { id, type:'sticker', content:emoji, x:100, y:100, w:60, h:60, fontSize:36, color:'inherit', rotation:0 };
  decorElements[key].push(d);
  addDecorToPage(pageEl, d, key);
  showToast('✅ เพิ่มของตกแต่ง');
}

function ctxInsertDecorText() {
  closeCtxMenu();
  const pageEl = _freeImgTargetPageEl || document.querySelector('[data-free-img-key]');
  if (!pageEl) return;
  const key = pageEl.dataset.freeImgKey || pageEl.id || 'page0';
  if (!decorElements[key]) decorElements[key] = [];
  const id = 'fd_' + (++_decorSerial);
  const d = { id, type:'text', content:'ข้อความตกแต่ง', x:80, y:120, w:180, h:50, fontSize:18, color:'#8b4513', rotation:0 };
  decorElements[key].push(d);
  addDecorToPage(pageEl, d, key);
  showToast('✅ เพิ่มกล่องข้อความ');
}

function addDecorToPage(pageEl, d, key) {
  const div = document.createElement('div');
  div.className = 'free-decor';
  div.id = d.id;
  div.style.cssText = `left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;font-size:${d.fontSize}px;color:${d.color};`;
  if (d.rotation) div.style.transform = `rotate(${d.rotation}deg)`;
  const isText = d.type === 'text';
  div.innerHTML = `
    <div class="fi-toolbar" style="top:-34px;">
      <button title="ลบ" onclick="removeDecor('${d.id}','${key}')">✕</button>
      <button title="หมุน 15°" onclick="rotateDecor('${d.id}','${key}',15)">↻</button>
      <button title="หมุน -15°" onclick="rotateDecor('${d.id}','${key}',-15)">↺</button>
      <span class="fi-sep">|</span>
      <input class="fd-size-input" type="number" value="${d.fontSize}" min="8" max="200" title="ขนาด" onchange="setDecorFontSize('${d.id}','${key}',this.value)">
      ${isText ? `<input class="fd-size-input" type="color" value="${d.color==='inherit'?'#8b4513':d.color}" style="width:22px;height:18px;padding:1px;border:none;background:none;cursor:pointer" onchange="setDecorColor('${d.id}','${key}',this.value)" title="สี">` : ''}
    </div>
    <div class="fd-content" ${isText ? `contenteditable="true" spellcheck="false" style="outline:none;min-width:40px;cursor:text;color:${d.color};font-size:${d.fontSize}px;white-space:pre-wrap;word-break:break-word"` : `style="font-size:${d.fontSize}px;line-height:1"`}>${d.content}</div>
    <div class="rh rh-nw"></div><div class="rh rh-n"></div><div class="rh rh-ne"></div>
    <div class="rh rh-e"></div><div class="rh rh-se resize-dot"></div><div class="rh rh-s"></div>
    <div class="rh rh-sw"></div><div class="rh rh-w"></div>
  `;

  // Sync text content edits back to data
  if (isText) {
    const content = div.querySelector('.fd-content');
    content.addEventListener('input', () => { d.content = content.innerText; });
    content.addEventListener('mousedown', (e) => e.stopPropagation()); // don't drag while editing
  }

  // Drag
  div.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('rh') || e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    if (e.target.classList.contains('fd-content') && d.type === 'text') return;
    document.querySelectorAll('.free-decor').forEach(f => f.classList.remove('selected'));
    div.classList.add('selected');
    const pt = _fiToPageCoords(e.clientX, e.clientY, div);
    _fdDrag.active = true; _fdDrag.el = div; _fdDrag.data = d;
    _fdDrag.startMX = pt.x; _fdDrag.startMY = pt.y; _fdDrag.ox = d.x; _fdDrag.oy = d.y;
    e.preventDefault(); e.stopPropagation();
  });

  // Resize (8 handles)
  div.querySelectorAll('.rh').forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation(); e.preventDefault();
      const pt = _fiToPageCoords(e.clientX, e.clientY, div);
      const dir = Array.from(handle.classList).find(c => c.startsWith('rh-') && c !== 'rh') || 'rh-se';
      document.querySelectorAll('.free-decor').forEach(f => f.classList.remove('selected'));
      div.classList.add('selected');
      _fdResize.active = true; _fdResize.el = div; _fdResize.data = d; _fdResize.dir = dir;
      _fdResize.sx = pt.x; _fdResize.sy = pt.y;
      _fdResize.ow = d.w; _fdResize.oh = d.h; _fdResize.ox = d.x; _fdResize.oy = d.y;
    });
  });

  pageEl.appendChild(div);
  // Select after adding
  document.querySelectorAll('.free-decor').forEach(f => f.classList.remove('selected'));
  div.classList.add('selected');
}

function removeDecor(id, key) {
  const el = document.getElementById(id);
  if (el) el.remove();
  if (decorElements[key]) decorElements[key] = decorElements[key].filter(d => d.id !== id);
}
function rotateDecor(id, key, deg) {
  const arr = decorElements[key]; if (!arr) return;
  const d = arr.find(d => d.id === id); if (!d) return;
  d.rotation = (d.rotation || 0) + deg;
  const el = document.getElementById(id);
  if (el) el.style.transform = `rotate(${d.rotation}deg)`;
}
function setDecorFontSize(id, key, val) {
  const arr = decorElements[key]; if (!arr) return;
  const d = arr.find(d => d.id === id); if (!d) return;
  d.fontSize = parseInt(val);
  const el = document.getElementById(id);
  if (el) { el.style.fontSize = d.fontSize + 'px'; const c = el.querySelector('.fd-content'); if (c) c.style.fontSize = d.fontSize + 'px'; }
}
function setDecorColor(id, key, val) {
  const arr = decorElements[key]; if (!arr) return;
  const d = arr.find(d => d.id === id); if (!d) return;
  d.color = val;
  const el = document.getElementById(id);
  if (el) { el.style.color = val; const c = el.querySelector('.fd-content'); if (c) c.style.color = val; }
}

// Global move/end handlers for decor drag & resize
document.addEventListener('mousemove', (e) => {
  if (_fdDrag.active || _fdResize.active) {
    const cx = e.clientX, cy = e.clientY;
    if (_fdDrag.active) {
      const pt = _fiToPageCoords(cx, cy, _fdDrag.el);
      _fdDrag.data.x = _fdDrag.ox + (pt.x - _fdDrag.startMX);
      _fdDrag.data.y = _fdDrag.oy + (pt.y - _fdDrag.startMY);
      _fdDrag.el.style.left = _fdDrag.data.x + 'px';
      _fdDrag.el.style.top  = _fdDrag.data.y + 'px';
    }
    if (_fdResize.active) {
      const pt = _fiToPageCoords(cx, cy, _fdResize.el);
      const dx = pt.x - _fdResize.sx, dy = pt.y - _fdResize.sy;
      const dir = _fdResize.dir;
      let nw = _fdResize.ow, nh = _fdResize.oh, nx = _fdResize.ox, ny = _fdResize.oy;
      if (dir.includes('e'))  nw = Math.max(30, _fdResize.ow + dx);
      if (dir.includes('w')) { nw = Math.max(30, _fdResize.ow - dx); nx = _fdResize.ox + (_fdResize.ow - nw); }
      if (dir.includes('s'))  nh = Math.max(24, _fdResize.oh + dy);
      if (dir.includes('n')) { nh = Math.max(24, _fdResize.oh - dy); ny = _fdResize.oy + (_fdResize.oh - nh); }
      _fdResize.data.w = nw; _fdResize.data.h = nh;
      _fdResize.data.x = nx; _fdResize.data.y = ny;
      _fdResize.el.style.width = nw + 'px'; _fdResize.el.style.height = nh + 'px';
      _fdResize.el.style.left = nx + 'px'; _fdResize.el.style.top = ny + 'px';
    }
    e.preventDefault();
  }
}, { capture: false });
document.addEventListener('mouseup', () => { _fdDrag.active = false; _fdResize.active = false; });
document.addEventListener('click', (e) => {
  if (!e.target.closest('.free-decor')) {
    document.querySelectorAll('.free-decor').forEach(f => f.classList.remove('selected'));
  }
});

// ── End Decorative Elements ──

