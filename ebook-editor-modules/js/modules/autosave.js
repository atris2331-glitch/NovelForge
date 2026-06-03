// ── Auto Save ──
function autoSave() {
  showAutosaveStatus('saving');
  try {
    const bookInfoIds = ['bookTitle','bookSubtitle','authorName','penName','publisher','pubYear','genre',
      'showTOC','showPreface','prefaceTitle','prefaceContent','showDedication','dedicationText'];
    const bookInfo = {};
    bookInfoIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) bookInfo[id] = el.type === 'checkbox' ? el.checked : el.value;
    });

    const settings = {
      textAlign, dropCap, bodyFont, coverTemplate, coverImageData,
      fontSize: document.getElementById('fontSize')?.value,
      lineHeight: document.getElementById('lineHeight')?.value,
      marginV: document.getElementById('marginV')?.value,
      marginH: document.getElementById('marginH')?.value,
      coverBrightness: document.getElementById('coverBrightness')?.value,
      coverOverlay: document.getElementById('coverOverlay')?.value,
    };

    const data = { bookInfo, chapters, settings, savedAt: new Date().toISOString() };
    localStorage.setItem('ebook_editor_autosave', JSON.stringify(data));
    showAutosaveStatus('saved');
  } catch(e) {
    console.warn('Autosave failed', e);
    showAutosaveStatus('error');
  }
}

function showAutosaveStatus(status) {
  const badge = document.getElementById('autosaveBadge');
  const text = document.getElementById('autosaveText');
  if (!badge || !text) return;
  badge.className = 'autosave-badge';
  if (status === 'saving') {
    badge.classList.add('saving'); text.textContent = 'กำลังบันทึก...';
  } else if (status === 'saved') {
    badge.classList.add('saved');
    const now = new Date();
    text.textContent = `✓ บันทึก ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    setTimeout(() => { badge.className = 'autosave-badge'; text.textContent = 'Auto Save ✓'; }, 3000);
  } else if (status === 'loaded') {
    badge.classList.add('saved'); text.textContent = '✓ โหลดแล้ว';
    setTimeout(() => { badge.className = 'autosave-badge'; text.textContent = 'Auto Save ✓'; }, 3000);
  } else if (status === 'error') {
    text.textContent = '⚠️ บันทึกไม่ได้';
    setTimeout(() => { text.textContent = 'Auto Save'; }, 3000);
  } else {
    text.textContent = 'Auto Save';
  }
}

// ── Save Project as JSON ──
function saveProject() {
  autoSave();
  const bookInfoIds = ['bookTitle','bookSubtitle','authorName','penName','publisher','pubYear','genre',
    'showTOC','showPreface','prefaceTitle','prefaceContent','showDedication','dedicationText'];
  const bookInfo = {};
  bookInfoIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) bookInfo[id] = el.type === 'checkbox' ? el.checked : el.value;
  });
  const settings = {
    textAlign, dropCap, bodyFont, coverTemplate, coverImageData,
    fontSize: document.getElementById('fontSize')?.value,
    lineHeight: document.getElementById('lineHeight')?.value,
    marginV: document.getElementById('marginV')?.value,
    marginH: document.getElementById('marginH')?.value,
    coverBrightness: document.getElementById('coverBrightness')?.value,
    coverOverlay: document.getElementById('coverOverlay')?.value,
  };
  const data = { bookInfo, chapters, settings, savedAt: new Date().toISOString(), version: '4' };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const title = document.getElementById('bookTitle')?.value || 'ebook';
  const safeTitle = title.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
  a.href = url; a.download = `${safeTitle}_project.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('💾 บันทึกโปรเจกต์ .json เรียบร้อย!');
}

