"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Category = "步枪" | "冲锋枪" | "手枪" | "重型" | "狙击枪";
type Weapon = {
  id: string;
  name: string;
  category: Category;
  ammo: number;
  rpm: number;
  auto: boolean;
  kick: number;
  side: number;
  curve: number;
  seed: number;
  pellets?: number;
  scoped?: boolean;
  shape: "ak" | "m4" | "bullpup" | "smg" | "pistol" | "revolver" | "shotgun" | "lmg" | "sniper";
};

const WEAPONS: Weapon[] = [
  { id: "ak47", name: "AK-47", category: "步枪", ammo: 30, rpm: 600, auto: true, kick: 1.22, side: .9, curve: .86, seed: 13, shape: "ak" },
  { id: "m4a4", name: "M4A4", category: "步枪", ammo: 30, rpm: 666, auto: true, kick: 1.02, side: .7, curve: .64, seed: 17, shape: "m4" },
  { id: "m4a1s", name: "M4A1-S", category: "步枪", ammo: 20, rpm: 600, auto: true, kick: .89, side: .54, curve: .52, seed: 23, shape: "m4" },
  { id: "galil", name: "Galil AR", category: "步枪", ammo: 35, rpm: 666, auto: true, kick: 1.08, side: .82, curve: .72, seed: 29, shape: "ak" },
  { id: "famas", name: "FAMAS", category: "步枪", ammo: 25, rpm: 666, auto: true, kick: 1.01, side: .66, curve: .62, seed: 31, shape: "bullpup" },
  { id: "aug", name: "AUG", category: "步枪", ammo: 30, rpm: 600, auto: true, kick: .92, side: .58, curve: .56, seed: 37, scoped: true, shape: "bullpup" },
  { id: "sg553", name: "SG 553", category: "步枪", ammo: 30, rpm: 545, auto: true, kick: 1.1, side: .72, curve: .7, seed: 41, scoped: true, shape: "ak" },
  { id: "mac10", name: "MAC-10", category: "冲锋枪", ammo: 30, rpm: 800, auto: true, kick: .72, side: .88, curve: .82, seed: 43, shape: "smg" },
  { id: "mp9", name: "MP9", category: "冲锋枪", ammo: 30, rpm: 857, auto: true, kick: .68, side: .72, curve: .7, seed: 47, shape: "smg" },
  { id: "mp7", name: "MP7", category: "冲锋枪", ammo: 30, rpm: 750, auto: true, kick: .66, side: .62, curve: .58, seed: 53, shape: "smg" },
  { id: "mp5sd", name: "MP5-SD", category: "冲锋枪", ammo: 30, rpm: 750, auto: true, kick: .61, side: .57, curve: .54, seed: 59, shape: "smg" },
  { id: "ump45", name: "UMP-45", category: "冲锋枪", ammo: 25, rpm: 666, auto: true, kick: .82, side: .66, curve: .62, seed: 61, shape: "smg" },
  { id: "p90", name: "P90", category: "冲锋枪", ammo: 50, rpm: 857, auto: true, kick: .6, side: .72, curve: .78, seed: 67, shape: "bullpup" },
  { id: "bizon", name: "PP-Bizon", category: "冲锋枪", ammo: 64, rpm: 750, auto: true, kick: .57, side: .7, curve: .73, seed: 71, shape: "smg" },
  { id: "glock", name: "Glock-18", category: "手枪", ammo: 20, rpm: 400, auto: false, kick: .72, side: .42, curve: .38, seed: 73, shape: "pistol" },
  { id: "usp", name: "USP-S", category: "手枪", ammo: 12, rpm: 352, auto: false, kick: .66, side: .32, curve: .3, seed: 79, shape: "pistol" },
  { id: "p2000", name: "P2000", category: "手枪", ammo: 13, rpm: 352, auto: false, kick: .68, side: .34, curve: .33, seed: 83, shape: "pistol" },
  { id: "elite", name: "Dual Berettas", category: "手枪", ammo: 30, rpm: 500, auto: false, kick: .55, side: .45, curve: .42, seed: 89, shape: "pistol" },
  { id: "p250", name: "P250", category: "手枪", ammo: 13, rpm: 400, auto: false, kick: .77, side: .42, curve: .4, seed: 97, shape: "pistol" },
  { id: "fiveseven", name: "Five-SeveN", category: "手枪", ammo: 20, rpm: 400, auto: false, kick: .72, side: .39, curve: .36, seed: 101, shape: "pistol" },
  { id: "tec9", name: "Tec-9", category: "手枪", ammo: 18, rpm: 500, auto: false, kick: .69, side: .52, curve: .5, seed: 103, shape: "pistol" },
  { id: "cz75", name: "CZ75-Auto", category: "手枪", ammo: 12, rpm: 600, auto: true, kick: .82, side: .64, curve: .59, seed: 107, shape: "pistol" },
  { id: "deagle", name: "Desert Eagle", category: "手枪", ammo: 7, rpm: 267, auto: false, kick: 1.5, side: .62, curve: .35, seed: 109, shape: "pistol" },
  { id: "revolver", name: "R8 Revolver", category: "手枪", ammo: 8, rpm: 120, auto: false, kick: 1.62, side: .55, curve: .3, seed: 113, shape: "revolver" },
  { id: "nova", name: "Nova", category: "重型", ammo: 8, rpm: 68, auto: false, kick: 1.25, side: .5, curve: .3, seed: 127, pellets: 9, shape: "shotgun" },
  { id: "xm1014", name: "XM1014", category: "重型", ammo: 7, rpm: 171, auto: true, kick: 1.05, side: .55, curve: .36, seed: 131, pellets: 6, shape: "shotgun" },
  { id: "mag7", name: "MAG-7", category: "重型", ammo: 5, rpm: 71, auto: false, kick: 1.34, side: .52, curve: .28, seed: 137, pellets: 8, shape: "shotgun" },
  { id: "sawedoff", name: "Sawed-Off", category: "重型", ammo: 7, rpm: 71, auto: false, kick: 1.4, side: .58, curve: .32, seed: 139, pellets: 8, shape: "shotgun" },
  { id: "m249", name: "M249", category: "重型", ammo: 100, rpm: 750, auto: true, kick: 1.08, side: .86, curve: .76, seed: 149, shape: "lmg" },
  { id: "negev", name: "Negev", category: "重型", ammo: 150, rpm: 800, auto: true, kick: 1.18, side: .96, curve: .84, seed: 151, shape: "lmg" },
  { id: "ssg08", name: "SSG 08", category: "狙击枪", ammo: 10, rpm: 48, auto: false, kick: 1.46, side: .28, curve: .22, seed: 157, scoped: true, shape: "sniper" },
  { id: "awp", name: "AWP", category: "狙击枪", ammo: 5, rpm: 41, auto: false, kick: 1.72, side: .3, curve: .2, seed: 163, scoped: true, shape: "sniper" },
  { id: "scar20", name: "SCAR-20", category: "狙击枪", ammo: 20, rpm: 240, auto: true, kick: 1.08, side: .42, curve: .38, seed: 167, scoped: true, shape: "sniper" },
  { id: "g3sg1", name: "G3SG1", category: "狙击枪", ammo: 20, rpm: 240, auto: true, kick: 1.11, side: .44, curve: .4, seed: 173, scoped: true, shape: "sniper" },
];

