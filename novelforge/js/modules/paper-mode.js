function setPaperMode(mode, btnEl) {
  currentPaperMode = mode;
  const pm = PAPER_MODES[mode] || PAPER_MODES.white;
  document.querySelectorAll('.paper-mode-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  document.querySelectorAll('.page.page-inner').forEach(page => {
    page.style.setProperty('--paper-bg', pm.bg);
    page.style.background = pm.bg;
    if (pm.headerColor) {
      page.querySelectorAll('.page-body,.page-chapter-title,.page-chapter-num,.page-number,.page-header').forEach(el => el.style.setProperty('color', pm.ink, 'important'));
    } else {
      page.querySelectorAll('.page-body,.page-chapter-title,.page-chapter-num,.page-number,.page-header').forEach(el => el.style.removeProperty('color'));
    }
  });
  showToast('🌙 เปลี่ยนสีกระดาษเป็น ' + mode);
}

function reapplyPaperMode() {
  if (currentPaperMode && currentPaperMode !== 'white') {
    setPaperMode(currentPaperMode, document.getElementById('pmb-' + currentPaperMode));
  }
}

