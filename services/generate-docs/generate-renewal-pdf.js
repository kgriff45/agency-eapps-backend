'use strict';
const PDFDocument = require('pdfkit');
const path = require('path');
const fs   = require('fs');
const { clientdb } = require('../../data/data');

// ─── Font resolution ──────────────────────────────────────────────────────────
function findFontsourceBase(startDir) {
  let dir = startDir;
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, 'node_modules/@fontsource');
    try { fs.accessSync(candidate); return candidate; } catch(e) {}
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    'Could not find node_modules/@fontsource. ' +
    'Run: npm install @fontsource/source-sans-pro @fontsource/source-serif-pro'
  );
}
const BASE = findFontsourceBase(__dirname);
const FONTS = {
  sansReg:    path.join(BASE, 'source-sans-pro/files/source-sans-pro-latin-400-normal.woff'),
  sansSemi:   path.join(BASE, 'source-sans-pro/files/source-sans-pro-latin-600-normal.woff'),
  sansItalic: path.join(BASE, 'source-sans-pro/files/source-sans-pro-latin-400-italic.woff'),
  serifReg:   path.join(BASE, 'source-serif-pro/files/source-serif-pro-latin-400-normal.woff'),
  serifSemi:  path.join(BASE, 'source-serif-pro/files/source-serif-pro-latin-600-normal.woff'),
};
const F = {
  reg: 'SSP-Regular', semi: 'SSP-SemiBold', italic: 'SSP-Italic',
  serifReg: 'SSeP-Regular', serifSemi: 'SSeP-SemiBold',
};
function registerFonts(doc) {
  doc.registerFont(F.reg,       FONTS.sansReg);
  doc.registerFont(F.semi,      FONTS.sansSemi);
  doc.registerFont(F.italic,    FONTS.sansItalic);
  doc.registerFont(F.serifReg,  FONTS.serifReg);
  doc.registerFont(F.serifSemi, FONTS.serifSemi);
}

// ─── Design tokens — matched to HTML/CSS example ─────────────────────────────
const C = {
  brand:      '#156736',
  brandMid:   '#4FB94A',
  brand10:    '#EAF2ED',
  brand05:    '#F3F9F5',
  bg:         '#F2F3F4',
  border:     '#E0EAE7',
  borderDark: '#C8D8D2',
  tx:         '#1A1A1A',
  txMid:      '#444444',
  sub:        '#6B7280',
  subLight:   '#9CA3AF',
  white:      '#FFFFFF',
  removed:    '#B91C1C',
  success:    '#15803D',
  successBg:  '#DCFCE7',
};

// Page geometry
const PW = 612, PH = 792;
const M  = 48;           // outer margin
const CW = PW - M * 2;  // content width = 516
const CARD_PAD = 16;     // inner padding inside policy cards
const CARD_R   = 8;      // card corner radius (approximated with rect)
const COL2_X   = M + CW / 2 + 10;   // second column x for 2-col grid
const COL2_W   = CW / 2 - 10;
const COL1_W   = CW / 2 - 10;

// ─── Utilities ────────────────────────────────────────────────────────────────
function fmt(v, format) {
  if (v == null || v === '') return '—';
  if (format === 'currency') return `$${Number(v).toLocaleString()}`;
  return String(v);
}
function resolvePath(dotPath, ctx) {
  return dotPath.split('.').reduce((o, k) => o?.[k], ctx);
}
function getClientVal(client, key) {
  const m = {
    accountName: client?.account_name,       dba: client?.dba,
    firstName: client?.first_name,           lastName: client?.last_name,
    billTo: client?.billing_address?.bill_to,
    billingContact: client?.billing_address?.contact_name,
    billingEmail: client?.billing_address?.email,
    billingPhone: client?.billing_address?.phone,
    billingStreet: client?.billing_address?.street1,
    billingCity: client?.billing_address?.city,
    billingState: client?.billing_address?.state,
    billingZip: client?.billing_address?.zip,
    practiceStreet: client?.business_address?.street1,
    practiceCity: client?.business_address?.city,
    practiceState: client?.business_address?.state,
    practiceZip: client?.business_address?.zip,
    occupation: client?.occupation,           specialty: client?.specialty,
    npi: client?.npi,                         taxId: client?.tax_id,
    licenseNumber: client?.license_number,
    yearsInPractice: client?.years_in_practice,
    contactEmail: client?.contact_email,      contactPhone: client?.contact_phone,
    agentNotes: client?.agent_notes,
  };
  return m[key] ?? '';
}

// ─── Layout engine ────────────────────────────────────────────────────────────
class Layout {
  constructor(doc) { this.doc = doc; this.y = M; }

