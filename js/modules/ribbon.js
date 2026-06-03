
  textAlign = preset.textAlign;
  document.querySelectorAll('input[name=align]').forEach(r => r.checked = r.value === textAlign);
  dropCap = preset.dropCap;
  document.getElementById('showDropCap').checked = dropCap;
  bodyFont = preset.font;
  document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.textContent.trim().startsWith(preset.font)));
  document.documentElement.style.setProperty('--accent', preset.accent);
  document.documentElement.style.setProperty('--accent-light', preset.accentLight);

  document.getElementById('layoutDesc').textContent = preset.desc;
  renderChapterPages();
  showToast('✅ ' + (cardEl?.querySelector('.lc-name')?.textContent || name));
}

// keep old applyLayout pointing to new function for backward compat
function applyLayout(name, btnEl) { applyLayoutCard(name, document.getElementById('lcard-' + name)); }



// ── Jump to page by number ──
function jumpToPage() {
  const n = parseInt(document.getElementById('navJumpInput').value) - 1;
  if (isNaN(n) || n < 0 || n >= allPages.length) { showToast('❌ หน้าไม่ถูกต้อง'); return; }
  const step = viewMode === 'spread' ? 2 : 1;
  currentPageIndex = viewMode === 'spread' ? Math.floor(n / 2) * 2 : n;
  applyViewMode();
}

function jumpToPageByLabel(val) {
  if (!val) return;
  const idx = parseInt(val);
  if (!isNaN(idx) && idx >= 0 && idx < allPages.length) {
    currentPageIndex = viewMode === 'spread' ? Math.floor(idx / 2) * 2 : idx;
    applyViewMode();
  }
  document.getElementById('pageSelectDropdown').value = '';
}

function buildPageDropdown() {
  const sel = document.getElementById('pageSelectDropdown');
  const tsel = document.getElementById('toolbarPageSelect');
  if (!sel) return;
  const opts = '<option value="">— เลือกหน้า —</option>' + allPages.map((u, i) => {
    const labelText = u.label ? u.label.textContent.trim() : `หน้า ${i + 1}`;
    const short = labelText.length > 30 ? labelText.substring(0, 30) + '…' : labelText;
    return `<option value="${i}">${i + 1}. ${short}</option>`;
  }).join('');
  sel.innerHTML = opts;
  if (tsel) {
    tsel.innerHTML = '<option value="">ไปหน้า...</option>' + allPages.map((u, i) => {
      const labelText = u.label ? u.label.textContent.trim().substring(0, 22) : `หน้า ${i + 1}`;
      return `<option value="${i}">${i + 1}. ${labelText}</option>`;
    }).join('');
  }
}

function toolbarJumpToPage(val) {
  if (!val) return;
  const idx = parseInt(val);
  if (!isNaN(idx) && idx >= 0 && idx < allPages.length) {
    currentPageIndex = viewMode === 'spread' ? Math.floor(idx / 2) * 2 : idx;
    // Switch to single if in scroll
    if (viewMode === 'scroll') { setViewMode('single', document.getElementById('vbSingle')); }
    else applyViewMode();
  }
  document.getElementById('toolbarPageSelect').value = '';
}

// ── Wrap selected text in editor with style markers ──
function wrapSelectedText(style) {
  const ta = document.getElementById('chapterEditor');
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e);
  if (!sel) { showToast('กรุณาคลุมข้อความก่อน'); return; }
  let wrapped;
  switch(style) {
    case 'quote': wrapped = `«${sel}»`; break;
    case 'boldem': wrapped = `**${sel}**`; break;
    case 'highlight': wrapped = `==${sel}==`; break;
    case 'cmd': wrapped = `\`${sel}\``; break;
    case 'em': wrapped = `_${sel}_`; break;
    default: wrapped = sel;
  }
  ta.value = ta.value.substring(0, s) + wrapped + ta.value.substring(e);
  ta.selectionStart = s; ta.selectionEnd = s + wrapped.length;
  ta.focus();
  updateChapterContent(ta.value);
}


let inlineFmtBarTimer;
function showInlineFmtBarOnSelect(sourceEl) {
  clearTimeout(inlineFmtBarTimer);
  inlineFmtBarTimer = setTimeout(() => {
    const sel = window.getSelection();
    const bar = document.getElementById('inlineFmtBar');
    if (!bar) return;
    if (sel && !sel.isCollapsed && sel.toString().length > 0) {
      // Check selection is inside chapterEditor OR any page-body
      const ed = weGetEditor();
      const anchorNode = sel.anchorNode;
      const inEditor = ed && ed.contains(anchorNode);
      const inPageBody = anchorNode && anchorNode.parentElement && anchorNode.parentElement.closest('.page-body');
      if (!inEditor && !inPageBody) { hideInlineFmtBar(); return; }
      // Save selection range so size/color buttons can restore it after focus shifts
      window._savedSel = sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      // Position bar near selection
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      bar.classList.add('show');
      const barW = bar.offsetWidth || 360;
      let left = rect.left + rect.width / 2 - barW / 2;
      let top = rect.top - 44;
      if (top < 56) top = rect.bottom + 8;
      left = Math.max(8, Math.min(window.innerWidth - barW - 8, left));
      top  = Math.max(8, Math.min(window.innerHeight - 60, top));
      bar.style.top  = top  + 'px';
      bar.style.left = left + 'px';
    } else {
      hideInlineFmtBar();
    }
  }, 80);
}

function hideInlineFmtBar() {
  document.getElementById('inlineFmtBar')?.classList.remove('show');
}

// Hide inline fmt bar when clicking outside editor/page-body or bar
document.addEventListener('mousedown', (e) => {
  const bar = document.getElementById('inlineFmtBar');
  const ed  = document.getElementById('chapterEditor');
  if (!bar) return;
  if (bar.contains(e.target)) return; // clicked inside bar — let button work
  if (ed && ed.contains(e.target)) return; // still inside editor
  if (e.target.closest('.page-body')) return; // clicked in a page-body
  hideInlineFmtBar();
}, true);

