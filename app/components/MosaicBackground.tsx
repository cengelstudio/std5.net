"use client";

import { useEffect, useRef, useState } from 'react';

interface MosaicBackgroundProps {
  seed?: number;
  className?: string;
}

export default function MosaicBackground({ seed = Date.now(), className = "" }: MosaicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const WIDTH = 1920;
    const HEIGHT = 1080;
    const POSTER_RATIO = 2 / 3;
    const POSTER_HEIGHT = 360;
    const POSTER_WIDTH = Math.round(POSTER_HEIGHT * POSTER_RATIO);
    const ROWS = 3;
    const COLS = Math.ceil(WIDTH / POSTER_WIDTH);
    const POSTER_MARGIN = 9;
    const PLACEHOLDER_COLOR = '#222';

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Seeded random number generator
    function seededRandom(seedVal: number) {
      const x = Math.sin(seedVal++) * 10000;
      return x - Math.floor(x);
    }

    // Mock image list (you can extend this with actual image names)
    const mockImages = [
      'image-1.jpg', 'image-2.png', 'image-3.jpg', 'image-4.jpg', 'image-5.jpg',
      'image-6.jpg', 'image-7.jpg', 'image-8.jpg', 'image-9.jpg', 'image-10.jpg',
      'image-11.jpg', 'image-12.webp', 'image-13.jpg', 'image-14.jpg', 'image-15.jpg'
    ];

    // Shuffle images using seeded random
    const shuffled = [...mockImages].sort(() => seededRandom(seed) - 0.5);

    // Fill background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Track loaded images
    let loadedImages = 0;
    const totalCells = ROWS * COLS;

    // Draw posters in a grid
    let posterIdx = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * POSTER_WIDTH + POSTER_MARGIN;
        const y = row * POSTER_HEIGHT + POSTER_MARGIN;
        const drawWidth = POSTER_WIDTH - 2 * POSTER_MARGIN;
        const drawHeight = POSTER_HEIGHT - 2 * POSTER_MARGIN;

        const imageFile = shuffled[posterIdx % shuffled.length];
        const img = new Image();

        img.onload = () => {
          // object-fit: cover logic
          const imgRatio = img.width / img.height;
          const cellRatio = drawWidth / drawHeight;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;

          if (imgRatio > cellRatio) {
            // Image is wider, crop sides
            sw = img.height * cellRatio;
            sx = (img.width - sw) / 2;
          } else {
            // Image is taller, crop top/bottom
            sh = img.width / cellRatio;
            sy = (img.height - sh) / 2;
          }

          ctx.drawImage(img, sx, sy, sw, sh, x, y, drawWidth, drawHeight);

          loadedImages++;
          if (loadedImages === totalCells) {
            // All images loaded, convert canvas to data URL
            setImageSrc(canvas.toDataURL('image/png', 0.8));
          }
        };

        img.onerror = () => {
          // Fallback: draw placeholder
          ctx.fillStyle = PLACEHOLDER_COLOR;
          ctx.fillRect(x, y, drawWidth, drawHeight);

          loadedImages++;
          if (loadedImages === totalCells) {
            setImageSrc(canvas.toDataURL('image/png', 0.8));
          }
        };

        img.src = `/works/${imageFile}`;
        posterIdx++;
      }
    }

    // Fallback: if no images load within 3 seconds, just use the basic canvas
    const fallbackTimer = setTimeout(() => {
      if (loadedImages < totalCells) {
        setImageSrc(canvas.toDataURL('image/png', 0.8));
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [seed]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
      {imageSrc && (
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center opacity-90 ${className}`}
          style={{
            backgroundImage: `url(${imageSrc})`,
          }}
        />
      )}
    </>
  );
}