  need(h) {
    if (this.y + h > PH - M - 40) {
      this.doc.addPage();
      this.y = M + 24;
    }
    return this;
  }

  keepTogether(h) {
    if (this.y + h > PH - M - 40) {
      this.doc.addPage();
      this.y = M + 24;
    }
    return this;
  }

  gap(n = 12) { this.y += n; return this; }

  rule(color = C.border, weight = 0.5) {
    this.doc.moveTo(M, this.y).lineTo(PW - M, this.y)
      .strokeColor(color).lineWidth(weight).stroke();
    this.y += 14;
    return this;
  }
}

// ─── Primitive helpers ────────────────────────────────────────────────────────

function roundedRect(doc, x, y, w, h, r, fillColor, strokeColor) {
  doc.roundedRect(x, y, w, h, r);
  if (fillColor && strokeColor) {
    doc.fillAndStroke(fillColor, strokeColor);
  } else if (fillColor) {
    doc.fill(fillColor);
  } else if (strokeColor) {
    doc.stroke(strokeColor);
  }
}

function strikethrough(doc, text, x, y, fs, color) {
  doc.font(F.reg).fontSize(fs).fillColor(color).text(text, x, y, { lineBreak: false });
  const w = doc.widthOfString(text);
  doc.moveTo(x, y + fs * 0.38).lineTo(x + w, y + fs * 0.38)
     .strokeColor(color).lineWidth(0.7).stroke();
  return w;
}

// Small pill badge
function pill(doc, label, x, y, bg, fg, fs = 7) {
  doc.font(F.semi).fontSize(fs);
  const w = doc.widthOfString(label) + 12;
  const h = fs + 6;
  roundedRect(doc, x, y, w, h, 3, bg, null);
  doc.fillColor(fg).text(label, x + 6, y + 3, { lineBreak: false });
  return w;
}

// Draw a checkbox — filled with checkmark if checked, empty border if not
function checkbox(doc, x, y, checked, size = 11) {
  if (checked) {
    roundedRect(doc, x, y, size, size, 2, C.brand, null);
    // Checkmark
    doc.moveTo(x + 2.5, y + size * 0.5)
       .lineTo(x + size * 0.4, y + size * 0.75)
       .lineTo(x + size - 2, y + size * 0.2)
       .strokeColor(C.white).lineWidth(1.3).lineJoin('round').stroke();
  } else {
    roundedRect(doc, x, y, size, size, 2, null, C.borderDark);
    doc.lineWidth(0.7);
  }
}

// ─── Document header ──────────────────────────────────────────────────────────

function drawDocHeader(doc, L, client, generated, logoPath) {
  // Thin brand top bar
  doc.rect(0, 0, PW, 4).fill(C.brand);

  let y = M;

  // Logo right-aligned if provided
  if (logoPath) {
    try { doc.image(logoPath, PW - M - 120, y, { width: 120, fit: [120, 34] }); }
    catch(e) { /* skip */ }
  }

  // Title — large Source Serif
  doc.font(F.serifSemi).fontSize(26).fillColor(C.tx)
     .text('Annual Coverage Review', M, y);
  y += 32;

  // Subtitle — account name + insured
  doc.font(F.reg).fontSize(13).fillColor(C.sub)
     .text('Prepared for ', M, y, { continued: true })
     .font(F.semi).fillColor(C.tx)
     .text(client.account_name, { continued: false });
  y += 16;

  doc.font(F.reg).fontSize(11).fillColor(C.sub)
     .text(
       `${client.first_name} ${client.last_name}  ·  ${client.specialty || client.occupation || ''}`,
       M, y
     );
  y += 14;

  // Date right side
  doc.font(F.reg).fontSize(8).fillColor(C.subLight)
     .text(generated, M, y, { width: CW, align: 'right', lineBreak: false });
  y += 10;

  // Divider
  doc.moveTo(M, y).lineTo(PW - M, y).strokeColor(C.border).lineWidth(0.5).stroke();
  y += 16;

  L.y = y;
  return L;
}

// ─── Running header (pages 2+) ───────────────────────────────────────────────

function drawRunningHeader(doc, client) {
  doc.rect(0, 0, PW, 4).fill(C.brand);
  doc.font(F.semi).fontSize(7.5).fillColor(C.sub)
     .text('Annual Coverage Review  ·  ', M, 14, { continued: true })
     .font(F.reg).fillColor(C.subLight)
     .text(client.account_name, { lineBreak: false });
}

// ─── Page numbers + footer ────────────────────────────────────────────────────

