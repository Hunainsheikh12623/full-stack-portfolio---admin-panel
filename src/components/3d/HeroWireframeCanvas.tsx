import React, { useEffect, useRef } from 'react';

export const HeroWireframeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Icosahedron / Polyhedron Vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const scale = Math.min(width, height) * 0.28;

    const baseVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [ (x / len) * scale, (y / len) * scale, (z / len) * scale ];
    });

    // Outer orbiting ring nodes
    const ringNodesCount = 16;
    const ringRadius = scale * 1.45;
    const ringNodes = Array.from({ length: ringNodesCount }, (_, i) => {
      const angle = (i / ringNodesCount) * Math.PI * 2;
      return [Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0];
    });

    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / width - 0.5;
      const mouseY = (e.clientY - rect.top) / height - 0.5;
      targetAngleX = mouseY * 0.8;
      targetAngleY = mouseX * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let rotationTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotationTime += 0.008;
      angleX += (targetAngleX - angleX) * 0.05;
      angleY += (targetAngleY - angleY) * 0.05;

      const currentAngleX = angleX + rotationTime * 0.4;
      const currentAngleY = angleY + rotationTime * 0.6;

      // Rotation matrix math
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      const project3D = (x: number, y: number, z: number) => {
        // Rotate around Y
        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;

        // Rotate around X
        let y2 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX;

        // Perspective
        const perspective = 600 / (600 + z2);
        return {
          x: width / 2 + x1 * perspective,
          y: height / 2 + y2 * perspective,
          z: z2,
          scale: perspective
        };
      };

      const projectedVertices = baseVertices.map(([x, y, z]) => project3D(x, y, z));

      // Draw edges connecting close vertices
      ctx.lineWidth = 1.2;
      for (let i = 0; i < projectedVertices.length; i++) {
        for (let j = i + 1; j < projectedVertices.length; j++) {
          const v1 = projectedVertices[i];
          const v2 = projectedVertices[j];
          const dist = Math.hypot(baseVertices[i][0] - baseVertices[j][0], baseVertices[i][1] - baseVertices[j][1], baseVertices[i][2] - baseVertices[j][2]);

          if (dist < scale * 1.5) {
            const alpha = Math.max(0.1, 1 - (dist / (scale * 1.5))) * ((v1.z + v2.z + scale * 2) / (scale * 4));
            ctx.beginPath();
            ctx.moveTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
            
            // Alternating crisp white and emerald green subtle gradients
            const gradient = ctx.createLinearGradient(v1.x, v1.y, v2.x, v2.y);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.min(0.8, alpha)})`);
            gradient.addColorStop(1, `rgba(34, 197, 94, ${Math.min(0.6, alpha)})`);
            
            ctx.strokeStyle = gradient;
            ctx.stroke();
          }
        }
      }

      // Draw Ring Nodes
      const projectedRing = ringNodes.map(([x, y, z]) => {
        // Orbit around Z
        const ringAngle = rotationTime * -0.3;
        const rx = x * Math.cos(ringAngle) - y * Math.sin(ringAngle);
        const ry = x * Math.sin(ringAngle) + y * Math.cos(ringAngle);
        return project3D(rx, ry, z);
      });

      ctx.beginPath();
      for (let i = 0; i < projectedRing.length; i++) {
        const next = projectedRing[(i + 1) % projectedRing.length];
        ctx.moveTo(projectedRing[i].x, projectedRing[i].y);
        ctx.lineTo(next.x, next.y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();

      // Render glowing nodes
      projectedVertices.forEach((v, index) => {
        const isGreen = index % 3 === 0;
        const glowRadius = Math.max(2, 4 * v.scale);

        ctx.beginPath();
        ctx.arc(v.x, v.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = isGreen ? '#22c55e' : '#ffffff';
        ctx.fill();

        // Glow aura
        ctx.beginPath();
        ctx.arc(v.x, v.y, glowRadius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isGreen ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] md:h-[480px] flex items-center justify-center overflow-hidden rounded-xl bg-[#080808] border border-white/10">
      <div className="absolute top-4 left-4 flex items-center space-x-2 z-10 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
        <span className="text-[10px] uppercase tracking-widest font-mono text-white/60">3D SCHEMATIC · RENDER 60FPS</span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-4 right-4 text-right z-10 pointer-events-none hidden sm:block">
        <p className="text-[10px] uppercase tracking-widest font-mono text-white/40">INTERACTIVE WIREFRAME MODEL</p>
        <p className="text-[10px] uppercase tracking-widest font-mono text-green-400/80">HOVER TO PARALLAX</p>
      </div>
    </div>
  );
};