// ── Rich-text parser: convert markdown-ish markup to HTML ──
function parseRichText(text) {
  // Handle properly-closed inline tags ([\s\S]+? allows multiline content within a single para call)
  let out = text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:var(--accent)">$1</strong>')
    .replace(/__(.+?)__/g, '<span style="text-decoration:underline">$1</span>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/==(.+?)==/g, '<mark style="background:rgba(201,162,39,0.25);border-radius:2px;padding:0 2px">$1</mark>')
    .replace(/`(.+?)`/g, '<code style="font-family:monospace;background:rgba(139,69,19,0.1);border-radius:3px;padding:0 4px;font-size:0.88em">$1</code>')
    .replace(/<color:(#[0-9a-fA-F]{3,6})>([\s\S]+?)<\/color>/g, '<span style="color:$1">$2</span>')
    .replace(/<size:(\d+)>([\s\S]+?)<\/size>/g, '<span style="font-size:$1px">$2</span>')
    .replace(/<font:([^>]+)>([\s\S]+?)<\/font>/g, '<span style="font-family:\'$1\',sans-serif">$2</span>')
    .replace(/«(.+?)»/g, '<span style="font-style:italic;color:var(--gold)">«$1»</span>');
  // Strip any remaining unclosed/malformed markup tags
  out = out.replace(/<size:\d+>/g, '').replace(/<\/size>/g, '');
  out = out.replace(/<color:#[0-9a-fA-F]{3,6}>/g, '').replace(/<\/color>/g, '');
  out = out.replace(/<font:[^>]+>/g, '').replace(/<\/font>/g, '');
  return out;
}

// ── Sync field from context panel to main sidebar ──
function syncField(fieldId, val) {
  const el = document.getElementById(fieldId);
  if (el) { el.value = val; }
  // Also sync reverse: other ctx fields with same fieldId
  ['ctx-bookTitle','ctx-penName','ctx-genre','ctx-bookSubtitle',
   'ctx2-bookTitle','ctx2-authorName','ctx2-publisher','ctx2-pubYear'].forEach(ctxId => {
    const mapped = ctxId.replace(/^ctx2?-/, '');
    if (mapped === fieldId) {
      const ctxEl = document.getElementById(ctxId);
      if (ctxEl && ctxEl.value !== val) ctxEl.value = val;
    }
  });
  updatePreview();
  if (typeof autoSaveDebounce === 'function') autoSaveDebounce();
}

// ── Update right panel context based on current page ──
function updateRightPanelContext() {
  if (viewMode === 'scroll') return; // don't switch in scroll mode
  const u = allPages[currentPageIndex];
  if (!u) return;
  const labelText = u.label ? u.label.textContent.trim() : '';
  const pageEl = u.pages[0];

  // Determine context type
  let ctx = 'chapter';
  if (pageEl && pageEl.classList.contains('page-cover')) ctx = 'cover';
  else if (pageEl && pageEl.classList.contains('page-title-page')) ctx = 'title';
  else if (pageEl && (pageEl.classList.contains('page-toc') ||
           pageEl.classList.contains('page-preface') ||
           pageEl.classList.contains('page-dedication'))) ctx = 'special';

  // Show correct context panel
  document.querySelectorAll('.ctx-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('ctx-' + ctx)?.classList.add('active');

  // Switch to editor tab automatically
  const editorTab = document.getElementById('ptabEditor');
  if (editorTab && !editorTab.classList.contains('active')) {
    switchTab('editor', editorTab);
  }

  if (ctx === 'cover') {
    // Sync cover fields
    ['bookTitle','penName','genre','bookSubtitle'].forEach(id => {
      const src = document.getElementById(id);
      const dst = document.getElementById('ctx-' + id);
      if (src && dst) dst.value = src.value;
    });
  } else if (ctx === 'title') {
    ['bookTitle','authorName','publisher','pubYear'].forEach(id => {
      const src = document.getElementById(id);
      const dst = document.getElementById('ctx2-' + id);
      if (src && dst) dst.value = src.value;
    });
  } else if (ctx === 'special') {
    document.getElementById('ctxSpecialNum').textContent = currentPageIndex + 1;
    const nameMap = { 'page-toc': 'สารบัญ', 'page-preface': 'คำนำ', 'page-dedication': 'คำอุทิศ' };
    const cls = pageEl ? Array.from(pageEl.classList).find(c => nameMap[c]) : null;
    document.getElementById('ctxSpecialName').textContent = cls ? nameMap[cls] : 'หน้าพิเศษ';
  } else if (ctx === 'chapter') {
    // Find which chapter this page belongs to
    const chIdx = labelText.match(/บทที่\s*(\d+)/)?.[1];
    if (chIdx) {
      const ch = chapters[parseInt(chIdx) - 1];
      if (ch && ch.id !== currentChapterId) {
        // silently load chapter into editor without page-jumping
        currentChapterId = ch.id;
        document.getElementById('chapterTitleInput').value = ch.title;
        weLoad(ch.content);
        document.getElementById('chapterNote').value = ch.note || '';
        const wrap = document.getElementById('chImgPreviewWrap');
        const drop = document.getElementById('chImgDrop');
        if (ch.imageData) {
          document.getElementById('chImgPreview').src = ch.imageData;
          document.getElementById('chImgSize').value = ch.imageSize || 100;
          document.getElementById('chImgSizeVal').textContent = (ch.imageSize || 100) + '%';
          wrap.style.display = 'block'; drop.style.display = 'none';
        } else {
          wrap.style.display = 'none'; drop.style.display = 'block';
        }
        renderChapterList();
      }
    }
    // Show badge
    const badge = document.getElementById('ctxChapterBadge');
    if (badge) {
      badge.style.display = 'flex';
      document.getElementById('ctxChapterNum').textContent = currentPageIndex + 1;
      const chTitle = labelText.replace(/\s*\(ต่อ\).*$/, '');
      document.getElementById('ctxChapterName').textContent = chTitle.substring(0, 22);
    }
    // Update page text preview
    const pageEl2 = u.pages[0];
    updatePageTextPreview(pageEl2);
  }
}


(function() {
  function initResize(handleId, panelSel, cssVar, side) {
    const handle = document.getElementById(handleId);
    if (!handle) return;
    let dragging = false;
    let startX = 0;
    let startW = 0;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('panel-collapse-btn')) return;
      dragging = true;
      startX = e.clientX;
      const panel = document.querySelector(panelSel);
      startW = panel.getBoundingClientRect().width;
      handle.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const panel = document.querySelector(panelSel);
      const minW = parseInt(getComputedStyle(panel).minWidth) || 160;
      const maxW = parseInt(getComputedStyle(panel).maxWidth) || 520;
      let delta = side === 'left' ? e.clientX - startX : startX - e.clientX;
      let newW = Math.max(minW, Math.min(maxW, startW + delta));
      document.documentElement.style.setProperty(cssVar, newW + 'px');
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      handle.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    initResize('leftResizeHandle', '.sidebar', '--sidebar-w', 'left');
    initResize('rightResizeHandle', '.right-panel', '--rightpanel-w', 'right');
  });
})();

// ── Panel collapse toggle ──
const _panelOrigW = {};
function togglePanelCollapse(side) {
  if (side === 'left') {
    const panel = document.querySelector('.sidebar');
    const btn = document.getElementById('leftCollapseBtn');
    if (panel.classList.contains('collapsed-panel')) {
      const prev = _panelOrigW['left'] || '280px';
      document.documentElement.style.setProperty('--sidebar-w', prev);
      panel.classList.remove('collapsed-panel');
      btn.textContent = '◀';
      btn.title = 'ซ่อนแผงซ้าย';
    } else {
      _panelOrigW['left'] = getComputedStyle(panel).width;
      panel.classList.add('collapsed-panel');
      btn.textContent = '▶';
      btn.title = 'แสดงแผงซ้าย';
    }
  } else {
    const panel = document.querySelector('.right-panel');
    const btn = document.getElementById('rightCollapseBtn');
    if (panel.classList.contains('collapsed-panel')) {
      const prev = _panelOrigW['right'] || '260px';
      document.documentElement.style.setProperty('--rightpanel-w', prev);
      panel.classList.remove('collapsed-panel');
      btn.textContent = '▶';
      btn.title = 'ซ่อนแผงขวา';
    } else {
      _panelOrigW['right'] = getComputedStyle(panel).width;
      panel.classList.add('collapsed-panel');
      btn.textContent = '◀';
      btn.title = 'แสดงแผงขวา';
    }
  }
}

// ── Page Number Style ──
let pageNumStyle = 'dash'; // dash | plain | dot | thai
let pageNumSize = 11;
let dropCapSize = 52;
let dropCapFont = 'Playfair Display';
let dropCapColor = null; // null = use accent color

// Page border decoration
let pageBorderPattern = 'none';
let pageBorderColor = '#8b4513';
let pageBorderThickness = 10;
let pageBorderLineWeight = 2;

function setPageNumStyle(style, btn) {
  pageNumStyle = style;
  document.querySelectorAll('.page-num-style-row button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderChapterPages();
}

function updatePageNumSize(val) {
  pageNumSize = parseInt(val);
  document.getElementById('pageNumSizeVal').textContent = val + 'px';
  renderChapterPages();
}

function formatPageNum(n) {
  return formatPageNumAdvanced(n);
}

function updateDropCapSize(val) {
  const sizeEl = document.getElementById('dropCapSize');
  const valEl = document.getElementById('dropCapSizeVal');
  dropCapSize = parseInt(sizeEl.value) || 52;
  dropCapFont = document.getElementById('dropCapFont').value || 'Playfair Display';
  dropCapColor = document.getElementById('dropCapColor') ? document.getElementById('dropCapColor').value : null;
  if (valEl) valEl.textContent = dropCapSize + 'px';
  renderChapterPages();
}

// ── Per-page layout overrides ──
const perPageLayouts = {}; // key: chapterId_pageIndex -> preset name
let _currentCtxPageKey = null;
let _perPageScope = 'page'; // 'page' | 'chapter' | 'all'

function setPerPageScope(scope, btnEl) {
  _perPageScope = scope;
  document.querySelectorAll('#ppscope-page,#ppscope-chapter,#ppscope-all').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  const hint = document.getElementById('ppScopeHint');
  if (hint) {
    const msgs = {
      page: '📄 ใช้กับหน้านี้เท่านั้น',
      chapter: '📖 ใช้กับทุกหน้าในบทนี้',
      all: '📚 ใช้กับทุกบท ทุกหน้า (global)'
    };
    hint.textContent = msgs[scope] || '';
  }
}

function openPerPagePopup(e, chId, pgIdx) {
  e.stopPropagation();
  _currentCtxPageKey = `${chId}_${pgIdx}`;
  const popup = document.getElementById('perPagePopup');
  popup.classList.add('open');
  const active = perPageLayouts[_currentCtxPageKey];
  popup.querySelectorAll('.layout-card').forEach(c => {
    const name = c.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
    c.classList.toggle('active', name === active);
  });
  // Position near click
  let x = e.clientX + 8, y = e.clientY + 8;
  if (x + 270 > window.innerWidth) x = e.clientX - 270;
  if (y + 480 > window.innerHeight) y = e.clientY - 480;
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
}

function closePerPagePopup() {
  document.getElementById('perPagePopup').classList.remove('open');
}

function applyPerPageLayout(name, cardEl) {
  if (!_currentCtxPageKey && _perPageScope === 'page') return;
  closePerPagePopup();

  if (_perPageScope === 'page') {
    // เฉพาะหน้านี้
    perPageLayouts[_currentCtxPageKey] = name;
    renderChapterPages();
    showToast('✅ ตั้ง Layout "' + name + '" สำหรับหน้านี้');
  } else if (_perPageScope === 'chapter') {
    // ทุกหน้าในบทนี้ — parse chId from key
    const chId = _currentCtxPageKey ? _currentCtxPageKey.split('_')[0] : null;
    if (!chId) return;
    // Apply to all existing page keys of this chapter
    Object.keys(perPageLayouts).forEach(k => {
      if (k.startsWith(chId + '_')) delete perPageLayouts[k];
    });
    // Mark chapter-level: set for pages 0–99
    for (let i = 0; i < 100; i++) {
      perPageLayouts[`${chId}_${i}`] = name;
    }
    renderChapterPages();
    showToast('✅ ตั้ง Layout "' + name + '" สำหรับทั้งบท');
  } else if (_perPageScope === 'all') {
    // ทุกบท ทุกหน้า → ใช้ applyLayoutCard (global)
    applyLayoutCard(name, null);
    // Clear all per-page overrides
    Object.keys(perPageLayouts).forEach(k => delete perPageLayouts[k]);
    showToast('✅ ตั้ง Layout "' + name + '" ทุกหน้า (global)');
  }
}

function clearPerPageLayout() {
  if (_perPageScope === 'page') {
    if (_currentCtxPageKey) delete perPageLayouts[_currentCtxPageKey];
    showToast('✕ ล้าง Layout หน้านี้แล้ว');
  } else if (_perPageScope === 'chapter') {
    const chId = _currentCtxPageKey ? _currentCtxPageKey.split('_')[0] : null;
    if (chId) Object.keys(perPageLayouts).forEach(k => { if (k.startsWith(chId + '_')) delete perPageLayouts[k]; });
    showToast('✕ ล้าง Layout ทั้งบทแล้ว');
  } else if (_perPageScope === 'all') {
    Object.keys(perPageLayouts).forEach(k => delete perPageLayouts[k]);
    showToast('✕ ล้าง Layout ทั้งหมดแล้ว');
  }
  closePerPagePopup();
  renderChapterPages();
}

// ── Free drag images on pages ──
let _freeImgTargetPageEl = null;
let _freeImgSerial = 0;
// Store free images per chapter+page: key=chId_pgIdx, value=[{id,src,x,y,w,h}]
const freeImages = {};

// Global drag state for free images (prevents multiple listener leaks)
const _fiDrag = { active: false, el: null, imgData: null, startMX: 0, startMY: 0, ox: 0, oy: 0 };
const _fiResize = { active: false, el: null, imgData: null, sx: 0, sy: 0, ow: 0, oh: 0, ox: 0, oy: 0, dir: 'rh-se' };
// Store the key (chId_pageIdx) at right-click time so it survives re-renders
let _freeImgTargetKey = '';

function _fiToPageCoords(cx, cy, el) {
  const pageEl = el.parentElement;
  if (!pageEl) return { x: cx, y: cy };
  // getBoundingClientRect already reflects the visual (CSS-transformed) position.
  // Dividing by the same scale factor gives logical page coordinates.
  const rect = pageEl.getBoundingClientRect();
  // Measure actual rendered width vs CSS width to derive true scale
  const cssW = parseFloat(getComputedStyle(pageEl).width) || 559;
  const sc = cssW > 0 ? rect.width / cssW : (zoomLevel || 100) / 100;
  return { x: (cx - rect.left) / sc, y: (cy - rect.top) / sc };
}

function _fiMove(cx, cy) {
  if (_fiDrag.active) {
    const pt = _fiToPageCoords(cx, cy, _fiDrag.el);
    _fiDrag.imgData.x = _fiDrag.ox + (pt.x - _fiDrag.startMX);
    _fiDrag.imgData.y = _fiDrag.oy + (pt.y - _fiDrag.startMY);
    _fiDrag.el.style.left = _fiDrag.imgData.x + 'px';
    _fiDrag.el.style.top  = _fiDrag.imgData.y + 'px';
  }
  if (_fiResize.active) {
    const pt = _fiToPageCoords(cx, cy, _fiResize.el);
    const dx = pt.x - _fiResize.sx;
    const dy = pt.y - _fiResize.sy;
    const dir = _fiResize.dir || 'rh-se';
    let nw = _fiResize.ow, nh = _fiResize.oh, nx = _fiResize.ox, ny = _fiResize.oy;
    if (dir.includes('e'))  nw = Math.max(40, _fiResize.ow + dx);
    if (dir.includes('w')) { nw = Math.max(40, _fiResize.ow - dx); nx = _fiResize.ox + (_fiResize.ow - nw); }
    if (dir.includes('s'))  nh = Math.max(30, _fiResize.oh + dy);
    if (dir.includes('n')) { nh = Math.max(30, _fiResize.oh - dy); ny = _fiResize.oy + (_fiResize.oh - nh); }
    _fiResize.imgData.w = nw; _fiResize.imgData.h = nh;
    _fiResize.imgData.x = nx; _fiResize.imgData.y = ny;
    _fiResize.el.style.width  = nw + 'px';
    _fiResize.el.style.height = nh + 'px';
    _fiResize.el.style.left   = nx + 'px';
    _fiResize.el.style.top    = ny + 'px';
    updatePageTextBudget(_fiResize.el.parentElement);
  }
}
function _fiEnd() {
  if (_fiResize.active) { _fiResize.active = false; updatePageTextBudget(_fiResize.el?.parentElement); }
  _fiDrag.active = false;
}
document.addEventListener('mousemove', (e) => {
  if (_fiDrag.active || _fiResize.active) { _fiMove(e.clientX, e.clientY); e.preventDefault(); }
});
document.addEventListener('mouseup', _fiEnd);
// Touch support for tablet
document.addEventListener('touchmove', (e) => {
  if (_fiDrag.active || _fiResize.active) {
    const t = e.touches[0];
    _fiMove(t.clientX, t.clientY);
    e.preventDefault();
  }
}, { passive: false });
document.addEventListener('touchend', _fiEnd);
document.addEventListener('touchcancel', _fiEnd);

function ctxInsertFreeImage() {
  closeCtxMenu();
  document.getElementById('freeImgInput').click();
}

function handleFreeImgUpload(input) {
  const file = input.files[0];
  // Try to find the live page element by key (survives re-render)
  let pageEl = _freeImgTargetKey
    ? document.querySelector(`[data-free-img-key="${_freeImgTargetKey}"]`)
    : _freeImgTargetPageEl;
  if (!file || !pageEl) { showToast('⚠️ กรุณาคลิกขวาบนหน้าก่อนแทรกรูป'); input.value = ''; return; }
  const key = _freeImgTargetKey || pageEl.dataset.freeImgKey || '';
  const reader = new FileReader();
  reader.onload = (ev) => {
    // Re-query page element in case re-render happened while reading file
    const livePage = document.querySelector(`[data-free-img-key="${key}"]`) || pageEl;
    if (!freeImages[key]) freeImages[key] = [];
    const id = 'fi_' + (++_freeImgSerial);
    const imgData = { id, src: ev.target.result, x: 40, y: 80, w: 180, h: 140, rotation: 0 };
    freeImages[key].push(imgData);
    addFreeImageToPage(livePage, imgData, key);
    showToast('🖼 แทรกรูปอิสระเรียบร้อย — ลากวางได้เลย');
  };
  reader.readAsDataURL(file);
  input.value = '';
}

// Re-trigger updatePreview when image size changes so text reflows
function updatePageTextBudget(pageEl) {
  if (!pageEl) return;
  // Debounce to avoid re-rendering on every pixel during drag
  clearTimeout(updatePageTextBudget._t);
  updatePageTextBudget._t = setTimeout(() => { updatePreview(); }, 350);
}

function addFreeImageToPage(pageEl, imgData, key) {
  const div = document.createElement('div');
  div.className = 'free-img';
  div.id = imgData.id;
  const zIdx = imgData.zLayer === 'front' ? 50 : imgData.zLayer === 'back' ? 1 : imgData.zLayer === 'top' ? 100 : 5;
  div.style.cssText = `left:${imgData.x}px;top:${imgData.y}px;width:${imgData.w}px;height:${imgData.h}px;z-index:${zIdx};`;
  if (imgData.rotation) div.style.transform = `rotate(${imgData.rotation}deg)`;
  if (imgData.opacity != null) div.style.opacity = imgData.opacity;
  div.innerHTML = `
    <div class="fi-toolbar">
      <button title="ลบ" onclick="removeFreeImg('${imgData.id}','${key}')">✕</button>
      <button title="หมุน 15°" onclick="rotateFreeImg('${imgData.id}','${key}',15)">↻</button>
      <button title="หมุน -15°" onclick="rotateFreeImg('${imgData.id}','${key}',-15)">↺</button>
      <span class="fi-sep">|</span>
      <button title="ด้านหน้าสุด (z100)" onclick="setFreeImgLayer('${imgData.id}','${key}','top')" style="font-size:10px">⬆top</button>
      <button title="หน้าข้อความ (z50)" onclick="setFreeImgLayer('${imgData.id}','${key}','front')" style="font-size:10px">▲หน้า</button>
      <button title="ทับข้อความ (z20)" onclick="setFreeImgLayer('${imgData.id}','${key}','over')" style="font-size:10px">◈ทับ</button>
      <button title="ใต้ข้อความ (z1)" onclick="setFreeImgLayer('${imgData.id}','${key}','back')" style="font-size:10px">▼หลัง</button>
      <span class="fi-sep">|</span>
      <input type="range" min="10" max="100" value="${Math.round((imgData.opacity||1)*100)}" title="ความโปร่งใส" style="width:48px;margin:0;padding:0;accent-color:#fff" oninput="setFreeImgOpacity('${imgData.id}','${key}',this.value/100)">
    </div>
    <img src="${imgData.src}" draggable="false">
    <div class="resize-dot rh rh-se" title="ปรับขนาด"></div>
    <div class="rh rh-nw" title="ปรับขนาด"></div>
    <div class="rh rh-n"  title="ปรับขนาด"></div>
    <div class="rh rh-ne" title="ปรับขนาด"></div>
    <div class="rh rh-e"  title="ปรับขนาด"></div>
    <div class="rh rh-s"  title="ปรับขนาด"></div>
    <div class="rh rh-sw" title="ปรับขนาด"></div>
    <div class="rh rh-w"  title="ปรับขนาด"></div>
  `;
  pageEl.appendChild(div);

  // Touch support: drag the image
  div.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('rh') || e.target.classList.contains('resize-dot') || e.target.closest('.fi-toolbar')) return;
    const t = e.touches[0];
    const pt = _fiToPageCoords(t.clientX, t.clientY, div);
    _fiDrag.active = true; _fiDrag.el = div; _fiDrag.imgData = imgData;
    _fiDrag.startMX = pt.x; _fiDrag.startMY = pt.y;
    _fiDrag.ox = imgData.x; _fiDrag.oy = imgData.y;
    e.preventDefault();
  }, { passive: false });
  // Touch support: resize dot
  const rdot = div.querySelector('.resize-dot');
  if (rdot) rdot.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    const pt = _fiToPageCoords(t.clientX, t.clientY, div);
    _fiResize.active = true; _fiResize.el = div; _fiResize.imgData = imgData;
    _fiResize.sx = pt.x; _fiResize.sy = pt.y;
    _fiResize.ow = imgData.w; _fiResize.oh = imgData.h;
    e.preventDefault();
  }, { passive: false });
  makeFreeImgDraggable(div, imgData, key);
  makeFreeImgResizable(div, imgData, key);
}

