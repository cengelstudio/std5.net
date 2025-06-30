import { NextRequest } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

const WIDTH = 1920;
const HEIGHT = 1080;
const POSTER_RATIO = 2 / 3;
const POSTER_HEIGHT = 360; // px
const POSTER_WIDTH = Math.round(POSTER_HEIGHT * POSTER_RATIO); // 240 px
const ROWS = 3;
const COLS = Math.ceil(WIDTH / POSTER_WIDTH);
const POSTER_MARGIN = 9; // px
const PLACEHOLDER_COLOR = '#222';

const postersDir = path.join(process.cwd(), 'public', 'works');

// Seeded random number generator
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export async function GET(req: NextRequest) {
  // Get seed from URL or use timestamp
  const { searchParams } = new URL(req.url);
  const seed = parseInt(searchParams.get('seed') || Date.now().toString(), 10);

  // Get all poster image filenames
  const files = fs.readdirSync(postersDir).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
  if (files.length === 0) {
    return new Response('No posters found', { status: 404 });
  }

  // Shuffle posters using seeded random
  const shuffled = [...files].sort(() => seededRandom(seed) - 0.5);

  // Create canvas
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Draw posters in a grid
  let posterIdx = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let found = false;
      let tryCount = 0;
      let file, imgPath, img;
      while (!found && tryCount < files.length) {
        file = shuffled[(posterIdx + tryCount) % shuffled.length];
        imgPath = path.join(postersDir, file);
        try {
          img = await loadImage(imgPath);
          found = true;
        } catch {
          tryCount++;
        }
      }
      const x = col * POSTER_WIDTH + POSTER_MARGIN;
      const y = row * POSTER_HEIGHT + POSTER_MARGIN;
      const drawWidth = POSTER_WIDTH - 2 * POSTER_MARGIN;
      const drawHeight = POSTER_HEIGHT - 2 * POSTER_MARGIN;
      if (found && img) {
        // object-fit: cover mantığı
        const imgRatio = img.width / img.height;
        const cellRatio = drawWidth / drawHeight;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (imgRatio > cellRatio) {
          // Görsel daha yatay, yanlardan kırp
          sw = img.height * cellRatio;
          sx = (img.width - sw) / 2;
        } else {
          // Görsel daha dikey, üstten/alttan kırp
          sh = img.width / cellRatio;
          sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, drawWidth, drawHeight);
      } else {
        // Fallback: dolu bir kutu çiz
        ctx.fillStyle = PLACEHOLDER_COLOR;
        ctx.fillRect(x, y, drawWidth, drawHeight);
      }
      posterIdx++;
    }
  }

  // Return PNG buffer
  const buffer = canvas.toBuffer('image/png');
  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store', // Disable caching
    },
  });
}
