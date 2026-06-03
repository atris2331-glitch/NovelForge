// ── View Mode ──
function setViewMode(mode, btnEl) {
  viewMode = mode;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  // Sync ribbon view buttons
  document.querySelectorAll('.rb[id^="rb-scroll"], .rb[id^="rb-single"], .rb[id^="rb-spread"]').forEach(b => b.classList.remove('active'));
  const rbMap = { scroll: 'rb-scroll', single: 'rb-single', spread: 'rb-spread' };
  if (rbMap[mode]) { const rb = document.getElementById(rbMap[mode]); if (rb) rb.classList.add('active'); }
  const area = document.getElementById('previewArea');
  area.className = 'preview-area mode-' + mode;
  currentPageIndex = 0;
  applyViewMode();
}

function applyViewMode() {
  const navBar = document.getElementById('pageNavBar');
  const zw = document.getElementById('zoomWrap');

  // collectPageUnits already unwraps spread-pairs; collect fresh units
  allPages = collectPageUnits();

  if (viewMode === 'scroll') {
    zw.querySelectorAll('.page-label').forEach(el => el.style.display = '');
    zw.querySelectorAll('.page').forEach(el => el.style.display = '');
    navBar.classList.add('hidden');
    document.getElementById('pageCountInfo').textContent = `${allPages.length} หน้า`;
    buildPageDropdown();
    return;
  }

  if (viewMode === 'single') {
    zw.querySelectorAll('.page-label').forEach(el => el.style.display = 'none');
    zw.querySelectorAll('.page').forEach(el => el.style.display = 'none');

    const u = allPages[currentPageIndex];
    if (u) {
      if (u.label) u.label.style.display = '';
      u.pages.forEach(p => p.style.display = '');
    }
    navBar.classList.remove('hidden');
    updateNavBar();
    updateRightPanelContext();
    return;
  }

  if (viewMode === 'spread') {
    zw.querySelectorAll('.page-label').forEach(el => el.style.display = 'none');
    zw.querySelectorAll('.page').forEach(el => el.style.display = 'none');

    // Clean up any old spread-pairs first
    zw.querySelectorAll('.spread-pair').forEach(sp => sp.replaceWith(...Array.from(sp.childNodes)));

    const left = allPages[currentPageIndex];
    const right = allPages[currentPageIndex + 1];
    [left, right].forEach(u => { if (u) u.pages.forEach(p => p.style.display = ''); });

    if (left && right && left.pages[0] && right.pages[0]) {
      const pair = document.createElement('div');
      pair.className = 'spread-pair';
      left.pages[0].after(pair);
      pair.appendChild(left.pages[0]);
      pair.appendChild(right.pages[0]);
    }
    navBar.classList.remove('hidden');
    updateNavBar();
    updateRightPanelContext();
    return;
  }
}

function collectPageUnits() {
  // Returns array of {label, pages[]} for each page block in render order
  // First unwrap any lingering spread-pair elements so we see raw pages
  const zw = document.getElementById('zoomWrap');
  zw.querySelectorAll('.spread-pair').forEach(sp => sp.replaceWith(...Array.from(sp.childNodes)));

  const flatNodes = [];
  function flatten(parent) {
    Array.from(parent.children).forEach(el => {
      if (el.id === 'chapterPages' || el.classList.contains('special-page-wrap')) {
        flatten(el);
      } else {
        flatNodes.push(el);
      }
    });
  }
  flatten(zw);

  const units = [];
  let i = 0;
  while (i < flatNodes.length) {
    const el = flatNodes[i];
    if (el.classList.contains('page-label')) {
      const label = el;
      const pages = [];
      let j = i + 1;
      while (j < flatNodes.length && !flatNodes[j].classList.contains('page-label')) {
        if (flatNodes[j].classList.contains('page')) pages.push(flatNodes[j]);
        j++;
      }
      units.push({ label, pages });
      i = j;
    } else if (el.classList.contains('page')) {
      units.push({ label: null, pages: [el] });
      i++;
    } else {
      i++;
    }
  }
  return units;
}

function updateNavBar() {
  const total = allPages.length;
  const spread = viewMode === 'spread';
  const navInfo = document.getElementById('navInfo');
  const navPrev = document.getElementById('navPrev');
  const navNext = document.getElementById('navNext');
  if (spread) {
    navInfo.textContent = `หน้า ${currentPageIndex + 1}–${Math.min(currentPageIndex + 2, total)} / ${total}`;
  } else {
    navInfo.textContent = `หน้า ${currentPageIndex + 1} / ${total}`;
  }
  document.getElementById('pageCountInfo').textContent = `${total} หน้า`;
  navPrev.disabled = currentPageIndex <= 0;
  navNext.disabled = spread ? currentPageIndex + 2 >= total : currentPageIndex + 1 >= total;
  // Update jump input
  const ji = document.getElementById('navJumpInput');
  if (ji) { ji.value = currentPageIndex + 1; ji.max = total; }
  buildPageDropdown();
}

function navPage(dir) {
  const total = allPages.length;
  const step = viewMode === 'spread' ? 2 : 1;
  currentPageIndex = Math.max(0, Math.min(currentPageIndex + dir * step, total - 1));
  applyViewMode();
}

// ── Zoom ──
function adjustZoom(delta) {
  zoomLevel = Math.max(40, Math.min(150, zoomLevel + delta));
  document.getElementById('zoomVal').textContent = zoomLevel + '%';
  document.getElementById('zoomWrap').style.transform = `scale(${zoomLevel / 100})`;
}

// ── Collapsible sidebar sections ──
