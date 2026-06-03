function _collectSnapshot() {
  return {
    ts: Date.now(),
    chapters: JSON.parse(JSON.stringify(chapters)),
    bookInfo: ['bookTitle','bookSubtitle','authorName','penName','publisher','pubYear','genre'].reduce((o,id)=>{const el=document.getElementById(id);if(el)o[id]=el.value;return o;},{}),
    label: new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
  };
}

function createManualBackup() {
  const snap = _collectSnapshot();
  backupList_data.unshift(snap);
  if (backupList_data.length > MAX_BACKUPS) backupList_data.length = MAX_BACKUPS;
  _saveBackupsToStorage();
  renderBackupList();
  showToast('📷 Checkpoint บันทึกแล้ว!');
}

function _saveBackupsToStorage() {
  try { localStorage.setItem('ebook_backups', JSON.stringify(backupList_data.map(b=>({ts:b.ts,label:b.label,chapters:b.chapters,bookInfo:b.bookInfo})))); } catch(e){}
}

function _loadBackupsFromStorage() {
  try {
    const raw = localStorage.getItem('ebook_backups');
    if (raw) backupList_data = JSON.parse(raw);
  } catch(e) {}
  renderBackupList();
}

function renderBackupList() {
  const container = document.getElementById('backupList');
  if (!container) return;
  if (!backupList_data.length) {
    container.innerHTML = '<div style="font-size:11px;color:var(--ink-faint);text-align:center;padding:12px">ยังไม่มี Checkpoint</div>';
    return;
  }
  container.innerHTML = '';
  backupList_data.forEach((b, i) => {
    const item = document.createElement('div');
    item.className = 'backup-item';
    const chCount = b.chapters ? b.chapters.length : 0;
    const wordCount = b.chapters ? b.chapters.reduce((s,c)=>(s+(c.content||'').split(/\s+/).filter(Boolean).length),0) : 0;
    item.innerHTML = `
      <div>
        <div class="bi-time">⏱ ${b.label}</div>
        <div class="bi-info">${chCount} บท · ${wordCount} คำ</div>
      </div>
      <button class="bi-restore" onclick="restoreBackup(${i})">กู้คืน</button>`;
    container.appendChild(item);
  });
}

function restoreBackup(idx) {
  const b = backupList_data[idx];
  if (!b) return;
  if (!confirm(`กู้คืน Checkpoint "${b.label}" ?\nการเปลี่ยนแปลงปัจจุบันจะถูกแทนที่`)) return;
  chapters = JSON.parse(JSON.stringify(b.chapters));
  if (b.bookInfo) {
    Object.entries(b.bookInfo).forEach(([id,val]) => {
      const el = document.getElementById(id); if(el) el.value = val;
    });
  }
  currentChapterId = chapters[0]?.id || 1;
  renderChapterList();
  selectChapter(currentChapterId);
  updatePreview();
  showToast('✅ กู้คืน Checkpoint แล้ว!');
}

// Auto-backup every 5 minutes
setInterval(() => {
  if (chapters && chapters.length > 0) {
    const snap = _collectSnapshot();
    backupList_data.unshift(snap);
    if (backupList_data.length > MAX_BACKUPS) backupList_data.length = MAX_BACKUPS;
    _saveBackupsToStorage();
    renderBackupList();
  }
}, 5 * 60 * 1000);

// ── FEATURE 8: Paper Mode (Dark/Light/Cream/Sepia) ──
const PAPER_MODES = {
  white:  { bg:'#fffef9', ink:'#1a1612', headerColor:null },
  cream:  { bg:'#fdf8ed', ink:'#1a1612', headerColor:null },
  warm:   { bg:'#f5e9d0', ink:'#2a1a0a', headerColor:'#6b4423' },
  sepia:  { bg:'#f2e4c8', ink:'#3a2a10', headerColor:'#8b6020' },
  night:  { bg:'#1e1a16', ink:'#d0c8b8', headerColor:'#a09080' },
};
let currentPaperMode = 'white';