function addPageNumbers(doc, client) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    if (i > 0) drawRunningHeader(doc, client);
    doc.moveTo(M, PH - 34).lineTo(PW - M, PH - 34)
       .strokeColor(C.border).lineWidth(0.4).stroke();
    doc.font(F.reg).fontSize(7).fillColor(C.subLight)
       .text('Confidential — For Agent & Insured Use Only', M, PH - 26, { lineBreak: false });
    doc.font(F.reg).fontSize(7).fillColor(C.sub)
       .text(`Page ${i + 1} of ${range.count}`, PW - M - 38, PH - 26, { lineBreak: false });
  }
}

// ─── Client information ───────────────────────────────────────────────────────

const CLIENT_LABELS = {
  accountName: 'Account Name',      dba: 'DBA / Practice',
  firstName: 'First Name',          lastName: 'Last Name',
  billTo: 'Bill To',                billingContact: 'Billing Contact',
  billingEmail: 'Billing Email',    billingPhone: 'Billing Phone',
  billingStreet: 'Street',          billingCity: 'City',
  billingState: 'State',            billingZip: 'ZIP Code',
  practiceStreet: 'Street',         practiceCity: 'City',
  practiceState: 'State',           practiceZip: 'ZIP Code',
  occupation: 'Occupation',         specialty: 'Specialty',
  npi: 'NPI Number',                taxId: 'Tax ID / EIN',
  licenseNumber: 'License Number',  yearsInPractice: 'Years in Practice',
  contactEmail: 'Contact Email',    contactPhone: 'Contact Phone',
  agentNotes: 'Notes',
};

const CLIENT_SECTIONS = [
  { label: 'Account & Insured',     keys: ['accountName', 'dba', 'firstName', 'lastName'] },
  { label: 'Billing',               keys: ['billTo', 'billingContact', 'billingEmail', 'billingPhone', 'billingStreet', 'billingCity', 'billingState', 'billingZip'] },
  { label: 'Practice Address',      keys: ['practiceStreet', 'practiceCity', 'practiceState', 'practiceZip'] },
  { label: 'Practice & Occupation', keys: ['occupation', 'specialty', 'npi', 'taxId', 'licenseNumber', 'yearsInPractice', 'contactEmail', 'contactPhone'] },
  { label: 'Agent Notes',           keys: ['agentNotes'] },
];

// A 2-column grid field — label above value
function gridField(doc, label, value, x, y, colW, hasChange, oldVal) {
  const fs = 8.5;
  // Label
  doc.font(F.semi).fontSize(9).fillColor(C.sub)
     .text(label, x, y, { width: colW, lineBreak: false });
  y += 13;

  if (hasChange) {
    strikethrough(doc, String(oldVal ?? '—'), x, y, fs, C.removed);
    const oldW = doc.widthOfString(String(oldVal ?? '—'));
    doc.font(F.reg).fontSize(fs).fillColor(C.subLight)
       .text('  →  ', x + oldW, y, { lineBreak: false });
    const aw = doc.widthOfString('  →  ');
    doc.font(F.semi).fontSize(fs).fillColor(C.tx)
       .text(String(value), x + oldW + aw, y, { width: colW - oldW - aw, lineBreak: false });
  } else {
    doc.font(F.semi).fontSize(fs).fillColor(C.tx)
       .text(String(value ?? '—'), x, y, { width: colW, lineBreak: false });
  }

  // Write-in underline
  doc.moveTo(x, y + fs + 4).lineTo(x + colW, y + fs + 4)
     .strokeColor(C.border).lineWidth(0.4).stroke();

  return y + fs + 16; // returns bottom Y of this field
}

function drawClientSection(doc, L, client, clientChanges) {
  const changes     = clientChanges ?? {};
  const changeCount = Object.keys(changes).length;

  // Section heading
  L.need(32);
  doc.font(F.serifSemi).fontSize(16).fillColor(C.tx)
     .text('Client Information', M, L.y);
  L.y += 20;
  doc.font(F.reg).fontSize(9).fillColor(C.sub)
     .text(
       changeCount > 0
         ? `${changeCount} field${changeCount > 1 ? 's' : ''} updated — review changes below`
         : 'Review your details below. Write any corrections on the lines and return to your agent.',
       M, L.y, { width: CW }
     );
  L.y += 20;

  CLIENT_SECTIONS.forEach(section => {
    // Sub-section label
    L.need(24);
    doc.font(F.semi).fontSize(7).fillColor(C.sub)
       .text(section.label.toUpperCase(), M, L.y, { characterSpacing: 0.5, lineBreak: false });
    L.y += 11;
    doc.moveTo(M, L.y).lineTo(PW - M, L.y)
       .strokeColor(C.borderDark).lineWidth(0.4).stroke();
    L.y += 10;

    // Render fields in 2-column grid
    const keys = section.keys;
    for (let i = 0; i < keys.length; i += 2) {
      const key1   = keys[i];
      const key2   = keys[i + 1];
      const ch1    = changes[key1];
      const ch2    = key2 ? changes[key2] : null;
      const val1   = ch1 ? (ch1.new || '—') : (getClientVal(client, key1) || '—');
      const val2   = key2 ? (ch2 ? (ch2.new || '—') : (getClientVal(client, key2) || '—')) : null;
      const old1   = ch1 ? ch1.old : null;
      const old2   = ch2 ? ch2.old : null;

      L.need(40);
      const rowStartY = L.y;
      const bottomY1  = gridField(doc, CLIENT_LABELS[key1] ?? key1, val1, M,        rowStartY, COL1_W, !!ch1, old1);
      const bottomY2  = key2
        ? gridField(doc, CLIENT_LABELS[key2] ?? key2, val2, COL2_X, rowStartY, COL2_W, !!ch2, old2)
        : rowStartY;

      L.y = Math.max(bottomY1, bottomY2) + 4;
    }
    L.gap(8);
  });

  L.gap(4).rule(C.border);
}

