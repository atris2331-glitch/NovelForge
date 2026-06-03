function openSearch() {
  document.getElementById('searchModal').classList.add('open');
  setTimeout(() => document.getElementById('searchInput').focus(), 100);
}
function closeSearch() {
  document.getElementById('searchModal').classList.remove('open');
}

// ── Focus Mode ──
function toggleFocusMode() {
  document.body.classList.toggle('focus-mode');
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('focus-mode')) toggleFocusMode();
  if (e.key === 'Escape' && document.getElementById('searchModal').classList.contains('open')) closeSearch();
  // Undo / Redo — let browser handle inside WYSIWYG editor, intercept elsewhere
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    const ed = document.getElementById('chapterEditor');
    if (document.activeElement !== ed) { e.preventDefault(); historyUndo(); }
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    const ed = document.getElementById('chapterEditor');
    if (document.activeElement !== ed) { e.preventDefault(); historyRedo(); }
  }
});

document.addEventListener('mousedown', (e) => {
  const bar = document.getElementById('inlineFmtBar');
  if (bar && !bar.contains(e.target) && e.target.id !== 'chapterEditor') {
    hideInlineFmtBar();
  }
});