function makeFreeImgDraggable(el, imgData, key) {
  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('rh') || e.target.classList.contains('resize-dot') || e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    // Select this image
    document.querySelectorAll('.free-img').forEach(f => f.classList.remove('selected'));
    el.classList.add('selected');
    // Start drag
    const pt = _fiToPageCoords(e.clientX, e.clientY, el);
    _fiDrag.active = true;
    _fiDrag.el = el;
    _fiDrag.imgData = imgData;
    _fiDrag.startMX = pt.x;
    _fiDrag.startMY = pt.y;
    _fiDrag.ox = imgData.x;
    _fiDrag.oy = imgData.y;
    e.preventDefault();
    e.stopPropagation();
  });
}

function setFreeImgLayer(id, key, layer) {
  const el = document.getElementById(id);
  const arr = freeImages[key];
  const imgData = arr ? arr.find(f => f.id === id) : null;
  const zMap = { top: 100, front: 50, over: 20, back: 1 };
  const z = zMap[layer] || 10;
  if (el) el.style.zIndex = z;
  if (imgData) imgData.zLayer = layer;
}

function setFreeImgOpacity(id, key, val) {
  const el = document.getElementById(id);
  const arr = freeImages[key];
  const imgData = arr ? arr.find(f => f.id === id) : null;
  if (el) el.style.opacity = val;
  if (imgData) imgData.opacity = val;
}