// ─── Measure policy height ────────────────────────────────────────────────────

function measurePolicy(doc, policy, polChanges) {
  const schema = policy.schema;
  let h = 0;

  h += 52;  // policy header card
  if (polChanges?.reviewedAt) h += 26;

  // Fields grid — pairs of 2
  if (schema?.fields?.length) {
    h += 20;  // subsection label
    const rows = Math.ceil(schema.fields.length / 2);
    h += rows * 44;  // each row ~44pt tall
    h += 8;
  }

  // Notices
  (schema?.notices ?? []).forEach(n => {
    h += doc.heightOfString(n.body, { width: CW - CARD_PAD * 2 - 12 }) + 30;
  });

  // Endorsements
  const allEnds = schema?.endorsements ?? [];
  if (allEnds.length > 0) {
    h += 24; // subsection label
    allEnds.forEach(e => {
      h += e.description ? 42 : 28;
    });
    h += 8;
  }

  // Questions by group
  const groups = schema?.questionGroups ?? [];
  if (groups.length > 0) {
    groups.forEach(group => {
      h += 24; // group label
      if (group.notice) h += 40;
      const qs = (schema.questions ?? []).filter(q => q?.group === group.id);
      qs.forEach(q => {
        h += 18; // title row
        if (q.description) h += doc.heightOfString(q.description, { width: CW - CARD_PAD * 2 - 26 }) + 6;
        h += 8; // bottom border gap
      });
    });
    h += 8;
  }

  // Notes
  if (polChanges?.notes?.trim()) {
    h += doc.heightOfString(polChanges.notes.trim(), { width: CW - CARD_PAD * 2 }) + 30;
  }

  // Write-in lines + signature
  h += 90;

  h += 20; // gap after card
  return h;
}

// ─── Policy block ─────────────────────────────────────────────────────────────

