import { useMemo, useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import { getProfile } from '../lib/identity.js';

// Bundled celebration chime (Mixkit "achievement bell", free license).
function playCelebration() {
  try {
    const audio = new Audio('/sounds/celebrate.mp3');
    audio.volume = 0.55;
    audio.play().catch(() => {});
  } catch { /* no audio — silent */ }
}

// ─── Creative confetti cannon (violet/blue festive palette) ──────────────────
const PALETTE = ['#8B5CF6', '#6366F1', '#3B82F6', '#A78BFA', '#22D3EE', '#E879F9', '#F0ABFC', '#FFFFFF', '#C4B5FD'];
const SHAPES = ['rect', 'circle', 'ribbon', 'star', 'tri'];
function rng(seed) { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }

function useConfetti(n = 54) {
  return useMemo(() => Array.from({ length: n }, (_, i) => {
    const r = (k) => rng(i * 7.13 + k * 3.77);
    const side = i % 2 === 0 ? 1 : -1;
    const spread = 120 + r(1) * 260;
    return {
      id: i,
      shape: SHAPES[i % SHAPES.length],
      color: PALETTE[Math.floor(r(2) * PALETTE.length)],
      originX: `${46 + r(8) * 8}%`,
      dx: `${side * spread * (0.6 + r(3) * 0.8)}px`,
      peak: `${-(120 + r(4) * 180)}px`,
      dy: `${280 + r(5) * 220}px`,
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
  if (p.shape === 'star')
    return <svg style={{ ...base, width: p.size + 4, height: p.size + 4 }} viewBox="0 0 24 24" fill={p.color}><path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.7 6.6L12 16.8 6.3 20.3 8 13.7 2.8 9.3l6.8-.5z" /></svg>;
  if (p.shape === 'tri')
    return <svg style={{ ...base, width: p.size + 2, height: p.size + 2 }} viewBox="0 0 24 24" fill={p.color}><path d="M12 3l9 18H3z" /></svg>;
  const dims =
    p.shape === 'circle' ? { width: p.size, height: p.size, borderRadius: '50%' }
    : p.shape === 'ribbon' ? { width: Math.max(3, p.size - 4), height: p.size + 9, borderRadius: 1 }
    : { width: p.size, height: p.size, borderRadius: 2 };
  return <span style={{ ...base, ...dims, background: p.color }} />;
}

// ─── Glowing shield badge (graduation cap) ───────────────────────────────────
function ShieldBadge({ size = 86 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="shieldG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A78BFA" /><stop offset="55%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <radialGradient id="shieldGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.5" /><stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="48" r="44" fill="url(#shieldGlow)" />
      <path d="M50 12 L80 24 V52 C80 70 66 82 50 88 C34 82 20 70 20 52 V24 Z" fill="url(#shieldG)" stroke="#C4B5FD" strokeWidth="1" strokeOpacity="0.5" />
      <path d="M50 18 L74 28 V52 C74 66 63 76 50 81 C37 76 26 66 26 52 V28 Z" fill="none" stroke="#E9D5FF" strokeWidth="0.7" strokeOpacity="0.35" />
      {/* graduation cap */}
      <g transform="translate(50,50)" fill="#F5F3FF">
        <path d="M0 -14 L18 -6 L0 2 L-18 -6 Z" />
        <path d="M-12 -2 V8 C-12 13 12 13 12 8 V-2 L0 4 Z" opacity="0.95" />
        <circle cx="17" cy="-6" r="1.6" /><path d="M17 -6 V6" stroke="#F5F3FF" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

// ─── Concentric-ring medallion seal (circular text) ──────────────────────────
function Seal({ animated, idSuffix = 'm' }) {
  const pathId = `sealRing-${idSuffix}`;
  return (
    <svg width="118" height="118" viewBox="0 0 120 120" fill="none">
      <defs>
        <path id={pathId} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        <radialGradient id={`sealCore-${idSuffix}`} cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#3B2A6B" /><stop offset="100%" stopColor="#1A1340" />
        </radialGradient>
      </defs>
      {/* rotating outer ring + text */}
      <g style={animated ? { transformOrigin: '60px 60px', animation: 'sealSpin 22s linear infinite' } : undefined}>
        <circle cx="60" cy="60" r="56" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.5" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="#8B5CF6" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 3" />
        <text fontFamily="Space Grotesk, sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="2.6" fill="#C4B5FD">
          <textPath href={`#${pathId}`} startOffset="0%">DSA · VIRTUAL · LABORATORY · SRMIST · </textPath>
        </text>
      </g>
      {/* core */}
      <circle cx="60" cy="60" r="36" fill={`url(#sealCore-${idSuffix})`} stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.6" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.4" />
      <g transform="translate(60,58)" fill="#E9D5FF">
        <path d="M0 -12 L15 -5 L0 2 L-15 -5 Z" />
        <path d="M-10 -2 V7 C-10 11 10 11 10 7 V-2 L0 3 Z" opacity="0.9" />
      </g>
      <text x="60" y="84" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="6" fill="#A78BFA" letterSpacing="1.5">CERTIFIED</text>
    </svg>
  );
}

// ─── Self-contained dark A4 HTML for the print window ────────────────────────
function buildPrintHTML(name, expTitle, date) {
  const shield = `<svg width="84" height="84" viewBox="0 0 100 100" fill="none"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#A78BFA"/><stop offset="55%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#4C1D95"/></linearGradient></defs><path d="M50 12 L80 24 V52 C80 70 66 82 50 88 C34 82 20 70 20 52 V24 Z" fill="url(#sg)" stroke="#C4B5FD" stroke-width="1" stroke-opacity="0.5"/><path d="M50 18 L74 28 V52 C74 66 63 76 50 81 C37 76 26 66 26 52 V28 Z" fill="none" stroke="#E9D5FF" stroke-width="0.7" stroke-opacity="0.35"/><g transform="translate(50,50)" fill="#F5F3FF"><path d="M0 -14 L18 -6 L0 2 L-18 -6 Z"/><path d="M-12 -2 V8 C-12 13 12 13 12 8 V-2 L0 4 Z" opacity="0.95"/></g></svg>`;
  const seal = `<svg width="118" height="118" viewBox="0 0 120 120" fill="none"><defs><path id="sr" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/><radialGradient id="sc" cx="42%" cy="38%" r="65%"><stop offset="0%" stop-color="#3B2A6B"/><stop offset="100%" stop-color="#1A1340"/></radialGradient></defs><circle cx="60" cy="60" r="56" fill="none" stroke="#8B5CF6" stroke-width="1" stroke-opacity="0.5"/><circle cx="60" cy="60" r="50" fill="none" stroke="#8B5CF6" stroke-width="0.5" stroke-opacity="0.3" stroke-dasharray="2 3"/><text font-family="Space Grotesk,sans-serif" font-size="7.5" font-weight="600" letter-spacing="2.6" fill="#C4B5FD"><textPath href="#sr" startOffset="0%">DSA · VIRTUAL · LABORATORY · SRMIST · </textPath></text><circle cx="60" cy="60" r="36" fill="url(#sc)" stroke="#7C3AED" stroke-width="1" stroke-opacity="0.6"/><circle cx="60" cy="60" r="30" fill="none" stroke="#A78BFA" stroke-width="0.5" stroke-opacity="0.4"/><g transform="translate(60,58)" fill="#E9D5FF"><path d="M0 -12 L15 -5 L0 2 L-15 -5 Z"/><path d="M-10 -2 V7 C-10 11 10 11 10 7 V-2 L0 3 Z" opacity="0.9"/></g><text x="60" y="84" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="6" fill="#A78BFA" letter-spacing="1.5">CERTIFIED</text></svg>`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>${name} — ${expTitle} Certificate</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
@page{size:A4 landscape;margin:0;}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{display:flex;align-items:center;justify-content:center;width:297mm;height:210mm;background:#0B0820;font-family:'Space Grotesk',system-ui,sans-serif;}
.cert{width:281mm;height:194mm;position:relative;overflow:hidden;border-radius:6px;padding:3px;background:linear-gradient(135deg,#A855F7,#6366F1 40%,#7C3AED);}
.inner{position:relative;width:100%;height:100%;border-radius:4px;overflow:hidden;background:radial-gradient(120% 90% at 80% 30%,#3B1A6E 0%,#1A1140 45%,#0C0826 100%);padding:46px 54px;}
.glow{position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.35),transparent 70%);top:-120px;right:-80px;pointer-events:none;}
.date{font-size:10px;letter-spacing:2px;color:#A5B4FC;text-transform:uppercase;}
.title{font-size:30px;font-weight:700;color:#F8FAFC;letter-spacing:1px;text-transform:uppercase;margin-top:26px;}
.titleline{width:64px;height:3px;border-radius:2px;background:linear-gradient(90deg,#A855F7,#6366F1);margin-top:10px;}
.ack{font-size:11px;color:#94A3B8;margin-top:26px;}
.name{font-family:'Cormorant Garamond',Georgia,serif;font-size:54px;font-weight:600;color:#fff;line-height:1;margin-top:6px;}
.has{font-size:11px;color:#94A3B8;margin-top:18px;}
.exp{font-size:20px;font-weight:600;color:#C4B5FD;margin-top:5px;}
.offered{font-size:11px;color:#94A3B8;margin-top:4px;}
.body{font-size:9.5px;line-height:1.7;color:#7C8BB0;max-width:430px;margin-top:18px;}
.shield{position:absolute;top:42px;right:54px;}
.seal{position:absolute;top:150px;right:64px;}
.bot{position:absolute;left:54px;right:54px;bottom:42px;display:flex;align-items:flex-end;justify-content:space-between;}
.sig{}.sigmark{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;color:#E9D5FF;}
.sline{width:150px;height:1px;background:#5B6488;margin:4px 0 6px;}
.sn{font-size:12px;font-weight:600;color:#F1F5F9;}.sr{font-size:8.5px;color:#94A3B8;letter-spacing:.5px;text-transform:uppercase;}
.brand{display:flex;align-items:center;gap:8px;}
.brandico{width:30px;height:30px;border-radius:7px;background:linear-gradient(135deg,#7C3AED,#3B82F6);display:flex;align-items:center;justify-content:center;}
.brandtx{line-height:1.1;}.brandtx b{font-size:12px;color:#F8FAFC;letter-spacing:1px;}.brandtx span{display:block;font-size:7px;color:#A5B4FC;letter-spacing:2px;}
</style></head><body>
<div class="cert"><div class="inner">
  <div class="glow"></div>
  <div class="date">Date: ${date}</div>
  <div class="title">Certificate of Completion</div>
  <div class="titleline"></div>
  <div class="ack">This acknowledges that</div>
  <div class="name">${name}</div>
  <div class="has">has successfully completed the</div>
  <div class="exp">${expTitle} — Experiment</div>
  <div class="offered">in the DSA Virtual Laboratory, School of Computing · SRMIST</div>
  <div class="body">This certifies hands-on completion of the experiment — covering core theory, interactive visualization, and live coding challenges graded against test cases — within the DSA Virtual Lab.</div>
  <div class="shield">${shield}</div>
  <div class="seal">${seal}</div>
  <div class="bot">
    <div class="sig"><div class="sigmark">Dr. V. Arun</div><div class="sline"></div><div class="sn">Dr. V. Arun</div><div class="sr">Faculty Mentor · Dept. of Computing Technologies</div></div>
    <div class="brand"><div class="brandico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div><div class="brandtx"><b>DSA LAB</b><span>VIRTUAL LABORATORY</span></div></div>
  </div>
</div></div></body></html>`;
}

const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function Certificate({ exp, onClose }) {
  const profile = getProfile() || {};
  const name = profile.name || 'Student';
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const confetti = useConfetti(reduceMotion ? 0 : 54);

  useEffect(() => { playCelebration(); }, []);

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=1080,height=780');
    win.document.write(buildPrintHTML(name, exp.title, date));
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 900);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&display=swap');
        @keyframes confettiArc {
          0%   { transform: translate3d(0,0,0) rotate(0deg); opacity:1; }
          12%  { opacity:1; }
          55%  { transform: translate3d(calc(var(--dx) * .7), var(--peak), 0) rotate(calc(var(--rot) * .55)); opacity:1; }
          100% { transform: translate3d(var(--dx), var(--dy), 0) rotate(var(--rot)); opacity:0; }
        }
        @keyframes certEnter {
          0%   { opacity:0; transform: perspective(1200px) rotateY(34deg) scale(.8); }
          60%  { transform: perspective(1200px) rotateY(-5deg) scale(1.02); }
          100% { opacity:1; transform: perspective(1200px) rotateY(0deg) scale(1); }
        }
        @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
        @keyframes sealSpin { from { transform:rotate(0deg);} to { transform:rotate(360deg);} }
        @keyframes glowPulse { 0%,100% { opacity:.5; transform:scale(1);} 50% { opacity:.9; transform:scale(1.08);} }
        @keyframes foilSweep { 0% { transform: translateX(-130%) skewX(-18deg);} 60%,100% { transform: translateX(260%) skewX(-18deg);} }
      `}</style>

      <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(6,4,18,0.82)', backdropFilter:'blur(8px)', animation:'overlayIn .3s ease' }}>

        {/* violet spotlight */}
        <div style={{ position:'absolute', width:720, height:720, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(59,130,246,0.14) 45%, transparent 70%)', animation: reduceMotion ? undefined : 'glowPulse 4s ease-in-out infinite', pointerEvents:'none' }} />

        {/* confetti */}
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          {confetti.map((p) => <ConfettiPiece key={p.id} p={p} />)}
        </div>

        <div style={{ width:'100%', maxWidth:820, position:'relative', zIndex:1 }}>
          {/* Actions */}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginBottom:12 }}>
            <button onClick={handlePrint} className="btn-primary" style={{ display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
              <Printer size={14} /> Download / Print
            </button>
            <button onClick={onClose} style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.14)', border:'none', cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={18} />
            </button>
          </div>

          {/* Certificate — dark, left-aligned, violet */}
          <div style={{
            borderRadius:14, padding:3,
            background:'linear-gradient(135deg,#A855F7,#6366F1 42%,#7C3AED)',
            boxShadow:'0 0 60px rgba(124,58,237,0.45), 0 30px 70px rgba(0,0,0,0.6)',
            animation: reduceMotion ? undefined : 'certEnter .8s cubic-bezier(.22,1,.36,1) both',
          }}>
            <div style={{
              position:'relative', overflow:'hidden', borderRadius:11,
              aspectRatio:'1.45 / 1',
              background:'radial-gradient(120% 90% at 80% 30%, #3B1A6E 0%, #1A1140 45%, #0C0826 100%)',
              padding:'34px 40px', fontFamily:"'Space Grotesk', Inter, sans-serif",
            }}>
              {/* corner glow */}
              <div style={{ position:'absolute', width:360, height:360, borderRadius:'50%', top:-130, right:-90, background:'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)', pointerEvents:'none' }} />

              {/* Shield badge top-right */}
              <div style={{ position:'absolute', top:30, right:38, zIndex:2 }}><ShieldBadge /></div>
              {/* Seal medallion mid-right */}
              <div style={{ position:'absolute', top:'42%', right:50, zIndex:1, opacity:0.96 }}><Seal animated={!reduceMotion} /></div>

              {/* Left text column */}
              <div style={{ position:'relative', zIndex:2, maxWidth:'64%' }}>
                <p style={{ fontSize:10, letterSpacing:2, color:'#A5B4FC', textTransform:'uppercase' }}>Date: {date}</p>
                <h2 style={{ fontSize:25, fontWeight:700, color:'#F8FAFC', letterSpacing:1, textTransform:'uppercase', marginTop:18 }}>Certificate of Completion</h2>
                <div style={{ width:56, height:3, borderRadius:2, background:'linear-gradient(90deg,#A855F7,#6366F1)', marginTop:9 }} />

                <p style={{ fontSize:11, color:'#94A3B8', marginTop:20 }}>This acknowledges that</p>
                {/* name with foil shimmer */}
                <div style={{ position:'relative', display:'inline-block', overflow:'hidden', marginTop:3 }}>
                  <p style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:46, fontWeight:600, color:'#fff', lineHeight:1 }}>{name}</p>
                  {!reduceMotion && (
                    <span style={{ position:'absolute', top:0, left:0, width:'45%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)', animation:'foilSweep 2.8s ease-in-out 0.7s infinite', pointerEvents:'none' }} />
                  )}
                </div>

                <p style={{ fontSize:11, color:'#94A3B8', marginTop:16 }}>has successfully completed the</p>
                <p style={{ fontSize:17, fontWeight:600, color:'#C4B5FD', marginTop:4 }}>{exp.title} — Experiment</p>
                <p style={{ fontSize:10, color:'#94A3B8', marginTop:3 }}>in the DSA Virtual Laboratory, School of Computing · SRMIST</p>

                <p style={{ fontSize:9, lineHeight:1.7, color:'#7C8BB0', maxWidth:380, marginTop:14 }}>
                  This certifies hands-on completion of the experiment — covering core theory, interactive
                  visualization, and live coding challenges graded against test cases — in the DSA Virtual Lab.
                </p>
              </div>

              {/* Bottom: signature + brand */}
              <div style={{ position:'absolute', left:40, right:40, bottom:30, display:'flex', alignItems:'flex-end', justifyContent:'space-between', zIndex:2 }}>
                <div>
                  <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:20, color:'#E9D5FF' }}>Dr. V. Arun</p>
                  <div style={{ width:148, height:1, background:'#5B6488', margin:'4px 0 6px' }} />
                  <p style={{ fontSize:12, fontWeight:600, color:'#F1F5F9' }}>Dr. V. Arun</p>
                  <p style={{ fontSize:8, color:'#94A3B8', letterSpacing:0.5, textTransform:'uppercase' }}>Faculty Mentor · Dept. of Computing Technologies</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:30, height:30, borderRadius:7, background:'linear-gradient(135deg,#7C3AED,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </span>
                  <div style={{ lineHeight:1.1 }}>
                    <b style={{ fontSize:12, color:'#F8FAFC', letterSpacing:1 }}>DSA LAB</b>
                    <span style={{ display:'block', fontSize:7, color:'#A5B4FC', letterSpacing:2 }}>VIRTUAL LABORATORY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:10, fontFamily:"'Space Grotesk', Inter, sans-serif" }}>
            Opens a print dialog — choose "Save as PDF" to download
          </p>
        </div>
      </div>
    </>
  );
}