function makeFreeImgResizable(el, imgData, key) {
  const handles = el.querySelectorAll('.rh');
  handles.forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const pt = _fiToPageCoords(e.clientX, e.clientY, el);
      const dir = Array.from(handle.classList).find(c => c.startsWith('rh-') && c !== 'rh');
      _fiResize.active = true;
      _fiResize.el = el;
      _fiResize.imgData = imgData;
      _fiResize.dir = dir || 'rh-se';
      _fiResize.sx = pt.x; _fiResize.sy = pt.y;
      _fiResize.ow = imgData.w; _fiResize.oh = imgData.h;
      _fiResize.ox = imgData.x; _fiResize.oy = imgData.y;
    });
    handle.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      const t = e.touches[0];
      const pt = _fiToPageCoords(t.clientX, t.clientY, el);
      const dir = Array.from(handle.classList).find(c => c.startsWith('rh-') && c !== 'rh');
      _fiResize.active = true; _fiResize.el = el; _fiResize.imgData = imgData;
      _fiResize.dir = dir || 'rh-se';
      _fiResize.sx = pt.x; _fiResize.sy = pt.y;
      _fiResize.ow = imgData.w; _fiResize.oh = imgData.h;
      _fiResize.ox = imgData.x; _fiResize.oy = imgData.y;
      e.preventDefault();
    }, { passive: false });
  });
}

function removeFreeImg(id, key) {
  const el = document.getElementById(id);
  if (el) el.remove();
  if (freeImages[key]) {
    freeImages[key] = freeImages[key].filter(f => f.id !== id);
  }
}

function rotateFreeImg(id, key, deg) {
  const arr = freeImages[key];
  if (!arr) return;
  const imgData = arr.find(f => f.id === id);
  if (!imgData) return;
  imgData.rotation = (imgData.rotation || 0) + deg;
  const el = document.getElementById(id);
  if (el) el.style.transform = `rotate(${imgData.rotation}deg)`;
}

function restoreFreeImages(pageEl, key) {
  if (!freeImages[key]) return;
  freeImages[key].forEach(imgData => addFreeImageToPage(pageEl, imgData, key));
}

// ── Right-click context menu ──
let _ctxMenuTarget = null;
const menu = () => document.getElementById('rightClickMenu');

function openCtxMenu(e, pageEl) {
  e.preventDefault();
  _freeImgTargetPageEl = pageEl;
  _freeImgTargetKey = pageEl.dataset.freeImgKey || '';
  _ctxMenuTarget = pageEl;
  const m = menu();
  m.classList.add('open');
  let x = e.clientX + 4, y = e.clientY + 4;
  if (x + 240 > window.innerWidth) x = e.clientX - 240;
  if (y + 400 > window.innerHeight) y = e.clientY - 380;
  m.style.left = x + 'px';
  m.style.top = y + 'px';
}

function closeCtxMenu() {
  menu().classList.remove('open');
}

document.addEventListener('pointerdown', (e) => {
  // Close ctx menu only if click is outside it — use pointerdown so actions inside still fire
  if (!menu().contains(e.target)) {
    // Small delay so menu item onclick fires before we remove the menu
    setTimeout(closeCtxMenu, 80);
  }
  if (!document.getElementById('perPagePopup').contains(e.target)) {
    setTimeout(closePerPagePopup, 80);
  }
  if (!e.target.closest('.free-img')) {
    document.querySelectorAll('.free-img').forEach(f => f.classList.remove('selected'));
  }
});

function ctxFmt(type) {
  closeCtxMenu();
  applyInlineFmt(type);
}

function ctxSetColor(color) {
  closeCtxMenu();
  document.getElementById('ifbColor').value = color;
  document.getElementById('ifbColorSwatch').style.background = color;
  applyInlineFmt('color');
}

function ctxSetFontSize(val) {
  document.getElementById('ifbSize').value = val;
  weFormat('size');
  closeCtxMenu();
}

function ctxSetFont(font) {
  const ed = weGetEditor();
  if (!ed) return;
  ed.focus();
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) { showToast('คลุมข้อความก่อนตั้งฟอนต์'); return; }
  const range = sel.getRangeAt(0);
  const node = document.createElement('span');
  node.style.fontFamily = `'${font}', sans-serif`;
  try { range.surroundContents(node); } catch(e) {}
  weOnInput();
  closeCtxMenu();
}