function drawPolicy(doc, L, policy, client, polChanges, cmdFrom) {
  const schema = policy.schema;
  console.log(`DRAW POLICY - ${cmdFrom}: policy: `, policy)
  console.log(`DRAW POLICY - ${cmdFrom}: client: `, client)
  console.log(`DRAW POLICY - ${cmdFrom}: polChanges: `, polChanges)

  // Keep entire policy together
  doc.font(F.reg);
  const totalH = measurePolicy(doc, policy, polChanges);
  L.keepTogether(totalH);

  const cardX = M;
  const cardY = L.y;

  // ── Policy card outer border (drawn at end once we know height)
  // We'll track content Y and draw the border after

  // ── Policy header row ─────────────────────────────────────────────────────
  // Title + status pill inline
  doc.font(F.serifSemi).fontSize(16).fillColor(C.tx)
     .text(policy.type_description ?? policy.type, M, L.y, { lineBreak: false });

  if (policy.status) {
    const statusBg = policy.status === 'Renewal' ? C.brand05 : '#EFF6FF';
    const statusFg = policy.status === 'Renewal' ? C.brand   : '#1D4ED8';
    const pw = doc.font(F.semi).fontSize(9).widthOfString(policy.status) + 16;
    roundedRect(doc, PW - M - pw, L.y + 2, pw, 18, 9, statusBg, null);
    doc.fillColor(statusFg).fontSize(9)
       .text(policy.status, PW - M - pw + 8, L.y + 5, { lineBreak: false });
  }
  L.y += 22;

  // Reviewed timestamp — green pill
  if (polChanges?.reviewedAt) {
    const ts = new Date(polChanges.reviewedAt).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });
    const bannerH = 20;
    roundedRect(doc, M, L.y, CW, bannerH, 4, C.successBg, null);
    doc.font(F.semi).fontSize(7.5).fillColor(C.success)
       .text('✓  Reviewed by insured', M + 10, L.y + 6, { continued: true })
       .font(F.reg)
       .text(`  —  ${ts}`, { lineBreak: false });
    L.y += bannerH + 10;
  }

  // Thin divider under header
  doc.moveTo(M, L.y).lineTo(PW - M, L.y)
     .strokeColor(C.border).lineWidth(0.5).stroke();
  L.y += 14;

  // ── Policy fields — 2-column grid ────────────────────────────────────────
  if (schema?.fields?.length) {
    doc.font(F.semi).fontSize(7).fillColor(C.sub)
       .text('POLICY DETAILS', M, L.y, { characterSpacing: 0.5, lineBreak: false });
    L.y += 11;
    doc.moveTo(M, L.y).lineTo(PW - M, L.y)
       .strokeColor(C.borderDark).lineWidth(0.3).stroke();
    L.y += 10;

    const ctx    = { policy, client };
    const fields = schema.fields;

    for (let i = 0; i < fields.length; i += 2) {
      const f1 = fields[i];
      const f2 = fields[i + 1];

      const raw1    = f1.source ? resolvePath(f1.source, ctx) : policy[f1.key];
      const cur1    = fmt(raw1, f1.format);
      const fc1     = polChanges?.fieldUpdates?.[f1.key];
      const disp1   = fc1 ? fmt(fc1.new, f1.format) : cur1;
      const old1    = fc1 ? fmt(fc1.old, f1.format) : null;

      const raw2    = f2 ? (f2.source ? resolvePath(f2.source, ctx) : policy[f2.key]) : null;
      const cur2    = f2 ? fmt(raw2, f2.format) : null;
      const fc2     = f2 ? polChanges?.fieldUpdates?.[f2.key] : null;
      const disp2   = fc2 ? fmt(fc2.new, f2.format) : cur2;
      const old2    = fc2 ? fmt(fc2.old, f2.format) : null;

      L.need(40);
      const rowY = L.y;
      const bot1 = gridField(doc, f1.label, disp1, M, rowY, COL1_W, !!fc1, old1);
      const bot2 = f2
        ? gridField(doc, f2.label, disp2, COL2_X, rowY, COL2_W, !!fc2, old2)
        : rowY;

      L.y = Math.max(bot1, bot2) + 4;
    }
    L.gap(8);
  }

  // ── Notices ───────────────────────────────────────────────────────────────
  (schema?.notices ?? []).forEach(notice => {
    const noticeText = notice.body;
    const textH = doc.heightOfString(noticeText, { width: CW - 28 });
    const noticeH = textH + 20;
    L.need(noticeH + 8);

    roundedRect(doc, M, L.y, CW, noticeH, 5, C.brand10, null);
    doc.font(F.reg).fontSize(8.5).fillColor(C.brand)
       .text(noticeText, M + 14, L.y + 10, { width: CW - 28 });
    L.y += noticeH + 10;
  });

  // ── Endorsements ──────────────────────────────────────────────────────────
  const allEnds = schema?.endorsements ?? [];
  if (allEnds.length > 0) {
    L.gap(4);
    doc.font(F.semi).fontSize(11).fillColor(C.tx)
       .text('Included Endorsements', M, L.y);
    L.y += 14;

    allEnds.forEach((e, idx) => {
      const endState   = polChanges?.endorsements ?? {};
      const currentOn  = endState[e.id] !== undefined ? endState[e.id] : e.default;
      const wasChanged = endState[e.id] !== undefined && endState[e.id] !== e.default;

      L.need(e.description ? 46 : 30);

      // Bottom border (except last)
      const isLast = idx === allEnds.length - 1;

      // Row layout: checkbox | title + desc | badge right
      checkbox(doc, M, L.y + 1, currentOn, 11);

      doc.font(F.semi).fontSize(9).fillColor(currentOn ? C.tx : C.sub)
         .text(e.title, M + 17, L.y, { lineBreak: false });

      if (e.price) {
        doc.font(F.reg).fontSize(8).fillColor(C.sub)
           .text(`  ${e.price}`, M + 17 + doc.widthOfString(e.title), L.y + 1, { lineBreak: false });
      }

      // "Included" badge if on
      if (currentOn && !wasChanged) {
        pill(doc, 'Included', PW - M - 58, L.y, C.successBg, C.success, 7);
      } else if (wasChanged) {
        const pillLabel = currentOn ? 'Added' : 'Removed';
        const pillBg    = currentOn ? C.successBg : '#FEE2E2';
        const pillFg    = currentOn ? C.success   : C.removed;
        pill(doc, pillLabel, PW - M - 58, L.y, pillBg, pillFg, 7);
      }

      if (e.description) {
        doc.font(F.reg).fontSize(8).fillColor(C.sub)
           .text(e.description, M + 17, L.y + 13, { width: CW - 80, lineBreak: false });
        L.y += 26;
      } else {
        L.y += 18;
      }

      if (!isLast) {
        doc.moveTo(M, L.y + 2).lineTo(PW - M, L.y + 2)
           .strokeColor(C.border).lineWidth(0.3).stroke();
        L.y += 8;
      }
    });
    L.gap(10);
  }

  // ── Questions by group ────────────────────────────────────────────────────
  const groups = schema?.questionGroups ?? [];
  if (groups.length > 0) {
    groups.forEach(group => {
      const groupQs = (schema.questions ?? []).filter(q => q?.group === group.id);
      if (!groupQs.length) return;

      L.gap(4);
      doc.font(F.semi).fontSize(11).fillColor(C.tx)
         .text(group.label, M, L.y);
      L.y += 14;

      // Group-level notice
      if (group.notice) {
        const nText = group.notice.body;
        const nH    = doc.heightOfString(nText, { width: CW - 28 }) + 20;
        L.need(nH + 8);
        roundedRect(doc, M, L.y, CW, nH, 5, C.brand10, null);
        doc.font(F.reg).fontSize(8.5).fillColor(C.brand)
           .text(nText, M + 14, L.y + 10, { width: CW - 28 });
        L.y += nH + 10;
      }

      groupQs.forEach((q, idx) => {
        const isChecked = (polChanges?.checks ?? {})[q.id] === true;
        const isLast    = idx === groupQs.length - 1;
        const descH     = q.description
          ? doc.heightOfString(q.description, { width: CW - 30 }) : 0;
        const rowH = 18 + (q.description ? descH + 6 : 0);
        L.need(rowH + 10);

        // Checkbox
        checkbox(doc, M, L.y + 1, isChecked, 11);

        // Title — semibold if checked
        doc.font(isChecked ? F.semi : F.reg).fontSize(10)
           .fillColor(isChecked ? C.tx : C.txMid)
           .text(q.title, M + 17, L.y, { width: CW - 17, lineBreak: false });
        L.y += 15;

        // Description
        if (q.description) {
          doc.font(F.reg).fontSize(8.5).fillColor(C.sub)
             .text(q.description, M + 17, L.y, { width: CW - 17 });
          L.y += descH + 4;
        }

        // Divider between questions
        if (!isLast) {
          doc.moveTo(M, L.y + 4).lineTo(PW - M, L.y + 4)
             .strokeColor(C.border).lineWidth(0.3).stroke();
          L.y += 12;
        } else {
          L.y += 4;
        }
      });
      L.gap(8);
    });
  }

  if (polChanges?.notes?.trim()) {
    L.need(50);
    const note  = polChanges.notes.trim();
    const noteH = doc.heightOfString(note, { width: CW - 28 }) + 20;
    roundedRect(doc, M, L.y, CW, noteH, 5, C.bg, null);
    doc.font(F.semi).fontSize(8).fillColor(C.sub)
       .text('NOTES FOR UNDERWRITER', M + 14, L.y + 8, { characterSpacing: 0.4, lineBreak: false });
    doc.font(F.italic).fontSize(9).fillColor(C.txMid)
       .text(note, M + 14, L.y + 20, { width: CW - 28 });
    L.y += noteH + 10;
  }

  // ── Write-in lines + signature area ──────────────────────────────────────
  L.gap(8);
  doc.font(F.semi).fontSize(7).fillColor(C.sub)
     .text('ADDITIONAL NOTES / CORRECTIONS', M, L.y, { characterSpacing: 0.4, lineBreak: false });
  L.y += 12;
  for (let i = 0; i < 2; i++) {
    doc.moveTo(M, L.y).lineTo(PW - M, L.y)
       .strokeColor(C.border).lineWidth(0.4).stroke();
    L.y += 18;
  }

  L.gap(12);

  // Signature line
  doc.font(F.semi).fontSize(7).fillColor(C.sub)
     .text('INSURED SIGNATURE', M, L.y, { characterSpacing: 0.4, lineBreak: false });
  doc.font(F.reg).fontSize(7).fillColor(C.subLight)
     .text('DATE', M + CW * 0.65, L.y, { characterSpacing: 0.4, lineBreak: false });
  L.y += 12;

  // Signature line — longer
  doc.moveTo(M, L.y).lineTo(M + CW * 0.6, L.y)
     .strokeColor(C.borderDark).lineWidth(0.5).stroke();
  // Date line — shorter, right side
  doc.moveTo(M + CW * 0.65, L.y).lineTo(PW - M, L.y)
     .strokeColor(C.borderDark).lineWidth(0.5).stroke();

  L.y += 20;

  // Thin rule between policies
  L.gap(6).rule(C.border);
}