const CATEGORIES: Category[] = ["步枪", "冲锋枪", "手枪", "重型", "狙击枪"];
type Hole = { x: number; y: number; age: number; pellet?: boolean };
type Runtime = { viewX: number; viewY: number; recoilX: number; recoilY: number; shot: number; holes: Hole[]; firing: boolean; nextShot: number; lastFrame: number; recoveryAt: number; roundStart: number; mouseDistance: number };

function noise(n: number, seed: number) {
  const x = Math.sin((n + 1) * 12.9898 + seed * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function recoilStep(weapon: Weapon, shot: number) {
  const phase = shot / Math.max(1, weapon.ammo - 1);
  const rise = weapon.kick * (shot < 3 ? .72 : shot < 10 ? 1.1 : .88);
  const wave = Math.sin(shot * .58 + weapon.seed) * weapon.side;
  const turn = Math.sin((phase * 2.6 + .15) * Math.PI) * weapon.curve;
  return { x: wave * .56 + turn * .58 + noise(shot, weapon.seed) * .22, y: rise + noise(shot, weapon.seed + 11) * .09 };
}

function WeaponSilhouette({ weapon }: { weapon: Weapon }) {
  return (
    <div className={`weapon-model shape-${weapon.shape}`} aria-hidden="true">
      <div className="gun-stock" /><div className="gun-body" /><div className="gun-barrel" />
      <div className="gun-mag" /><div className="gun-grip" /><div className="gun-scope" />
    </div>
  );
}

export default function Home() {
  const [category, setCategory] = useState<Category>("步枪");
  const [weaponId, setWeaponId] = useState("ak47");
  const weapon = useMemo(() => WEAPONS.find(w => w.id === weaponId) ?? WEAPONS[0], [weaponId]);
  const [ammo, setAmmo] = useState(weapon.ammo);
  const [sensitivity, setSensitivity] = useState(1.0);
  const [dpi, setDpi] = useState(800);
  const [mYaw, setMYaw] = useState(.022);
  const [pattern, setPattern] = useState(true);
  const [spread, setSpread] = useState(true);
  const [locked, setLocked] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [status, setStatus] = useState("点击靶场进入训练");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const weaponRef = useRef(weapon);
  const settingsRef = useRef({ sensitivity, dpi, mYaw, spread, pattern, zoomed });
  const runtime = useRef<Runtime>({ viewX: 0, viewY: 0, recoilX: 0, recoilY: 0, shot: 0, holes: [], firing: false, nextShot: 0, lastFrame: 0, recoveryAt: 0, roundStart: 0, mouseDistance: 0 });

  useEffect(() => { weaponRef.current = weapon; }, [weapon]);
  useEffect(() => { settingsRef.current = { sensitivity, dpi, mYaw, spread, pattern, zoomed }; }, [sensitivity, dpi, mYaw, spread, pattern, zoomed]);

  const finishRound = useCallback(() => {
    const r = runtime.current;
    if (!r.holes.length) return;
    const main = r.holes.filter(h => !h.pellet);
    const mean = main.reduce((sum, h) => sum + Math.hypot(h.x, h.y), 0) / Math.max(1, main.length);
    const result = Math.max(0, Math.min(100, Math.round(100 - mean * .72)));
    setScore(result);
    setStatus(result >= 85 ? "压枪稳定 · 保持节奏" : result >= 65 ? "控制良好 · 注意中段横摆" : "继续练习 · 向下反拉要更连贯");
  }, []);

  const reset = useCallback((refill = true) => {
    const r = runtime.current;
    r.viewX = r.viewY = r.recoilX = r.recoilY = r.shot = r.mouseDistance = 0;
    r.holes = []; r.firing = false; r.nextShot = 0; r.roundStart = performance.now();
    if (refill) setAmmo(weaponRef.current.ammo);
    setScore(null); setStatus("准备就绪 · 按住左键射击");
  }, []);

  const shoot = useCallback((now: number) => {
    const w = weaponRef.current;
    const r = runtime.current;
    if (r.shot >= w.ammo) { finishRound(); return false; }
    const step = recoilStep(w, r.shot);
    r.recoilX += step.x * 6.2;
    r.recoilY += step.y * 7.2;
    const scatter = settingsRef.current.spread ? (0.9 + r.shot * .055) : 0;
    const sx = noise(r.shot, w.seed + 211) * scatter;
    const sy = noise(r.shot, w.seed + 307) * scatter;
    r.holes.push({ x: r.viewX + r.recoilX + sx, y: r.viewY + r.recoilY + sy, age: now });
    if (w.pellets) for (let i = 1; i < w.pellets; i++) r.holes.push({ x: r.viewX + r.recoilX + noise(i + r.shot * 9, w.seed) * 16, y: r.viewY + r.recoilY + noise(i + r.shot * 7, w.seed + 4) * 13, age: now, pellet: true });
    r.shot += 1; r.recoveryAt = now + 120;
    setAmmo(w.ammo - r.shot);
    if (r.shot >= w.ammo) setTimeout(finishRound, 160);
    return true;
  }, [finishRound]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 2);
      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) { canvas.width = Math.floor(rect.width * dpr); canvas.height = Math.floor(rect.height * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r = runtime.current; const w = weaponRef.current;
      const dt = Math.min(32, now - (r.lastFrame || now)); r.lastFrame = now;
      if (r.firing && w.auto && now >= r.nextShot) { if (shoot(now)) r.nextShot = now + 60000 / w.rpm; }
      if (!r.firing && now > r.recoveryAt) { const recovery = Math.pow(.86, dt / 16); r.recoilX *= recovery; r.recoilY *= recovery; }
      ctx.clearRect(0, 0, rect.width, rect.height);
      const cx = rect.width / 2, cy = rect.height / 2;
      const scale = settingsRef.current.zoomed ? 1.65 : 1;
      const screen = (h: Hole) => ({ x: cx + (h.x - r.viewX) * scale, y: cy - (h.y - r.viewY) * scale });
      if (settingsRef.current.pattern) {
        ctx.save(); ctx.globalAlpha = .32; ctx.setLineDash([4, 8]); ctx.strokeStyle = "#efb23c"; ctx.lineWidth = 1;
        ctx.beginPath(); let gx = 0, gy = 0;
        for (let i = 0; i < w.ammo; i++) { const s = recoilStep(w, i); gx += s.x * 6.2; gy += s.y * 7.2; const x = cx + gx * scale, y = cy - gy * scale; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.stroke(); ctx.restore();
      }
      r.holes.forEach((h, i) => { const p = screen(h); if (p.x < -20 || p.x > rect.width + 20 || p.y < -20 || p.y > rect.height + 20) return; ctx.beginPath(); ctx.arc(p.x, p.y, h.pellet ? 2.2 : 4.1, 0, Math.PI * 2); ctx.fillStyle = h.pellet ? "rgba(22,20,17,.7)" : "#171511"; ctx.fill(); if (!h.pellet) { ctx.beginPath(); ctx.arc(p.x, p.y, 7 + (i % 3), 0, Math.PI * 2); ctx.strokeStyle = "rgba(59,48,35,.28)"; ctx.lineWidth = 1; ctx.stroke(); } });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf);
  }, [shoot]);

  useEffect(() => {
    const onLock = () => { const isLocked = document.pointerLockElement === arenaRef.current; setLocked(isLocked); if (!isLocked) runtime.current.firing = false; };
    const onMove = (e: MouseEvent) => { if (document.pointerLockElement !== arenaRef.current) return; const factor = settingsRef.current.sensitivity * (settingsRef.current.mYaw / .022) * .58; runtime.current.viewX += e.movementX * factor; runtime.current.viewY -= e.movementY * factor; runtime.current.mouseDistance += Math.hypot(e.movementX, e.movementY); };
    const onKey = (e: KeyboardEvent) => { if (e.code === "KeyR") { setStatus("换弹中…"); setTimeout(() => reset(true), 620); } if (e.code === "KeyE") reset(true); };
    document.addEventListener("pointerlockchange", onLock); document.addEventListener("mousemove", onMove); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerlockchange", onLock); document.removeEventListener("mousemove", onMove); document.removeEventListener("keydown", onKey); };
  }, [reset]);

  const enter = () => { arenaRef.current?.requestPointerLock(); setStatus("准备就绪 · 按住左键射击"); };
  const down = (e: React.MouseEvent) => {
    if (e.button === 2) { e.preventDefault(); if (weapon.scoped) setZoomed(v => !v); return; }
    if (e.button !== 0) return;
    if (!locked) { enter(); return; }
    const r = runtime.current; r.firing = true; const now = performance.now();
    if (r.shot === 0) r.roundStart = now;
    if (now >= r.nextShot) { shoot(now); r.nextShot = now + 60000 / weapon.rpm; }
  };
  const up = () => { runtime.current.firing = false; };
  const chooseWeapon = (w: Weapon) => { setWeaponId(w.id); setZoomed(false); setTimeout(() => reset(true), 0); };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">R</span><div><strong>RECOIL//LAB</strong><small>CS2 SPRAY CONTROL TRAINER</small></div></div>
        <div className="session"><span className="live-dot" /> 本地训练会话 <b>·</b> 64 TICK INPUT</div>
        <button className="ghost-button" onClick={() => reset(true)}>重置训练 <kbd>E</kbd></button>
      </header>
      <section className="workspace">
        <aside className="sidebar">
          <div className="section-label"><span>01</span> 武器库 <em>{WEAPONS.length} 件</em></div>
          <div className="category-tabs">{CATEGORIES.map(c => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div>
          <div className="weapon-list">{WEAPONS.filter(w => w.category === category).map(w => <button key={w.id} className={`weapon-row ${weapon.id === w.id ? "selected" : ""}`} onClick={() => chooseWeapon(w)}><span className={`mini-gun mini-${w.shape}`} /><span><b>{w.name}</b><small>{w.ammo} 发 · {w.rpm} RPM</small></span>{weapon.id === w.id && <i>已装备</i>}</button>)}</div>
          <div className="section-label settings-title"><span>02</span> 输入校准</div>
          <label className="range-label"><span>游戏灵敏度 <b>{sensitivity.toFixed(2)}</b></span><input type="range" min=".1" max="4" step=".05" value={sensitivity} onChange={e => setSensitivity(+e.target.value)} /></label>
          <div className="input-pair"><label>DPI<input type="number" value={dpi} onChange={e => setDpi(+e.target.value)} /></label><label>m_yaw<input type="number" step=".001" value={mYaw} onChange={e => setMYaw(+e.target.value)} /></label></div>
          <div className="edpi"><span>eDPI</span><strong>{Math.round(dpi * sensitivity)}</strong><small>cm/360° ≈ {(41563.6 / Math.max(1, dpi * sensitivity * (mYaw / .022))).toFixed(1)}</small></div>
          <label className="toggle-row"><span>显示参考弹道<small>逐发反向压枪路径</small></span><input type="checkbox" checked={pattern} onChange={e => setPattern(e.target.checked)} /></label>
          <label className="toggle-row"><span>武器散布<small>加入站立射击误差</small></span><input type="checkbox" checked={spread} onChange={e => setSpread(e.target.checked)} /></label>
        </aside>
        <section ref={arenaRef} className={`arena ${locked ? "is-locked" : ""} ${zoomed ? "is-zoomed" : ""}`} onMouseDown={down} onMouseUp={up} onContextMenu={e => e.preventDefault()}>
          <div className="wall-grid" />
          <div className="distance-marker"><span>20</span><i /> METERS</div>
          <div className="target"><div className="target-ring ring-3" /><div className="target-ring ring-2" /><div className="target-ring ring-1" /><div className="target-core" /></div>
          <canvas ref={canvasRef} />
          {zoomed && <div className="scope"><div /><div /></div>}
          <div className="crosshair"><i /><i /><i /><i /></div>
          {!locked && <button className="enter-card" onClick={enter}><span className="mouse-icon">●</span><strong>点击进入训练场</strong><small>浏览器将锁定鼠标 · ESC 退出</small></button>}
          <div className="arena-top"><span className="mode-pill">站立 · 静止 · 20M</span><span>{status}</span></div>
          <div className="score-card"><span>CONTROL SCORE</span><strong>{score === null ? "—" : score}</strong><small>{score === null ? "完成一个弹匣后评分" : score >= 85 ? "优秀" : score >= 65 ? "稳定" : "练习中"}</small></div>
          <div className="weapon-hud"><div><span>{weapon.category.toUpperCase()}</span><strong>{weapon.name}</strong><small>{weapon.auto ? "全自动" : "半自动"} · {weapon.rpm} RPM {weapon.scoped ? " · 右键开镜" : ""}</small></div><div className="ammo"><strong>{String(ammo).padStart(2, "0")}</strong><span>/ {weapon.ammo}</span></div></div>
          <WeaponSilhouette weapon={weapon} />
          <div className="controls"><span><kbd>鼠标左键</kbd> 射击</span><span><kbd>R</kbd> 换弹</span><span><kbd>E</kbd> 重置</span><span><kbd>ESC</kbd> 释放鼠标</span></div>
        </section>
      </section>
      <footer><span>PARAMETER-LEVEL WEB SIMULATION</span><p>依据正式服武器结构建立的浏览器训练模拟；引擎反馈、音频与动画不等同于 Source 2 客户端。</p><b>BUILD 2026.07</b></footer>
    </main>
  );
}
