
// ── Export PDF (html2canvas method for correct Thai font) ──
async function exportPDF() {
  showToast('⏳ กำลังสร้าง PDF... อาจใช้เวลาสักครู่');
  // Clean up any ghost measurement elements that may have leaked
  document.querySelectorAll('.page.page-inner[style*="-9999px"]').forEach(el => el.remove());
  try {
    if (!window.html2canvas) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = resolve; s.onerror = () => reject(new Error('โหลด html2canvas ไม่ได้ — ต้องใช้ Internet'));
        document.head.appendChild(s);
      });
    }

    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = resolve; s.onerror = () => reject(new Error('โหลด jsPDF ไม่ได้ — ต้องใช้ Internet'));
        document.head.appendChild(s);
      });
    }

    const { jsPDF } = window.jspdf;
    if (!jsPDF) throw new Error('โหลด jsPDF ไม่ได้');
    const title = document.getElementById('bookTitle').value || 'ebook';
    const safeTitle = title.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
    const W = 148, H = 210;

    // Collect all page elements
    const pageCover = document.getElementById('pageCover');
    const pageTitlePage = document.getElementById('pageTitlePage');
    const specialPages = Array.from(document.querySelectorAll('.special-page-wrap .page'));
    const chapterPageEls = Array.from(document.querySelectorAll('#chapterPages .page'));
    const allPageEls = [pageCover, pageTitlePage, ...specialPages, ...chapterPageEls].filter(Boolean);

    // Force all pages visible (hide via display:none breaks html2canvas)
    const prevDisplay = allPageEls.map(p => p.style.display);
    allPageEls.forEach(p => { p.style.display = 'flex'; });
    // Also unhide any page-label elements temporarily
    const prevLabelDisplay = [];
    document.querySelectorAll('.page-label').forEach(l => { prevLabelDisplay.push([l, l.style.display]); l.style.display = 'none'; });

    let first = true;
    // Temporarily reset zoom transform so html2canvas captures at 1:1
    const zoomWrap = document.getElementById('zoomWrap');
    const prevTransform = zoomWrap ? zoomWrap.style.transform : '';
    if (zoomWrap) zoomWrap.style.transform = 'none';

    for (const pageEl of allPageEls) {
      const rect = pageEl.getBoundingClientRect();
      const canvas = await html2canvas(pageEl, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: '#fffef9', logging: false,
        width: 559, height: 794,
        windowWidth: 559, windowHeight: 794,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        x: 0, y: 0,
        ignoreElements: el => el.classList?.contains('page-label') ||
                               el.classList?.contains('page-layout-pill') ||
                               el.id === 'inlineFmtBar'
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      if (!first) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, W, H);
      first = false;
    }

    // Restore zoom transform
    if (zoomWrap) zoomWrap.style.transform = prevTransform;

    // Restore display states
    allPageEls.forEach((p, i) => { p.style.display = prevDisplay[i]; });
    prevLabelDisplay.forEach(([l, d]) => { l.style.display = d; });

    // Download
    pdf.save(`${safeTitle}_A5.pdf`);
    showToast('✅ Export PDF เรียบร้อย!');
  } catch(e) {
    console.error('PDF export error:', e);
    showToast('❌ PDF error: ' + (e.message || e));
  }
}

