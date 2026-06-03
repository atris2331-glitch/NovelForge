// ── Divider helper ──
function getDividerHTML() {
  const style = document.getElementById('dividerStyle')?.value || 'line';
  const color = `var(--accent)`;
  switch(style) {
    case 'none':      return '';
    case 'line':      return `<div class="divider-line" style="background:${color}"></div>`;
    case 'double':    return `<div class="divider-double" style="border-color:${color}"></div>`;
    case 'dots':      return `<div class="divider-dots">· · ·</div>`;
    case 'asterism':  return `<div class="divider-asterism">⁂</div>`;
    case 'wave':      return `<div class="divider-wave">〜〜〜</div>`;
    case 'diamond':   return `<div class="divider-diamond">◆ ◇ ◆</div>`;
    case 'fleuron':   return `<div class="divider-fleuron">❧</div>`;
    // ── แนวใหม่ ──
    case 'sparkle':   return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.5em;font-size:13px">✦ ✧ ✦</div>`;
    case 'star':      return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:14px">★ ☆ ★</div>`;
    case 'heart':     return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.5em;font-size:14px">♡ ♥ ♡</div>`;
    case 'sakura':    return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:13px">🌸 · 🌸</div>`;
    case 'moon':      return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.5em;font-size:13px">☽ ✦ ☾</div>`;
    case 'sword':     return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.5em;font-size:13px">⚔ · · · ⚔</div>`;
    case 'dragon':    return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.3em;font-size:12px">— 龍 —</div>`;
    case 'rose':      return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:13px">🌹 · · 🌹</div>`;
    case 'ribbon':    return `<div class="divider-dots" style="color:var(--accent);font-size:11px">—— 🎀 ——</div>`;
    case 'cross':     return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.5em;font-size:13px">✝ · · ✝</div>`;
    case 'butterfly': return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:13px">🦋 · 🦋</div>`;
    case 'cat':       return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:13px">≧^◡^≦</div>`;
    case 'thunder':   return `<div class="divider-dots" style="color:var(--accent);letter-spacing:0.4em;font-size:14px">⚡ · · ⚡</div>`;
    case 'custom_div':return customDividerHTML || `<div class="divider-line" style="background:${color}"></div>`;
    default:          return `<div class="divider-line" style="background:${color}"></div>`;
  }
}
let customDividerHTML = '';

// ── Preview update ──
function updatePreview() {
  const title = document.getElementById('bookTitle').value;
  const subtitle = document.getElementById('bookSubtitle').value;
  const author = document.getElementById('authorName').value;
  const pen = document.getElementById('penName').value;
  const pub = document.getElementById('publisher').value;
  const year = document.getElementById('pubYear').value;
  const genre = document.getElementById('genre').value;

  document.getElementById('coverGenre').textContent = genre;
  document.getElementById('coverTitleDisplay').textContent = title;
  document.getElementById('coverSubtitleDisplay').textContent = subtitle;
  document.getElementById('coverAuthorDisplay').textContent = pen || author;
  document.getElementById('coverPublisherDisplay').textContent = pub;

  updateTitlePage();

  // Special pages toggles
  const showPreface = document.getElementById('showPreface').checked;
  const showDedication = document.getElementById('showDedication').checked;
  document.getElementById('prefaceFields').style.display = showPreface ? 'block' : 'none';
  document.getElementById('dedicationFields').style.display = showDedication ? 'block' : 'none';

  // Cover template (no image)
  if (!coverImageData) {
    const tpl = coverTemplates[coverTemplate] || coverTemplates.dark;
    const bg = document.getElementById('coverBg');
    if (bg) { bg.style.backgroundImage = ''; bg.style.background = tpl.bg; }
    document.getElementById('pageCover').style.background = tpl.bg;
  }

  renderSpecialPages();
  renderChapterPages();
}

let tocStyle = 'classic';
let titlePageLayout = 'center'; // 'center' | 'left' | 'bottom'

function setTitlePageLayout(layout, el) {
  titlePageLayout = layout;
  document.querySelectorAll('#tplayout-center,#tplayout-left,#tplayout-bottom').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  updateTitlePage();
}

