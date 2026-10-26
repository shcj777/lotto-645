/**
 * Lightweight canvas confetti trigger with zero external libraries
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
}

export function fireConfetti(originX?: number, originY?: number) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  const particles: Particle[] = [];
  const startX = originX !== undefined ? originX : width / 2;
  const startY = originY !== undefined ? originY : height * 0.45;

  for (let i = 0; i < 60; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      alpha: 1,
    });
  }

  let animationFrameId: number;
  const gravity = 0.22;
  const drag = 0.98;

  const render = () => {
    ctx.clearRect(0, 0, width, height);

    let aliveCount = 0;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= drag;
      p.vy = p.vy * drag + gravity;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        aliveCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }

    if (aliveCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };

  render();
}
