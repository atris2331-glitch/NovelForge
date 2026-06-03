
// ── FEATURE 10: Internal Link (TOC → chapter jump) ──
function jumpToChapterInPreview(chapterIdx) {
  // Switch to scroll mode and scroll to that chapter, or navigate to its page in single mode
  const allUnits = collectPageUnits();
  // Find the unit for this chapter (label contains "บทที่ X")
  const targetLabel = `บทที่ ${chapterIdx + 1}:`;
  const unitIdx = allUnits.findIndex(u => u.label && u.label.textContent.includes(targetLabel));
  if (unitIdx < 0) { showToast('ไม่พบบทนี้ในหน้าพรีวิว'); return; }
  if (viewMode === 'scroll') {
    const u = allUnits[unitIdx];
    if (u.pages[0]) u.pages[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    currentPageIndex = unitIdx;
    applyViewMode();
  }
  showToast(`🔗 ไปยังบทที่ ${chapterIdx + 1}`);
}

// ── FEATURE 2: Advanced Page Numbers ──
function formatPageNumAdvanced(n) {
  const startNum = parseInt(document.getElementById('pageNumStart')?.value) || 1;
  const actualN = n + startNum - 1;
  if (pageNumStyle === 'roman') {
    return toRoman(actualN);
  }
  if (pageNumStyle === 'plain') return String(actualN);
  if (pageNumStyle === 'dot') return `· ${actualN} ·`;
  if (pageNumStyle === 'thai') {
    const thai = ['๐','๑','๒','๓','๔','๕','๖','๗','๘','๙'];
    return String(actualN).split('').map(d => thai[parseInt(d)] || d).join('');
  }
  return `— ${actualN} —`;
}

function toRoman(num) {
  if (num <= 0) return String(num);
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['m','cm','d','cd','c','xc','l','xl','x','ix','v','iv','i'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
  }
  return result;
}

function shouldHidePageNum(isFirstPage, isSpecialPage, isCoverPage, isTitlePage) {
  if (isCoverPage && document.getElementById('hideNumCover')?.checked) return true;
  if (isTitlePage && document.getElementById('hideNumTitle')?.checked) return true;
  if (isSpecialPage && document.getElementById('hideNumSpecial')?.checked) return true;
  if (isFirstPage && document.getElementById('hideNumFirstChapter')?.checked) return true;
  return false;
}

init();
