// ── Typography ──
function updateFontSize(val) {
  document.getElementById('fontSizeVal').textContent = val + 'px';
  renderChapterPages();
}

function updateLineHeight(val) {
  document.getElementById('lineHeightVal').textContent = (val / 100).toFixed(2);
  renderChapterPages();
}

function setAccent(color, light, el) {
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  if (el) el.classList.add('active');
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-light', light);
  renderChapterPages();
}

function setTextAlign(val) {
  textAlign = val;
  renderChapterPages();
}

function toggleDropCap() {
  dropCap = document.getElementById('showDropCap').checked;
  renderChapterPages();
}

function updateMargins() {
  const mv = document.getElementById('marginV').value;
  const mh = document.getElementById('marginH').value;
  document.getElementById('marginVVal').textContent = mv + 'px';
  document.getElementById('marginHVal').textContent = mh + 'px';
  renderChapterPages();
}

// ── Editor helpers (WYSIWYG) ──
function insertText(before, after) { weInsert('quote'); } // legacy fallback
function insertPara() { weInsert('para'); }
function insertBreak() { weInsert('break'); }
function insertPageBreak() { weInsert('pagebreak'); showToast('📄 แทรกตัดหน้าใหม่แล้ว'); }
function insertItalic() { weFormat('italic'); }
function insertBold() { weFormat('bold'); }
function insertHighlight() { weFormat('highlight'); }
function insertCmd() { weFormat('cmd'); }
function rbInsert(type) {
  if (type === 'break') weInsert('break');
  else if (type === 'para') weInsert('para');
}

