import { useMemo } from 'react';
import { X, Printer } from 'lucide-react';
import { getProfile } from '../lib/identity.js';

// ─── Creative confetti cannon ────────────────────────────────────────────────
// Particles burst up-and-out from the top of the certificate, arc, then fall.
// Shapes vary (rect / circle / ribbon / star / triangle); each piece carries
// its own trajectory via CSS custom props consumed by a shared @keyframes.
const PALETTE = ['#2563EB', '#CA8A04', '#F59E0B', '#16a34a', '#7C3AED', '#0891B2', '#DC2626', '#EC4899', '#FACC15'];
const SHAPES = ['rect', 'circle', 'ribbon', 'star', 'tri'];

// deterministic pseudo-random so render is stable
function rng(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }

function useConfetti(n = 54) {
  return useMemo(() => Array.from({ length: n }, (_, i) => {
    const r = (k) => rng(i * 7.13 + k * 3.77);
    const side = i % 2 === 0 ? 1 : -1;            // alternate left/right bias
    const spread = 120 + r(1) * 260;               // horizontal reach
    const shape = SHAPES[i % SHAPES.length];
    const color = PALETTE[Math.floor(r(2) * PALETTE.length)];
    return {
      id: i,
      shape,
      color,
      originX: `${46 + r(8) * 8}%`,                 // burst from near-center top
      dx: `${side * spread * (0.6 + r(3) * 0.8)}px`,
      peak: `${-(120 + r(4) * 180)}px`,             // up at apex
      dy: `${280 + r(5) * 220}px`,                  // down past bottom
      rot: `${(r(6) > 0.5 ? 1 : -1) * (360 + r(6) * 900)}deg`,
      dur: `${(2.1 + r(7) * 1.6).toFixed(2)}s`,
      delay: `${(r(0) * 0.5).toFixed(2)}s`,
      size: 7 + Math.floor(r(9) * 7),
    };
  }), [n]);
}

function ConfettiPiece({ p }) {
  const base = {
    position: 'absolute', top: '8%', left: p.originX,
    ['--dx']: p.dx, ['--peak']: p.peak, ['--dy']: p.dy, ['--rot']: p.rot,
    animation: `confettiArc ${p.dur} cubic-bezier(.25,.6,.4,1) ${p.delay} forwards`,
    willChange: 'transform, opacity',
  };
  if (p.shape === 'star') {
    return (
      <svg style={{ ...base, width: p.size + 4, height: p.size + 4 }} viewBox="0 0 24 24" fill={p.color}>
        <path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.7 6.6L12 16.8 6.3 20.3 8 13.7 2.8 9.3l6.8-.5z" />
      </svg>
    );
  }
  if (p.shape === 'tri') {
    return (
      <svg style={{ ...base, width: p.size + 2, height: p.size + 2 }} viewBox="0 0 24 24" fill={p.color}>
        <path d="M12 3l9 18H3z" />
      </svg>
    );
  }
  const dims =
    p.shape === 'circle' ? { width: p.size, height: p.size, borderRadius: '50%' }
    : p.shape === 'ribbon' ? { width: Math.max(3, p.size - 4), height: p.size + 9, borderRadius: 1 }
    : { width: p.size, height: p.size, borderRadius: 2 };
  return <span style={{ ...base, ...dims, background: p.color }} />;
}

// ─── Corner ornament ─────────────────────────────────────────────────────────
function Corner({ style }) {
  return (
    <svg style={{ position: 'absolute', width: 46, height: 46, ...style }} viewBox="0 0 46 46" fill="none">
      <path d="M3 3 L43 3 L43 7 L7 7 L7 43 L3 43 Z" fill="url(#goldGrad)" opacity="0.7" />
      <path d="M10 10 L21 10 L21 12 L12 12 L12 21 L10 21 Z" fill="url(#goldGrad)" opacity="0.4" />
      <circle cx="6" cy="6" r="1.8" fill="#CA8A04" />
    </svg>
  );
}

// ─── Premium gold wax seal ───────────────────────────────────────────────────
function Seal({ animated }) {
  return (
    <svg width="62" height="62" viewBox="0 0 72 72" fill="none">
      <defs>
        <radialGradient id="sealGold" cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="45%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#9A6B0A" />
        </radialGradient>
      </defs>
      {/* spinning scalloped ring */}
      <g style={animated ? { transformOrigin: '36px 36px', animation: 'sealSpin 16s linear infinite' } : undefined}>
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <circle key={i} cx={36 + Math.cos(a) * 32} cy={36 + Math.sin(a) * 32} r="2.4" fill="#CA8A04" opacity="0.55" />;
        })}
      </g>
      <circle cx="36" cy="36" r="27" fill="url(#sealGold)" />
      <circle cx="36" cy="36" r="27" fill="none" stroke="#7A5408" strokeWidth="0.8" opacity="0.5" />
      <circle cx="36" cy="36" r="21" fill="none" stroke="#FFF8E1" strokeWidth="0.6" opacity="0.5" />
      <text x="36" y="32" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="5.6" fill="#5B3F06" fontWeight="700" letterSpacing="1.4">DSA VIRTUAL</text>
      <text x="36" y="40" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="5.6" fill="#5B3F06" fontWeight="700" letterSpacing="1.4">LABORATORY</text>
      <text x="36" y="50" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="6" fill="#5B3F06">★ SRM ★</text>
    </svg>
  );
}

