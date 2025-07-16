"use client";

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { MOSAIC_CONFIG, MOCK_IMAGES, COLORS } from '../constants';
import { MosaicBackgroundProps } from '../../types';

const MosaicBackground = memo(({ seed = Date.now(), className = "" }: MosaicBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<string[]>([...MOCK_IMAGES]);

  // Seeded random number generator - memoized
  const seededRandom = useCallback((seedVal: number, increment: number = 1) => {
    const x = Math.sin(seedVal + increment) * 10000;
    return x - Math.floor(x);
  }, []);

  // Object-fit cover logic - memoized
  const calculateCropDimensions = useCallback((
    imgWidth: number,
    imgHeight: number,
    cellWidth: number,
    cellHeight: number
  ) => {
    const imgRatio = imgWidth / imgHeight;
    const cellRatio = cellWidth / cellHeight;
    let sx = 0, sy = 0, sw = imgWidth, sh = imgHeight;

    if (imgRatio > cellRatio) {
      sw = imgHeight * cellRatio;
      sx = (imgWidth - sw) / 2;
    } else {
      sh = imgWidth / cellRatio;
      sy = (imgHeight - sh) / 2;
    }

    return { sx, sy, sw, sh };
  }, []);

  // Generate mosaic canvas
  const generateMosaic = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const {
      WIDTH,
      HEIGHT,
      POSTER_RATIO,
      POSTER_HEIGHT,
      ROWS,
      POSTER_MARGIN,
      PLACEHOLDER_COLOR,
      FALLBACK_TIMEOUT
    } = MOSAIC_CONFIG;

    const POSTER_WIDTH = Math.round(POSTER_HEIGHT * POSTER_RATIO);
    const COLS = Math.ceil(WIDTH / POSTER_WIDTH);

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Shuffle images using seeded random
    const shuffled = [...images];
    // Fisher-Yates shuffle with seeded random
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed, i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Fill background
    ctx.fillStyle = COLORS.DARKER;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Track loaded images
    let loadedImages = 0;
    const totalCells = ROWS * COLS;
    const imagePromises: Promise<void>[] = [];

    // Create image loading promises with better error handling
    let posterIdx = 0;
    // Her hücreye farklı afiş yerleştir, fazlası için placeholder
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * POSTER_WIDTH + POSTER_MARGIN;
        const y = row * POSTER_HEIGHT + POSTER_MARGIN;
        const drawWidth = POSTER_WIDTH - 2 * POSTER_MARGIN;
        const drawHeight = POSTER_HEIGHT - 2 * POSTER_MARGIN;

        let imagePromise: Promise<void>;
        if (posterIdx < shuffled.length) {
          const imageFile = shuffled[posterIdx];
          imagePromise = new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
              try {
                const { sx, sy, sw, sh } = calculateCropDimensions(
                  img.width,
                  img.height,
                  drawWidth,
                  drawHeight
                );

                ctx.drawImage(img, sx, sy, sw, sh, x, y, drawWidth, drawHeight);
              } catch {
                ctx.fillStyle = PLACEHOLDER_COLOR;
                ctx.fillRect(x, y, drawWidth, drawHeight);
              }
              loadedImages++;
              resolve();
            };

            img.onerror = () => {
              ctx.fillStyle = PLACEHOLDER_COLOR;
              ctx.fillRect(x, y, drawWidth, drawHeight);
              loadedImages++;
              resolve();
            };

            img.src = `/works/${imageFile}`;
          });
        } else {
          // Fazla hücreler için placeholder
          imagePromise = new Promise<void>((resolve) => {
            ctx.fillStyle = PLACEHOLDER_COLOR;
            ctx.fillRect(x, y, drawWidth, drawHeight);
            loadedImages++;
            resolve();
          });
        }
        imagePromises.push(imagePromise);
        posterIdx++;
      }
    }

    // Set fallback timer
    fallbackTimerRef.current = setTimeout(() => {
      if (loadedImages < totalCells) {
        try {
          setImageSrc(canvas.toDataURL('image/png', 0.8));
        } catch {
          console.warn('Failed to generate mosaic data URL');
        }
        setIsLoading(false);
      }
    }, FALLBACK_TIMEOUT);

    // Wait for all images or timeout
    try {
      await Promise.all(imagePromises);
      setImageSrc(canvas.toDataURL('image/png', 0.8));
    } catch {
      console.warn('Some images failed to load for mosaic');
      try {
        setImageSrc(canvas.toDataURL('image/png', 0.8));
      } catch {
        console.warn('Failed to generate mosaic data URL');
      }
    } finally {
      setIsLoading(false);
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
    }
  }, [seed, seededRandom, calculateCropDimensions, images]);

  // Fetch images from API on mount
  useEffect(() => {
    let cancelled = false;
    fetch('/api/works-images')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (!cancelled && data.images && Array.isArray(data.images) && data.images.length > 0) {
          setImages(data.images);
        }
      })
      .catch(() => {
        // fallback: MOCK_IMAGES zaten default
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    generateMosaic();

    // Cleanup function
    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
    };
  }, [generateMosaic, images]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      {!isLoading && imageSrc && (
        <>
          <div
            className={`absolute inset-0 w-full h-full bg-cover bg-center opacity-90 ${className}`}
            style={{
              backgroundImage: `url(${imageSrc})`,
            }}
            role="img"
            aria-label="STD5 Works Mosaic Background"
          />
          {/* Üstten alta doğru azalan siyah gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 80%, rgba(0,0,0,0) 100%)'
            }}
          />
        </>
      )}
    </>
  );
});

MosaicBackground.displayName = 'MosaicBackground';

export default MosaicBackground;