// ─── Audit / eSignature report ────────────────────────────────────────────────

function drawAuditReport(doc, L, client, changes, submittedAt) {
  L.need(60);

  // Section header
  doc.font(F.serifSemi).fontSize(14).fillColor(C.tx)
     .text('Submission Audit Report', M, L.y);
  L.y += 16;

  doc.font(F.reg).fontSize(9).fillColor(C.sub)
     .text(
       'This section confirms the insured completed and submitted this Annual Coverage Review electronically. ' +
       'It serves as a record of the digital submission and constitutes the insured\'s electronic acknowledgment.',
       M, L.y, { width: CW }
     );
  L.y += doc.heightOfString(
    'This section confirms the insured completed and submitted this Annual Coverage Review electronically. ' +
    'It serves as a record of the digital submission and constitutes the insured\'s electronic acknowledgment.',
    { width: CW }
  ) + 12;

  // Audit detail rows
  const auditRows = [
    { label: 'Submitted By',      value: `${client.first_name} ${client.last_name}` },
    { label: 'Account',           value: client.account_name },
    { label: 'Email',             value: client.contact_email },
    { label: 'Submitted At',      value: new Date(submittedAt).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'long'
      })
    },
    { label: 'Policies Reviewed', value: Object.keys(changes?.policies ?? {}).length.toString() },
    { label: 'IP / Session',      value: changes?.sessionId ?? 'Recorded' },
  ];

  const rowH = 22;
  auditRows.forEach((row, i) => {
    L.need(rowH);
    const bg = i % 2 === 0 ? C.bg : C.white;
    doc.rect(M, L.y, CW, rowH).fill(bg);
    doc.font(F.semi).fontSize(8.5).fillColor(C.sub)
       .text(row.label, M + 10, L.y + 6, { width: 130, lineBreak: false });
    doc.font(F.reg).fontSize(8.5).fillColor(C.tx)
       .text(row.value, M + 145, L.y + 6, { width: CW - 155, lineBreak: false });
    L.y += rowH;
  });

  L.gap(12);

  // Per-policy review timestamps
  const polReviews = Object.entries(changes?.policies ?? {})
    .filter(([, p]) => p?.reviewedAt);

  if (polReviews.length > 0) {
    L.need(30);
    doc.font(F.semi).fontSize(9).fillColor(C.sub)
       .text('Policy Review Timestamps', M, L.y, { characterSpacing: 0.3, lineBreak: false });
    L.y += 14;

    polReviews.forEach(([polId, polData]) => {
      L.need(20);
      const ts = new Date(polData.reviewedAt).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
      });
      doc.font(F.semi).fontSize(8).fillColor(C.txMid)
         .text(`Policy ID ${polId}`, M + 6, L.y, { width: 100, lineBreak: false });
      doc.font(F.reg).fontSize(8).fillColor(C.sub)
         .text(ts, M + 110, L.y, { lineBreak: false });
      L.y += 16;
    });
  }

  L.gap(12);

  // eSignature acknowledgment box
  L.need(60);
  const ackText =
    `By submitting this Annual Coverage Review electronically, ${client.first_name} ${client.last_name} ` +
    `acknowledges that the information provided is accurate to the best of their knowledge and authorizes ` +
    `PRA Agency to use this information in connection with the renewal of the policies listed herein.`;
  const ackH = doc.heightOfString(ackText, { width: CW - 28 }) + 24;

  roundedRect(doc, M, L.y, CW, ackH, 6, C.brand10, null);
  doc.rect(M, L.y, 3, ackH).fill(C.brand);

  doc.font(F.semi).fontSize(8).fillColor(C.brand)
     .text('ELECTRONIC ACKNOWLEDGMENT', M + 14, L.y + 8, { characterSpacing: 0.4, lineBreak: false });
  doc.font(F.reg).fontSize(8.5).fillColor(C.tx)
     .text(ackText, M + 14, L.y + 20, { width: CW - 28 });
  L.y += ackH + 10;

  // e-Signature display
  L.need(50);
  const sigDate = new Date(submittedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  doc.font(F.semi).fontSize(7).fillColor(C.sub)
     .text('ELECTRONICALLY SIGNED BY', M, L.y, { characterSpacing: 0.4, lineBreak: false });
  doc.font(F.reg).fontSize(7).fillColor(C.subLight)
     .text('DATE', M + CW * 0.65, L.y, { characterSpacing: 0.4, lineBreak: false });
  L.y += 12;

  // Name as e-signature (italic serif — feels like a signature)
  doc.font(F.serifReg).fontSize(14).fillColor(C.tx)
     .text(`${client.first_name} ${client.last_name}`, M, L.y, { lineBreak: false });
  doc.font(F.reg).fontSize(9).fillColor(C.txMid)
     .text(sigDate, M + CW * 0.65, L.y + 3, { lineBreak: false });
  L.y += 20;

  doc.moveTo(M, L.y).lineTo(M + CW * 0.6, L.y)
     .strokeColor(C.borderDark).lineWidth(0.5).stroke();
  doc.moveTo(M + CW * 0.65, L.y).lineTo(PW - M, L.y)
     .strokeColor(C.borderDark).lineWidth(0.5).stroke();

  L.y += 6;
}

