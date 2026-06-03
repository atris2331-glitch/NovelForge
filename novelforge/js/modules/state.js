// ── State ──
let viewMode = 'single'; // 'scroll' | 'single' | 'spread'
let currentPageIndex = 0;
let zoomLevel = 100;
let allPages = []; // flat list of all page DOM elements after render
let chapters = [
  { id: 1, title: 'ลมกรด', content: 'ณ ชายแดนที่ขอบฟ้าแห่งอาณาจักรอาร์เวน สายลมพัดผ่านทุ่งหญ้าสีทองราวกับการโอดครวญของวิญญาณที่ไม่มีที่ไป เซล่า หญิงสาวผมดำประกายสีน้ำเงิน ยืนอยู่บนหน้าผาสูงชัน สายตาปักแน่นอยู่ที่ขอบฟ้าอันไกลโพ้น\n\nเธอเคยได้ยินเรื่องเล่าจากยายมาตั้งแต่เด็ก เรื่องของมังกรลมที่ซ่อนตัวอยู่ในเมฆก้อนใหญ่ เรื่องของอาณาจักรที่หายไปพร้อมกับพายุฝนครั้งใหญ่เมื่อพันปีก่อน และเรื่องของสมบัติที่ซ่อนไว้ลึกในหัวใจของพายุนั้น\n\n«ถ้าลมพาเธอไป จงไปด้วยใจที่กล้า» นั่นคือสิ่งที่ยายบอกในวันที่เธอจากไปตลอดกาล เซล่าบิดริมฝีปาก มือเธอกำดาบเงินอยู่แน่น ดาบที่เป็นมรดกจากตระกูลที่สูญสลายไปนานแล้ว', note: '', imageData: null, imageSize: 100 },
  { id: 2, title: 'เมืองใต้พายุ', content: 'ตลาดเมืองคาลิสเต้มีกลิ่นของควันธูปและเครื่องเทศปนกัน พ่อค้าแม่ค้าเรียกขายสินค้าด้วยเสียงดัง ขณะที่เด็กๆ วิ่งเล่นอยู่ระหว่างแผงขาย\n\nเซล่าสวมผ้าคลุมหน้าสีน้ำตาล เดินผ่านฝูงชนอย่างระมัดระวัง เธอกำลังมองหาใครบางคน คนที่รู้เรื่องแผนที่ที่ซ่อนอยู่ในตำนาน\n\n«เฮ้ นายหญิง รอสักครู่» เสียงชายคนหนึ่งเรียกจากหลัง เซล่าหยุดเดินแต่ไม่หันหน้า มือวางบนด้ามดาบโดยสัญชาตญาณ', note: '', imageData: null, imageSize: 100 },
];
let currentChapterId = 1;
let coverImageData = null;
let textAlign = 'justify';
let dropCap = true;
let bodyFont = 'Sarabun';
let coverTemplate = 'dark';
let coverTemplates = {
  dark:       { bg: 'linear-gradient(160deg,#1a1210,#3d2010)', accent: '#8b4513' },
  navy:       { bg: 'linear-gradient(160deg,#0a1628,#1a3a5c)', accent: '#1a3a5c' },
  forest:     { bg: 'linear-gradient(160deg,#0d2016,#1e5c38)', accent: '#2d6a4f' },
  rose:       { bg: 'linear-gradient(160deg,#2a0a14,#7a2040)', accent: '#922b21' },
  ivory:      { bg: 'linear-gradient(160deg,#f5ede0,#ddd0bc)', accent: '#8b4513' },
  slate:      { bg: 'linear-gradient(160deg,#1c1c24,#2e2e3a)', accent: '#6b2d8b' },
  // ── แนวใหม่ ──
  anime_dark: { bg: 'linear-gradient(160deg,#0e001e,#1a0040,#0e001e)', accent: '#7c3aed' },
  anime_day:  { bg: 'linear-gradient(160deg,#e0e7ff,#c7d2fe,#a5b4fc)', accent: '#4338ca' },
  sakura:     { bg: 'linear-gradient(160deg,#1a0010,#4a1030,#2a0820)', accent: '#e91e8c' },
  sakura_soft:{ bg: 'linear-gradient(160deg,#fff0f5,#ffd6e8,#ffe4ee)', accent: '#be185d' },
  yaoi_dark:  { bg: 'linear-gradient(160deg,#0a0015,#1e0035,#0a0015)', accent: '#9333ea' },
  yaoi_pink:  { bg: 'linear-gradient(160deg,#2d001a,#5a0030,#2d001a)', accent: '#f43f5e' },
  fantasy_gold:{ bg: 'linear-gradient(160deg,#1a1000,#3d2800,#1a1000)', accent: '#d97706' },
  galaxy:     { bg: 'linear-gradient(160deg,#020817,#0f1628,#1a0a2e)', accent: '#818cf8' },
  wuxia:      { bg: 'linear-gradient(160deg,#1a0505,#3d0000,#1a0505)', accent: '#dc2626' },
  kidspastel: { bg: 'linear-gradient(160deg,#fef3c7,#fde8f0,#e8f0fe)', accent: '#f59e0b' },
  mint_fresh: { bg: 'linear-gradient(160deg,#064e3b,#065f46,#064e3b)', accent: '#34d399' },
  horror:     { bg: 'linear-gradient(160deg,#000000,#1a0000,#0a0000)', accent: '#991b1b' },
  vintage_bl: { bg: 'linear-gradient(160deg,#fdf2f8,#fce7f3,#fbcfe8)', accent: '#9d174d' },
  steampunk:  { bg: 'linear-gradient(160deg,#1c1408,#2d2010,#1c1408)', accent: '#b45309' },
  ocean:      { bg: 'linear-gradient(160deg,#001e3c,#003366,#001e3c)', accent: '#0ea5e9' },
  custom_tpl: { bg: 'linear-gradient(160deg,#1a1612,#2a2018)', accent: '#8b4513', custom: true },
};
// Custom cover template image
let customCoverTemplateImageData = null;

