import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle, small ambient stars
    const starCount = 85;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.6 + 0.15,
      speed: Math.random() * 0.008 + 0.003,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.alpha += star.speed * star.direction;
        if (star.alpha > 0.75 || star.alpha < 0.1) {
          star.direction *= -1;
        }

        ctx.fillStyle = `rgba(245, 242, 237, ${Math.max(0.08, star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-space-ink">
      {/* Soft, calm nebula radial glows */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[850px] h-[500px] rounded-full bg-gradient-to-b from-[#1E2E4A]/30 via-[#18263E]/20 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[500px] rounded-full bg-gradient-to-tl from-[#B1E5E6]/5 via-[#18263E]/20 to-transparent blur-[160px] pointer-events-none" />

      {/* Twinkling star canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full opacity-60" />
    </div>
  );
};
