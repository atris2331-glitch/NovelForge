// ── Chapter management ──
function renderChapterList() {
  const list = document.getElementById('chapterList');
  list.innerHTML = '';
  chapters.forEach((ch, i) => {
    const el = document.createElement('div');
    el.className = 'chapter-item' + (ch.id === currentChapterId ? ' active' : '');
    el.draggable = true;
    el.dataset.chId = ch.id;
    el.innerHTML = `
      <span class="ch-drag" title="ลากเพื่อสลับตำแหน่ง">⠿</span>
      <div class="ch-move-btns">
        <button class="ch-move-btn ch-move-up" title="เลื่อนขึ้น">▲</button>
        <button class="ch-move-btn ch-move-dn" title="เลื่อนลง">▼</button>
      </div>
      <div class="ch-num">${i + 1}</div>
      <div class="ch-title" title="แตะสองครั้งหรือกดปุ่ม ✏ เพื่อแก้ชื่อ">${ch.title || 'บทที่ ' + (i+1)}</div>
      <button class="ch-edit-btn" title="แก้ไขชื่อบท">✏</button>
      <span class="ch-del" title="ลบบท">×</span>
    `;

    // ── ฟังก์ชัน inline edit ──
    const startEdit = () => {
      const titleEl = el.querySelector('.ch-title');
      if (!titleEl) return;
      const input = document.createElement('input');
      input.className = 'ch-title-input';
      input.value = ch.title || '';
      input.placeholder = 'ชื่อบท...';
      titleEl.replaceWith(input);
      input.focus();
      input.select();
      const save = () => {
        const newTitle = input.value.trim() || ('บทที่ ' + (i + 1));
        ch.title = newTitle;
        renderChapterList();
        updatePreview();
        updateStats();
        recordHistoryDebounced();
        if (ch.id === currentChapterId) {
          const ti = document.getElementById('chapterTitleInput');
          if (ti) ti.value = newTitle;
        }
      };
      input.addEventListener('blur', save);
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
        if (ev.key === 'Escape') { input.value = ch.title || ''; input.blur(); }
      });
    };

    // คลิกเลือกบท
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('ch-del')) return;
      if (e.target.classList.contains('ch-drag')) return;
      if (e.target.classList.contains('ch-title-input')) return;
      if (e.target.classList.contains('ch-edit-btn')) return;
      if (e.target.classList.contains('ch-move-btn') || e.target.classList.contains('ch-move-up') || e.target.classList.contains('ch-move-dn')) return;
      selectChapter(ch.id);
    });

    // ดับเบิลคลิก ch-title → inline edit (desktop)
    el.querySelector('.ch-title').addEventListener('dblclick', (e) => {
      e.stopPropagation();
      startEdit();
    });

    // ปุ่ม ✏ → inline edit (mobile-friendly)
    el.querySelector('.ch-edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      startEdit();
    });

    // ปุ่มเลื่อนขึ้น
    el.querySelector('.ch-move-up').addEventListener('click', (e) => {
      e.stopPropagation();
      if (i === 0) return;
      const [moved] = chapters.splice(i, 1);
      chapters.splice(i - 1, 0, moved);
      renderChapterList();
      updatePreview();
      updateStats();
      recordHistoryDebounced();
      showToast('↑ เลื่อนบทขึ้นแล้ว');
    });

    // ปุ่มเลื่อนลง
    el.querySelector('.ch-move-dn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (i === chapters.length - 1) return;
      const [moved] = chapters.splice(i, 1);
      chapters.splice(i + 1, 0, moved);
      renderChapterList();
      updatePreview();
      updateStats();
      recordHistoryDebounced();
      showToast('↓ เลื่อนบทลงแล้ว');
    });

    // ลบบท
    el.querySelector('.ch-del').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteChapter(ch.id, e);
    });

    // ── Drag & Drop (desktop) ──
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', ch.id);
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      list.querySelectorAll('.chapter-item').forEach(x => x.classList.remove('drag-over'));
    });
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      list.querySelectorAll('.chapter-item').forEach(x => x.classList.remove('drag-over'));
      el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('drag-over');
      const fromId = e.dataTransfer.getData('text/plain');
      const toId = ch.id;
      if (fromId === toId) return;
      const fromIdx = chapters.findIndex(c => c.id === fromId);
      const toIdx   = chapters.findIndex(c => c.id === toId);
      if (fromIdx < 0 || toIdx < 0) return;
      const [moved] = chapters.splice(fromIdx, 1);
      chapters.splice(toIdx, 0, moved);
      renderChapterList();
      updatePreview();
      updateStats();
      recordHistoryDebounced();
      showToast('↕ สลับตำแหน่งบทแล้ว');
    });

    // ── Touch Drag & Drop (mobile) ──
    let touchDragId = null;
    let touchPlaceholder = null;
    el.querySelector('.ch-drag').addEventListener('touchstart', (e) => {
      e.stopPropagation();
      touchDragId = ch.id;
      el.classList.add('dragging');
      touchPlaceholder = document.createElement('div');
      touchPlaceholder.style.cssText = 'height:' + el.offsetHeight + 'px;border:1.5px dashed var(--accent);border-radius:4px;margin-bottom:2px;background:rgba(139,69,19,0.04)';
    }, { passive: true });
    el.querySelector('.ch-drag').addEventListener('touchmove', (e) => {
      if (!touchDragId) return;
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetItem = target && target.closest('.chapter-item');
      list.querySelectorAll('.chapter-item').forEach(x => x.classList.remove('drag-over'));
      if (targetItem && targetItem !== el) targetItem.classList.add('drag-over');
    }, { passive: true });
    el.querySelector('.ch-drag').addEventListener('touchend', (e) => {
      if (!touchDragId) return;
      el.classList.remove('dragging');
      list.querySelectorAll('.chapter-item').forEach(x => x.classList.remove('drag-over'));
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetItem = target && target.closest('.chapter-item');
      if (targetItem && targetItem.dataset.chId && targetItem.dataset.chId !== touchDragId) {
        const fromIdx = chapters.findIndex(c => c.id === touchDragId);
        const toIdx   = chapters.findIndex(c => c.id === targetItem.dataset.chId);
        if (fromIdx >= 0 && toIdx >= 0) {
          const [moved] = chapters.splice(fromIdx, 1);
          chapters.splice(toIdx, 0, moved);
          renderChapterList();
          updatePreview();
          updateStats();
          recordHistoryDebounced();
          showToast('↕ สลับตำแหน่งบทแล้ว');
        }
      }
      touchDragId = null;
    }, { passive: true });

    list.appendChild(el);
  });
}

