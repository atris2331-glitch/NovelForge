// ── Cover upload ──
function handleCoverUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    coverImageData = e.target.result;
    document.getElementById('coverPreview').src = coverImageData;
    document.getElementById('coverPreview').style.display = 'block';
    document.getElementById('coverPlaceholder').style.display = 'none';
    document.getElementById('coverDrop').classList.add('has-image');
    const bg = document.getElementById('coverBg');
    bg.style.backgroundImage = `url(${coverImageData})`;
    bg.style.backgroundSize = 'cover';
    bg.style.backgroundPosition = 'center';
    // Apply current brightness inline
    const bv = document.getElementById('coverBrightness')?.value || 100;
    bg.style.filter = `brightness(${bv / 100})`;
    const ov = document.querySelector('.cover-overlay');
    const ovv = document.getElementById('coverOverlay')?.value || 100;
    if (ov) ov.style.opacity = ovv / 100;
  };
  reader.readAsDataURL(file);
}

// ── Cover brightness / overlay ──
function updateCoverBrightness(val) {
  document.getElementById('coverBrightnessVal').textContent = val + '%';
  document.documentElement.style.setProperty('--cover-brightness', val / 100);
  // Also set directly so html2canvas captures it
  const bg = document.getElementById('coverBg');
  if (bg) bg.style.filter = `brightness(${val / 100})`;
}
function updateCoverOverlay(val) {
  document.getElementById('coverOverlayVal').textContent = val + '%';
  document.documentElement.style.setProperty('--cover-overlay-opacity', val / 100);
  // Also set directly so html2canvas captures it
  const ov = document.querySelector('.cover-overlay');
  if (ov) ov.style.opacity = val / 100;
}

// ── Cover template ──
function setCoverTemplate(name, el) {
  coverTemplate = name;
  document.querySelectorAll('.cover-tpl').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  const tpl = coverTemplates[name];
  if (!coverImageData) {
    // Apply gradient to coverBg so it shows correctly
    const bg = document.getElementById('coverBg');
    if (bg) {
      bg.style.backgroundImage = '';
      bg.style.background = tpl.bg;
    }
    document.getElementById('pageCover').style.background = tpl.bg;
  }
  updatePreview();
}

// ── Chapter image ──
function handleChapterImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const ch = chapters.find(c => c.id === currentChapterId);
    if (!ch) return;
    ch.imageData = e.target.result;
    ch.imageSize = 100;
    ch.imagePosition = 'top';
    document.getElementById('chImgPreview').src = e.target.result;
    document.getElementById('chImgSize').value = 100;
    document.getElementById('chImgSizeVal').textContent = '100%';
    document.getElementById('chImgPreviewWrap').style.display = 'block';
    document.getElementById('chImgDrop').style.display = 'none';
    // Reset position buttons
    document.querySelectorAll('.ch-img-pos-btn').forEach(b=>b.classList.remove('active'));
    const topBtn = document.getElementById('imgpos-top');
    if (topBtn) topBtn.classList.add('active');
    updatePreview();
  };
  reader.readAsDataURL(file);
}
function updateChapterImageSize(val) {
  document.getElementById('chImgSizeVal').textContent = val + '%';
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) { ch.imageSize = parseInt(val); updatePreview(); }
}
function removeChapterImage() {
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) { ch.imageData = null; ch.imageSize = 100; }
  document.getElementById('chImgPreviewWrap').style.display = 'none';
  document.getElementById('chImgDrop').style.display = 'block';
  updatePreview();
}

// ── Body font ──
function setBodyFont(font, el) {
  bodyFont = font;
  document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderChapterPages();
}

