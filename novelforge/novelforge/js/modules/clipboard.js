
function setPasteMode(mode, btnEl) {
  _pasteMode = mode;
  document.querySelectorAll('#pasteMode-preserve,#pasteMode-strip').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  const hint = document.getElementById('pasteModeHint');
  if (hint) {
    if (mode === 'preserve') {
      hint.innerHTML = '📄 <b>คงรูปแบบ</b>: รักษา **bold**, _italic_, __underline__ จาก Word/Doc';
    } else {
      hint.innerHTML = '🧹 <b>ล้าง Fmt</b>: ข้อความเปล่า ไม่มี formatting — สะอาดที่สุด';
    }
  }
}

// แปลง HTML จาก clipboard → markup string (รักษา bold/italic/underline)
function _htmlToMarkup(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  function nodeToMarkup(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    const tag = node.nodeName.toUpperCase();
    const inner = Array.from(node.childNodes).map(nodeToMarkup).join('');
    if (tag === 'STRONG' || tag === 'B') return `**${inner}**`;
    if (tag === 'EM' || tag === 'I') return `_${inner}_`;
    if (tag === 'U') return `__${inner}__`;
    if (tag === 'BR') return '\n';
    if (tag === 'P' || tag === 'DIV' || tag === 'LI') return inner + '\n';
    if (tag === 'H1' || tag === 'H2' || tag === 'H3') return `**${inner}**\n`;
    if (tag === 'TABLE') {
      // แปลงตาราง → แถวธรรมดา
      return Array.from(node.querySelectorAll('tr')).map(r =>
        Array.from(r.querySelectorAll('td,th')).map(c => c.textContent.trim()).join(' | ')
      ).join('\n') + '\n';
    }
    return inner;
  }
  let result = nodeToMarkup(tmp);
  // Clean up artifacts
  result = result
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return result;
}

function handleClipboardPaste(event, textarea) {
  event.preventDefault();
  const clipData = event.clipboardData || window.clipboardData;
  let text = '';

  if (_pasteMode === 'preserve') {
    // ลอง HTML ก่อนเพื่อรักษา formatting
    const html = clipData.getData('text/html');
    if (html && html.trim()) {
      text = _htmlToMarkup(html);
    } else {
      text = clipData.getData('text/plain') || '';
      text = text
        .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        .replace(/\t/g, ' ').replace(/\u00A0/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/ {2,}/g, ' ').trim();
    }
    showToast('📄 วางข้อความ (คงรูปแบบ) เรียบร้อย');
  } else {
    // Strip mode: plain text เท่านั้น
    text = clipData.getData('text/plain');
    if (!text) {
      const html = clipData.getData('text/html');
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      text = tmp.innerText;
    }
    text = text
      .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      .replace(/\t/g, ' ').replace(/\u00A0/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/ {2,}/g, ' ').trim();
    showToast('🧹 วางข้อความ (ล้าง formatting) เรียบร้อย');
  }

  textarea.value = text;
  // Add to history
  if (text && !clipboardHistory.includes(text)) {
    clipboardHistory.unshift(text);
    if (clipboardHistory.length > MAX_CLIP_HISTORY) clipboardHistory.length = MAX_CLIP_HISTORY;
    renderClipHistory();
  }
}

function renderClipHistory() {
  const container = document.getElementById('clipHistory');
  if (!container) return;
  if (!clipboardHistory.length) {
    container.innerHTML = '<div class="clip-item" style="color:var(--ink-faint);font-style:italic">ยังไม่มีประวัติ...</div>';
    return;
  }
  container.innerHTML = '';
  clipboardHistory.forEach((text, i) => {
    const item = document.createElement('div');
    item.className = 'clip-item';
    item.title = text;
    item.textContent = text.substring(0, 80) + (text.length > 80 ? '...' : '');
    item.onclick = () => {
      document.getElementById('clipboardPasteArea').value = text;
    };
    container.appendChild(item);
  });
}

function stripAndInsert() {
  const text = document.getElementById('clipboardPasteArea')?.value?.trim();
  if (!text) { showToast('⚠️ ไม่มีข้อความให้แทรก'); return; }
  const ch = chapters.find(c => c.id === currentChapterId);
  if (!ch) return;
  ch.content = (ch.content ? ch.content + '\n\n' : '') + text;
  const ta = document.getElementById('chapterEditor');
  if (ta) ta.value = ch.content;
  document.getElementById('clipboardPasteArea').value = '';
  updatePreview();
  showToast('✅ แทรกข้อความเรียบร้อย');
}

// ── FEATURE 4: Chapter Image Position ──
function setChImgPosition(pos, btnEl) {
  const ch = chapters.find(c => c.id === currentChapterId);
  if (ch) { ch.imagePosition = pos; updatePreview(); }
  document.querySelectorAll('.ch-img-pos-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
}