function updateTitlePage() {
  const title    = (document.getElementById('titlePageCustomTitle')?.value.trim()    ) || document.getElementById('bookTitle').value;
  const subtitle = (document.getElementById('titlePageCustomSubtitle')?.value.trim() ) || document.getElementById('bookSubtitle').value;
  const author   = (document.getElementById('titlePageCustomAuthor')?.value.trim()   ) || document.getElementById('authorName').value;
  const pen      = (document.getElementById('titlePageCustomPen')?.value.trim()      ) || document.getElementById('penName').value;
  const pub      = document.getElementById('publisher').value;
  const year     = document.getElementById('pubYear').value;
  const pubLine  = (document.getElementById('titlePageCustomPub')?.value.trim()      ) || `${pub} · ${year}`;
  const ornament = document.getElementById('titlePageOrnament')?.value ?? '✦ ✦ ✦';

  const tp = document.getElementById('pageTitlePage');
  if (!tp) return;

  // Apply layout class
  tp.classList.remove('tp-left','tp-bottom');
  if (titlePageLayout === 'left') tp.classList.add('tp-left');
  else if (titlePageLayout === 'bottom') tp.classList.add('tp-bottom');

  const ornEl = tp.querySelector('.title-page-ornament');
  if (ornEl) { ornEl.textContent = ornament; ornEl.style.display = ornament ? '' : 'none'; }
  const titleEl = tp.querySelector('.title-page-title');
  if (titleEl) titleEl.textContent = title;
  const subEl = tp.querySelector('.title-page-subtitle');
  if (subEl) { subEl.textContent = subtitle; subEl.style.display = subtitle ? '' : 'none'; }
  const authEl = tp.querySelector('#titlePageAuthor');
  if (authEl) authEl.textContent = author;
  const yearEl = tp.querySelector('#titlePageYear');
  if (yearEl) { yearEl.textContent = pen ? `(นามปากกา: ${pen})` : ''; yearEl.style.display = pen ? '' : 'none'; }
  const pubEl = tp.querySelector('#titlePagePublisher');
  if (pubEl) pubEl.textContent = pubLine;
}

function setTocStyle(style, el) {
  tocStyle = style;
  document.querySelectorAll('#toc-style-classic,#toc-style-modern,#toc-style-minimal,#toc-style-elegant,#toc-style-boxed,#toc-style-roman,#toc-style-split,#toc-style-ornate').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderSpecialPages();
  setTimeout(() => applyViewMode(), 0);
}