function selectChapter(id) {
  currentChapterId = id;
  const ch = chapters.find(c => c.id === id);
  if (!ch) return;
  document.getElementById('chapterTitleInput').value = ch.title;
  weLoad(ch.content);
  document.getElementById('chapterNote').value = ch.note || '';
  // Chapter image
  const wrap = document.getElementById('chImgPreviewWrap');
  const drop = document.getElementById('chImgDrop');
  if (ch.imageData) {
    document.getElementById('chImgPreview').src = ch.imageData;
    document.getElementById('chImgSize').value = ch.imageSize || 100;
    document.getElementById('chImgSizeVal').textContent = (ch.imageSize || 100) + '%';
    wrap.style.display = 'block'; drop.style.display = 'none';
  } else {
    wrap.style.display = 'none'; drop.style.display = 'block';
  }
  renderChapterList();
  updatePreview();
  // After preview renders, jump to the first page of this chapter
  if (viewMode !== 'scroll') {
    setTimeout(() => {
      const zw = document.getElementById('zoomWrap');
      // Find page-label whose text starts with the chapter index
      const chIdx = chapters.findIndex(c => c.id === id);
      if (chIdx < 0) return;
      const labelText = `บทที่ ${chIdx + 1}`;
      const labels = Array.from(zw.querySelectorAll('.page-label'));
      const targetLabel = labels.find(l => l.textContent.trim().startsWith(labelText));
      if (!targetLabel) return;
      const units = collectPageUnits();
      const unitIdx = units.findIndex(u => u.label === targetLabel);
      if (unitIdx >= 0) {
        currentPageIndex = viewMode === 'spread' ? Math.floor(unitIdx / 2) * 2 : unitIdx;
        applyViewMode();
      }
    }, 50);
  }
}

