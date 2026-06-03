// ── Init ──
function init() {
  // Try to load from autosave first
  const saved = localStorage.getItem('ebook_editor_autosave');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.chapters && data.chapters.length > 0) {
        chapters = data.chapters;
        currentChapterId = chapters[0].id;
        // Restore book info
        if (data.bookInfo) {
          Object.entries(data.bookInfo).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) {
              if (el.type === 'checkbox') el.checked = val;
              else el.value = val;
            }
          });
        }
        // Restore settings
        if (data.settings) {
          if (data.settings.textAlign) textAlign = data.settings.textAlign;
          if (data.settings.dropCap !== undefined) dropCap = data.settings.dropCap;
          if (data.settings.bodyFont) bodyFont = data.settings.bodyFont;
          if (data.settings.coverTemplate) coverTemplate = data.settings.coverTemplate;
          if (data.settings.coverImageData) {
            coverImageData = data.settings.coverImageData;
            document.getElementById('coverPreview').src = coverImageData;
            document.getElementById('coverPreview').style.display = 'block';
            document.getElementById('coverPlaceholder').style.display = 'none';
            document.getElementById('coverDrop').classList.add('has-image');
            document.getElementById('coverBg').style.backgroundImage = `url(${coverImageData})`;
            document.getElementById('coverBg').style.backgroundSize = 'cover';
            document.getElementById('coverBg').style.backgroundPosition = 'center';
          }
          // Restore sliders
          ['fontSize','lineHeight','marginV','marginH','coverBrightness','coverOverlay'].forEach(id => {
            if (data.settings[id] !== undefined) {
              const el = document.getElementById(id);
              if (el) {
                el.value = data.settings[id];
                // Trigger display updates
                if (id === 'fontSize') document.getElementById('fontSizeVal').textContent = data.settings[id] + 'px';
                if (id === 'lineHeight') document.getElementById('lineHeightVal').textContent = (data.settings[id]/100).toFixed(2);
                if (id === 'marginV') document.getElementById('marginVVal').textContent = data.settings[id] + 'px';
                if (id === 'marginH') document.getElementById('marginHVal').textContent = data.settings[id] + 'px';
                if (id === 'coverBrightness') { document.getElementById('coverBrightnessVal').textContent = data.settings[id] + '%'; updateCoverBrightness(data.settings[id]); }
                if (id === 'coverOverlay') { document.getElementById('coverOverlayVal').textContent = data.settings[id] + '%'; updateCoverOverlay(data.settings[id]); }
              }
            }
          });
          // Restore font button
          if (data.settings.bodyFont) {
            document.querySelectorAll('.font-btn').forEach(b => {
              b.classList.toggle('active', b.textContent.startsWith(data.settings.bodyFont));
            });
          }
          // Restore text align radios
          if (data.settings.textAlign) {
            document.querySelectorAll('input[name=align]').forEach(r => {
              r.checked = r.value === data.settings.textAlign;
            });
          }
          // Restore drop cap
          if (data.settings.dropCap !== undefined) {
            document.getElementById('showDropCap').checked = data.settings.dropCap;
          }
        }
        showAutosaveStatus('loaded');
      }
    } catch(e) { console.warn('Autosave load failed', e); }
  }

  renderChapterList();
  selectChapter(currentChapterId || chapters[0].id);
  updatePreview();
  updateStats();

  // Record initial snapshot so Undo always has a base
  setTimeout(() => { _pushHistory(_snapshot()); _updateHistoryBtns(); }, 100);
  // Init right panel section accordions
  setTimeout(initPanelSectionAccordions, 200);

  // Auto-collapse LEFT panel on tablet/mobile to maximize preview
  if (window.innerWidth < 900) {
    const sidebar = document.querySelector('.sidebar');
    const lbtn = document.getElementById('leftPanelToggle');
    const rb2 = document.getElementById('rb-leftPanel');
    if (sidebar && !sidebar.classList.contains('collapsed-panel')) {
      sidebar.classList.add('collapsed-panel');
      if (lbtn) lbtn.classList.remove('active');
      if (rb2) rb2.classList.remove('active');
    }
    // Also collapse right panel
    const rp = document.querySelector('.right-panel');
    const rbtn = document.getElementById('rightPanelToggle');
    const rb3 = document.getElementById('rb-rightPanel');
    if (rp && !rp.classList.contains('collapsed-panel')) {
      rp.classList.add('collapsed-panel');
      if (rbtn) rbtn.classList.remove('active');
      if (rb3) rb3.classList.remove('active');
    }
    showToast('💡 แตะ ☰ เพื่อเปิดแผงซ้าย / ✏️ เพื่อเปิดแผงแก้ไข');
  }

  // Auto save every 30 seconds
  setInterval(autoSave, 30000);
  // Also save on any content change (debounced)
  autoSaveDebounce = debounce(autoSave, 3000);
  // Load backup history
  setTimeout(_loadBackupsFromStorage, 300);
}

let autoSaveDebounce;
function debounce(fn, delay) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