// ── Pure-JS DOCX XML writer (fallback when docx library unavailable) ──
async function exportDOCX_fallback() {
  const title = document.getElementById('bookTitle').value || 'Untitled';
  const author = document.getElementById('authorName').value || '';
  const pen = document.getElementById('penName').value || author;
  const pub = document.getElementById('publisher').value || '';
  const year = document.getElementById('pubYear').value || '';

  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // ── Strip/convert markup tags to plain text for DOCX runs ──
  function stripMarkupToRuns(text, baseOpts = {}) {
    // Returns array of run objects: { text, bold, italic, color, sz }
    const defaultSz = baseOpts.sz || 24;
    const runs = [];
    // Parse inline markup into segments
    // Supported: **bold**, _italic_, <color:#hex>text</color>, <size:N>text</size>, <font:...>text</font>, ==highlight==, `code`, «text»
    // Strategy: walk through with regex to split into tagged/untagged segments
    const segments = [];
    let remaining = text;
    const tagRe = /(\*\*(.+?)\*\*|__(.+?)__|_(.+?)_|==(.+?)==|`(.+?)`|<color:(#[0-9a-fA-F]{3,6})>(.+?)<\/color>|<size:(\d+)>(.+?)<\/size>|<font:[^>]+>(.+?)<\/font>|«(.+?)»)/;
    while (remaining.length > 0) {
      const m = tagRe.exec(remaining);
      if (!m) { segments.push({ text: remaining, bold: false, italic: false }); break; }
      if (m.index > 0) segments.push({ text: remaining.slice(0, m.index), bold: false, italic: false });
      const full = m[0];
      if (full.startsWith('**')) segments.push({ text: m[2], bold: true, italic: false });
      else if (full.startsWith('__')) segments.push({ text: m[3], underline: true });
      else if (full.startsWith('_')) segments.push({ text: m[4], italic: true });
      else if (full.startsWith('==')) segments.push({ text: m[5] });
      else if (full.startsWith('`')) segments.push({ text: m[6] });
      else if (full.startsWith('<color:')) segments.push({ text: m[8], color: m[7].replace('#','') });
      else if (full.startsWith('<size:')) segments.push({ text: m[10], sz: Math.round(parseInt(m[9]) * 2) }); // OOXML half-points
      else if (full.startsWith('<font:')) segments.push({ text: m[11] });
      else if (full.startsWith('«')) segments.push({ text: '«' + m[12] + '»', italic: true });
      else segments.push({ text: full });
      remaining = remaining.slice(m.index + full.length);
    }
    return segments.map(seg => {
      const bold = (baseOpts.bold || seg.bold) ? '<w:b/>' : '';
      const italic = (baseOpts.italic || seg.italic) ? '<w:i/>' : '';
      const underline = seg.underline ? '<w:u w:val="single"/>' : '';
      const color = (seg.color || baseOpts.color) ? `<w:color w:val="${seg.color || baseOpts.color}"/>` : '';
      const sz = seg.sz || defaultSz;
      return `<w:r><w:rPr>${bold}${italic}${underline}${color}<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:rFonts w:ascii="Sarabun" w:hAnsi="Sarabun" w:cs="Sarabun"/></w:rPr><w:t xml:space="preserve">${esc(seg.text)}</w:t></w:r>`;
    }).join('');
  }

  let bodyXml = '';
  const p = (text, opts = {}) => {
    const jc = opts.center ? '<w:jc w:val="center"/>' : '';
    const before = opts.before ? `<w:spacing w:before="${opts.before}"/>` : '';
    const runsXml = stripMarkupToRuns(text, opts);
    return `<w:p><w:pPr>${jc}${before}</w:pPr>${runsXml}</w:p>`;
  };
  const pageBreak = () => `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;

  bodyXml += p(title, { bold: true, sz: 52, center: true, before: 2400 });
  bodyXml += p(document.getElementById('bookSubtitle').value || '', { italic: true, sz: 26, center: true, color: '888880', before: 200 });
  bodyXml += p('โดย  ' + pen, { sz: 24, center: true, before: 600 });
  bodyXml += p(pub + '  ·  ' + year, { sz: 18, center: true, color: 'aaaaaa', before: 3200 });
  bodyXml += pageBreak();

  bodyXml += p('✦  ✦  ✦', { sz: 24, center: true, color: 'c9a227', before: 2000 });
  bodyXml += p(title, { bold: true, sz: 44, center: true, before: 400 });
  bodyXml += p('โดย  ' + author, { sz: 22, center: true, before: 400 });
  if (pen !== author) bodyXml += p('(นามปากกา: ' + pen + ')', { italic: true, sz: 18, center: true, color: '888880', before: 100 });
  bodyXml += pageBreak();

  chapters.forEach((ch, i) => {
    bodyXml += p('บทที่ ' + (i+1), { bold: true, sz: 18, color: '8b4513', before: 480 });
    bodyXml += p(ch.title || 'บทที่ ' + (i+1), { bold: true, sz: 32, before: 100 });
    const paras = ch.content.split('\n').filter(x => x.trim() && x.trim() !== '[PAGE_BREAK]');
    if (!paras.length) bodyXml += p('(ยังไม่มีเนื้อหา)', { italic: true, color: 'aaaaaa' });
    else paras.forEach(para => { bodyXml += p(para, { sz: 24 }); });
    if (i < chapters.length - 1) bodyXml += pageBreak();
  });

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
${bodyXml}
<w:sectPr>
  <w:pgSz w:w="8391" w:h="11906"/>
  <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/>
</w:sectPr>
</w:body>
</w:document>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`;
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  // Use JSZip if available (loaded with jspdf area) or manual Blob trick
  const enc = new TextEncoder();
  // Simple ZIP builder
  function makeZip(files) {
    const parts = [];
    const centralDir = [];
    let offset = 0;
    const crc32 = (buf) => {
      let crc = 0xFFFFFFFF;
      const t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) { let c = i; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[i] = c; }
      for (let i = 0; i < buf.length; i++) crc = t[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
      return (crc ^ 0xFFFFFFFF) >>> 0;
    };
    for (const [name, content] of files) {
      const data = enc.encode(content);
      const crc = crc32(data);
      const nameBytes = enc.encode(name);
      const local = new Uint8Array(30 + nameBytes.length + data.length);
      const dv = new DataView(local.buffer);
      dv.setUint32(0, 0x04034b50, true); dv.setUint16(4, 20, true); dv.setUint16(6, 0, true);
      dv.setUint16(8, 0, true); dv.setUint16(10, 0, true); dv.setUint16(12, 0, true);
      dv.setUint32(14, crc, true); dv.setUint32(18, data.length, true); dv.setUint32(22, data.length, true);
      dv.setUint16(26, nameBytes.length, true); dv.setUint16(28, 0, true);
      local.set(nameBytes, 30); local.set(data, 30 + nameBytes.length);
      parts.push(local);
      const cd = new Uint8Array(46 + nameBytes.length);
      const cdv = new DataView(cd.buffer);
      cdv.setUint32(0, 0x02014b50, true); cdv.setUint16(4, 20, true); cdv.setUint16(6, 20, true);
      cdv.setUint16(8, 0, true); cdv.setUint16(10, 0, true); cdv.setUint16(12, 0, true);
      cdv.setUint16(14, 0, true); cdv.setUint32(16, crc, true); cdv.setUint32(20, data.length, true);
      cdv.setUint32(24, data.length, true); cdv.setUint16(28, nameBytes.length, true);
      cdv.setUint16(30, 0, true); cdv.setUint16(32, 0, true); cdv.setUint16(34, 0, true);
      cdv.setUint16(36, 0, true); cdv.setUint32(38, 0, true); cdv.setUint32(42, offset, true);
      cd.set(nameBytes, 46); centralDir.push(cd);
      offset += local.length;
    }
    const cdSize = centralDir.reduce((a, b) => a + b.length, 0);
    const eocd = new Uint8Array(22);
    const edv = new DataView(eocd.buffer);
    edv.setUint32(0, 0x06054b50, true); edv.setUint16(4, 0, true); edv.setUint16(6, 0, true);
    edv.setUint16(8, files.length, true); edv.setUint16(10, files.length, true);
    edv.setUint32(12, cdSize, true); edv.setUint32(16, offset, true); edv.setUint16(20, 0, true);
    const all = [...parts, ...centralDir, eocd];
    const total = all.reduce((a, b) => a + b.length, 0);
    const out = new Uint8Array(total); let pos = 0;
    for (const a of all) { out.set(a, pos); pos += a.length; }
    return out;
  }

  const zipData = makeZip([
    ['[Content_Types].xml', contentTypesXml],
    ['_rels/.rels', relsXml],
    ['word/document.xml', docXml],
    ['word/_rels/document.xml.rels', wordRelsXml],
  ]);
  const blob = new Blob([zipData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const safeTitle = title.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
  _downloadBlob(blob, `${safeTitle}_A5.docx`);
  showToast('✅ บันทึก .docx เรียบร้อย! (basic XML mode)');
}

// ── Export DOCX (always uses pure-JS XML writer — no external lib needed) ──
async function exportDOCX() {
  showToast('⏳ กำลังสร้าง .docx...');
  try {
    await exportDOCX_fallback();
  } catch(e) {
    console.error('DOCX export error:', e);
    showToast('❌ DOCX error: ' + (e.message || e));
  }
}


