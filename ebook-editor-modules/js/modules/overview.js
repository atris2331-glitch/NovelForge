// ── Thumbnail Overview Mode ──
function buildOverviewGrid() {
  const area = document.getElementById('previewArea');
  area.querySelectorAll('.overview-grid').forEach(g => g.remove());
  const grid = document.createElement('div');
  grid.className = 'overview-grid';
  area.appendChild(grid);

  const thumbW = 100, thumbH = 142;
  const sc = thumbW / 559;

  const pageCover = document.getElementById('pageCover');
  const pageTitlePage = document.getElementById('pageTitlePage');
  const specialPageEls = Array.from(document.querySelectorAll('.special-page-wrap .page'));
  const chapterPageEls = Array.from(document.querySelectorAll('#chapterPages .page'));
  const allPageEls = [pageCover, pageTitlePage, ...specialPageEls, ...chapterPageEls].filter(Boolean);

  const labelMap = new Map();
  document.querySelectorAll('.page-label').forEach(lbl => {
    let sib = lbl.nextElementSibling;
    while (sib && !sib.classList.contains('page')) sib = sib.nextElementSibling;
    if (sib) labelMap.set(sib, lbl.textContent.trim());
  });

  allPageEls.forEach((pageEl, idx) => {
    const thumb = document.createElement('div');
    thumb.className = 'overview-thumb' + (idx === currentPageIndex ? ' active-thumb' : '');
    thumb.style.cssText = `width:${thumbW}px;height:${thumbH}px;flex-shrink:0;`;

    const clone = pageEl.cloneNode(true);
    clone.style.cssText = `position:absolute;top:0;left:0;width:559px;height:794px;transform:scale(${sc});transform-origin:top left;pointer-events:none;display:flex;overflow:hidden;`;
    clone.querySelectorAll('input,textarea,button,.fi-toolbar,.page-layout-pill,.rh,.resize-dot').forEach(el => el.remove());
    thumb.appendChild(clone);

    const name = labelMap.get(pageEl) ||
      (pageEl.id === 'pageCover' ? 'ปกหน้า' :
       pageEl.id === 'pageTitlePage' ? 'หน้าชื่อเรื่อง' : `หน้า ${idx + 1}`);
    const label = document.createElement('div');
    label.className = 'overview-thumb-label';
    label.textContent = name.length > 18 ? name.substring(0, 18) + '…' : name;
    thumb.appendChild(label);

    const badge = document.createElement('div');
    badge.style.cssText = 'position:absolute;top:3px;left:3px;background:rgba(26,22,18,0.6);color:#e8e4de;font-size:8px;padding:1px 5px;border-radius:8px;font-weight:700;z-index:10;';
    badge.textContent = idx + 1;
    thumb.appendChild(badge);

    thumb.addEventListener('click', () => {
      currentPageIndex = idx;
      toggleOverviewMode(null);
    });
    grid.appendChild(thumb);
  });

  if (allPageEls.length === 0) {
    grid.innerHTML = '<div style="color:#9a9590;font-size:13px;padding:32px;text-align:center">ยังไม่มีหน้า</div>';
  }
}

// ── Sync contenteditable page-body → chapter state ──
function syncPageBodyToChapter(bodyEl, chapterId) {
  // Collect ALL page-bodies belonging to this chapter (multi-page chapters)
  const allBodies = document.querySelectorAll(`.page-body[data-ch-id="${chapterId}"]`);
  const paragraphs = [];
  allBodies.forEach(b => {
    b.querySelectorAll('p').forEach(p => {
      if (p.dataset.placeholder) return; // skip placeholder
      // Use weNodeToMarkup to preserve bold/italic/color formatting
      // Use trimEnd only — preserve leading whitespace/indent (Thai \u3000, spaces)
      const markup = weNodeToMarkup(p).trimEnd();
      if (markup) paragraphs.push(markup);
    });
    // If no <p> tags, fall back to innerText lines
    if (b.querySelectorAll('p').length === 0) {
      b.innerText.split('\n').forEach(line => {
        const t = line.trimEnd();
        if (t) paragraphs.push(t);
      });
    }
  });

  const ch = chapters.find(c => c.id === chapterId);
  if (!ch) return;
  const newContent = paragraphs.join('\n');
  if (ch.content === newContent) return; // no change

  ch.content = newContent;

  // Sync to WYSIWYG editor if this chapter is selected
  if (currentChapterId === chapterId) {
    const ed = document.getElementById('chapterEditor');
    if (ed) {
      const currentMarkup = weToMarkup(ed.innerHTML);
      if (currentMarkup !== newContent) {
        weLoad(newContent);
      }
    }
  }

  updateStats();
  _historyDebounce(_snapshot());
}

// ── Custom Image Uploads ──
function loadCustomTexture(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    customTextureImageData = e.target.result;
    setPaperTexture('custom_tex', document.querySelector('[data-tex="custom_tex"]'));
    showToast('✅ อัปโหลดลายกระดาษแล้ว');
  };
  reader.readAsDataURL(file);
}
function loadCustomBorderImage(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    customBorderImageData = e.target.result;
    setPageBorderPattern('custom_img_border', document.querySelector('[data-pattern="custom_img_border"]'));
    applyPageBorders();
    showToast('✅ อัปโหลดขอบกระดาษแล้ว');
  };
  reader.readAsDataURL(file);
}
function loadCustomCoverImage(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    customCoverTemplateImageData = e.target.result;
    coverTemplates['custom_tpl'].bg = `url(${e.target.result}) center/cover no-repeat`;
    setCoverTemplate('custom_tpl', document.getElementById('tpl-custom_tpl'));
    showToast('✅ อัปโหลดปกแล้ว');
  };
  reader.readAsDataURL(file);
}
document.addEventListener('change', e => {
  if (e.target.id === 'dividerStyle') {
    const f = document.getElementById('customDividerFields');
    if (f) f.style.display = e.target.value === 'custom_div' ? 'block' : 'none';
  }
});

// ── Toggle Overview Mode ──
function toggleOverviewMode(btnEl) {
  if (viewMode === 'overview') {
    // Exit overview
    viewMode = 'single';
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    const vbSingle = document.getElementById('vbSingle');
    if (vbSingle) vbSingle.classList.add('active');
    document.getElementById('previewArea').className = 'preview-area mode-single';
    document.getElementById('pageNavBar').classList.remove('hidden');
    document.querySelectorAll('.overview-grid').forEach(g => g.remove());
    // Restore zoomWrap
    const zw = document.getElementById('zoomWrap');
    zw.style.display = '';
    applyViewMode();
  } else {
    // Enter overview — show all pages first so clones render correctly
    viewMode = 'overview';
    const zw = document.getElementById('zoomWrap');
    zw.querySelectorAll('.page').forEach(el => { el.style.display = 'flex'; });
    zw.querySelectorAll('.page-label').forEach(el => { el.style.display = 'none'; });
    document.getElementById('previewArea').className = 'preview-area mode-overview';
    document.getElementById('pageNavBar').classList.add('hidden');
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    // Build thumbnails after paint so clones get rendered styles
    setTimeout(() => {
      buildOverviewGrid();
      zw.style.display = 'none';
    }, 80);
  }
}

