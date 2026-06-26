import { X, Printer } from 'lucide-react';
import { getProfile } from '../lib/identity.js';

// Corner ornament — rotated via CSS for each corner
function Corner({ style }) {
  return (
    <svg style={{ position: 'absolute', width: 44, height: 44, ...style }} viewBox="0 0 44 44" fill="none">
      <path d="M3 3 L41 3 L41 7 L7 7 L7 41 L3 41 Z" fill="#B8860B" opacity="0.55" />
      <path d="M9 9 L19 9 L19 11 L11 11 L11 19 L9 19 Z" fill="#B8860B" opacity="0.3" />
      <circle cx="6" cy="6" r="1.5" fill="#B8860B" opacity="0.55" />
    </svg>
  );
}

// Self-contained A4 HTML for the print/download window
function buildPrintHTML(name, expTitle, date) {
  const cornerSVG = `<svg viewBox="0 0 44 44" fill="none" width="44" height="44"><path d="M3 3 L41 3 L41 7 L7 7 L7 41 L3 41 Z" fill="#B8860B" opacity="0.55"/><path d="M9 9 L19 9 L19 11 L11 11 L11 19 L9 19 Z" fill="#B8860B" opacity="0.3"/><circle cx="6" cy="6" r="1.5" fill="#B8860B" opacity="0.55"/></svg>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${name} — ${expTitle} Certificate</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  @page{size:A4 landscape;margin:0;}
  body{display:flex;align-items:center;justify-content:center;width:297mm;height:210mm;background:#fff;font-family:'Space Grotesk',system-ui,sans-serif;}
  .cert{width:277mm;height:190mm;background:#FFFDF5;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:40px 52px;}
  .ob{position:absolute;inset:10px;border:1.5px solid #B8860B;border-radius:4px;opacity:.55;pointer-events:none;}
  .ib{position:absolute;inset:16px;border:.5px solid #B8860B;border-radius:2px;opacity:.25;pointer-events:none;}
  .c{position:absolute;width:44px;height:44px;}
  .c-tl{top:20px;left:20px;}
  .c-tr{top:20px;right:20px;transform:rotate(90deg);}
  .c-br{bottom:20px;right:20px;transform:rotate(180deg);}
  .c-bl{bottom:20px;left:20px;transform:rotate(270deg);}
  .top{text-align:center;z-index:1;}
  .badge{display:flex;align-items:center;gap:8px;justify-content:center;margin-bottom:8px;}
  .icon{width:24px;height:24px;border-radius:5px;background:#2563EB;display:flex;align-items:center;justify-content:center;}
  .lab{font-size:10px;font-weight:600;color:#2563EB;letter-spacing:2px;text-transform:uppercase;}
  .title{font-size:26px;font-weight:700;color:#1E293B;letter-spacing:-.5px;}
  .rule{height:1px;width:170px;background:linear-gradient(90deg,transparent,#B8860B,transparent);margin:9px auto 0;}
  .mid{text-align:center;z-index:1;}
  .certify{font-size:10px;color:#64748B;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:7px;}
  .sname{font-size:34px;font-weight:700;color:#1E293B;letter-spacing:-1px;line-height:1.1;}
  .completed{font-size:10px;color:#64748B;margin-top:9px;margin-bottom:4px;}
  .exp{font-size:17px;font-weight:600;color:#2563EB;letter-spacing:-.3px;}
  .sub{font-size:9px;color:#94A3B8;margin-top:3px;}
  .bot{display:flex;align-items:flex-end;justify-content:space-between;width:100%;z-index:1;}
  .sig{text-align:center;}
  .sline{width:118px;height:1px;background:#CBD5E1;margin:5px auto;}
  .sn{font-size:11px;font-weight:600;color:#1E293B;}
  .sr{font-size:8.5px;color:#94A3B8;letter-spacing:.5px;text-transform:uppercase;}
  .sd{font-size:8px;color:#94A3B8;}
  .si{font-size:13px;font-style:italic;color:#1E293B;margin-bottom:2px;font-family:Georgia,serif;}
</style>
</head>
<body>
<div class="cert">
  <div class="ob"></div><div class="ib"></div>
  <div class="c c-tl">${cornerSVG}</div>
  <div class="c c-tr">${cornerSVG}</div>
  <div class="c c-br">${cornerSVG}</div>
  <div class="c c-bl">${cornerSVG}</div>

  <div class="top">
    <div class="badge">
      <div class="icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
      </div>
      <span class="lab">DSA Virtual Laboratory</span>
    </div>
    <div class="title">Certificate of Completion</div>
    <div class="rule"></div>
  </div>

  <div class="mid">
    <p class="certify">This is to certify that</p>
    <p class="sname">${name}</p>
    <p class="completed">has successfully completed the</p>
    <p class="exp">${expTitle}</p>
    <p class="sub">Experiment &nbsp;·&nbsp; DSA Virtual Lab &nbsp;·&nbsp; School of Computing, SRM Institute of Science and Technology</p>
  </div>

  <div class="bot">
    <div class="sig">
      <div class="sline"></div>
      <p class="sn">${date}</p>
      <p class="sr">Date of Completion</p>
    </div>

    <svg width="66" height="66" viewBox="0 0 66 66" fill="none">
      <circle cx="33" cy="33" r="31" stroke="#2563EB" stroke-width="1.5" opacity=".22"/>
      <circle cx="33" cy="33" r="26" stroke="#2563EB" stroke-width=".5" opacity=".18"/>
      <circle cx="33" cy="33" r="21" fill="#2563EB" opacity=".06"/>
      <text x="33" y="30" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="5.5" fill="#2563EB" opacity=".65" font-weight="600" letter-spacing="1.5">DSA VIRTUAL</text>
      <text x="33" y="38" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="5.5" fill="#2563EB" opacity=".65" font-weight="600" letter-spacing="1.5">LABORATORY</text>
      <text x="33" y="47" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="5" fill="#B8860B" opacity=".7">✦ SRM ✦</text>
    </svg>

    <div class="sig">
      <p class="si">Dr. V. Arun</p>
      <div class="sline"></div>
      <p class="sn">Dr. V. Arun</p>
      <p class="sr">Faculty Mentor</p>
      <p class="sd">Dept. of Computing Technologies</p>
    </div>
  </div>
</div>
</body>
</html>`;
}

