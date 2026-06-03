// ── FEATURE 6: Regex Find & Replace ──
function _buildSearchRegex(query) {
  const useRegex = document.getElementById('searchRegex')?.checked;
  const useCase = document.getElementById('searchCase')?.checked;
  const useWhole = document.getElementById('searchWholeWord')?.checked;
  let pattern = query;
  if (!useRegex) pattern = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (useWhole) pattern = '\\b' + pattern + '\\b';
  const flags = 'g' + (useCase ? '' : 'i');
  try { return new RegExp(pattern, flags); } catch(e) { return null; }
}

function searchCount() {
  const query = document.getElementById('searchInput').value;
  const info = document.getElementById('searchInfo');
  if (!query) { info.textContent = ''; info.className = 'search-result-info'; return; }
  const rx = _buildSearchRegex(query);
  if (!rx) { info.textContent = '⚠️ Regex ไม่ถูกต้อง'; info.className = 'search-result-info miss'; return; }
  const scope = document.querySelector('input[name=searchScope]:checked')?.value;
  const targets = scope === 'all' ? chapters : chapters.filter(c => c.id === currentChapterId);
  let total = 0;
  targets.forEach(ch => { const m = (ch.content || '').match(rx); if (m) total += m.length; });
  if (total > 0) {
    info.textContent = `พบ ${total} รายการ`;
    info.className = 'search-result-info hit';
  } else {
    info.textContent = 'ไม่พบข้อความที่ค้นหา';
    info.className = 'search-result-info miss';
  }
}

function replaceAll() {
  const query = document.getElementById('searchInput').value;
  const replacement = document.getElementById('replaceInput').value;
  if (!query) return;
  const rx = _buildSearchRegex(query);
  if (!rx) { showToast('⚠️ Regex ไม่ถูกต้อง'); return; }
  const scope = document.querySelector('input[name=searchScope]:checked')?.value;
  const targets = scope === 'all' ? chapters : chapters.filter(c => c.id === currentChapterId);
  let total = 0;
  targets.forEach(ch => {
    const before = ch.content || '';
    const after = before.replace(rx, replacement);
    const count = (before.match(rx) || []).length;
    total += count;
    ch.content = after;
  });
  if (currentChapterId) {
    const ch = chapters.find(c => c.id === currentChapterId);
    const ta = document.getElementById('chapterEditor');
    if (ch && ta) ta.value = ch.content;
  }
  updatePreview();
  showToast(`✅ แทนที่ ${total} รายการเรียบร้อย`);
  searchCount();
}

function replaceOne() {
  const query = document.getElementById('searchInput').value;
  const replacement = document.getElementById('replaceInput').value;
  if (!query) return;
  const rx = _buildSearchRegex(query);
  if (!rx) { showToast('⚠️ Regex ไม่ถูกต้อง'); return; }
  // Replace only first occurrence in current scope
  const scope = document.querySelector('input[name=searchScope]:checked')?.value;
  const targets = scope === 'all' ? chapters : chapters.filter(c => c.id === currentChapterId);
  for (const ch of targets) {
    const before = ch.content || '';
    // Reset lastIndex for stateful regex
    rx.lastIndex = 0;
    if (rx.test(before)) {
      rx.lastIndex = 0;
      ch.content = before.replace(rx, (m, ...args) => {
        // Replace only first: set flag
        if (!replaceOne._done) { replaceOne._done = true; return replacement.replace(/\$(\d+)/g, (_, n) => args[parseInt(n)-1] || ''); }
        return m;
      });
      replaceOne._done = false;
      if (currentChapterId === ch.id) {
        const ta = document.getElementById('chapterEditor'); if (ta) ta.value = ch.content;
      }
      updatePreview();
      showToast('✅ แทนที่ 1 รายการ');
      searchCount();
      return;
    }
  }
  showToast('ไม่พบข้อความที่ค้นหา');
}
replaceOne._done = false;

// ── FEATURE 5: Clipboard / Paste history with preserve/strip mode ──
let clipboardHistory = [];
const MAX_CLIP_HISTORY = 10;
let _pasteMode = 'preserve'; // 'preserve' | 'strip'