function updateChapterTitle(val) {
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) { ch.title = val; renderChapterList(); updatePreview(); updateStats(); }
  recordHistoryDebounced();
  if (typeof autoSaveDebounce === 'function') autoSaveDebounce();
}

// ═══════════════════════════════════════════════
// WYSIWYG EDITOR ENGINE
// ═══════════════════════════════════════════════

function weGetEditor() { return document.getElementById('chapterEditor'); }

// Convert editor HTML → plain markup string (for storage & preview)
function weToMarkup(html) {
  // Use a temp div to parse
  const d = document.createElement('div');
  d.innerHTML = html;
  // Convert each block to a line
  const lines = [];
  d.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent;
      if (t.trim()) lines.push(t);
    } else if (node.classList && node.classList.contains('we-pagebreak')) {
      lines.push('[PAGE_BREAK]');
    } else {
      lines.push(weNodeToMarkup(node));
    }
  });
  return lines.join('\n');
}

function weNodeToMarkup(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.classList && node.classList.contains('we-pagebreak')) return '[PAGE_BREAK]';
  let text = '';
  node.childNodes.forEach(c => { text += weNodeToMarkup(c); });
  const tag = node.tagName ? node.tagName.toLowerCase() : '';
  const style = node.getAttribute ? (node.getAttribute('style') || '') : '';
  if (tag === 'strong' || tag === 'b') return `**${text}**`;
  if (tag === 'em' || tag === 'i') return `_${text}_`;
  if (tag === 'u') return `__${text}__`;
  if (tag === 'mark') return `==${text}==`;
  if (tag === 'span') {
    const colorM = style.match(/color:\s*([#\w(),-]+)/);
    const sizeM = style.match(/font-size:\s*(\d+)px/);
    const fontM = style.match(/font-family:\s*'?([^',;]+)/);
    if (sizeM) return `<size:${sizeM[1]}>${text}</size>`;
    if (colorM && !sizeM) return `<color:${colorM[1]}>${text}</color>`;
    if (fontM) return `<font:${fontM[1].trim()}>${text}</font>`;
    // gold italic («»)
    if (style.includes('var(--gold)')) return `«${text}»`;
    return text;
  }
  // blockquote from execCommand('indent') — preserve as Thai indent prefix
  if (tag === 'blockquote') return '\u3000' + text;
  if (tag === 'code') return `\`${text}\``;
  if (tag === 'br') return '\n';
  // div/p with margin-left (from indent button)
  if ((tag === 'div' || tag === 'p') && style.match(/margin-left:\s*\d/)) {
    const indentLevels = Math.round(parseFloat(style.match(/margin-left:\s*([\d.]+)px/)?.[1] || 0) / 40);
    return '\u3000'.repeat(Math.max(1, indentLevels)) + text;
  }
  return text;
}

// Convert markup string → editor HTML
function weFromMarkup(markup) {
  const lines = markup.split('\n');
  return lines.map(line => {
    if (line.trim() === '[PAGE_BREAK]') {
      return `<div class="we-pagebreak" contenteditable="false">— ↵ ตัดหน้า —</div>`;
    }
    // Preserve lines that have only whitespace/indent (e.g. Thai \u3000) as non-empty paragraphs
    if (!line.trim()) return `<p><br></p>`;
    return `<p>${parseRichText(line)}</p>`;
  }).join('');
}

// Load chapter content into WYSIWYG editor
function weLoad(markup) {
  const ed = weGetEditor();
  if (!ed) return;
  ed.innerHTML = markup ? weFromMarkup(markup) : '';
  // Place cursor at end
}