function ctxAlign(align) {
  // Update the align buttons in ctx menu
  document.querySelectorAll('#ctxAlignRow button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  setTextAlign(align);
  closeCtxMenu();
}

// ── Page text preview update ──
// ── Page Rich-Text Editor ──
let _pedCurrentPageEl = null;
let _pedCurrentPageParas = []; // paragraph indices on this page
let _pedCurrentChId = null;
let _pedCurrentPiStart = 0; // first paragraph index of this page in chapter

function updatePageTextPreview(pageEl) {
  const wrap = document.getElementById('pageTextPreviewWrap');
  const body = document.getElementById('pedBody');
  if (!pageEl || !wrap || !body) return;
  const bodyEl = pageEl.querySelector('.page-body');
  if (!bodyEl) { wrap.style.display = 'none'; return; }

  _pedCurrentPageEl = pageEl;

  // Figure out which chapter + page index this page belongs to
  // pageEl.dataset.freeImgKey = "chId_pageIndex"
  const key = pageEl.dataset.freeImgKey || '';
  const [chIdStr, piStr] = key.split('_');
  const chId = parseInt(chIdStr);
  const pi = parseInt(piStr) || 0;
  _pedCurrentChId = chId;

  const ch = chapters.find(c => c.id === chId);
  if (!ch) { wrap.style.display = 'none'; return; }

  // Collect paragraphs for this page by re-splitting (same logic as renderChapterPages)
  const allParas = ch.content.split('\n').filter(p => p.trim());
  const fs = parseInt(document.getElementById('fontSize').value) || 15;
  const lh = document.getElementById('lineHeight').value / 100;
  const mv = parseInt(document.getElementById('marginV').value) || 56;
  const mh = parseInt(document.getElementById('marginH').value) || 52;
  const showHeader = document.getElementById('showHeader').checked;
  const showPageNum = document.getElementById('showPageNum').checked;
  const contentW = 559 - 2 * mh;
  const headerH = showHeader ? 32 : 0;
  const footerH = showPageNum ? 32 : 0;
  const contentH = 794 - mv - (mv + 8) - headerH - footerH;
  const charsPerLine = Math.floor(contentW / (fs * 0.56));
  const linesPerPage = Math.floor(contentH / (fs * lh));
  const CHARS_PER_PAGE = Math.max(400, charsPerLine * linesPerPage);
  const TITLE_RESERVE = Math.ceil(180 / (fs * lh));
  const firstPageChars = Math.max(100, CHARS_PER_PAGE - (TITLE_RESERVE * charsPerLine));

  const pageGroups = [[]];
  let charCount = 0;
  let isFirst2 = true;
  const pageLimit2 = () => isFirst2 ? firstPageChars : CHARS_PER_PAGE;
  allParas.forEach(p => {
    const pLen = p.length + 1;
    if (charCount + pLen > pageLimit2() && pageGroups[pageGroups.length - 1].length > 0) {
      pageGroups.push([]); charCount = 0; isFirst2 = false;
    }
    pageGroups[pageGroups.length - 1].push(p);
    charCount += pLen;
    if (charCount >= pageLimit2()) isFirst2 = false;
  });
  if (allParas.length === 0) pageGroups[0] = [];

  const pgParas = pageGroups[pi] || [];

  // Calculate start index of first para on this page
  let startIdx = 0;
  for (let g = 0; g < pi && g < pageGroups.length; g++) startIdx += pageGroups[g].length;
  _pedCurrentPiStart = startIdx;
  _pedCurrentPageParas = pgParas;

  // Build editable HTML from the page paragraphs (render with markup parsed to HTML)
  if (pgParas.length === 0) {
    body.innerHTML = '';
    wrap.style.display = 'none';
    return;
  }

  body.innerHTML = pgParas.map(p => {
    const isSection = p.trim() === '— ✦ —' || p.trim() === '* * *';
    if (isSection) return `<div style="text-align:center;color:var(--gold);letter-spacing:0.4em">${p}</div>`;
    return `<p style="margin:0 0 2px;text-indent:2em">${parseRichText(p)}</p>`;
  }).join('');

  // Update page badge
  const badge = document.getElementById('pedPageBadge');
  if (badge) badge.textContent = `หน้า ${_pedCurrentPageEl ? (allPages.indexOf(allPages.find(u => u.pages[0] === pageEl)) + 1) : '—'}`;

  wrap.style.display = 'block';
  pedUpdateToolbar();
}

function pedExec(cmd, val) {
  document.getElementById('pedBody').focus();
  document.execCommand(cmd, false, val || null);
  pedUpdateToolbar();
}

function pedAlign(align) {
  pedExec('justify' + align.charAt(0).toUpperCase() + align.slice(1));
  ['L','C','R','J'].forEach(x => {
    const b = document.getElementById('pedAlign' + x);
    if (b) b.classList.remove('active');
  });
  const map = { left:'L', center:'C', right:'R', justify:'J' };
  const btn = document.getElementById('pedAlign' + (map[align] || 'J'));
  if (btn) btn.classList.add('active');
}

function pedUpdateToolbar() {
  try {
    ['Bold','Italic','Underline','StrikeThrough'].forEach(cmd => {
      const btn = document.querySelector(`.ped-btn[onclick*="${cmd.toLowerCase()}"], .ped-btn[onclick*="${cmd}"]`);
      // use queryCommandState
    });
    // Update align buttons
    const aligns = { justifyLeft:'L', justifyCenter:'C', justifyRight:'R', justifyFull:'J' };
    Object.entries(aligns).forEach(([cmd, key]) => {
      const el = document.getElementById('pedAlign' + key);
      if (el) el.classList.toggle('active', document.queryCommandState(cmd));
    });
  } catch(e) {}
}

function pedOnInput() {
  // Live sync back to chapter content when typing in the editor
  // (optional: auto-sync on input, or wait for "save" button)
}

function pedRevertToOriginal() {
  if (!_pedCurrentPageEl) return;
  updatePageTextPreview(_pedCurrentPageEl);
  showToast('↺ คืนค่าเนื้อหาจากบทแล้ว');
}

function pedApplyToChapter() {
  const body = document.getElementById('pedBody');
  if (!body || _pedCurrentChId == null) return;
  const ch = chapters.find(c => c.id === _pedCurrentChId);
  if (!ch) return;

  recordHistory();

  // Convert edited HTML back to plain text paragraphs (our markup format)
  // We extract paragraphs from the contenteditable
  const paraEls = Array.from(body.querySelectorAll('p, div'));
  const newParas = paraEls.length > 0
    ? paraEls.map(el => el.innerText.trim()).filter(Boolean)
    : [body.innerText.trim()].filter(Boolean);

  // Replace just the paragraphs belonging to this page
  const allParas = ch.content.split('\n').filter(p => p.trim());
  const start = _pedCurrentPiStart;
  const count = _pedCurrentPageParas.length;

  // Splice in new paragraphs
  allParas.splice(start, count, ...newParas);
  ch.content = allParas.join('\n\n');

  // Refresh WYSIWYG editor
  if (ch.id === currentChapterId) weLoad(ch.content);
  _pedCurrentPageParas = newParas;

  updatePreview();
  updateStats();
  if (typeof autoSaveDebounce === 'function') autoSaveDebounce();
  showToast('💾 บันทึกเนื้อหาหน้านี้เข้าบทแล้ว!');

  // Re-render preview in editor
  setTimeout(() => updatePageTextPreview(_pedCurrentPageEl), 50);
}

// ── Enable drag-and-drop image onto pages ──
function enablePageDrop(pageEl) {
  // Add overlay element
  const overlay = document.createElement('div');
  overlay.className = 'page-drop-overlay';
  overlay.textContent = '🖼 วางรูปที่นี่';
  pageEl.appendChild(overlay);

  pageEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    pageEl.classList.add('drag-over');
  });
  pageEl.addEventListener('dragleave', () => pageEl.classList.remove('drag-over'));
  pageEl.addEventListener('drop', (e) => {
    e.preventDefault();
    pageEl.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const key = pageEl.dataset.freeImgKey || '';
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (!freeImages[key]) freeImages[key] = [];
      const id = 'fi_' + (++_freeImgSerial);
      // Place at drop position relative to page
      const rect = pageEl.getBoundingClientRect();
      const sc = (zoomLevel || 100) / 100;
      // getBoundingClientRect already accounts for scale, so divide delta by scale
      const dropX = Math.max(0, (e.clientX - rect.left) / sc - 90);
      const dropY = Math.max(0, (e.clientY - rect.top) / sc - 70);
      const imgData = { id, src: ev.target.result, x: dropX, y: dropY, w: 180, h: 140, rotation: 0 };
      freeImages[key].push(imgData);
      addFreeImageToPage(pageEl, imgData, key);
      showToast('🖼 วางรูปเรียบร้อย! ลากย้ายหรือปรับขนาดได้');
    };
    reader.readAsDataURL(file);
  });
}

// ── Undo / Redo History ──
const HISTORY_MAX = 100;
const _history = [];   // array of snapshots
let _historyIdx = -1;  // current position
let _historyLocked = false; // prevent recording while restoring

function _snapshot() {
  // Capture full editor state: all chapters content + title + note
  return JSON.parse(JSON.stringify({
    chapters: chapters.map(c => ({
      id: c.id, title: c.title, content: c.content, note: c.note || '',
      imageData: c.imageData || null, imageSize: c.imageSize || 100
    })),
    currentChapterId,
    textAlign, dropCap, bodyFont,
    pageNumStyle, pageNumSize, dropCapSize, dropCapFont,
  }));
}

function _pushHistory(snap) {
  if (_historyLocked) return;
  // Discard any redo tail
  if (_historyIdx < _history.length - 1) {
    _history.splice(_historyIdx + 1);
  }
  _history.push(snap);
  if (_history.length > HISTORY_MAX) _history.shift();
  _historyIdx = _history.length - 1;
  _updateHistoryBtns();
}

function _updateHistoryBtns() {
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  if (undoBtn) undoBtn.disabled = _historyIdx <= 0;
  if (redoBtn) redoBtn.disabled = _historyIdx >= _history.length - 1;
}

function _restoreSnapshot(snap) {
  _historyLocked = true;
  chapters = snap.chapters.map(c => ({ ...c }));
  currentChapterId = snap.currentChapterId;
  textAlign = snap.textAlign;
  dropCap = snap.dropCap;
  bodyFont = snap.bodyFont;
  if (snap.pageNumStyle) pageNumStyle = snap.pageNumStyle;
  if (snap.pageNumSize) pageNumSize = snap.pageNumSize;
  if (snap.dropCapSize) dropCapSize = snap.dropCapSize;
  if (snap.dropCapFont) dropCapFont = snap.dropCapFont;

  // Update UI controls
  document.querySelectorAll('input[name=align]').forEach(r => r.checked = r.value === textAlign);
  const dcEl = document.getElementById('showDropCap');
  if (dcEl) dcEl.checked = dropCap;
  document.querySelectorAll('.font-btn').forEach(b =>
    b.classList.toggle('active', b.textContent.trim().startsWith(bodyFont)));

  // Reload current chapter in editor
  const ch = chapters.find(c => c.id === currentChapterId) || chapters[0];
  if (ch) {
    currentChapterId = ch.id;
    const titleEl = document.getElementById('chapterTitleInput');
    const editorEl = document.getElementById('chapterEditor');
    const noteEl = document.getElementById('chapterNote');
    if (titleEl) titleEl.value = ch.title;
    if (document.getElementById('chapterEditor')) weLoad(ch.content);
    if (noteEl) noteEl.value = ch.note || '';
    const wrap = document.getElementById('chImgPreviewWrap');
    const drop = document.getElementById('chImgDrop');
    if (ch.imageData) {
      document.getElementById('chImgPreview').src = ch.imageData;
      document.getElementById('chImgSize').value = ch.imageSize || 100;
      document.getElementById('chImgSizeVal').textContent = (ch.imageSize || 100) + '%';
      if (wrap) wrap.style.display = 'block';
      if (drop) drop.style.display = 'none';
    } else {
      if (wrap) wrap.style.display = 'none';
      if (drop) drop.style.display = 'block';
    }
  }

  renderChapterList();
  updatePreview();
  updateStats();
  _historyLocked = false;
}

function historyUndo() {
  if (_historyIdx <= 0) return;
  _historyIdx--;
  _restoreSnapshot(_history[_historyIdx]);
  _updateHistoryBtns();
  showToast('↩ Undo — ย้อนกลับแล้ว');
}

function historyRedo() {
  if (_historyIdx >= _history.length - 1) return;
  _historyIdx++;
  _restoreSnapshot(_history[_historyIdx]);
  _updateHistoryBtns();
  showToast('↪ Redo — ทำซ้ำแล้ว');
}

// Record history on every meaningful change (debounced 600ms for typing)
const _historyDebounce = (() => {
  let t;
  return (snap) => { clearTimeout(t); t = setTimeout(() => _pushHistory(snap), 600); };
})();