const S = {
  border1: { position: 'absolute', inset: 12, border: '1.5px solid #B8860B', borderRadius: 4, opacity: 0.55, pointerEvents: 'none' },
  border2: { position: 'absolute', inset: 18, border: '0.5px solid #B8860B', borderRadius: 2, opacity: 0.25, pointerEvents: 'none' },
  f: (extra) => ({ fontFamily: "'Space Grotesk', Inter, sans-serif", ...extra }),
};

export default function Certificate({ exp, onClose }) {
  const profile = getProfile() || {};
  const name = profile.name || 'Student';
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=1050,height=760');
    win.document.write(buildPrintHTML(name, exp.title, date));
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 900);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(6px)' }}>
      <div style={{ width: '100%', maxWidth: 780 }}>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 12 }}>
          <button onClick={handlePrint} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Printer size={14} /> Download / Print
          </button>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Preview */}
        <div style={S.f({ background: '#FFFDF5', borderRadius: 10, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', padding: '32px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 14, aspectRatio: '1.414 / 1', position: 'relative' })}>
          <div style={S.border1} />
          <div style={S.border2} />

          {/* Corner ornaments */}
          <Corner style={{ top: 22, left: 22 }} />
          <Corner style={{ top: 22, right: 22, transform: 'rotate(90deg)' }} />
          <Corner style={{ bottom: 22, right: 22, transform: 'rotate(180deg)' }} />
          <Corner style={{ bottom: 22, left: 22, transform: 'rotate(270deg)' }} />

          {/* Top */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', marginBottom: 7 }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <span style={S.f({ fontSize: 9, fontWeight: 600, color: '#2563EB', letterSpacing: 2, textTransform: 'uppercase' })}>
                DSA Virtual Laboratory
              </span>
            </div>
            <h2 style={S.f({ fontSize: 22, fontWeight: 700, color: '#1E293B', letterSpacing: -0.5, lineHeight: 1.1 })}>
              Certificate of Completion
            </h2>
            <div style={{ height: 1, width: 140, background: 'linear-gradient(90deg,transparent,#B8860B,transparent)', margin: '8px auto 0' }} />
          </div>

          {/* Middle */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <p style={S.f({ fontSize: 9, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 })}>
              This is to certify that
            </p>
            <p style={S.f({ fontSize: 28, fontWeight: 700, color: '#1E293B', letterSpacing: -1, lineHeight: 1.1 })}>
              {name}
            </p>
            <p style={S.f({ fontSize: 9, color: '#64748B', marginTop: 8, marginBottom: 3 })}>
              has successfully completed the
            </p>
            <p style={S.f({ fontSize: 14, fontWeight: 600, color: '#2563EB', letterSpacing: -0.2 })}>
              {exp.title}
            </p>
            <p style={S.f({ fontSize: 8.5, color: '#94A3B8', marginTop: 2 })}>
              Experiment · DSA Virtual Lab · School of Computing, SRM Institute
            </p>
          </div>

          {/* Bottom */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', position: 'relative', zIndex: 1 }}>
            {/* Date */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 110, height: 1, background: '#CBD5E1', margin: '0 auto 5px' }} />
              <p style={S.f({ fontSize: 11, fontWeight: 600, color: '#1E293B' })}>{date}</p>
              <p style={S.f({ fontSize: 8, color: '#94A3B8', letterSpacing: 0.5, textTransform: 'uppercase' })}>Date of Completion</p>
            </div>

            {/* Seal */}
            <svg width="58" height="58" viewBox="0 0 66 66" fill="none">
              <circle cx="33" cy="33" r="31" stroke="#2563EB" strokeWidth="1.5" opacity=".22" />
              <circle cx="33" cy="33" r="26" stroke="#2563EB" strokeWidth=".5" opacity=".18" />
              <circle cx="33" cy="33" r="21" fill="#2563EB" opacity=".06" />
              <text x="33" y="30" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="5.5" fill="#2563EB" opacity=".65" fontWeight="600" letterSpacing="1.5">DSA VIRTUAL</text>
              <text x="33" y="38" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="5.5" fill="#2563EB" opacity=".65" fontWeight="600" letterSpacing="1.5">LABORATORY</text>
              <text x="33" y="47" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="5" fill="#B8860B" opacity=".7">✦ SRM ✦</text>
            </svg>

            {/* Signature */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontStyle: 'italic', color: '#1E293B', marginBottom: 2, fontFamily: 'Georgia, serif' }}>Dr. V. Arun</p>
              <div style={{ width: 110, height: 1, background: '#CBD5E1', margin: '0 auto 5px' }} />
              <p style={S.f({ fontSize: 11, fontWeight: 600, color: '#1E293B' })}>Dr. V. Arun</p>
              <p style={S.f({ fontSize: 8, color: '#94A3B8', letterSpacing: 0.5, textTransform: 'uppercase' })}>Faculty Mentor</p>
              <p style={S.f({ fontSize: 7.5, color: '#94A3B8' })}>Dept. of Computing Technologies</p>
            </div>
          </div>
        </div>

        <p style={S.f({ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 10 })}>
          Opens a print dialog — choose "Save as PDF" to download
        </p>
      </div>
    </div>
  );
}