// On editor input — sync to chapter data
function weOnInput() {
  const ed = weGetEditor();
  if (!ed) return;
  const markup = weToMarkup(ed.innerHTML);
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) {
    ch.content = markup;
    _fastUpdatePageBodies(currentChapterId, markup);
    updateStats();
  }
  recordHistoryDebounced();
  if (typeof autoSaveDebounce === 'function') autoSaveDebounce();
  _scheduleFullRender();
}

// Apply rich-text format to current selection
function weFormat(type) {
  // Work on whichever contenteditable has active selection: chapterEditor OR page-body
  let sel = window.getSelection();

  // For 'size' and 'color': clicking the button can clear the selection.
  // Restore from _savedSel if needed.
  if ((type === 'size' || type === 'color') && window._savedSel) {
    try {
      sel.removeAllRanges();
      sel.addRange(window._savedSel);
    } catch(e) {}
  }

  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
    showToast('กรุณาคลุมข้อความก่อน'); return;
  }
  const range = sel.getRangeAt(0);
  const anchorNode = sel.anchorNode;

  // Determine context: chapterEditor or page-body
  const ed = weGetEditor();
  const inEditor   = ed && ed.contains(anchorNode);
  const pageBodyEl = anchorNode?.parentElement?.closest('.page-body');
  const inPageBody = !!pageBodyEl;

  if (!inEditor && !inPageBody) {
    showToast('กรุณาคลุมข้อความก่อน'); return;
  }

  const selectedText = range.toString();
  if (!selectedText) { showToast('กรุณาคลุมข้อความก่อน'); return; }

  let node;
  switch(type) {
    case 'bold': {
      node = document.createElement('strong');
      node.style.fontWeight = '700';
      node.style.color = 'var(--accent)';
      break;
    }
    case 'italic': {
      node = document.createElement('em');
      break;
    }
    case 'underline': {
      node = document.createElement('u');
      break;
    }
    case 'highlight': {
      node = document.createElement('mark');
      node.style.cssText = 'background:rgba(201,162,39,0.25);border-radius:2px;padding:0 2px';
      break;
    }
    case 'color': {
      const color = document.getElementById('ifbColor')?.value || '#8b4513';
      node = document.createElement('span');
      node.style.color = color;
      document.getElementById('ifbColorSwatch').style.background = color;
      break;
    }
    case 'size': {
      const sz = parseInt(document.getElementById('ifbSize')?.value) || 15;
      // Use a robust approach: wrap with span but handle cross-element selections properly
      const frag = range.extractContents();
      const wrapper = document.createElement('span');
      wrapper.style.fontSize = sz + 'px';
      wrapper.appendChild(frag);
      range.insertNode(wrapper);
      // Collapse selection to end of inserted node
      range.setStartAfter(wrapper);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      if (inPageBody) syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
      else weOnInput();
      hideInlineFmtBar();
      return;
    }
    case 'quote': {
      node = document.createElement('span');
      node.style.cssText = 'font-style:italic;color:var(--gold)';
      node.textContent = `«${selectedText}»`;
      range.deleteContents();
      range.insertNode(node);
      sel.removeAllRanges();
      if (inPageBody) syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
      else weOnInput();
      hideInlineFmtBar(); return;
    }
    case 'cmd': {
      node = document.createElement('code');
      node.style.cssText = 'font-family:monospace;background:rgba(139,69,19,0.1);border-radius:3px;padding:0 4px;font-size:0.88em';
      break;
    }
    case 'clear': {
      const text = selectedText;
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      sel.removeAllRanges();
      if (inPageBody) syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
      else weOnInput();
      hideInlineFmtBar(); return;
    }
    default: return;
  }
  if (node) {
    try {
      range.surroundContents(node);
    } catch(e) {
      // partial selection across tags — extract and re-wrap
      const frag = range.extractContents();
      node.appendChild(frag);
      range.insertNode(node);
    }
    sel.removeAllRanges();
  }
  if (inPageBody) {
    syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
  } else {
    weOnInput();
  }
  hideInlineFmtBar();
}