// Immediate record (for structural changes like add/delete chapter, layout changes)
function recordHistory() {
  if (_historyLocked) return;
  _pushHistory(_snapshot());
}

// Debounced record (for typing)
function recordHistoryDebounced() {
  if (_historyLocked) return;
  _historyDebounce(_snapshot());
}


// ── Paper Texture ──
let paperTexture = 'none';
let textureOpacity = 1.0;

// Texture definitions: background CSS per key
const PAPER_TEXTURES = {
  none:       { bg: '#fffef9', img: '' },
  cream:      { bg: 'linear-gradient(135deg,#fdf8ed 25%,#f7f0df 50%,#fdf8ed 75%)', img: '' },
  aged:       { bg: '#f5ead6', img: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")` },
  lines:      { bg: '#fefefe', img: 'repeating-linear-gradient(transparent,transparent 23px,#c8d8e8 23px,#c8d8e8 24px)' },
  grid:       { bg: '#fefefe', img: 'linear-gradient(rgba(180,200,220,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(180,200,220,0.4) 1px,transparent 1px)', size: '20px 20px' },
  dot:        { bg: '#fefefe', img: 'radial-gradient(circle,rgba(100,140,180,0.35) 1px,transparent 1px)', size: '14px 14px' },
  linen:      { bg: '#f8f4ee', img: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(160,140,100,0.08) 3px,rgba(160,140,100,0.08) 4px),repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(160,140,100,0.08) 3px,rgba(160,140,100,0.08) 4px)' },
  crosshatch: { bg: '#fefefe', img: 'repeating-linear-gradient(45deg,rgba(180,180,180,0.2) 0,rgba(180,180,180,0.2) 1px,transparent 0,transparent 50%),repeating-linear-gradient(135deg,rgba(180,180,180,0.2) 0,rgba(180,180,180,0.2) 1px,transparent 0,transparent 50%)', size: '10px 10px' },
  marble:     { bg: 'linear-gradient(120deg,#f0ece4 0%,#e8e2d8 20%,#ede8e0 40%,#e4dfd5 60%,#ede8e0 80%,#f0ece4 100%)', img: 'repeating-linear-gradient(130deg,transparent,transparent 15px,rgba(200,190,175,0.15) 15px,rgba(200,190,175,0.15) 16px)' },
  parchment:  { bg: 'radial-gradient(ellipse at 20% 20%,#f5e6c8,#e8d4a8 40%,#dcc890 70%,#c9b578)', img: 'repeating-linear-gradient(75deg,transparent,transparent 8px,rgba(160,120,60,0.05) 8px,rgba(160,120,60,0.05) 9px)', textColor: '#2a1a08' },
  dark:       { bg: '#1e1a16', img: 'radial-gradient(circle at 50% 50%,rgba(255,255,255,0.02) 0%,transparent 70%)', textColor: '#e8e0d4' },
  sepia:      { bg: 'linear-gradient(160deg,#f2e4c8,#e8d5a8,#f0e2bc)', img: 'repeating-linear-gradient(0deg,transparent,transparent 11px,rgba(120,90,40,0.06) 11px,rgba(120,90,40,0.06) 12px)', textColor: '#2a1a08' },
  // ── แนวใหม่ ──
  sakura:     { bg: 'linear-gradient(135deg,#fff0f5 0%,#ffe4ee 40%,#fff0f5 70%,#ffd6e8 100%)', img: 'radial-gradient(circle at 20% 30%,rgba(255,182,193,0.18) 0,transparent 35%),radial-gradient(circle at 80% 70%,rgba(255,182,193,0.15) 0,transparent 30%)' },
  pastel:     { bg: 'linear-gradient(160deg,#fef3c7 0%,#fde8f0 33%,#e8f0fe 66%,#f0fde8 100%)', img: '' },
  galaxy:     { bg: 'linear-gradient(160deg,#0f0c29,#302b63,#24243e)', img: 'radial-gradient(ellipse at 20% 20%,rgba(255,255,255,0.04) 0,transparent 40%),radial-gradient(circle at 80% 50%,rgba(150,100,255,0.06) 0,transparent 35%)', textColor: '#e8e4f8' },
  nightsky:   { bg: 'linear-gradient(180deg,#020817 0%,#0f1628 50%,#1a0a2e 100%)', img: 'radial-gradient(circle at 15% 25%,rgba(255,255,255,0.7) 0.5px,transparent 0.5px),radial-gradient(circle at 70% 15%,rgba(255,255,255,0.5) 0.5px,transparent 0.5px),radial-gradient(circle at 45% 60%,rgba(255,255,255,0.6) 0.5px,transparent 0.5px),radial-gradient(circle at 85% 80%,rgba(255,255,255,0.4) 0.5px,transparent 0.5px)', textColor: '#d4d0f0' },
  anime:      { bg: 'linear-gradient(135deg,#f8f4ff 0%,#f0e8ff 50%,#f8f4ff 100%)', img: 'radial-gradient(circle at 10% 90%,rgba(180,130,255,0.1) 0,transparent 40%),radial-gradient(circle at 90% 10%,rgba(130,200,255,0.1) 0,transparent 40%)' },
  moe:        { bg: 'linear-gradient(135deg,#fff5f8 0%,#ffeef6 40%,#f5f0ff 100%)', img: 'radial-gradient(circle,rgba(255,150,200,0.08) 1px,transparent 1px)', size: '18px 18px' },
  shonen:     { bg: '#f0f4ff', img: 'repeating-linear-gradient(45deg,rgba(80,120,255,0.04) 0,rgba(80,120,255,0.04) 1px,transparent 0,transparent 12px),repeating-linear-gradient(-45deg,rgba(80,120,255,0.04) 0,rgba(80,120,255,0.04) 1px,transparent 0,transparent 12px)' },
  vintage_pink:{ bg: 'linear-gradient(135deg,#fdf2f8 0%,#fce7f3 50%,#fdf2f8 100%)', img: 'repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(219,39,119,0.06) 18px,rgba(219,39,119,0.06) 19px)' },
  mint:       { bg: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 50%,#f0fdf4 100%)', img: 'radial-gradient(circle,rgba(34,197,94,0.08) 1px,transparent 1px)', size: '16px 16px' },
  lavender:   { bg: 'linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#f5f3ff 100%)', img: 'repeating-linear-gradient(60deg,transparent,transparent 20px,rgba(139,92,246,0.04) 20px,rgba(139,92,246,0.04) 21px)' },
  horror_dark:{ bg: 'linear-gradient(160deg,#0a0a0a,#1a0505,#0d0d0d)', img: 'radial-gradient(circle at 50% 0%,rgba(180,0,0,0.08) 0,transparent 50%)', textColor: '#ccc0c0' },
  wuxia_paper:{ bg: 'linear-gradient(135deg,#fef9ec 0%,#fdf0d0 40%,#f8e8b8 70%,#fdf0d0 100%)', img: 'repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(150,100,30,0.04) 40px,rgba(150,100,30,0.04) 41px),repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(150,100,30,0.04) 40px,rgba(150,100,30,0.04) 41px)', textColor: '#2a1505' },
  custom_tex: { bg: '#fffef9', img: '', custom: true },
};
// Custom texture image (user-uploaded)
let customTextureImageData = null;

function setPaperTexture(key, el) {
  paperTexture = key;
  document.querySelectorAll('.tx-thumb').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  applyPaperTexture();
  recordHistory();
}

function updateTextureOpacity(val) {
  textureOpacity = parseInt(val) / 100;
  document.getElementById('textureOpacityVal').textContent = val + '%';
  applyPaperTexture();
}

function applyPaperTexture() {
  const tex = PAPER_TEXTURES[paperTexture] || PAPER_TEXTURES.none;
  const pages = document.querySelectorAll('.page.page-inner');

  pages.forEach(page => {
    page.querySelectorAll('.paper-tex-overlay').forEach(o => o.remove());

    if (paperTexture === 'none') {
      page.style.background = '#fffef9';
      page.style.backgroundImage = '';
      page.style.backgroundSize = '';
      page.querySelectorAll('.page-body,.page-chapter-title,.page-chapter-num,.page-number,.page-header').forEach(el => el.style.removeProperty('color'));
    } else {
      page.style.background = '#fffef9';
      page.style.backgroundImage = '';
      page.style.backgroundSize = '';

      const ov = document.createElement('div');
      ov.className = 'paper-tex-overlay';
      ov.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;border-radius:inherit;';

      // Custom texture: uploaded image as repeating background
      if (paperTexture === 'custom_tex' && customTextureImageData) {
        ov.style.backgroundImage = `url(${customTextureImageData})`;
        ov.style.backgroundRepeat = 'repeat';
        ov.style.backgroundSize = '200px auto';
      } else {
        ov.style.background = tex.bg;
        if (tex.img) ov.style.backgroundImage = tex.img;
        if (tex.size) ov.style.backgroundSize = tex.size;
      }
      ov.style.opacity = textureOpacity;
      page.insertBefore(ov, page.firstChild);

      if (tex.textColor) {
        page.querySelectorAll('.page-body,.page-chapter-title,.page-chapter-num,.page-number,.page-header').forEach(el => el.style.setProperty('color', tex.textColor, 'important'));
      } else {
        page.querySelectorAll('.page-body,.page-chapter-title,.page-chapter-num,.page-number,.page-header').forEach(el => el.style.removeProperty('color'));
      }
    }
  });
}

// ── Panel toggle (left / right) ──
function togglePanel(side) {
  if (side === 'left') {
    const panel = document.querySelector('.sidebar');
    const handle = document.getElementById('leftResizeHandle');
    const btn = document.getElementById('leftPanelToggle');
    const collapsed = panel.classList.toggle('collapsed-panel');
    if (handle) handle.style.display = collapsed ? 'none' : '';
    if (btn) btn.classList.toggle('active', !collapsed);
  } else {
    const panel = document.querySelector('.right-panel');
    const handle = document.getElementById('rightResizeHandle');
    const btn = document.getElementById('rightPanelToggle');
    const collapsed = panel.classList.toggle('collapsed-panel');
    if (handle) handle.style.display = collapsed ? 'none' : '';
    if (btn) btn.classList.toggle('active', !collapsed);
  }
}

// ── Page border pattern ──
function setPageBorderPattern(pattern, el) {
  pageBorderPattern = pattern;
  document.querySelectorAll('.bp-thumb').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  const cf = document.getElementById('customBorderFields');
  if (cf) cf.style.display = pattern === 'custom' ? 'block' : 'none';
  applyPageBorders();
  recordHistory();
}

function applyCustomBorderPreview() {
  if (pageBorderPattern === 'custom') applyPageBorders();
}

function updateBorderColor(val) {
  pageBorderColor = val;
  applyPageBorders();
}

function updateBorderThickness(val) {
  pageBorderThickness = parseInt(val);
  document.getElementById('borderThicknessVal').textContent = val + 'px';
  applyPageBorders();
}

function updateBorderLineWeight(val) {
  pageBorderLineWeight = parseInt(val);
  document.getElementById('borderLineWeightVal').textContent = val + 'px';
  applyPageBorders();
}

function applyPageBorders() {
  // Remove existing border overlays
  document.querySelectorAll('.page-border-overlay').forEach(el => el.remove());
  if (pageBorderPattern === 'none') return;

  const t = pageBorderThickness;
  const c = pageBorderColor;
  const lw = pageBorderLineWeight;

  // Apply to all inner pages (not cover)
  document.querySelectorAll('.page.page-inner').forEach(page => {
    const ov = document.createElement('div');
    ov.className = 'page-border-overlay';
    ov.style.setProperty('--pb-color', c);
    ov.style.setProperty('--pb-lw', lw + 'px');
    renderBorderPattern(ov, pageBorderPattern, c, t, lw);
    page.appendChild(ov);
  });
}

function renderBorderPattern(el, pattern, c, t, lw) {
  el.innerHTML = '';
  const s = t; // inset size
  lw = lw || 2; // line weight default 2px

  if (pattern === 'classic') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};pointer-events:none;box-sizing:border-box"></div>
      <div style="position:absolute;inset:${s+5}px;border:${Math.max(1,lw-1)}px solid ${c};pointer-events:none;box-sizing:border-box"></div>`;
  } else if (pattern === 'double') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};pointer-events:none;box-sizing:border-box"></div>
      <div style="position:absolute;inset:${s+4+lw}px;border:${lw}px solid ${c};pointer-events:none;box-sizing:border-box"></div>`;
  } else if (pattern === 'vintage') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};border-radius:4px;pointer-events:none;box-sizing:border-box"></div>
      <div style="position:absolute;inset:${s+5}px;border:${Math.max(1,lw-1)}px dashed ${c};border-radius:2px;pointer-events:none;box-sizing:border-box"></div>`;
  } else if (pattern === 'shadow') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};box-shadow:inset 0 0 12px rgba(0,0,0,0.07);pointer-events:none;box-sizing:border-box"></div>`;
  } else if (pattern === 'ornate') {
    const cornerSvg = (r) => `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' style='transform:rotate(${r}deg)'><path d='M2 20 L2 2 L20 2' fill='none' stroke='${c}' stroke-width='${lw}'/><circle cx='2' cy='2' r='2.5' fill='${c}'/></svg>`;
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};pointer-events:none;box-sizing:border-box"></div>
      <div style="position:absolute;top:${s-2}px;left:${s-2}px">${cornerSvg(0)}</div>
      <div style="position:absolute;top:${s-2}px;right:${s-2}px">${cornerSvg(90)}</div>
      <div style="position:absolute;bottom:${s-2}px;left:${s-2}px">${cornerSvg(270)}</div>
      <div style="position:absolute;bottom:${s-2}px;right:${s-2}px">${cornerSvg(180)}</div>`;
  } else if (pattern === 'minimal') {
    el.innerHTML = `
      <div style="position:absolute;left:${s}px;right:${s}px;top:${s}px;border-top:${lw}px solid ${c};pointer-events:none"></div>
      <div style="position:absolute;left:${s}px;right:${s}px;bottom:${s}px;border-bottom:${lw}px solid ${c};pointer-events:none"></div>`;
  } else if (pattern === 'corner') {
    const arm = Math.min(40, t * 2.5 + lw * 4);
    el.innerHTML = `
      <div style="position:absolute;top:${s}px;left:${s}px;width:${arm}px;height:${arm}px;border-top:${lw}px solid ${c};border-left:${lw}px solid ${c};pointer-events:none"></div>
      <div style="position:absolute;top:${s}px;right:${s}px;width:${arm}px;height:${arm}px;border-top:${lw}px solid ${c};border-right:${lw}px solid ${c};pointer-events:none"></div>
      <div style="position:absolute;bottom:${s}px;left:${s}px;width:${arm}px;height:${arm}px;border-bottom:${lw}px solid ${c};border-left:${lw}px solid ${c};pointer-events:none"></div>
      <div style="position:absolute;bottom:${s}px;right:${s}px;width:${arm}px;height:${arm}px;border-bottom:${lw}px solid ${c};border-right:${lw}px solid ${c};pointer-events:none"></div>`;
  } else if (pattern === 'floral') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px dashed ${c};border-radius:3px;pointer-events:none;box-sizing:border-box"></div>
      <div style="position:absolute;top:${s-6}px;left:${s-6}px;font-size:12px;color:${c};pointer-events:none">✿</div>
      <div style="position:absolute;top:${s-6}px;right:${s-6}px;font-size:12px;color:${c};pointer-events:none">✿</div>
      <div style="position:absolute;bottom:${s-6}px;left:${s-6}px;font-size:12px;color:${c};pointer-events:none">✿</div>
      <div style="position:absolute;bottom:${s-6}px;right:${s-6}px;font-size:12px;color:${c};pointer-events:none">✿</div>`;
  } else if (pattern === 'wave') {
    el.innerHTML = `
      <div style="position:absolute;left:${s}px;right:${s}px;top:${s}px;border-top:${lw}px dotted ${c};pointer-events:none"></div>
      <div style="position:absolute;left:${s}px;right:${s}px;bottom:${s}px;border-bottom:${lw}px dotted ${c};pointer-events:none"></div>
      <div style="position:absolute;top:${s}px;bottom:${s}px;left:${s}px;border-left:${lw}px dotted ${c};pointer-events:none"></div>
      <div style="position:absolute;top:${s}px;bottom:${s}px;right:${s}px;border-right:${lw}px dotted ${c};pointer-events:none"></div>`;
  } else if (pattern === 'triple') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw+1}px double ${c};box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;inset:${s+6+lw}px;border:${Math.max(1,lw-1)}px solid ${c};box-sizing:border-box;pointer-events:none"></div>`;
  } else if (pattern === 'custom') {
    const customCSS = document.getElementById('customBorderCSS')?.value || 'border:' + lw + 'px solid ' + c;
    const customBG = document.getElementById('customBorderBG')?.value || '';
    el.innerHTML = `<div style="position:absolute;inset:${s}px;box-sizing:border-box;pointer-events:none;${customCSS};${customBG}"></div>`;
  }
  // ── แนวใหม่ ──
  else if (pattern === 'kawaii') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};border-radius:8px;box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;top:${s-7}px;left:50%;transform:translateX(-50%);font-size:13px;color:${c};letter-spacing:4px;pointer-events:none">♥ ♡ ♥</div>
      <div style="position:absolute;bottom:${s-7}px;left:50%;transform:translateX(-50%);font-size:13px;color:${c};letter-spacing:4px;pointer-events:none">♡ ♥ ♡</div>`;
  } else if (pattern === 'sparkle_border') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;top:${s-8}px;left:${s-8}px;font-size:14px;color:${c};pointer-events:none">✦</div>
      <div style="position:absolute;top:${s-8}px;right:${s-8}px;font-size:14px;color:${c};pointer-events:none">✦</div>
      <div style="position:absolute;bottom:${s-8}px;left:${s-8}px;font-size:14px;color:${c};pointer-events:none">✦</div>
      <div style="position:absolute;bottom:${s-8}px;right:${s-8}px;font-size:14px;color:${c};pointer-events:none">✦</div>`;
  } else if (pattern === 'manga') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw+1}px solid ${c};box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;inset:${s+4+lw}px;border:${Math.max(1,lw-1)}px solid ${c};box-sizing:border-box;pointer-events:none"></div>`;
  } else if (pattern === 'wuxia_border') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;top:${s-8}px;left:50%;transform:translateX(-50%);font-size:13px;color:${c};letter-spacing:4px;pointer-events:none">— 龍 —</div>
      <div style="position:absolute;bottom:${s-8}px;left:50%;transform:translateX(-50%);font-size:13px;color:${c};letter-spacing:4px;pointer-events:none">— 鳳 —</div>`;
  } else if (pattern === 'rose_border') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};border-radius:2px;box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;top:${s-8}px;left:${s-8}px;font-size:14px;pointer-events:none">🌹</div>
      <div style="position:absolute;top:${s-8}px;right:${s-8}px;font-size:14px;pointer-events:none">🌹</div>
      <div style="position:absolute;bottom:${s-8}px;left:${s-8}px;font-size:14px;pointer-events:none">🌹</div>
      <div style="position:absolute;bottom:${s-8}px;right:${s-8}px;font-size:14px;pointer-events:none">🌹</div>`;
  } else if (pattern === 'star_border') {
    el.innerHTML = `
      <div style="position:absolute;inset:${s}px;border:${lw}px solid ${c};box-sizing:border-box;pointer-events:none"></div>
      <div style="position:absolute;top:${s-8}px;left:${s-8}px;font-size:13px;color:${c};pointer-events:none">★</div>
      <div style="position:absolute;top:${s-8}px;right:${s-8}px;font-size:13px;color:${c};pointer-events:none">★</div>
      <div style="position:absolute;bottom:${s-8}px;left:${s-8}px;font-size:13px;color:${c};pointer-events:none">★</div>
      <div style="position:absolute;bottom:${s-8}px;right:${s-8}px;font-size:13px;color:${c};pointer-events:none">★</div>`;
  } else if (pattern === 'custom_img_border') {
    if (customBorderImageData) {
      el.innerHTML = `<div style="position:absolute;inset:0;border-image:url(${customBorderImageData}) 30 round;border-width:${t}px;border-style:solid;box-sizing:border-box;pointer-events:none"></div>`;
    }
  }
}
let customBorderImageData = null;

