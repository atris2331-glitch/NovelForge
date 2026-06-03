// ── FEATURE 1: EPUB Export ──
function exportEPUB() {
  showToast('⏳ กำลังสร้าง EPUB...');
  const title = document.getElementById('bookTitle').value || 'Untitled';
  const author = document.getElementById('authorName').value || 'Author';
  const pen = document.getElementById('penName').value || author;
  const pub = document.getElementById('publisher').value || '';
  const lang = 'th';
  const uid = 'ebook-' + Date.now();
  const safeTitle = title.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));

  // Build chapter HTML files
  const chapterFiles = [];
  chapters.forEach((ch, i) => {
    const paras = (ch.content || '').split('\n').filter(p => p.trim() && p.trim() !== '[PAGE_BREAK]');
    const bodyHtml = paras.map(p => `<p>${p.replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</p>`).join('\n');
    const fname = `chapter${i+1}.xhtml`;
    chapterFiles.push({
      name: fname,
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>${safeTitle} — บทที่ ${i+1}</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <h1 class="chapter-title">${ch.title || 'บทที่ ' + (i+1)}</h1>
  ${bodyHtml || '<p class="empty">— —</p>'}
</body>
</html>`
    });
  });

  const manifestItems = chapterFiles.map((f,i) =>
    `<item id="chapter${i+1}" href="Text/${f.name}" media-type="application/xhtml+xml"/>`
  ).join('\n    ');
  const spineItems = chapterFiles.map((f,i) =>
    `<itemref idref="chapter${i+1}"/>`
  ).join('\n    ');

  const opfContent = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${safeTitle}</dc:title>
    <dc:creator opf:role="aut">${pen}</dc:creator>
    <dc:publisher>${pub}</dc:publisher>
    <dc:language>${lang}</dc:language>
    <dc:identifier id="BookId">${uid}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="css" href="css/style.css" media-type="text/css"/>
    ${manifestItems}
  </manifest>
  <spine toc="ncx">
    ${spineItems}
  </spine>
</package>`;

  const ncxContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${uid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${safeTitle}</text></docTitle>
  <navMap>
    ${chapterFiles.map((f,i) => `<navPoint id="navpoint-${i+1}" playOrder="${i+1}">
      <navLabel><text>บทที่ ${i+1}: ${chapters[i].title||''}</text></navLabel>
      <content src="Text/${f.name}"/>
    </navPoint>`).join('\n    ')}
  </navMap>
</ncx>`;

  const cssContent = `body { font-family: serif; font-size: 1em; line-height: 1.8; margin: 1em; }
h1.chapter-title { font-size: 1.4em; font-weight: bold; margin: 1.5em 0 0.8em; text-align: center; }
p { margin: 0 0 0.6em; text-align: justify; text-indent: 1.5em; }
p:first-of-type { text-indent: 0; }`;

  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

  // Build ZIP
  const files = [
    ['mimetype', 'application/epub+zip'],
    ['META-INF/container.xml', containerXml],
    ['OEBPS/content.opf', opfContent],
    ['OEBPS/toc.ncx', ncxContent],
    ['OEBPS/css/style.css', cssContent],
    ...chapterFiles.map(f => [`OEBPS/Text/${f.name}`, f.content])
  ];

  const enc = new TextEncoder();
  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    const t = new Uint32Array(256);
    for (let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[i]=c;}
    for (let i=0;i<buf.length;i++) crc=t[(crc^buf[i])&0xFF]^(crc>>>8);
    return (crc^0xFFFFFFFF)>>>0;
  }
  function makeEpubZip(fileList) {
    const parts=[],centralDir=[];let offset=0;
    for(let fi=0;fi<fileList.length;fi++){
      const [name,content]=fileList[fi];
      const isMime = name === 'mimetype';
      const data=enc.encode(content);
      const crc=crc32(data);
      const nameBytes=enc.encode(name);
      // mimetype must be stored uncompressed (method=0, no flags)
      const stored=new Uint8Array(30+nameBytes.length+data.length);
      const dv=new DataView(stored.buffer);
      dv.setUint32(0,0x04034b50,true);
      dv.setUint16(4,20,true);  // version needed
      dv.setUint16(6,0,true);   // flags
      dv.setUint16(8,0,true);   // compression: 0=store
      dv.setUint16(10,0,true);dv.setUint16(12,0,true);
      dv.setUint32(14,crc,true);dv.setUint32(18,data.length,true);dv.setUint32(22,data.length,true);
      dv.setUint16(26,nameBytes.length,true);dv.setUint16(28,0,true);
      stored.set(nameBytes,30);stored.set(data,30+nameBytes.length);
      parts.push(stored);
      const cd=new Uint8Array(46+nameBytes.length);
      const cdv=new DataView(cd.buffer);
      cdv.setUint32(0,0x02014b50,true);cdv.setUint16(4,20,true);cdv.setUint16(6,20,true);
      cdv.setUint16(8,0,true);cdv.setUint16(10,0,true);cdv.setUint16(12,0,true);
      cdv.setUint16(14,0,true);cdv.setUint32(16,crc,true);cdv.setUint32(20,data.length,true);
      cdv.setUint32(24,data.length,true);cdv.setUint16(28,nameBytes.length,true);
      cdv.setUint16(30,0,true);cdv.setUint16(32,0,true);cdv.setUint16(34,0,true);
      cdv.setUint16(36,0,true);cdv.setUint32(38,0,true);cdv.setUint32(42,offset,true);
      cd.set(nameBytes,46);centralDir.push(cd);offset+=stored.length;
    }
    const cdSize=centralDir.reduce((a,b)=>a+b.length,0);
    const eocd=new Uint8Array(22);
    const edv=new DataView(eocd.buffer);
    edv.setUint32(0,0x06054b50,true);edv.setUint16(4,0,true);edv.setUint16(6,0,true);
    edv.setUint16(8,fileList.length,true);edv.setUint16(10,fileList.length,true);
    edv.setUint32(12,cdSize,true);edv.setUint32(16,offset,true);edv.setUint16(20,0,true);
    const all=[...parts,...centralDir,eocd];
    const total=all.reduce((a,b)=>a+b.length,0);
    const out=new Uint8Array(total);let pos=0;
    for(const a of all){out.set(a,pos);pos+=a.length;}
    return out;
  }

  const zipData = makeEpubZip(files);
  const blob = new Blob([zipData], {type:'application/epub+zip'});
  const safeFileName = title.replace(/[^a-zA-Z0-9ก-๙]/g,'_') || 'ebook';
  _downloadBlob(blob, `${safeFileName}.epub`);
  showToast('✅ Export EPUB เรียบร้อย! เปิดด้วย Readium, Calibre หรือ iBooks');
}