function renderSpecialPages() {
  // Show/hide TOC style picker
  const showTOCChk = document.getElementById('showTOC').checked;
  const tocStyleRow = document.getElementById('tocStyleRow');
  if (tocStyleRow) tocStyleRow.style.display = showTOCChk ? 'block' : 'none';

  // Remove existing special pages
  document.querySelectorAll('.special-page-wrap').forEach(el => el.remove());

  const showPreface = document.getElementById('showPreface').checked;
  const showDedication = document.getElementById('showDedication').checked;
  const titlePageNode = document.getElementById('pageTitlePage');

  let afterNode = titlePageNode;

  function insertSpecialPage(html) {
    const wrap = document.createElement('div');
    wrap.className = 'special-page-wrap';
    wrap.style.display = 'contents';
    wrap.innerHTML = html;
    afterNode.after(wrap);
    afterNode = wrap.lastElementChild || wrap;
    return wrap;
  }

  // ── Dedication (editable) ──
  if (showDedication) {
    const text = document.getElementById('dedicationText').value || 'สำหรับทุกคนที่เชื่อในเรื่องเล่า...';
    const wrap = insertSpecialPage(`
      <div class="page-label">คำอุทิศ</div>
      <div class="page page-inner page-dedication">
        <div class="dedication-label" contenteditable="true" spellcheck="false"
          class="special-editable" data-field="dedicationLabel"
          style="outline:none;cursor:text;border-radius:3px"
          data-ph="อุทิศแด่">อุทิศแด่</div>
        <div class="dedication-text special-editable" contenteditable="true" spellcheck="false"
          data-field="dedicationText" data-ph="เขียนคำอุทิศ..."
          style="outline:none;cursor:text">${text.replace(/\n/g,'<br>')}</div>
      </div>
    `);
    // Sync editable back to textarea
    wrap.querySelectorAll('[data-field="dedicationText"]').forEach(el => {
      el.addEventListener('input', () => {
        document.getElementById('dedicationText').value = el.innerText;
      });
      el.addEventListener('focus', () => { el.style.outline = '1.5px dashed rgba(139,69,19,0.45)'; });
      el.addEventListener('blur',  () => { el.style.outline = 'none'; });
    });
  }

  // ── Preface (editable) ──
  if (showPreface) {
    const ptitle = document.getElementById('prefaceTitle').value || 'คำนำ';
    const pcontent = document.getElementById('prefaceContent').value || '';
    const paras = pcontent.split('\n').filter(p => p.trim()).map(p => `<p style="margin-bottom:1em">${p}</p>`).join('');
    const wrap = insertSpecialPage(`
      <div class="page-label">คำนำ</div>
      <div class="page page-inner page-preface">
        <div class="preface-title special-editable" contenteditable="true" spellcheck="false"
          data-field="prefaceTitle" data-ph="หัวข้อคำนำ"
          style="outline:none;cursor:text">${ptitle}</div>
        <div class="preface-body special-editable" contenteditable="true" spellcheck="false"
          data-field="prefaceContent" data-ph="เขียนคำนำที่นี่..."
          style="outline:none;cursor:text">${paras || '<p style="color:#ccc;font-style:italic">คลิกเพื่อพิมพ์คำนำ...</p>'}</div>
      </div>
    `);
    wrap.querySelectorAll('[data-field="prefaceTitle"]').forEach(el => {
      el.addEventListener('input', () => {
        document.getElementById('prefaceTitle').value = el.innerText;
      });
      el.addEventListener('focus', () => { el.style.outline = '1.5px dashed rgba(139,69,19,0.45)'; });
      el.addEventListener('blur',  () => { el.style.outline = 'none'; });
    });
    wrap.querySelectorAll('[data-field="prefaceContent"]').forEach(el => {
      el.addEventListener('input', () => {
        document.getElementById('prefaceContent').value = el.innerText;
      });
      el.addEventListener('focus', () => { el.style.outline = '1.5px dashed rgba(139,69,19,0.45)'; });
      el.addEventListener('blur',  () => { el.style.outline = 'none'; });
    });
  }

  // ── TOC ──
  if (showTOCChk) {
    const CHARS_PER_PAGE = 1650;
    const FIXED_PAGES_BEFORE = 3;
    let runningPage = FIXED_PAGES_BEFORE + 1;
    const tocEntries = chapters.map((ch, i) => {
      const startPage = runningPage;
      const contentLen = (ch.content || '').length;
      const numPages = Math.max(1, Math.ceil((contentLen + 200) / CHARS_PER_PAGE));
      runningPage += numPages;
      return { ch, i, startPage };
    });

    const styleClassMap = { modern:'toc-modern', minimal:'toc-minimal', elegant:'toc-elegant', boxed:'toc-boxed', roman:'toc-roman', split:'toc-split', ornate:'toc-ornate' };
    const styleClass = styleClassMap[tocStyle] || '';
    const tocTitleText = tocStyle === 'minimal' ? 'CONTENTS' : tocStyle === 'split' ? 'สารบัญ' : 'สารบัญ';
    const ornateRule = tocStyle === 'ornate' ? `<div class="toc-ornate-rule">— ✦ · ✦ —</div>` : '';

    let entries = tocEntries.map(({ ch, i, startPage }) => `
      <div class="toc-entry" onclick="jumpToChapterInPreview(${i})" title="ไปบทที่ ${i+1}">
        <span class="toc-ch">บทที่ ${i+1}</span>
        <span class="toc-name">${ch.title || 'บทที่ '+(i+1)}<span class="toc-link-badge">↗</span></span>
        <span class="toc-dots"></span>
        <span class="toc-pg">${startPage}</span>
      </div>
    `).join('');

    insertSpecialPage(`
      <div class="page-label">สารบัญ</div>
      <div class="page page-inner page-toc ${styleClass}">
        <div class="page-header"><span></span><span></span></div>
        <div class="toc-title">${tocTitleText}</div>
        ${ornateRule}
        ${entries}
        ${showPageNum ? `<div class="page-number" style="font-size:${pageNumSize}px">${formatPageNumAdvanced(2)}</div>` : ''}
      </div>
    `);
  }

  // Refresh view
  setTimeout(() => applyViewMode(), 0);

  // Render custom special pages (editable)
  customSpecialPages.forEach(csp => {
    const paras = csp.content.split('\n').filter(p => p.trim()).map(p => `<p style="margin-bottom:1em">${p}</p>`).join('');
    const cspKey = csp.id + '_0';
    const wrap = insertSpecialPage(`
      <div class="page-label">${csp.title}</div>
      <div class="page page-inner page-preface" style="position:relative" data-free-img-key="${cspKey}">
        <div class="preface-title special-editable" contenteditable="true" spellcheck="false"
          data-csp-id="${csp.id}" data-csp-field="title" data-ph="หัวข้อ"
          style="outline:none;cursor:text;position:relative;z-index:2">${csp.title}</div>
        <div class="preface-body special-editable" contenteditable="true" spellcheck="false"
          data-csp-id="${csp.id}" data-csp-field="content" data-ph="คลิกเพื่อพิมพ์..."
          style="outline:none;cursor:text;position:relative;z-index:2">${paras || '<p style="color:#ccc;font-style:italic">คลิกเพื่อพิมพ์...</p>'}</div>
      </div>
    `);
    // Sync custom page editable
    wrap.querySelectorAll('[data-csp-id]').forEach(el => {
      const field = el.dataset.cspField;
      el.addEventListener('input', () => {
        const c = customSpecialPages.find(x => x.id === csp.id);
        if (c) c[field] = el.innerText;
        // sync sidebar input if exists
        const sideInp = document.querySelector(`[data-csp-sidebar="${csp.id}-${field}"]`);
        if (sideInp) sideInp.value = el.innerText;
      });
      el.addEventListener('focus', () => { el.style.outline = '1.5px dashed rgba(139,69,19,0.45)'; });
      el.addEventListener('blur',  () => { el.style.outline = 'none'; });
    });
    if (!freeImages[cspKey]) freeImages[cspKey] = [];
    const pageEl = document.querySelector(`[data-free-img-key="${cspKey}"]`);
    if (pageEl) {
      pageEl.addEventListener('contextmenu', (e) => openCtxMenu(e, pageEl));
      enablePageDrop(pageEl);
      restoreFreeImages(pageEl, cspKey);
    }
  });
}