// Insert special elements at cursor
function weInsert(type) {
  const ed = weGetEditor();
  if (!ed) return;
  ed.focus();
  const sel = window.getSelection();
  const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

  switch(type) {
    case 'quote': document.execCommand('insertText', false, '«»'); break;
    case 'dquote': document.execCommand('insertText', false, '\u201c\u201d'); break;
    case 'para': document.execCommand('insertParagraph', false); break;
    case 'break': {
      const br = document.createElement('p');
      br.textContent = '— ✦ —';
      br.style.textAlign = 'center';
      if (range) { range.collapse(false); range.insertNode(br); range.setStartAfter(br); range.collapse(true); sel.removeAllRanges(); sel.addRange(range); }
      break;
    }
    case 'pagebreak': {
      const pb = document.createElement('div');
      pb.className = 'we-pagebreak';
      pb.contentEditable = 'false';
      pb.textContent = '— ↵ ตัดหน้า —';
      const after = document.createElement('p');
      after.innerHTML = '<br>';
      if (range) {
        range.collapse(false);
        range.insertNode(after);
        range.insertNode(pb);
        range.setStart(after, 0); range.collapse(true);
        sel.removeAllRanges(); sel.addRange(range);
      }
      break;
    }
  }
  weOnInput();
}

// Inline format bar: use weFormat instead of applyInlineFmt for WYSIWYG
function applyInlineFmt(type) {
  weFormat(type);
}

// Apply a specific color to selection (called from format-bar color picker)
function weFormatColor(color) {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return;
  const anchorNode = sel.anchorNode;
  const ed = weGetEditor();
  const inEditor   = ed && ed.contains(anchorNode);
  const pageBodyEl = anchorNode?.parentElement?.closest('.page-body');
  if (!inEditor && !pageBodyEl) return;
  const range = sel.getRangeAt(0);
  const node = document.createElement('span');
  node.style.color = color;
  try { range.surroundContents(node); } catch(e) {
    const frag = range.extractContents();
    node.appendChild(frag);
    range.insertNode(node);
  }
  sel.removeAllRanges();
  if (pageBodyEl) syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
  else weOnInput();
}

// Apply a specific font-size to selection (called from format-bar size input)
function weFormatSize(size) {
  const sz = parseInt(size);
  if (!sz || sz < 6) return;
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) { showToast('กรุณาคลุมข้อความก่อน'); return; }
  const anchorNode = sel.anchorNode;
  const ed = weGetEditor();
  const inEditor   = ed && ed.contains(anchorNode);
  const pageBodyEl = anchorNode?.parentElement?.closest('.page-body');
  if (!inEditor && !pageBodyEl) { showToast('กรุณาคลุมข้อความในหน้าหรือในแผงแก้ไขก่อน'); return; }
  const range = sel.getRangeAt(0);
  const frag = range.extractContents();
  const wrapper = document.createElement('span');
  wrapper.style.fontSize = sz + 'px';
  wrapper.appendChild(frag);
  range.insertNode(wrapper);
  range.setStartAfter(wrapper);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  if (pageBodyEl) syncPageBodyToChapter(pageBodyEl, pageBodyEl.dataset.chId);
  else weOnInput();
}

// ═══════════════════════════════════════════════
let _renderDebounceTimer = null;
function _scheduleFullRender() {
  clearTimeout(_renderDebounceTimer);
  _renderDebounceTimer = setTimeout(() => { updatePreview(); }, 900);
}

