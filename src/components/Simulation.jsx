import React, { useRef, useEffect } from 'react';

// ── Node Class (como en el original) ─────────────────────────────────────────
class Node {
  constructor(position, level = 0, type = 0) {
    this.position = { ...position };   // { x, y, z }
    this.target = { ...position };   // posición destino para morfeo
    this.connections = [];
    this.level = level;
    this.type = type;
    this.pulse = 0;                    // intensidad de pulso recibido
  }
}

// ── Formación Fractal (3er tipo, la que pide el usuario) ──────────────────────
function buildFractal(depth, maxDepth, pos, dirX, dirY, dirZ, length, nodes) {
  const node = new Node(pos, depth);
  nodes.push(node);

  if (depth >= maxDepth) return node;

  const branches = depth === 0 ? 6 : 3;
  const childLen = length * 0.62;

  for (let b = 0; b < branches; b++) {
    // Distribuimos las ramas uniformemente en 3D usando coordenadas esféricas
    const phi = Math.acos(1 - 2 * (b + 0.5) / branches); // distribución uniforme
    const theta = (b / branches) * Math.PI * 2 + depth * 1.1; // giro por nivel

    const nx = Math.sin(phi) * Math.cos(theta);
    const ny = Math.sin(phi) * Math.sin(theta);
    const nz = Math.cos(phi); // ahora SÍ se distribuye en Z

    const childPos = {
      x: pos.x + nx * childLen,
      y: pos.y + ny * childLen,
      z: pos.z + nz * childLen,
    };

    const child = buildFractal(depth + 1, maxDepth, childPos, nx, ny, nz, childLen, nodes);
    node.connections.push(child);
  }
  return node;
}

const QuantumNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── Dimensiones ────────────────────────────────────────────────────────────
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();

    // ── Paleta Turquesa/Estelar ────────────────────────────────────────────────
    const PALETTE = [
      { r: 0, g: 255, b: 255 },   // cian puro
      { r: 0, g: 200, b: 220 },   // turquesa
      { r: 64, g: 224, b: 208 },   // turquesa medio
      { r: 100, g: 149, b: 237 },   // azul aciano
      { r: 173, g: 216, b: 230 },   // azul claro
    ];

    // ── Construir Red Fractal ──────────────────────────────────────────────────
    const nodes = [];
    buildFractal(0, 4, { x: 0, y: 0, z: 0 }, 0, 1, 0, 580, nodes);

    // Asignar color a cada nodo según nivel
    nodes.forEach(n => {
      const c = PALETTE[n.level % PALETTE.length];
      n.cr = c.r; n.cg = c.g; n.cb = c.b;
      n.size = Math.max(1.5, 5 - n.level * 0.8);   // nodos internos más grandes
      n.twinkle = Math.random() * Math.PI * 2;        // offset para parpadeo
    });

    // ── Sistema de Pulsos ──────────────────────────────────────────────────────
    let pulses = [];          // { origin: Node, startTime, active }
    const PULSE_SPEED = 80;   // px lógicos por segundo

    // ── Rotación ───────────────────────────────────────────────────────────────
    let rotY = 0;
    let rotX = 0.55;  // Inclinación pronunciada para que se vea el volumen 3D
    let dragStart = null;
    let rotYDrag = 0;

    // ── Proyección 3D → 2D ─────────────────────────────────────────────────────
    const FOV = 420;  // FOV más bajo = perspectiva más dramática y sens. 3D mayor
    const DEPTH_RANGE = 600; // rango de niebla ampliado para la red expandida
    function project(p) {
      // Rotación en Y
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      // Rotación en X
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const y1 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;
      // Perspectiva
      const scale = FOV / (FOV + z2 + 300);
      // Neblina de profundidad: nodos lejanos (z2 positivo grande) más transparentes
      const fogAlpha = Math.max(0.08, Math.min(1, 1 - (z2 + DEPTH_RANGE) / (DEPTH_RANGE * 2.5)));
      return { sx: W / 2 + x1 * scale, sy: H / 2 + y1 * scale, scale, depth: z2, fogAlpha };
    }

    // ── Helper: Glow ───────────────────────────────────────────────────────────
    function drawGlow(px, py, r, cr, cg, cb, alpha) {
      if (r <= 0 || alpha <= 0) return;          // evita DOMException en createRadialGradient
      const g = ctx.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
      g.addColorStop(0.4, `rgba(${cr},${cg},${cb},${alpha * 0.4})`);
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Starfield de fondo ─────────────────────────────────────────────────────
    const STARS = Array.from({ length: 180 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    // ── Click → Pulso desde el nodo más cercano ────────────────────────────────
    function onClickOrTouch(ex, ey) {
      // Buscamos el nodo 2D más cercano al click
      let best = null, bestDist = Infinity;
      nodes.forEach(n => {
        const { sx, sy } = project(n.position);
        const d = Math.hypot(sx - ex, sy - ey);
        if (d < bestDist) { bestDist = d; best = n; }
      });
      if (best && bestDist < 80) {
        pulses.push({ origin: best, startTime: performance.now(), wave: 0 });
      }
    }

    // ── Loop principal ─────────────────────────────────────────────────────────
    let animId;
    let lastTime = performance.now();

    function render(now) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      rotY += dt * 0.18;   // rotación automática lenta

      // Fondo con fade (efecto de estela)
      ctx.fillStyle = 'rgba(5, 5, 18, 0.22)';
      ctx.fillRect(0, 0, W, H);

      // Estrellas de fondo parpadeantes
      STARS.forEach(s => {
        s.phase += dt * (0.5 + s.r);
        const alpha = 0.3 + Math.sin(s.phase) * 0.25;
        ctx.fillStyle = `rgba(180,230,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Avanzar pulsos
      pulses = pulses.filter(p => (now - p.startTime) < 3500);
      pulses.forEach(p => {
        p.wave = ((now - p.startTime) / 1000) * PULSE_SPEED;
      });

      // ── Ordenar nodos por profundidad (painter's algorithm) ────────────────
      const sorted = nodes
        .map(n => ({ n, proj: project(n.position) }))
        .sort((a, b) => a.proj.depth - b.proj.depth);

      // ── Dibujar conexiones ─────────────────────────────────────────────────
      sorted.forEach(({ n, proj }) => {
        n.connections.forEach(child => {
          const cp = project(child.position);

          // Intensidad de pulso en la conexión
          let pulseAlpha = 0;
          pulses.forEach(p => {
            const dx = n.position.x - p.origin.position.x;
            const dy = n.position.y - p.origin.position.y;
            const dz = n.position.z - p.origin.position.z;
            const distToOrigin = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const waveProximity = Math.abs(distToOrigin - p.wave);
            pulseAlpha = Math.max(pulseAlpha, Math.max(0, 1 - waveProximity / 40));
          });

          const s = (proj.scale + cp.scale) / 2;
          // Neblina aplicada a las conexiones
          const fog = (proj.fogAlpha + cp.fogAlpha) / 2;
          const baseAlpha = (0.12 + proj.scale * 0.25) * fog;
          const { cr, cg, cb } = n;

          ctx.beginPath();
          ctx.moveTo(proj.sx, proj.sy);
          ctx.lineTo(cp.sx, cp.sy);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${baseAlpha + pulseAlpha * 0.8})`;
          ctx.lineWidth = s * (0.5 + pulseAlpha * 2);
          ctx.stroke();

          if (pulseAlpha > 0.1) {
            ctx.beginPath();
            ctx.moveTo(proj.sx, proj.sy);
            ctx.lineTo(cp.sx, cp.sy);
            ctx.strokeStyle = `rgba(255,255,255,${pulseAlpha * 0.5})`;
            ctx.lineWidth = s * 0.6;
            ctx.stroke();
          }
        });
      });

      // ── Dibujar nodos ──────────────────────────────────────────────────────
      sorted.forEach(({ n, proj }) => {
        const { sx, sy, scale, fogAlpha } = proj;
        const { cr, cg, cb } = n;

        n.twinkle += dt * (1.5 + n.level * 0.3);
        const twinkleF = 0.7 + Math.sin(n.twinkle) * 0.3;

        let pIntensity = 0;
        pulses.forEach(p => {
          const dx = n.position.x - p.origin.position.x;
          const dy = n.position.y - p.origin.position.y;
          const dz = n.position.z - p.origin.position.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const proximity = Math.abs(dist - p.wave);
          pIntensity = Math.max(pIntensity, Math.max(0, 1 - proximity / 35));
        });

        const nodeSize = n.size * scale * twinkleF;
        const glowR = nodeSize * (7 + pIntensity * 14);
        // Neblina aplicada a nodos
        const glowAlpha = (0.2 + pIntensity * 0.7) * twinkleF * fogAlpha;

        if (pIntensity > 0.05) {
          drawGlow(sx, sy, glowR * 2, 255, 255, 255, pIntensity * 0.25 * fogAlpha);
        }
        drawGlow(sx, sy, glowR, cr, cg, cb, glowAlpha);

        ctx.fillStyle = `rgba(255,255,255,${(0.5 + pIntensity * 0.5) * fogAlpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.4, nodeSize * 0.4), 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    // ── Eventos ────────────────────────────────────────────────────────────────
    const onClick = e => {
      const r = canvas.getBoundingClientRect();
      onClickOrTouch(e.clientX - r.left, e.clientY - r.top);
    };
    const onTouch = e => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      onClickOrTouch(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    };

    // Drag para rotar manualmente
    const onPointerDown = e => {
      dragStart = e.clientX;
      rotYDrag = rotY;
    };
    const onPointerMove = e => {
      if (dragStart === null) return;
      rotY = rotYDrag + (e.clientX - dragStart) * 0.005;
    };
    const onPointerUp = () => { dragStart = null; };

    const onResize = () => resize();

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchstart', onTouch);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        display: 'block',
        cursor: 'default',
      }}
    />
  );
};

export default QuantumNetwork;