// ─── Document footer note ─────────────────────────────────────────────────────

function drawFooterNote(doc, L) {
  L.need(50);
  L.gap(16);
  doc.moveTo(M, L.y).lineTo(PW - M, L.y)
     .strokeColor(C.border).lineWidth(0.5).stroke();
  L.y += 10;
  doc.font(F.reg).fontSize(8).fillColor(C.subLight)
     .text(
       'This document summarizes your annual coverage review. Final terms are governed by the issued policy ' +
       'forms and carrier agreements. Please contact your agent with any questions.',
       M, L.y, { width: CW, align: 'center' }
     );
}

// ─── Main export ───────────────────────────────────────────────────────────────

/**
 * generateRenewalPDF
 *
 * @param {object} client         — enriched client with policies[].schema
 * @param {object} changes        — { client, policies, submittedAt?, sessionId? }
 * @param {Stream} outputStream   — writable stream
 * @param {object} [options]
 * @param {string} [options.logoPath]      — absolute path to logo PNG
 * @param {boolean} [options.isOnline]     — true = completed online → include audit report
 * @param {string} [options.submittedAt]   — ISO timestamp of submission (required if isOnline)
 */
function generateRenewalPDF(client, changes, outputStream, options = {}) {
  const { logoPath = null, isOnline = false, submittedAt = new Date().toISOString() } = options;

  const doc = new PDFDocument({
    size: 'LETTER',
    margin:        M,
    bufferPages:   true,
    autoFirstPage: true,
    info: {
      Title:   `Annual Coverage Review — ${client.account_name}`,
      Author:  'PRA Agency',
      Subject: 'Annual Coverage Review',
    },
  });

  registerFonts(doc);
  doc.pipe(outputStream);

  const L = new Layout(doc);
  const generated = new Date().toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  drawDocHeader(doc, L, client, generated, logoPath);

  drawClientSection(doc, L, client, changes?.client);
  L.gap(8);

  (client.policies ?? []).forEach(pol => {
    drawPolicy(doc, L, pol, client, changes?.policies?.[String(pol.id)] ?? {}, "PDF DOWNLOAD");
    L.gap(4);
  });

  drawFooterNote(doc, L);

  // Audit report — only appended when completed online
  if (isOnline) {
    L.doc.addPage();
    L.y = M + 24;
    drawAuditReport(doc, L, client, changes, submittedAt);
    addPageNumbers(doc, client);
  } else {
    addPageNumbers(doc, client);
  }

  doc.end();
}