// ── Panel section accordion (right panel) ──
function initPanelSectionAccordions() {
  document.querySelectorAll('.panel-section').forEach(sec => {
    const titleEl = sec.querySelector('.panel-section-title');
    if (!titleEl || titleEl.dataset.accordionInit) return;
    titleEl.dataset.accordionInit = '1';
    // Add arrow
    if (!titleEl.querySelector('.ps-arrow')) {
      const arrow = document.createElement('span');
      arrow.className = 'ps-arrow';
      arrow.textContent = '▼';
      titleEl.appendChild(arrow);
    }
    // Wrap all non-title children in panel-section-body if not already
    let body = sec.querySelector('.panel-section-body');
    if (!body) {
      body = document.createElement('div');
      body.className = 'panel-section-body';
      const children = Array.from(sec.children).filter(c => c !== titleEl);
      children.forEach(c => body.appendChild(c));
      sec.appendChild(body);
    }
    titleEl.addEventListener('click', () => {
      sec.classList.toggle('ps-collapsed');
    });
  });
}

// Call after DOM content and also after tab switches / panel updates
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initPanelSectionAccordions, 100);
});

// Patch switchTab to reinit accordions when tabs are shown
const _origSwitchTab = window.switchTab;
window.switchTab = function(tab, el) {
  if (_origSwitchTab) _origSwitchTab(tab, el);
  setTimeout(initPanelSectionAccordions, 50);
};