// Fast partial update: re-render only the page-body paragraphs for current chapter
function _fastUpdatePageBodies(chId, content) {
  const paras = content.split('\n').filter(p => p.trim() && p.trim() !== '[PAGE_BREAK]');
  document.querySelectorAll(`.page-body[data-ch-id="${chId}"]`).forEach(bodyEl => {
    const pi = parseInt(bodyEl.dataset.pi) || 0;
    // Collect existing <p> elements and update their innerHTML in-place
    const pEls = bodyEl.querySelectorAll('p:not([data-placeholder])');
    // Simple: rebuild innerHTML of body (fast, no layout measurement)
    const dropCapColor2 = window.dropCapColor || 'var(--accent)';
    const _dropCap = window.dropCap;
    const _dropCapFont = window.dropCapFont || 'Playfair Display';
    const _dropCapSize = window.dropCapSize || 48;
    const dropCapSpanStyle = _dropCap
      ? `font-family:'${_dropCapFont}',serif;font-size:${_dropCapSize}px;font-weight:700;line-height:0.75;float:left;margin:2px 6px 0 0;color:${dropCapColor2};display:block;`
      : null;
    // Find which paras belong to this page (use existing count as hint)
    // We only refresh innerHTML of existing paragraphs to avoid layout shift
    let pIdx = 0;
    pEls.forEach(pEl => {
      const para = paras[pIdx];
      if (para !== undefined) {
        const isSection = para.trim() === '— ✦ —' || para.trim() === '* * *';
        if (isSection) {
          pEl.style.textAlign = 'center';
          pEl.innerHTML = para;
        } else if (pIdx === 0 && dropCapSpanStyle && pi === 0) {
          const parsed = parseRichText(para);
          const m = parsed.match(/^(<[^>]+>)*(.)/);
          if (m && m[2]) {
            const prefix = m[1] || '';
            pEl.innerHTML = `${prefix}<span style="${dropCapSpanStyle}">${m[2]}</span>${parsed.slice(prefix.length + m[2].length)}`;
          } else { pEl.innerHTML = parsed; }
        } else {
          pEl.innerHTML = parseRichText(para);
        }
        pIdx++;
      }
    });
  });
}

function updateChapterContent(val) {
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) {
    ch.content = val;
    // Instant visual update of existing page bodies (no re-layout)
    _fastUpdatePageBodies(currentChapterId, val);
    updateStats();
  }
  recordHistoryDebounced();
  if (typeof autoSaveDebounce === 'function') autoSaveDebounce();
  // Full re-render (with page-splitting) after user stops typing
  _scheduleFullRender();
}

// ── Tab key → ย่อหน้าแบบไทย (WYSIWYG editor) ──
document.addEventListener('DOMContentLoaded', () => {
  const ed = document.getElementById('chapterEditor');
  if (!ed) return;
  ed.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\u3000'); // full-width Thai indent
    }
  });
});

function addChapter() {
  recordHistory();
  // Blur any active page-body so renderChapterPages() guard doesn't skip the new chapter
  if (document.activeElement && document.activeElement.classList.contains('page-body')) {
    document.activeElement.blur();
  }
  const newId = Date.now();
  chapters.push({ id: newId, title: 'บทใหม่', content: '', note: '', imageData: null, imageSize: 100 });
  _forceRenderChapterPages = true;
  selectChapter(newId);
  // Ensure the chapter list is visible (expand sidebar section if collapsed)
  const chapterSection = document.getElementById('chapterList')?.closest('.sidebar-section');
  if (chapterSection && chapterSection.classList.contains('collapsed')) {
    chapterSection.classList.remove('collapsed');
  }
  // On mobile, open left panel if hidden
  const sidebar = document.querySelector('.sidebar');
  if (sidebar && sidebar.classList.contains('collapsed-panel')) {
    togglePanel('left');
  }
  showToast('✅ เพิ่มบทใหม่แล้ว — กรุณาแก้ไขชื่อและเนื้อหา');
}

function deleteChapter(id, e) {
  e.stopPropagation();
  if (chapters.length === 1) { showToast('ต้องมีอย่างน้อย 1 บท'); return; }
  recordHistory();
  chapters = chapters.filter(c => c.id !== id);
  if (currentChapterId === id) selectChapter(chapters[0].id);
  else { renderChapterList(); updatePreview(); updateStats(); }
}

