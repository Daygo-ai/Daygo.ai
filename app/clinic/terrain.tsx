"use client";

/*
 * Web versions of the Daygo app's dot visuals (RunRouteTerrain,
 * HeartRateMountain / SleepNightsTerrain, DotColumnsCard).
 * Canvas point clouds with a perspective camera like the app's
 * RouteCamera: drag sideways to turn, hover to read a point.
 * Brightness follows height only; it never means good or bad.
 */
import { useEffect, useRef, useState } from "react";

const LIME = [230, 228, 108];
const mix = (t: number) => `rgb(${Math.round(255 + (LIME[0] - 255) * t)},${Math.round(255 + (LIME[1] - 255) * t)},${Math.round(255 + (LIME[2] - 255) * t)})`;

function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void, deps: unknown[]) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, start = performance.now(), visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    let last = 0;
    const frame = (now: number) => {
      if (now - last < 32) { raf = requestAnimationFrame(frame); return; }
      last = now;
      const dpr = Math.min(2, devicePixelRatio || 1);
      const w = c.clientWidth, h = c.clientHeight;
      if (c.width !== w * dpr || c.height !== h * dpr) { c.width = w * dpr; c.height = h * dpr; }
      if (visible) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        drawRef.current(ctx, w, h, reduce ? 0 : (now - start) / 1000);
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/** Drag-to-turn yaw that eases back, like the app. */
function useYaw() {
  const [drag, setDrag] = useState(0);
  const st = useRef<{ x: number; base: number } | null>(null);
  const handlers = {
    onPointerDown: (e: React.PointerEvent) => { st.current = { x: e.clientX, base: drag }; (e.target as Element).setPointerCapture(e.pointerId); },
    onPointerMove: (e: React.PointerEvent) => { if (st.current) setDrag(Math.max(-0.9, Math.min(0.9, st.current.base + (e.clientX - st.current.x) / 260))); },
    onPointerUp: () => { st.current = null; },
  };
  return { drag, handlers };
}

function project(x: number, z: number, y: number, w: number, h: number, yaw: number, pitch: number, lift = 0.42, zoom = 1.2) {
  const rx = x * Math.cos(yaw) - z * Math.sin(yaw);
  const rz = x * Math.sin(yaw) + z * Math.cos(yaw);
  const wy = y * lift;
  const d = rz * Math.cos(pitch) - wy * Math.sin(pitch) + 3;
  const up = rz * Math.sin(pitch) + wy * Math.cos(pitch);
  const s = Math.min(w, h * 1.5) * zoom;
  return { x: w / 2 + (rx / d) * s, y: h * 0.58 - (up / d) * s, d };
}

/* ───────────── Mountain: a series as a dot ridge with depth ───────────── */
export function DotMountain({ values, labels, unit, dec = 0, height = 230 }: { values: (number | null)[]; labels: string[]; unit: string; dec?: number; height?: number }) {
  const { drag, handlers } = useYaw();
  const [hover, setHover] = useState<number | null>(null);
  const v = values.map((x) => x ?? NaN);
  const ok = v.filter((x) => !isNaN(x));
  const mn = Math.min(...ok), mx = Math.max(...ok), r = mx - mn || 1;
  const norm = v.map((x) => (isNaN(x) ? 0 : 0.12 + 0.88 * ((x - mn) / r)));
  const COLS = Math.max(56, values.length * 5), ROWS = 18;
  // One hill per day so each night reads as its own peak.
  const n = norm.length, wid = 0.42 / n;
  const at = (fx: number) => { let m = 0; for (let i = 0; i < n; i++) { const cx = (i + 0.5) / n; const v = norm[i] * Math.exp(-((fx - cx) ** 2) / (2 * wid * wid)); if (v > m) m = v; } return m; };
  const ref = useCanvas((ctx, w, h, t) => {
    const yaw = -0.12 + drag + Math.sin(t * 0.2) * 0.03;
    const pts: { x: number; y: number; d: number; hgt: number; col: number }[] = [];
    for (let j = 0; j < ROWS; j++) {
      const zf = j / (ROWS - 1) * 2 - 1;
      const fall = Math.exp(-(zf * zf) / 0.3);
      for (let i = 0; i < COLS; i++) {
        const xf = i / (COLS - 1);
        const hgt = at(xf) * fall;
        const p = project(xf * 2 - 1, zf * 0.5, hgt, w, h, yaw, 0.42, 1.55, 1.15);
        pts.push({ ...p, hgt, col: Math.min(values.length - 1, Math.floor(xf * values.length)) });
      }
    }
    pts.sort((a, b) => b.d - a.d);
    for (const p of pts) {
      const sel = hover != null && p.col === hover;
      ctx.fillStyle = sel ? "#fff" : mix(Math.min(1, p.hgt * 1.15));
      ctx.globalAlpha = 0.32 + 0.68 * Math.min(1, p.hgt * 1.2);
      const s = (sel ? 3 : 2.2) * (3.5 - p.d);
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.6, s), 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [drag, hover, values.join()]);
  const cur = hover ?? values.length - 1;
  return (
    <div className="relative select-none">
      <div className="pointer-events-none absolute left-0 top-0 z-10">
        <div className="font-dots text-[56px] leading-none text-white">{values[cur] == null ? "––" : (values[cur] as number).toFixed(dec)}<span className="ml-1.5 font-sans text-[15px] text-white/60">{unit}</span></div>
        <div className="mt-1.5 text-[13px] text-white/65">{hover == null ? "Last night · " : ""}{labels[cur]}</div>
      </div>
      <canvas ref={ref} {...handlers} onMouseMove={(e) => { const r = (e.target as HTMLElement).getBoundingClientRect(); setHover(Math.max(0, Math.min(values.length - 1, Math.floor(((e.clientX - r.left) / r.width) * values.length)))); }} onMouseLeave={() => setHover(null)}
        className="block w-full cursor-crosshair touch-pan-y" style={{ height }} aria-label={`${values.length} days, ${unit}. Hover to read a day.`} role="img" />
      <div className="mt-1 flex justify-between text-[11px] text-white/45"><span>{labels[0]}</span><span>Hover a night to read it</span><span>{labels[labels.length - 1]}</span></div>
    </div>
  );
}

/* ───────────── Run route: the route's shape as terrain, ridges = heart rate ───────────── */
export function RouteTerrain({ height = 260 }: { height?: number }) {
  const { drag, handlers } = useYaw();
  const N = 260;
  // A fictional 6.2 km loop, effort from an example heart-rate trace.
  const route = useRef(Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const r = 0.62 + 0.16 * Math.sin(a * 3 + 0.6) + 0.07 * Math.cos(a * 7);
    const effort = Math.min(1, Math.max(0, 0.35 + 0.35 * Math.sin(a * 2 - 0.9) + 0.25 * Math.exp(-((a - 4.1) ** 2) / 0.12) + 0.05 * Math.sin(a * 13)));
    return { x: Math.cos(a) * r, z: Math.sin(a) * r * 0.8, e: effort };
  })).current;
  const G = 54;
  const field = useRef<Float32Array | null>(null);
  if (!field.current) {
    const f = new Float32Array(G * G);
    for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
      const x = (i / (G - 1)) * 2 - 1, z = (j / (G - 1)) * 2 - 1;
      let best = 0;
      for (let k = 0; k < N; k += 2) { const p = route[k]; const dd = (x - p.x) ** 2 + (z - p.z) ** 2; const v = Math.exp(-dd / 0.0065) * (0.15 + 0.85 * p.e ** 1.3); if (v > best) best = v; }
      f[j * G + i] = best;
    }
    field.current = f;
  }
  const ref = useCanvas((ctx, w, h, t) => {
    const yaw = 0.35 + drag + t * 0.07;
    const f = field.current!;
    const pts: { x: number; y: number; d: number; v: number }[] = [];
    for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
      const v = f[j * G + i];
      if (v < 0.03 && (i % 4 || j % 4)) continue;
      const p = project((i / (G - 1)) * 2 - 1, (j / (G - 1)) * 2 - 1, v, w, h, yaw, 0.78, 1.15, 1.45);
      pts.push({ ...p, v });
    }
    pts.sort((a, b) => b.d - a.d);
    for (const p of pts) {
      ctx.fillStyle = p.v < 0.03 ? "rgba(255,255,255,.22)" : mix(Math.min(1, p.v * 1.2));
      ctx.globalAlpha = p.v < 0.03 ? 1 : 0.5 + 0.5 * p.v;
      const s = (3.6 - p.d) * (p.v < 0.03 ? 0.55 : 1.05);
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.5, s), 0, 6.283); ctx.fill();
    }
    // the route itself, raised by effort, as a continuous bright line
    ctx.globalAlpha = 1; ctx.lineWidth = 2.2; ctx.lineCap = "round";
    for (let k2 = 0; k2 < N; k2++) {
      const p1 = route[k2], p2 = route[(k2 + 1) % N];
      const a1 = project(p1.x, p1.z, 0.15 + 0.85 * p1.e ** 1.3, w, h, yaw, 0.78, 1.15, 1.45);
      const a2 = project(p2.x, p2.z, 0.15 + 0.85 * p2.e ** 1.3, w, h, yaw, 0.78, 1.15, 1.45);
      ctx.strokeStyle = mix(Math.min(1, p1.e * 1.15)); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.stroke();
    }
    // runner dot moving along the route
    const k = ((Math.floor(Math.max(0, t) * 18) % N) + N) % N, rp = route[k];
    const q = project(rp.x, rp.z, 0.15 + 0.85 * rp.e ** 1.3 + 0.08, w, h, yaw, 0.78, 1.15, 1.45);
    ctx.globalAlpha = 1;
    const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 14); g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.x, q.y, 14, 0, 6.283); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(q.x, q.y, 3.5, 0, 6.283); ctx.fill();
  }, [drag]);
  return <canvas ref={ref} {...handlers} className="block w-full cursor-grab touch-pan-y active:cursor-grabbing" style={{ height }} role="img" aria-label="Example run route drawn as terrain. Higher means a harder heart. Drag sideways to turn." />;
}