// ── Ribbon Toolbar JS ──

function switchRibbonTab(name, el) {
  document.querySelectorAll('.ribbon-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ribbon-body').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  const body = document.getElementById('rtab-' + name);
  if (body) body.classList.add('active');
}

function toggleRibbon() {
  const ribbon = document.getElementById('ribbon');
  const btn = document.getElementById('ribbonCollapseBtn');
  const collapsed = ribbon.classList.toggle('collapsed');
  btn.textContent = collapsed ? '▼' : '▲';
  document.querySelector('.main').style.height = collapsed
    ? 'calc(100vh - 52px - 34px)'
    : 'calc(100vh - 52px - 90px)';
}

function rbFmt(type) {
  const ta = document.getElementById('chapterEditor');
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e);
  if (!sel && type !== 'clear') { showToast('กรุณาคลุมข้อความก่อน'); return; }
  let wrapped = sel;
  switch (type) {
    case 'bold':      wrapped = `**${sel}**`; break;
    case 'italic':    wrapped = `_${sel}_`; break;
    case 'underline': wrapped = `__${sel}__`; break;
    case 'strike':    wrapped = `~~${sel}~~`; break;
    case 'quote':     wrapped = `«${sel}»`; break;
    case 'highlight': wrapped = `==${sel}==`; break;
    case 'clear':     wrapped = sel.replace(/\*\*|__|_|==|`|«|»|~~/g, ''); break;
  }
  ta.value = ta.value.substring(0, s) + wrapped + ta.value.substring(e);
  ta.selectionStart = s; ta.selectionEnd = s + wrapped.length;
  ta.focus();
  updateChapterContent(ta.value);
}

function rbAlign(align) {
  ['l','c','r','j'].forEach(k => document.getElementById('rb-a'+k)?.classList.remove('active'));
  document.getElementById('rb-a' + align[0])?.classList.add('active');
  setTextAlign(align);
}

function rbSetFont(font) {
  bodyFont = font;
  document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.textContent.trim().startsWith(font)));
  renderChapterPages();
}

function rbSetFontSize(val) {
  const el = document.getElementById('fontSize');
  if (el) { el.value = val; updateFontSize(val); }
  const el2 = document.getElementById('rb-fs2');
  if (el2) el2.value = val;
}

function rbSetFontSizeGlobal(val) {
  const el = document.getElementById('fontSize');
  if (el) { el.value = val; updateFontSize(val); }
  const el1 = document.getElementById('rb-size');
  if (el1) el1.value = val;
}

function rbSetLineHeight(val) {
  const el = document.getElementById('lineHeight');
  if (el) { el.value = val; updateLineHeight(val); }
  const el2 = document.getElementById('rb-lh2');
  if (el2) el2.value = val;
}

function rbSetLineHeightGlobal(val) {
  const el = document.getElementById('lineHeight');
  if (el) { el.value = val; updateLineHeight(val); }
  const el1 = document.getElementById('rb-lh');
  if (el1) el1.value = val;
}

function rbSetMargin(axis, val) {
  if (axis === 'v') { const el = document.getElementById('marginV'); if (el) el.value = val; }
  else { const el = document.getElementById('marginH'); if (el) el.value = val; }
  updateMargins();
}

function rbSetColor(color) {
  document.getElementById('rb-fgBox').style.background = color;
  const ta = document.getElementById('chapterEditor');
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e);
  if (!sel) { showToast('กรุณาคลุมข้อความก่อน'); return; }
  const wrapped = `<color:${color}>${sel}</color>`;
  ta.value = ta.value.substring(0, s) + wrapped + ta.value.substring(e);
  ta.focus(); updateChapterContent(ta.value);
}

function rbSetHighlight(color) {
  document.getElementById('rb-hlBox').style.background = color;
  const ta = document.getElementById('chapterEditor');
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e);
  if (!sel) { showToast('กรุณาคลุมข้อความก่อน'); return; }
  ta.value = ta.value.substring(0, s) + `==${sel}==` + ta.value.substring(e);
  ta.focus(); updateChapterContent(ta.value);
}

function rbToggleDropCap(cb) {
  dropCap = cb.checked;
  const el = document.getElementById('showDropCap');
  if (el) el.checked = dropCap;
  renderChapterPages();
}

function rbInsertChapterImage() {
  document.getElementById('chImgDrop')?.querySelector('input[type=file]')?.click();
}

function rbInsertFreeImage() {
  const u = allPages[currentPageIndex];
  if (u && u.pages[0]) {
    _freeImgTargetPageEl = u.pages[0];
    _freeImgTargetKey = u.pages[0].dataset.freeImgKey || '';
  }
  document.getElementById('freeImgInput').click();
}

function rbUploadCover() {
  document.getElementById('coverDrop')?.querySelector('input[type=file]')?.click();
}

function rbZoomSlider(val) {
  zoomLevel = parseInt(val);
  document.getElementById('zoomVal').textContent = val + '%';
  document.getElementById('rb-zoomVal').textContent = val + '%';
  document.getElementById('zoomWrap').style.transform = `scale(${val / 100})`;
}

function rbMarkTex(key) {
  document.querySelectorAll('[id^="rb-tex-"]').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('rb-tex-' + key);
  if (el) el.classList.add('active');
}

function rbMarkBp(key) {
  document.querySelectorAll('[id^="rb-bp-"]').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('rb-bp-' + key);
  if (el) el.classList.add('active');
}

function rbMarkLayout(btn) {
  document.querySelectorAll('[id^="rb-lay-"]').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function rbMarkTpl(key) {
  document.querySelectorAll('[id^="rb-tpl-"]').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('rb-tpl-' + key);
  if (el) el.classList.add('active');
}

function _rbSyncNav() {
  const info = document.getElementById('navInfo');
  const rbNav = document.getElementById('rb-navInfo');
  if (info && rbNav) rbNav.textContent = info.textContent;
  const rbZv = document.getElementById('rb-zoomVal');
  const rbZs = document.getElementById('rb-zoomSlider');
  if (rbZv) rbZv.textContent = zoomLevel + '%';
  if (rbZs) rbZs.value = zoomLevel;
}

const _origApplyViewMode = window.applyViewMode;
window.applyViewMode = function() {
  if (_origApplyViewMode) _origApplyViewMode();
  setTimeout(_rbSyncNav, 50);
};

const _origAdjustZoom = window.adjustZoom;
window.adjustZoom = function(delta) {
  if (_origAdjustZoom) _origAdjustZoom(delta);
  const rbZs = document.getElementById('rb-zoomSlider');
  const rbZv = document.getElementById('rb-zoomVal');
  if (rbZs) rbZs.value = zoomLevel;
  if (rbZv) rbZv.textContent = zoomLevel + '%';
};

// ── End Ribbon JS ──

