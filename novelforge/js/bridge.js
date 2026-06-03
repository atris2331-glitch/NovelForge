// ═══════════════════════════════════════════════════════════════
// bridge.js — React ↔ Editor JS modules bridge
// ═══════════════════════════════════════════════════════════════

// Global state that modules read/write
var chapters = [];
var currentChapterId = null;
var coverImageData = null;
var textAlign = 'justify';
var dropCap = true;
var bodyFont = 'Sarabun';
var coverTemplate = 'dark';
var coverTemplates = {};
var viewMode = 'single';
var currentPageIndex = 0;
var zoomLevel = 100;
var allPages = [];
var backupList_data = [];
var MAX_BACKUPS = 5;

// ── Sync FROM React → modules ──────────────────────────────────
// React calls this whenever its state changes
window.NF = window.NF || {};
window.NF.syncFromReact = function(reactChapters, activeId) {
  // Deep copy to avoid React immutability issues
  chapters = JSON.parse(JSON.stringify(reactChapters || []));
  currentChapterId = activeId || (chapters[0] && chapters[0].id);
};

// ── Sync TO React ← modules ────────────────────────────────────
// Modules call this after mutating chapters
window.NF.pushToReact = function() {
  if (typeof window.__nfSetChapters === 'function') {
    window.__nfSetChapters(JSON.parse(JSON.stringify(chapters)));
  }
};

// ── showToast helper (modules call this) ───────────────────────
function showToast(msg, duration) {
  var t = document.getElementById('nf-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'nf-toast';
    t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);'
      + 'background:#1e1b18;color:#e0dbd4;border:1px solid #3a3632;border-radius:20px;'
      + 'padding:8px 20px;font-size:13px;font-family:Sarabun,sans-serif;'
      + 'z-index:99999;pointer-events:none;opacity:0;transition:opacity .2s;'
      + 'box-shadow:0 4px 20px rgba(0,0,0,.5);';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._tid);
  t._tid = setTimeout(function() { t.style.opacity = '0'; }, duration || 2500);
}

// ── updatePreview: called by modules after content change ───────
// Notifies React to re-render
function updatePreview() {
  window.NF.pushToReact();
}

// ── pushHistory / historyUndo / historyRedo stubs ───────────────
// (React handles its own undo if needed; these prevent errors)
var _history = [], _historyIdx = -1;
function pushHistory() {
  var snap = JSON.parse(JSON.stringify(chapters));
  _history = _history.slice(0, _historyIdx + 1);
  _history.push(snap);
  if (_history.length > 50) _history.shift();
  _historyIdx = _history.length - 1;
}
function historyUndo() {
  if (_historyIdx > 0) {
    _historyIdx--;
    chapters = JSON.parse(JSON.stringify(_history[_historyIdx]));
    window.NF.pushToReact();
  }
}
function historyRedo() {
  if (_historyIdx < _history.length - 1) {
    _historyIdx++;
    chapters = JSON.parse(JSON.stringify(_history[_historyIdx]));
    window.NF.pushToReact();
  }
}

// ── autoSave shim ────────────────────────────────────────────────
function autoSave() {
  try {
    var data = { chapters: chapters, savedAt: new Date().toISOString() };
    localStorage.setItem('ebook_editor_autosave', JSON.stringify(data));
    showToast('✓ บันทึกแล้ว', 1500);
  } catch(e) {}
}
function showAutosaveStatus(s) {
  if (s === 'saving') showToast('⏳ กำลังบันทึก...', 1000);
  else if (s === 'saved') showToast('✓ บันทึกแล้ว', 1500);
}
setInterval(function() { if (chapters.length) autoSave(); }, 60000);

// ── renderChapterList shim (backup/restore needs this) ───────────
function renderChapterList() { window.NF.pushToReact(); }
function selectChapter(id) {
  currentChapterId = id;
  if (typeof window.__nfSetActiveChapter === 'function') {
    window.__nfSetActiveChapter(id);
  }
}

// ── DOM stubs for elements modules might query ───────────────────
// modules do getElementById for settings fields that don't exist in React
// wrap to return safe defaults
var _origGetById = document.getElementById.bind(document);
document.getElementById = function(id) {
  var el = _origGetById(id);
  if (el) return el;
  // Return a dummy element that won't throw
  var dummy = {
    value: '', checked: false, textContent: '', style: {},
    classList: { add: function(){}, remove: function(){}, toggle: function(){}, contains: function(){ return false; } },
    querySelectorAll: function(){ return []; },
    querySelector: function(){ return null; }
  };
  return dummy;
};