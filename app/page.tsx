"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { RECOIL_PATTERNS } from "./recoil-patterns";

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
type Distance = 1 | 10 | 20 | 30 | 50;
const DISTANCES: Distance[] = [1, 10, 20, 30, 50];
const SOURCE_PLAYER_HEIGHT_METERS = 1.8288;
// Source uses a 90° horizontal reference at 4:3, equivalent to ~73.74° vertical.
const SOURCE_VERTICAL_FOV = 2 * Math.atan(Math.tan(Math.PI / 4) / (4 / 3));

function projectedTargetHeight(distance: Distance) {
  return Math.min(124, (SOURCE_PLAYER_HEIGHT_METERS / (2 * distance * Math.tan(SOURCE_VERTICAL_FOV / 2))) * 100);
}

type Hole = { x: number; y: number; age: number; pellet?: boolean };
type Tracer = { x: number; y: number; age: number; seed: number };
type Runtime = { aimX: number; aimY: number; punchX: number; punchY: number; shot: number; burst: number; holes: Hole[]; tracers: Tracer[]; firing: boolean; nextShot: number; lastShot: number; lastFrame: number; recoveryAt: number; roundStart: number; mouseDistance: number; gunKick: number; gunRoll: number; muzzle: number; smoke: number };

function noise(n: number, seed: number) {
  const x = Math.sin((n + 1) * 12.9898 + seed * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function recoilPoint(weapon: Weapon, shot: number, burst: number) {
  const source = RECOIL_PATTERNS[weapon.id];
  if (source?.length) {
    const point = source[Math.min(shot, source.length - 1)];
    return { x: point[0], y: Math.max(0, point[1]) };
  }
  const firstKick = weapon.kick * (weapon.scoped ? 12.5 : weapon.pellets ? 10 : 7.2);
  return {
    x: noise(burst, weapon.seed) * weapon.side * (2.2 + burst * .8),
    y: firstKick * (1 + Math.min(burst, 4) * .42),
  };
}

function WeaponSilhouette({ weapon }: { weapon: Weapon }) {
  return (
    <div className={`weapon-model shape-${weapon.shape} weapon-${weapon.id}`} aria-hidden="true">
      <div className="view-arm arm-support"><i className="view-glove" /></div>
      <div className="view-arm arm-trigger"><i className="view-glove" /></div>
      <div className="gun-assembly">
        <div className="gun-suppressor" />
        <div className="gun-muzzle" />
        <div className="gun-barrel" />
        <div className="gun-front-sight" />
        <div className="gun-handguard" />
        <div className="gun-body"><i className="gun-bolt" /></div>
        <div className="gun-stock" />
        <div className="gun-mag" />
        <div className="gun-top-mag" />
        <div className="gun-helical" />
        <div className="gun-drum" />
        <div className="gun-grip" />
        <div className="gun-scope"><i /></div>
      </div>
      <div className="muzzle-smoke"><i /><i /><i /></div>
      <div className="muzzle-flash"><i /><i /><i /></div>
      <div className="ejected-case" />
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
  const [distance, setDistance] = useState<Distance>(20);
  const [locked, setLocked] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [status, setStatus] = useState("点击靶场进入训练");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const weaponRef = useRef(weapon);
  const settingsRef = useRef({ sensitivity, dpi, mYaw, spread, pattern, zoomed });
  const runtime = useRef<Runtime>({ aimX: 0, aimY: 0, punchX: 0, punchY: 0, shot: 0, burst: 0, holes: [], tracers: [], firing: false, nextShot: 0, lastShot: 0, lastFrame: 0, recoveryAt: 0, roundStart: 0, mouseDistance: 0, gunKick: 0, gunRoll: 0, muzzle: 0, smoke: 0 });
  const targetHeight = useMemo(() => projectedTargetHeight(distance), [distance]);

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
    r.aimX = r.aimY = r.punchX = r.punchY = r.shot = r.burst = r.mouseDistance = 0;
    r.holes = []; r.tracers = []; r.firing = false; r.nextShot = r.lastShot = 0; r.gunKick = r.gunRoll = r.muzzle = r.smoke = 0; r.roundStart = performance.now();
    if (refill) setAmmo(weaponRef.current.ammo);
    setScore(null); setStatus("准备就绪 · 按住左键射击");
  }, []);

  const shoot = useCallback((now: number) => {
    const w = weaponRef.current;
    const r = runtime.current;
    if (r.shot >= w.ammo) { finishRound(); return false; }
    if (now - r.lastShot > 320) r.burst = 0;
    const point = recoilPoint(w, r.burst, r.burst);
    r.punchX = point.x;
    r.punchY = point.y;
    const scatter = settingsRef.current.spread ? (0.75 + r.shot * .045) : 0;
    const sx = noise(r.shot, w.seed + 211) * scatter;
    const sy = noise(r.shot, w.seed + 307) * scatter;
    const impact = { x: r.aimX + r.punchX + sx, y: r.aimY + r.punchY + sy, age: now };
    r.holes.push(impact);
    r.tracers.push({ x: impact.x, y: impact.y, age: now, seed: r.shot + w.seed });
    if (w.pellets) for (let i = 1; i < w.pellets; i++) r.holes.push({ x: r.aimX + r.punchX + noise(i + r.shot * 9, w.seed) * 16, y: r.aimY + r.punchY + noise(i + r.shot * 7, w.seed + 4) * 13, age: now, pellet: true });
    r.shot += 1; r.burst += 1; r.lastShot = now; r.recoveryAt = now + 110;
    r.gunKick = Math.min(1.35, r.gunKick + (w.category === "手枪" || w.scoped ? 1 : .68));
    r.gunRoll = noise(r.shot, w.seed + 19) * (w.category === "冲锋枪" ? 1.3 : 2.4);
    r.muzzle = 1;
    r.smoke = Math.min(1.25, r.smoke + (w.id === "m4a1s" || w.id === "usp" || w.id === "mp5sd" ? .28 : .58));
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
      if (!r.firing && now > r.recoveryAt) { const recovery = Math.pow(.78, dt / 16); r.punchX *= recovery; r.punchY *= recovery; if (Math.abs(r.punchY) < .05) { r.punchX = r.punchY = 0; r.burst = 0; } }
      r.gunKick *= Math.pow(.7, dt / 16); r.gunRoll *= Math.pow(.68, dt / 16); r.muzzle *= Math.pow(.35, dt / 16); r.smoke *= Math.pow(.91, dt / 16);
      ctx.clearRect(0, 0, rect.width, rect.height);
      const cx = rect.width / 2, cy = rect.height / 2;
      const scale = settingsRef.current.zoomed ? 1.65 : 1;
      const cameraX = r.aimX + r.punchX * .43 + noise(r.shot, w.seed + 401) * r.gunKick * .8;
      const cameraY = r.aimY + r.punchY * .43 + r.gunKick * .7;
      const screen = (h: Hole) => ({ x: cx + (h.x - cameraX) * scale, y: cy - (h.y - cameraY) * scale });
      if (arenaRef.current) {
        arenaRef.current.style.setProperty("--camera-x", `${-cameraX * scale}px`);
        arenaRef.current.style.setProperty("--camera-y", `${cameraY * scale}px`);
        arenaRef.current.style.setProperty("--vm-kick", `${r.gunKick}`);
        arenaRef.current.style.setProperty("--vm-kick-x", `${r.gunKick * -18}px`);
        arenaRef.current.style.setProperty("--vm-kick-y", `${r.gunKick * 14}px`);
        arenaRef.current.style.setProperty("--vm-roll", `${r.gunRoll}deg`);
        arenaRef.current.style.setProperty("--muzzle", `${r.muzzle}`);
        arenaRef.current.style.setProperty("--smoke", `${r.smoke}`);
      }
      if (settingsRef.current.pattern) {
        const source = RECOIL_PATTERNS[w.id];
        if (source?.length) {
          ctx.save(); ctx.globalAlpha = .5; ctx.setLineDash([3, 7]); ctx.strokeStyle = "#d86c24"; ctx.fillStyle = "#d86c24"; ctx.lineWidth = 1.2;
          ctx.beginPath();
          source.forEach((point, i) => { const x = cx + (-point[0] - cameraX) * scale; const y = cy - (-point[1] - cameraY) * scale; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
          ctx.stroke();
          source.forEach((point, i) => { if (i % 3) return; const x = cx + (-point[0] - cameraX) * scale; const y = cy - (-point[1] - cameraY) * scale; ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill(); });
          ctx.restore();
        }
      }
      r.tracers = r.tracers.filter(t => now - t.age < 105);
      r.tracers.forEach(t => {
        const p = screen(t);
        const life = Math.max(0, 1 - (now - t.age) / 105);
        const muzzleX = Math.max(cx + 72, rect.width - 630);
        const muzzleY = Math.max(cy + 105, rect.height - 205);
        const tailX = muzzleX + (p.x - muzzleX) * .28;
        const tailY = muzzleY + (p.y - muzzleY) * .28;
        const gradient = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
        gradient.addColorStop(0, "rgba(255,168,45,0)");
        gradient.addColorStop(.58, `rgba(255,184,70,${life * .42})`);
        gradient.addColorStop(1, `rgba(255,248,202,${life * .95})`);
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.1 + life * 1.5;
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.strokeStyle = `rgba(255,136,36,${life * .35})`;
        ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(muzzleX, muzzleY); ctx.lineTo(tailX, tailY); ctx.stroke();
        ctx.restore();
      });
      r.holes.forEach((h, i) => { const p = screen(h); if (p.x < -20 || p.x > rect.width + 20 || p.y < -20 || p.y > rect.height + 20) return; ctx.beginPath(); ctx.arc(p.x, p.y, h.pellet ? 2.2 : 4.1, 0, Math.PI * 2); ctx.fillStyle = h.pellet ? "rgba(22,20,17,.7)" : "#171511"; ctx.fill(); if (!h.pellet) { ctx.beginPath(); ctx.arc(p.x, p.y, 7 + (i % 3), 0, Math.PI * 2); ctx.strokeStyle = "rgba(59,48,35,.28)"; ctx.lineWidth = 1; ctx.stroke(); } });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf);
  }, [shoot]);

  useEffect(() => {
    const onLock = () => { const isLocked = document.pointerLockElement === arenaRef.current; setLocked(isLocked); if (!isLocked) runtime.current.firing = false; };
    const onMove = (e: MouseEvent) => { if (document.pointerLockElement !== arenaRef.current) return; const factor = settingsRef.current.sensitivity * (settingsRef.current.mYaw / .022) * .32; runtime.current.aimX += e.movementX * factor; runtime.current.aimY -= e.movementY * factor; runtime.current.mouseDistance += Math.hypot(e.movementX, e.movementY); };
    const onMouseUp = () => { runtime.current.firing = false; };
    const onKey = (e: KeyboardEvent) => { if (e.code === "KeyR") { setStatus("换弹中…"); setTimeout(() => reset(true), 620); } if (e.code === "KeyE") reset(true); };
    document.addEventListener("pointerlockchange", onLock); document.addEventListener("mousemove", onMove); document.addEventListener("mouseup", onMouseUp); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerlockchange", onLock); document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onMouseUp); document.removeEventListener("keydown", onKey); };
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
  const chooseDistance = (value: Distance) => {
    setDistance(value);
    reset(true);
    setStatus(`交战距离已切换至 ${value} 米`);
  };

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
          <div className="section-label distance-title"><span>02</span> 交战距离 <em>站立靶</em></div>
          <div className="distance-grid">{DISTANCES.map(value => <button key={value} className={distance === value ? "active" : ""} aria-pressed={distance === value} onClick={() => chooseDistance(value)}><b>{value}</b><span>M</span></button>)}</div>
          <div className="distance-readout"><span>Source 比例</span><strong>{Math.round(distance * 39.3701)} HU</strong><small>人物高度 72 HU · 视线高度 64 HU</small></div>
          <div className="section-label settings-title"><span>03</span> 输入校准</div>
          <label className="range-label"><span>游戏灵敏度 <b>{sensitivity.toFixed(2)}</b></span><input type="range" min=".1" max="4" step=".05" value={sensitivity} onChange={e => setSensitivity(+e.target.value)} /></label>
          <div className="input-pair"><label>DPI<input type="number" value={dpi} onChange={e => setDpi(+e.target.value)} /></label><label>m_yaw<input type="number" step=".001" value={mYaw} onChange={e => setMYaw(+e.target.value)} /></label></div>
          <div className="edpi"><span>eDPI</span><strong>{Math.round(dpi * sensitivity)}</strong><small>cm/360° ≈ {(41563.6 / Math.max(1, dpi * sensitivity * (mYaw / .022))).toFixed(1)}</small></div>
          <label className="toggle-row"><span>显示参考弹道<small>逐发反向压枪路径</small></span><input type="checkbox" checked={pattern} onChange={e => setPattern(e.target.checked)} /></label>
          <label className="toggle-row"><span>武器散布<small>加入站立射击误差</small></span><input type="checkbox" checked={spread} onChange={e => setSpread(e.target.checked)} /></label>
        </aside>
        <section ref={arenaRef} className={`arena ${locked ? "is-locked" : ""} ${zoomed ? "is-zoomed" : ""}`} onMouseDown={down} onMouseUp={up} onContextMenu={e => e.preventDefault()}>
          <div className="wall-grid" />
          <div className="distance-marker"><span>{distance}</span><i /> METERS</div>
          <div className="human-target" style={{ "--target-height": `${targetHeight}%` } as CSSProperties}>
            <div className="target-head"><i /></div>
            <div className="target-neck" />
            <div className="target-torso"><i /><b /></div>
            <div className="target-arm arm-left" /><div className="target-arm arm-right" />
            <div className="target-leg leg-left" /><div className="target-leg leg-right" />
            <div className="target-ground" />
          </div>
          <canvas ref={canvasRef} />
          {zoomed && <div className="scope"><div /><div /></div>}
          <div className="crosshair"><i /><i /><i /><i /></div>
          {!locked && <button className="enter-card" onClick={enter}><span className="mouse-icon">●</span><strong>点击进入训练场</strong><small>浏览器将锁定鼠标 · ESC 退出</small></button>}
          <div className="arena-top"><span className="mode-pill">站立 · 静止 · {distance}M · {Math.round(distance * 39.3701)}HU</span><span>{status}</span></div>
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
