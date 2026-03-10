import { useEffect, useRef } from 'react';

export default function FloatingShirt({ style }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = 80;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.28;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      particles.push({
        angle,
        radius: baseRadius + Math.random() * 30 - 15,
        size: Math.random() * 3 + 1.5,
        speed: 0.003 + Math.random() * 0.004,
        offset: Math.random() * Math.PI * 2,
        orbitTilt: Math.random() * 0.4 - 0.2,
      });
    }

    // Floating dots in background
    const bgDots = [];
    for (let i = 0; i < 40; i++) {
      bgDots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    let time = 0;

    function drawTorusKnot(t) {
      const points = [];
      const segments = 200;

      for (let i = 0; i <= segments; i++) {
        const s = (i / segments) * Math.PI * 2;
        const p = 2, q = 3;
        const r = 2 + Math.cos(q * s);
        const x3d = r * Math.cos(p * s);
        const y3d = r * Math.sin(p * s);
        const z3d = -Math.sin(q * s);

        // Rotate around Y axis
        const cosT = Math.cos(t * 0.5);
        const sinT = Math.sin(t * 0.5);
        const rx = x3d * cosT + z3d * sinT;
        const rz = -x3d * sinT + z3d * cosT;

        // Rotate around X axis slightly
        const cosX = Math.cos(Math.sin(t * 0.3) * 0.3);
        const sinX = Math.sin(Math.sin(t * 0.3) * 0.3);
        const ry = y3d * cosX - rz * sinX;
        const finalZ = y3d * sinX + rz * cosX;

        const scale = baseRadius * 0.35;
        const perspective = 5 / (5 + finalZ * 0.3);

        points.push({
          x: centerX + rx * scale * perspective,
          y: centerY + ry * scale * perspective + Math.sin(t * 0.8) * 8,
          z: finalZ,
          perspective,
        });
      }

      // Draw the knot with glow
      for (let pass = 0; pass < 3; pass++) {
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }

        if (pass === 0) {
          ctx.strokeStyle = 'rgba(255, 107, 0, 0.08)';
          ctx.lineWidth = 18;
        } else if (pass === 1) {
          ctx.strokeStyle = 'rgba(255, 107, 0, 0.2)';
          ctx.lineWidth = 8;
        } else {
          ctx.strokeStyle = 'rgba(255, 140, 40, 0.9)';
          ctx.lineWidth = 2.5;
        }
        ctx.stroke();
      }

      // Draw bright points at intervals
      for (let i = 0; i < points.length; i += 5) {
        const pt = points[i];
        const brightness = (pt.z + 2) / 4;
        const alpha = 0.3 + brightness * 0.7;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.5 * pt.perspective, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${Math.floor(107 + brightness * 80)}, ${Math.floor(brightness * 40)}, ${alpha})`;
        ctx.fill();
      }
    }

    function animate() {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Background dots
      bgDots.forEach((dot) => {
        dot.x += dot.speedX;
        dot.y += dot.speedY;
        if (dot.x < 0) dot.x = width;
        if (dot.x > width) dot.x = 0;
        if (dot.y < 0) dot.y = height;
        if (dot.y > height) dot.y = 0;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 0, ${dot.opacity})`;
        ctx.fill();
      });

      // Central glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.5);
      gradient.addColorStop(0, 'rgba(255, 107, 0, 0.06)');
      gradient.addColorStop(0.5, 'rgba(255, 107, 0, 0.02)');
      gradient.addColorStop(1, 'rgba(255, 107, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw torus knot
      drawTorusKnot(time);

      // Orbiting particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const wobble = Math.sin(time * 2 + p.offset) * 15;
        const px = centerX + Math.cos(p.angle) * (p.radius + wobble);
        const py = centerY + Math.sin(p.angle + p.orbitTilt) * (p.radius * 0.6 + wobble * 0.5);
        const alpha = 0.2 + Math.sin(time * 3 + p.offset) * 0.15;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 140, 40, ${alpha})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', ...style }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
