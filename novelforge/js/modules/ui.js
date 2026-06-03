// ── Tabs ──
function switchTab(name, el) {
  document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

// ── Stats ──
function updateStats() {
  let totalWords = 0, totalChars = 0;
  let statsHtml = '';
  const WORDS_PER_A5_PAGE = 350; // มาตรฐาน A5 นิยาย ~300-400 คำ/หน้า
  const READING_WPM = 250; // ความเร็วอ่านภาษาไทย ~200-280 wpm

  chapters.forEach((ch, i) => {
    const words = ch.content.trim() ? ch.content.trim().split(/\s+/).length : 0;
    const chars = ch.content.length;
    const estPages = Math.ceil(words / WORDS_PER_A5_PAGE) || 1;
    totalWords += words;
    totalChars += chars;
    statsHtml += `<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;border-bottom:1px solid var(--border)">
      <strong style="font-size:11px">${ch.title || 'บทที่'+(i+1)}</strong>
      <span style="color:var(--ink-faint);font-size:11px">${words.toLocaleString()} คำ &bull; ~${estPages} หน้า</span>
    </div>`;
  });

  const totalPages = Math.ceil(totalWords / WORDS_PER_A5_PAGE) + 2;
  const readMinutes = Math.ceil(totalWords / READING_WPM);
  const readHours = Math.floor(readMinutes / 60);
  const readMins = readMinutes % 60;
  const readTimeStr = readHours > 0 ? `${readHours} ชม. ${readMins} นาที` : `${readMins} นาที`;
  const avgWordsPerPage = chapters.length > 0 ? Math.round(totalWords / Math.max(1, totalPages - 2)) : 0;

  let wppHint = '';
  if (avgWordsPerPage > 0) {
    if (avgWordsPerPage < 250) wppHint = '<span style="color:#f59e0b">⚠ น้อยเกินไป</span>';
    else if (avgWordsPerPage <= 420) wppHint = '<span style="color:#10b981">✓ เหมาะสม</span>';
    else wppHint = '<span style="color:#f59e0b">⚠ หนาแน่นเกินไป</span>';
  }

  document.getElementById('statChapters').textContent = chapters.length;
  document.getElementById('statWords').textContent = totalWords.toLocaleString();
  document.getElementById('statChars').textContent = totalChars.toLocaleString();
  document.getElementById('statPages').textContent = totalPages;
  document.getElementById('statReadTime').textContent = totalWords > 0 ? readTimeStr : '—';
  document.getElementById('statWordsPerPage').textContent = avgWordsPerPage > 0 ? avgWordsPerPage.toLocaleString() : '—';
  document.getElementById('statWordsPerPageHint').innerHTML = wppHint;
  document.getElementById('chapterStats').innerHTML = statsHtml || '<div style="color:var(--ink-faint);font-style:italic;font-size:11px">ยังไม่มีบท...</div>';
}

// ── Toast ──
// ── Robust download helper (works on Android content:// URLs) ──
function _downloadBlob(blob, filename) {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 2000);
  } catch(e) {
    // Fallback: open in new window (Android WebView fallback)
    try {
      const reader = new FileReader();
      reader.onload = function() {
        const win = window.open('about:blank', '_blank');
        if (win) {
          win.document.write(`<html><body style="margin:0;background:#1a1612;color:#fff;font-family:sans-serif;padding:20px">
            <h3 style="color:#c9a227">⚠️ ดาวน์โหลดไม่สำเร็จอัตโนมัติ</h3>
            <p>เบราว์เซอร์นี้อาจไม่รองรับการดาวน์โหลดไฟล์โดยตรง</p>
            <p>วิธีแก้: <strong>เปิดไฟล์นี้ใน Chrome บนเครื่อง PC</strong> แล้ว Export อีกครั้ง</p>
          </body></html>`);
        } else {
          showToast('❌ กรุณาเปิดในเบราว์เซอร์ Chrome บน PC เพื่อ Export');
        }
      };
      reader.readAsDataURL(blob);
    } catch(e2) {
      showToast('❌ Export ไม่สำเร็จ: กรุณาเปิดใน Chrome บน PC');
    }
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) { console.log('[Toast]', msg); return; }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