let _forceRenderChapterPages = false;
function renderChapterPages() {
  // Don't re-render if user is actively typing in a page-body (unless forced)
  if (!_forceRenderChapterPages && document.activeElement && document.activeElement.classList.contains('page-body')) {
    // Just update stats silently
    updateStats();
    return;
  }
  _forceRenderChapterPages = false;
  const container = document.getElementById('chapterPages');
  container.innerHTML = '';
  const showHeader = document.getElementById('showHeader').checked;
  const showPageNum = document.getElementById('showPageNum').checked;
  const mv = parseInt(document.getElementById('marginV').value) || 56;
  const mh = parseInt(document.getElementById('marginH').value) || 52;
  const fs = parseInt(document.getElementById('fontSize').value) || 15;
  const lh = (document.getElementById('lineHeight').value / 100);
  const bookTitle = document.getElementById('bookTitle').value;
  const penName = document.getElementById('penName').value || document.getElementById('authorName').value;
  const dividerHTML = getDividerHTML();

  // Estimate chars per page based on settings
  // Thai chars average ~0.95 of font size width; Latin ~0.55
  // Use 0.65 as blended factor for Thai-heavy text
  const contentW = 559 - 2 * mh;
  const headerH = showHeader ? 32 : 0;
  const footerH = showPageNum ? 32 : 0;
  // Reserve: top padding + bottom padding + 8px extra bottom
  const contentH = 794 - mv - (mv + 8) - headerH - footerH;
  // Characters per line: Thai text is wider than Latin
  const charsPerLine = Math.max(10, Math.floor(contentW / (fs * 0.65)));
  // Lines per page: use actual pixel line height
  const lineHeightPx = fs * lh;
  const linesPerPage = Math.max(5, Math.floor(contentH / lineHeightPx));
  // chars per page = lines * chars per line, but paragraphs each start a new line
  // Add paragraph overhead: each para costs 1 extra line (paragraph break)
  const CHARS_PER_PAGE = Math.max(300, charsPerLine * linesPerPage);

  let pageNum = 3; // cover=1, title=2, chapters start at 3

  // ── Helper: build page-body innerHTML for a given list of paragraphs ──
  function buildBodyHTML(pgParas, isFirstPage, pageKey, pageFs, pageLh, pageAlign, pageFont, pageDropCap, pageAccent) {
    const _dcColor = dropCapColor || pageAccent || 'var(--accent)';
    const dropCapSpanStyle = pageDropCap
      ? `font-family:'${dropCapFont}',serif;font-size:${dropCapSize}px;font-weight:700;line-height:0.75;float:left;margin:2px 6px 0 0;color:${_dcColor};display:block;`
      : null;
    let bodyHtml = `<div class="page-body page-body-${pageKey}" data-ch-id="" data-pi="" contenteditable="false" spellcheck="false" style="font-size:${pageFs}px;line-height:${pageLh};text-align:${pageAlign};font-family:'${pageFont}',sans-serif;outline:none;cursor:text;overflow:hidden;">`;
    if (pgParas.length === 0 && isFirstPage) {
      bodyHtml += `<p style="color:#aaa;font-style:italic" data-placeholder="true">คลิกเพื่อพิมพ์เนื้อหาได้เลย...</p>`;
    } else {
      pgParas.forEach((p, pIdx) => {
        const isSection = p.trim() === '— ✦ —' || p.trim() === '* * *';
        if (isSection) {
          bodyHtml += `<div style="text-align:center;color:var(--gold);margin:16px 0;letter-spacing:0.4em">${p}</div>`;
        } else if (pIdx === 0 && dropCapSpanStyle) {
          const parsed = parseRichText(p);
          const firstCharMatch = parsed.match(/^(<[^>]+>)*(.)/);
          if (firstCharMatch && firstCharMatch[2]) {
            const prefix = firstCharMatch[1] || '';
            const firstChar = firstCharMatch[2];
            const rest = parsed.slice(prefix.length + firstChar.length);
            bodyHtml += `<p style="text-indent:0">${prefix}<span style="${dropCapSpanStyle}">${firstChar}</span>${rest}</p>`;
          } else {
            bodyHtml += `<p style="text-indent:0">${parsed}</p>`;
          }
        } else {
          bodyHtml += `<p>${parseRichText(p)}</p>`;
        }
      });
    }
    bodyHtml += '</div>';
    return bodyHtml;
  }

  // ── DOM-based paragraph height probe (accurate Thai text measurement) ──
  // สร้าง hidden probe element ครั้งเดียวต่อ render cycle เพื่อวัดความสูงจริงของแต่ละย่อหน้า
  let _probeEl = null;
  function _getProbe(contentW, pageFs, pageLh, pageAlign, pageFont) {
    if (!_probeEl) {
      _probeEl = document.createElement('div');
      _probeEl.style.cssText = [
        'position:absolute', 'visibility:hidden', 'pointer-events:none',
        'z-index:-9999', 'top:-9999px', 'left:-9999px'
      ].join(';');
      document.body.appendChild(_probeEl);
    }
    _probeEl.style.width     = contentW + 'px';
    _probeEl.style.fontSize  = pageFs + 'px';
    _probeEl.style.lineHeight = pageLh;
    _probeEl.style.textAlign = pageAlign || 'justify';
    _probeEl.style.fontFamily = `'${pageFont}', sans-serif`;
    _probeEl.style.padding   = '0';
    _probeEl.style.margin    = '0';
    _probeEl.style.wordBreak = 'break-word';
    _probeEl.style.overflowWrap = 'break-word';
    return _probeEl;
  }

  // วัดความสูงย่อหน้าจริงจาก DOM — แม่นยำสำหรับภาษาไทย
  function measureParaHeight(text, contentW, pageFs, pageLh, pageAlign, pageFont) {
    const probe = _getProbe(contentW, pageFs, pageLh, pageAlign, pageFont);
    // สร้าง <p> เดียวแบบเดียวกับที่ render จริง
    probe.innerHTML = `<p style="margin:0 0 ${(pageFs*0.35).toFixed(1)}px;padding:0">${parseRichText(text)}</p>`;
    return probe.offsetHeight + 2; // +2px safety
  }

  // วัด header บทด้วย DOM จริง (chapter-num + title + divider)
  function measureChapterHeaderH(ch, pageMv, pageMh, pageFs, pageLh, pageAlign, pageFont, divHTML) {
    const probe = document.createElement('div');
    probe.style.cssText = [
      'position:absolute','visibility:hidden','pointer-events:none',
      'z-index:-9999','top:-9999px','left:-9999px',
      `width:${559 - 2*pageMh}px`,
      `font-size:${pageFs}px`,
      `font-family:'${pageFont}',sans-serif`
    ].join(';');
    probe.innerHTML = `
      <div style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px">บทที่ X</div>
      <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;margin-bottom:6px">${ch.title||'บท'}</div>
      ${divHTML}
    `;
    document.body.appendChild(probe);
    const h = probe.offsetHeight;
    document.body.removeChild(probe);
    return h + 16; // +16px buffer
  }

  chapters.forEach((ch, ci) => {
    const rawParagraphs = ch.content.split('\n').filter(p => p.trim());

    const PAGE_H = 794;
    const headerH = showHeader ? 32 : 0;
    const footerH = showPageNum ? 32 : 0;

    const pageGroups = [[]];
    let usedH = 0;

    // วัด chapter header จริง (ครั้งแรกเท่านั้น)
    const _p0Override = perPageLayouts[`${ch.id}_0`];
    const _p0Preset   = _p0Override ? layoutPresets[_p0Override] : null;
    const _p0Mv = _p0Preset ? _p0Preset.marginV : mv;
    const _p0Mh = _p0Preset ? _p0Preset.marginH : mh;
    const _p0Fs = _p0Preset ? _p0Preset.fontSize : fs;
    const _p0Lh = _p0Preset ? _p0Preset.lineHeight / 100 : lh;
    const _p0Al = _p0Preset ? _p0Preset.textAlign : textAlign;
    const _p0Fn = _p0Preset ? _p0Preset.font : bodyFont;
    const chapterHeaderH = measureChapterHeaderH(ch, _p0Mv, _p0Mh, _p0Fs, _p0Lh, _p0Al, _p0Fn, dividerHTML);

    rawParagraphs.forEach((p) => {
      if (p.trim() === '[PAGE_BREAK]') {
        if (pageGroups[pageGroups.length - 1].length > 0) {
          pageGroups.push([]);
          usedH = 0;
        }
        return;
      }

      const curPgIdx = pageGroups.length - 1;
      const isFirstPage = curPgIdx === 0;
      const pageKey = `${ch.id}_${curPgIdx}`;
      const pageOverride = perPageLayouts[pageKey];
      const overridePreset = pageOverride ? layoutPresets[pageOverride] : null;
      const pageMv = overridePreset ? overridePreset.marginV : mv;
      const pageMh = overridePreset ? overridePreset.marginH : mh;
      const pageFs = overridePreset ? overridePreset.fontSize : fs;
      const pageLh = overridePreset ? overridePreset.lineHeight / 100 : lh;
      const pageAl = overridePreset ? overridePreset.textAlign : textAlign;
      const pageFn = overridePreset ? overridePreset.font : bodyFont;

      const contentW = 559 - 2 * pageMh;
      const availH = PAGE_H - pageMv - (pageMv + 8) - headerH - footerH
                     - (isFirstPage ? chapterHeaderH : 0)
                     - 8; // 8px safety buffer

      const paraH = measureParaHeight(p, contentW, pageFs, pageLh, pageAl, pageFn);

      if (usedH + paraH > availH && pageGroups[curPgIdx].length > 0) {
        pageGroups.push([p]);
        usedH = paraH;
      } else {
        pageGroups[curPgIdx].push(p);
        usedH += paraH;
      }
    });
    if (rawParagraphs.length === 0) pageGroups[0] = [];

    pageGroups.forEach((pgParas, pi) => {
      const isFirstPage = pi === 0;

      // Label (only on first page of chapter)
      if (isFirstPage) {
        const label = document.createElement('div');
        label.className = 'page-label';
        label.textContent = `บทที่ ${ci + 1}: ${ch.title}`;
        container.appendChild(label);
      } else {
        // continuation label
        const label = document.createElement('div');
        label.className = 'page-label';
        label.textContent = `บทที่ ${ci + 1} (ต่อ) หน้า ${pi + 1}`;
        container.appendChild(label);
      }

      const page = document.createElement('div');
      page.className = 'page page-inner';

      // Check per-page layout override
      const pageKey = `${ch.id}_${pi}`;
      const pageOverride = perPageLayouts[pageKey];
      const overridePreset = pageOverride ? layoutPresets[pageOverride] : null;
      const pageMv = overridePreset ? overridePreset.marginV : mv;
      const pageMh = overridePreset ? overridePreset.marginH : mh;
      const pageFs = overridePreset ? overridePreset.fontSize : fs;
      const pageLh = overridePreset ? overridePreset.lineHeight / 100 : lh;
      const pageAlign = overridePreset ? overridePreset.textAlign : textAlign;
      const pageFont = overridePreset ? overridePreset.font : bodyFont;
      const pageDropCap = overridePreset ? overridePreset.dropCap : dropCap;
      const pageAccent = overridePreset ? overridePreset.accent : null;

      page.style.padding = `${pageMv}px ${pageMh}px ${pageMv + 8}px`;
      page.dataset.freeImgKey = pageKey;

      let html = '';
      if (showHeader) {
        html += `<div class="page-header"><span>${penName}</span><span>${bookTitle}</span></div>`;
      }

      if (isFirstPage) {
        html += `<div class="page-chapter-num" style="color:${pageAccent || 'var(--accent)'}">บทที่ ${ci + 1}</div>`;
        html += `<div class="page-chapter-title" contenteditable="true" spellcheck="false" data-ch-id="${ch.id}" style="font-family:'Playfair Display',serif;color:${pageAccent || 'var(--ink)'};" title="คลิกเพื่อแก้ชื่อบท">${ch.title || 'บทที่ ' + (ci+1)}</div>`;
        html += dividerHTML;
        if (ch.imageData) {
          const sz = ch.imageSize || 100;
          const imgPos = ch.imagePosition || 'top';
          let imgStyle = `width:${sz}%; border-radius:4px;`;
          let wrapStyle = 'width:100%; margin:12px 0; text-align:center;';
          if (imgPos === 'left') { imgStyle += 'display:inline-block;'; wrapStyle = 'float:left;width:45%;margin:0 12px 8px 0;'; }
          else if (imgPos === 'right') { imgStyle += 'display:inline-block;'; wrapStyle = 'float:right;width:45%;margin:0 0 8px 12px;'; }
          else if (imgPos === 'center') { wrapStyle = 'width:100%; margin:20px 0; text-align:center; display:flex; align-items:center; justify-content:center; flex:1'; }
          html += `<div style="${wrapStyle}"><img src="${ch.imageData}" style="${imgStyle}"></div>`;
        }
      }

      // Build body HTML using shared helper, then patch data attributes
      let bodyHtml = buildBodyHTML(pgParas, isFirstPage, pageKey, pageFs, pageLh, pageAlign, pageFont, pageDropCap, pageAccent);
      // Patch: set contenteditable=true and correct data attributes
      bodyHtml = bodyHtml.replace('contenteditable="false"', 'contenteditable="true"')
        .replace('data-ch-id=""', `data-ch-id="${ch.id}"`)
        .replace('data-pi=""', `data-pi="${pi}"`)
        .replace('overflow:hidden;', '');
      html += bodyHtml;

      if (showPageNum) {
        const hideNum = shouldHidePageNum(isFirstPage, false, false, false);
        if (!hideNum) {
          const numStr = formatPageNum(pageNum);
          html += `<div class="page-number" style="font-size:${pageNumSize}px">${numStr}</div>`;
        }
      }

      page.innerHTML = html;

      // Wire chapter title inline edit → sync back to chapter data
      const chTitleEl = page.querySelector('.page-chapter-title[contenteditable]');
      if (chTitleEl) {
        chTitleEl.addEventListener('blur', () => {
          const newTitle = chTitleEl.textContent.trim();
          if (newTitle && newTitle !== ch.title) {
            ch.title = newTitle;
            renderChapterList();
            const ti = document.getElementById('chapterTitleInput');
            if (ch.id === currentChapterId && ti) ti.value = newTitle;
            recordHistoryDebounced();
            showToast('✏ แก้ชื่อบทแล้ว');
          }
        });
        chTitleEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); chTitleEl.blur(); }
          if (e.key === 'Escape') { chTitleEl.textContent = ch.title || ''; chTitleEl.blur(); }
        });
      }

      // Add page layout pill button (after innerHTML so it's not destroyed)
      const pill = document.createElement('div');
      pill.className = 'page-layout-pill';
      pill.textContent = pageOverride ? `🎨 ${pageOverride}` : '🎨 Pattern';
      pill.title = 'เลือก Pattern สำหรับหน้านี้';
      pill.onclick = (e) => openPerPagePopup(e, ch.id, pi);
      page.appendChild(pill);

      // Wire contenteditable page-body → sync back to chapter state
      const bodyEl = page.querySelector('.page-body');
      if (bodyEl) {
        // Tab key → insert Thai indent (ideographic space) instead of moving focus
        bodyEl.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const indent = '\u3000'; // full-width space (Thai indent)
            document.execCommand('insertText', false, indent);
          }
        });
        // Remove placeholder on focus
        bodyEl.addEventListener('focus', () => {
          const ph = bodyEl.querySelector('[data-placeholder]');
          if (ph) ph.remove();
          bodyEl.style.boxShadow = 'none';
          // Track active page-body for inline fmt bar
          window._activePageBody = bodyEl;
        });
        // Debounced sync on input
        let _syncTimer;
        bodyEl.addEventListener('input', () => {
          clearTimeout(_syncTimer);
          _syncTimer = setTimeout(() => syncPageBodyToChapter(bodyEl, ch.id), 800);
        });
        // Show inline format bar on text selection (same as chapterEditor)
        bodyEl.addEventListener('mouseup', () => showInlineFmtBarOnSelect(bodyEl));
        bodyEl.addEventListener('keyup',   () => showInlineFmtBarOnSelect(bodyEl));
        // Show subtle edit ring on hover
        bodyEl.addEventListener('mouseenter', () => {
          if (document.activeElement !== bodyEl)
            bodyEl.style.outline = '1.5px dashed rgba(139,69,19,0.2)';
        });
        bodyEl.addEventListener('mouseleave', () => {
          if (document.activeElement !== bodyEl)
            bodyEl.style.outline = 'none';
        });
        bodyEl.addEventListener('blur', () => {
          bodyEl.style.outline = 'none';
          syncPageBodyToChapter(bodyEl, ch.id);
        });
      }

      // Wire dblclick on each paragraph → jump to editor position
      page.querySelectorAll('.page-body p').forEach((pEl, pIdx) => {
        pEl.addEventListener('dblclick', () => {
          // Switch to editor tab
          const editorTab = document.querySelector('.panel-tab');
          if (editorTab) switchTab('editor', editorTab);
          // Select the chapter
          selectChapter(ch.id);
          // Try to position cursor at this paragraph in textarea
          setTimeout(() => {
            const ta = document.getElementById('chapterEditor');
            if (!ta) return;
            const paraText = pgParas[pIdx] || '';
            const pos = ta.value.indexOf(paraText);
            if (pos >= 0) {
              ta.focus();
              ta.setSelectionRange(pos, pos + paraText.length);
              ta.scrollTop = ta.scrollHeight * (pos / ta.value.length);
            }
          }, 60);
        });
      });

      // Drop cap: handled by per-page CSS class now

      // Right-click context menu on page
      page.addEventListener('contextmenu', (e) => openCtxMenu(e, page));

      // Enable drag-and-drop of images onto page
      enablePageDrop(page);

      // Restore any previously placed free images
      restoreFreeImages(page, pageKey);

      container.appendChild(page);
      pageNum++;
    });
  });

  // After rendering, refresh view mode + apply borders
  // Clean up the DOM probe element used for height measurement
  if (_probeEl && _probeEl.parentNode) {
    _probeEl.parentNode.removeChild(_probeEl);
    _probeEl = null;
  }
  setTimeout(() => {
    applyViewMode();
    const total = document.getElementById('zoomWrap').querySelectorAll('.page').length;
    document.getElementById('pageCountInfo').textContent = `${total} หน้า`;
    applyPageBorders();
    applyPaperTexture();
    reapplyPaperMode();
  }, 0);
}