function generateRenewalPDFBuffer(client, changes, options = {}) {
  return new Promise((resolve, reject) => {
    const { logoPath = null, isOnline = false, submittedAt = new Date().toISOString() } = options;

    const doc = new PDFDocument({
      size: 'LETTER',
      margin: M,
      bufferPages: true,
      autoFirstPage: true,
    });

    // 1. Explicitly register fonts for this specific instance
    registerFonts(doc); 

    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', err => reject(err));

    const L = new Layout(doc);
    
    // 2. Ensure a default font/color is set immediately
    doc.font(F.reg).fontSize(10).fillColor(C.tx);

    const generated = new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    drawDocHeader(doc, L, client, generated, logoPath);
    drawClientSection(doc, L, client, changes?.client);
    L.gap(8);

    (client.policies ?? []).forEach(pol => {
      // DEBUG: Verify pol.schema exists here
      if (!pol.schema) {
          console.error(`[Buffer Gen] CRITICAL: Missing schema for policy type ${pol.type}`);
      }
      drawPolicy(doc, L, pol, client, changes?.policies?.[pol.id] ?? {}, "EMAIL PDF");
      L.gap(4);
    });

    drawFooterNote(doc, L);

    if (isOnline) {
      doc.addPage(); // Use doc.addPage() directly to ensure state reset
      L.y = M + 24;
      drawAuditReport(doc, L, client, changes, submittedAt);
    }
    
    addPageNumbers(doc, client);
    doc.end();
  });
}

module.exports = { generateRenewalPDF, generateRenewalPDFBuffer };