import { useEffect, useRef } from 'react';

export const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Configuration
    const words = ["SOLANA", "TETSUO", "SOLPRIVACY", "0x", "PRIVACY", "BLOCKCHAIN", "ENTROPY", "ANON"];
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@#%&*";
    const fontSize = 16;
    let columns = canvas.width / fontSize;

    // State for each column
    let drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100;
    }

    const draw = () => {
      // Semi-transparent background for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        // Decide what to show: random char or keyword
        let text;
        if (Math.random() > 0.98) {
          text = words[Math.floor(Math.random() * words.length)];
        } else {
          text = chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Solana gradient colors (Purple to Cyan)
        const color = (i % 2 === 0) ? "#9945FF" : "#14F195";
        ctx.fillStyle = color;

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop when it reaches bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    // Run at 30fps
    const interval = setInterval(draw, 33);

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
      columns = canvas.width / fontSize;
      drops = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  );
};