/* ───────────── Dot columns: a metric per day as dotted columns + usual range band ───────────── */
export function DotColumns({ values, labels, unit, height = 150 }: { values: (number | null)[]; labels: string[]; unit: string; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const ok = values.filter((x): x is number => x != null);
  const mean = ok.reduce((a, b) => a + b, 0) / (ok.length || 1);
  const sd = Math.sqrt(ok.reduce((a, b) => a + (b - mean) ** 2, 0) / (ok.length || 1));
  const lo = Math.min(...ok, mean - sd) * 0.9, hi = Math.max(...ok, mean + sd) * 1.05;
  const Y = (v: number) => height - 18 - ((v - lo) / (hi - lo)) * (height - 30);
  const n = values.length, cur = hover ?? n - 1;
  return (
    <div className="relative select-none" onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${n * 14} ${height}`} preserveAspectRatio="none" className="block w-full" style={{ height }}
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setHover(Math.max(0, Math.min(n - 1, Math.floor(((e.clientX - r.left) / r.width) * n)))); }}>
        <rect x="0" width={n * 14} y={Y(mean + sd)} height={Y(mean - sd) - Y(mean + sd)} fill="white" fillOpacity=".06" rx="4" />
        {values.map((v, i) => v == null ? null : Array.from({ length: Math.max(1, Math.round((height - 18 - Y(v)) / 7)) }, (_, k) => (
          <circle key={`${i}-${k}`} cx={i * 14 + 7} cy={height - 21 - k * 7} r={i === cur ? 2.6 : 2.1} fill={i === cur ? "#E6E46C" : "white"} fillOpacity={i === cur ? 1 : 0.35 + 0.5 * (k / ((height - 18 - Y(v)) / 7))} />
        )))}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-white/55"><span>{labels[0]}</span><span>{labels[cur]} · <b className="font-semibold text-white">{values[cur] ?? "–"} {unit}</b></span><span>{labels[n - 1]}</span></div>
    </div>
  );
}