// ─── Self-contained A4 HTML for the print window ────────────────────────────
function buildPrintHTML(name, expTitle, date) {
  const c = `<svg viewBox="0 0 46 46" fill="none" width="46" height="46"><path d="M3 3 L43 3 L43 7 L7 7 L7 43 L3 43 Z" fill="#CA8A04" opacity="0.7"/><path d="M10 10 L21 10 L21 12 L12 12 L12 21 L10 21 Z" fill="#CA8A04" opacity="0.4"/><circle cx="6" cy="6" r="1.8" fill="#CA8A04"/></svg>`;
  const seal = `<svg width="74" height="74" viewBox="0 0 72 72" fill="none"><defs><radialGradient id="sg" cx="38%" cy="34%" r="70%"><stop offset="0%" stop-color="#FDE68A"/><stop offset="45%" stop-color="#D4A017"/><stop offset="100%" stop-color="#9A6B0A"/></radialGradient></defs>${Array.from({length:24}).map((_,i)=>{const a=(i/24)*Math.PI*2;return `<circle cx="${(36+Math.cos(a)*32).toFixed(1)}" cy="${(36+Math.sin(a)*32).toFixed(1)}" r="2.4" fill="#CA8A04" opacity="0.55"/>`;}).join('')}<circle cx="36" cy="36" r="27" fill="url(#sg)"/><circle cx="36" cy="36" r="21" fill="none" stroke="#FFF8E1" stroke-width="0.6" opacity="0.5"/><text x="36" y="32" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="5.6" fill="#5B3F06" font-weight="700" letter-spacing="1.4">DSA VIRTUAL</text><text x="36" y="40" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="5.6" fill="#5B3F06" font-weight="700" letter-spacing="1.4">LABORATORY</text><text x="36" y="50" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="6" fill="#5B3F06">★ SRM ★</text></svg>`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>${name} — ${expTitle} Certificate</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Cormorant+Garamond:ital,wght@1,600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
@page{size:A4 landscape;margin:0;}
body{display:flex;align-items:center;justify-content:center;width:297mm;height:210mm;background:#fff;font-family:'Space Grotesk',system-ui,sans-serif;}
.cert{width:277mm;height:190mm;background:radial-gradient(120% 120% at 50% 0%,#FFFEF8 0%,#FBF6E9 70%,#F6EFD8 100%);position:relative;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:40px 52px;}
.ob{position:absolute;inset:9px;border:2px solid #CA8A04;border-radius:5px;opacity:.7;pointer-events:none;}
.ib{position:absolute;inset:15px;border:.75px solid #CA8A04;border-radius:3px;opacity:.35;pointer-events:none;}
.c{position:absolute;width:46px;height:46px;}.c-tl{top:18px;left:18px;}.c-tr{top:18px;right:18px;transform:rotate(90deg);}.c-br{bottom:18px;right:18px;transform:rotate(180deg);}.c-bl{bottom:18px;left:18px;transform:rotate(270deg);}
.badge{display:flex;align-items:center;gap:8px;justify-content:center;margin-bottom:8px;}
.icon{width:24px;height:24px;border-radius:5px;background:#2563EB;display:flex;align-items:center;justify-content:center;}
.lab{font-size:10px;font-weight:600;color:#2563EB;letter-spacing:2.5px;text-transform:uppercase;}
.title{font-size:27px;font-weight:700;color:#1E293B;letter-spacing:-.5px;}
.rule{height:2px;width:190px;background:linear-gradient(90deg,transparent,#CA8A04,transparent);margin:9px auto 0;}
.certify{font-size:10px;color:#64748B;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;text-align:center;}
.sname{font-size:40px;font-weight:700;color:#1E293B;letter-spacing:-1px;line-height:1.05;text-align:center;background:linear-gradient(90deg,#1E293B,#92670B,#1E293B);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
.completed{font-size:10px;color:#64748B;margin-top:10px;margin-bottom:4px;text-align:center;}
.exp{font-size:18px;font-weight:600;color:#2563EB;letter-spacing:-.3px;text-align:center;}
.sub{font-size:9px;color:#94A3B8;margin-top:4px;text-align:center;}
.bot{display:flex;align-items:flex-end;justify-content:space-between;width:100%;}
.sig{text-align:center;}.sline{width:120px;height:1px;background:#CBD5E1;margin:5px auto;}
.sn{font-size:11px;font-weight:600;color:#1E293B;}.sr{font-size:8.5px;color:#94A3B8;letter-spacing:.5px;text-transform:uppercase;}.sd{font-size:8px;color:#94A3B8;}
.si{font-size:17px;color:#1E293B;margin-bottom:2px;font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;}
</style></head><body>
<div class="cert">
  <div class="ob"></div><div class="ib"></div>
  <div class="c c-tl">${c}</div><div class="c c-tr">${c}</div><div class="c c-br">${c}</div><div class="c c-bl">${c}</div>
  <div style="text-align:center;z-index:1">
    <div class="badge"><div class="icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div><span class="lab">DSA Virtual Laboratory</span></div>
    <div class="title">Certificate of Completion</div><div class="rule"></div>
  </div>
  <div style="z-index:1">
    <p class="certify">This is to certify that</p>
    <p class="sname">${name}</p>
    <p class="completed">has successfully completed the</p>
    <p class="exp">${expTitle}</p>
    <p class="sub">Experiment &nbsp;·&nbsp; DSA Virtual Lab &nbsp;·&nbsp; School of Computing, SRM Institute of Science and Technology</p>
  </div>
  <div class="bot">
    <div class="sig"><div class="sline"></div><p class="sn">${date}</p><p class="sr">Date of Completion</p></div>
    ${seal}
    <div class="sig"><p class="si">Dr. V. Arun</p><div class="sline"></div><p class="sn">Dr. V. Arun</p><p class="sr">Faculty Mentor</p><p class="sd">Dept. of Computing Technologies</p></div>
  </div>
</div></body></html>`;
}

// ─── shared inline style helper ──────────────────────────────────────────────
const f = (extra) => ({ fontFamily: "'Space Grotesk', Inter, sans-serif", ...extra });
const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function Certificate({ exp, onClose }) {
  const profile = getProfile() || {};
  const name = profile.name || 'Student';
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const confetti = useConfetti(reduceMotion ? 0 : 54);

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=1050,height=760');
    win.document.write(buildPrintHTML(name, exp.title, date));
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 900);
  };

  return (
    <>
      <style>{`
        @keyframes confettiArc {
          0%   { transform: translate3d(0,0,0) rotate(0deg); opacity:1; }
          12%  { opacity:1; }
          55%  { transform: translate3d(calc(var(--dx) * .7), var(--peak), 0) rotate(calc(var(--rot) * .55)); opacity:1; }
          100% { transform: translate3d(var(--dx), var(--dy), 0) rotate(var(--rot)); opacity:0; }
        }
        @keyframes certEnter {
          0%   { opacity:0; transform: perspective(1200px) rotateY(38deg) scale(.78); }
          60%  { transform: perspective(1200px) rotateY(-6deg) scale(1.02); }
          100% { opacity:1; transform: perspective(1200px) rotateY(0deg) scale(1); }
        }
        @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
        @keyframes sealSpin { from { transform:rotate(0deg);} to { transform:rotate(360deg);} }
        @keyframes glowPulse { 0%,100% { opacity:.5; transform:scale(1);} 50% { opacity:.85; transform:scale(1.06);} }
        @keyframes foilSweep {
          0%   { transform: translateX(-130%) skewX(-18deg); }
          60%,100% { transform: translateX(260%) skewX(-18deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cert-anim { animation: none !important; opacity:1 !important; transform:none !important; }
        }
      `}</style>

      <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(15,23,42,0.74)', backdropFilter:'blur(8px)', animation:'overlayIn .3s ease' }}>

        {/* radial spotlight backdrop */}
        <div style={{ position:'absolute', width:680, height:680, borderRadius:'50%', background:'radial-gradient(circle, rgba(202,138,4,0.30) 0%, rgba(37,99,235,0.14) 45%, transparent 70%)', animation: reduceMotion ? undefined : 'glowPulse 4s ease-in-out infinite', pointerEvents:'none' }} />

        {/* confetti cannon */}
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          {confetti.map((p) => <ConfettiPiece key={p.id} p={p} />)}
        </div>

        <div style={{ width:'100%', maxWidth:790, position:'relative', zIndex:1 }}>
          {/* Actions */}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginBottom:12 }}>
            <button onClick={handlePrint} className="btn-primary" style={{ display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
              <Printer size={14} /> Download / Print
            </button>
            <button onClick={onClose} style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.16)', border:'none', cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={18} />
            </button>
          </div>

          {/* Certificate */}
          <div className="cert-anim" style={f({
            background:'radial-gradient(120% 120% at 50% 0%,#FFFEF8 0%,#FBF6E9 68%,#F6EFD8 100%)',
            borderRadius:12, overflow:'hidden',
            boxShadow:'0 0 0 1px rgba(202,138,4,0.25), 0 34px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.6)',
            padding:'34px 46px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', gap:14,
            aspectRatio:'1.414 / 1', position:'relative',
            animation: reduceMotion ? undefined : 'certEnter .8s cubic-bezier(.22,1,.36,1) both',
          })}>
            {/* SVG gold gradient def */}
            <svg width="0" height="0" style={{ position:'absolute' }}><defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE68A" /><stop offset="50%" stopColor="#CA8A04" /><stop offset="100%" stopColor="#9A6B0A" />
              </linearGradient>
            </defs></svg>

            {/* Borders */}
            <div style={{ position:'absolute', inset:11, border:'2px solid #CA8A04', borderRadius:6, opacity:0.7, pointerEvents:'none' }} />
            <div style={{ position:'absolute', inset:17, border:'0.75px solid #CA8A04', borderRadius:3, opacity:0.32, pointerEvents:'none' }} />

            {/* Corners */}
            <Corner style={{ top:20, left:20 }} />
            <Corner style={{ top:20, right:20, transform:'rotate(90deg)' }} />
            <Corner style={{ bottom:20, right:20, transform:'rotate(180deg)' }} />
            <Corner style={{ bottom:20, left:20, transform:'rotate(270deg)' }} />

            {/* Top */}
            <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, justifyContent:'center', marginBottom:7 }}>
                <div style={{ width:22, height:22, borderRadius:5, background:'#2563EB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <span style={f({ fontSize:9, fontWeight:600, color:'#2563EB', letterSpacing:2.5, textTransform:'uppercase' })}>
                  DSA Virtual Laboratory
                </span>
              </div>
              <h2 style={f({ fontSize:23, fontWeight:700, color:'#1E293B', letterSpacing:-0.5, lineHeight:1.1 })}>
                Certificate of Completion
              </h2>
              <div style={{ height:2, width:160, background:'linear-gradient(90deg,transparent,#CA8A04,transparent)', margin:'8px auto 0' }} />
            </div>

            {/* Middle */}
            <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
              <p style={f({ fontSize:9, color:'#64748B', letterSpacing:2, textTransform:'uppercase', marginBottom:7 })}>
                This is to certify that
              </p>
              {/* name with foil shimmer sweep */}
              <div style={{ position:'relative', display:'inline-block', overflow:'hidden' }}>
                <p style={f({ fontSize:32, fontWeight:700, letterSpacing:-1, lineHeight:1.05,
                  background:'linear-gradient(90deg,#1E293B 0%,#92670B 50%,#1E293B 100%)',
                  WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' })}>
                  {name}
                </p>
                {!reduceMotion && (
                  <span style={{ position:'absolute', top:0, left:0, width:'45%', height:'100%',
                    background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)',
                    animation:'foilSweep 2.6s ease-in-out 0.6s infinite', pointerEvents:'none' }} />
                )}
              </div>
              <p style={f({ fontSize:9, color:'#64748B', marginTop:9, marginBottom:3 })}>
                has successfully completed the
              </p>
              <p style={f({ fontSize:15, fontWeight:600, color:'#2563EB', letterSpacing:-0.2 })}>
                {exp.title}
              </p>
              <p style={f({ fontSize:8.5, color:'#94A3B8', marginTop:3 })}>
                Experiment · DSA Virtual Lab · School of Computing, SRM Institute
              </p>
            </div>

            {/* Bottom */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', width:'100%', position:'relative', zIndex:1 }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ width:112, height:1, background:'#CBD5E1', margin:'0 auto 5px' }} />
                <p style={f({ fontSize:11, fontWeight:600, color:'#1E293B' })}>{date}</p>
                <p style={f({ fontSize:8, color:'#94A3B8', letterSpacing:0.5, textTransform:'uppercase' })}>Date of Completion</p>
              </div>

              <Seal animated={!reduceMotion} />

              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:17, color:'#1E293B', marginBottom:2, fontFamily:"'Cormorant Garamond', Georgia, serif", fontStyle:'italic' }}>Dr. V. Arun</p>
                <div style={{ width:112, height:1, background:'#CBD5E1', margin:'0 auto 5px' }} />
                <p style={f({ fontSize:11, fontWeight:600, color:'#1E293B' })}>Dr. V. Arun</p>
                <p style={f({ fontSize:8, color:'#94A3B8', letterSpacing:0.5, textTransform:'uppercase' })}>Faculty Mentor</p>
                <p style={f({ fontSize:7.5, color:'#94A3B8' })}>Dept. of Computing Technologies</p>
              </div>
            </div>
          </div>

          <p style={f({ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:10 })}>
            Opens a print dialog — choose "Save as PDF" to download
          </p>
        </div>
      </div>
    </>
  );
}
