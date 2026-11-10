const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generate() {
  const width = 1024;
  const height = 500;

  // Read the 512x512 icon as base64 to embed in SVG
  const iconPath = path.join(__dirname, 'google_play_icon_512x512.png');
  const iconBase64 = fs.readFileSync(iconPath).toString('base64');

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a1026" />
        <stop offset="50%" stop-color="#14214d" />
        <stop offset="100%" stop-color="#1f357c" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#4ad1c7" />
        <stop offset="100%" stop-color="#3e7aa7" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.45" />
      </filter>
      <clipPath id="iconClip">
        <rect x="76" y="118" width="264" height="264" rx="56" />
      </clipPath>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Ambient Glow Circles -->
    <circle cx="180" cy="250" r="180" fill="#3e7aa7" opacity="0.25" filter="blur(60px)" />
    <circle cx="850" cy="180" r="160" fill="#4ad1c7" opacity="0.18" filter="blur(70px)" />
    <circle cx="950" cy="420" r="140" fill="#1f357c" opacity="0.4" filter="blur(50px)" />

    <!-- App Icon Card with Shadow -->
    <g filter="url(#shadow)">
      <rect x="76" y="118" width="264" height="264" rx="56" fill="#ffffff" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
      <image href="data:image/png;base64,${iconBase64}" x="76" y="118" width="264" height="264" clip-path="url(#iconClip)" preserveAspectRatio="xMidYMid slice" />
    </g>

    <!-- Text Container -->
    <!-- Pill Badge -->
    <g transform="translate(390, 130)">
      <rect width="270" height="34" rx="17" fill="rgba(74, 209, 199, 0.15)" stroke="rgba(74, 209, 199, 0.4)" stroke-width="1.5" />
      <text x="135" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#4ad1c7" text-anchor="middle" letter-spacing="1">
        VERIFIED FRESHER TALENT
      </text>
    </g>

    <!-- Brand Heading -->
    <text x="390" y="225" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1">
      Fresher2Work
    </text>

    <!-- Tagline Subtitle -->
    <text x="390" y="272" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="600" fill="#e2e8f0">
      Zero Bias. Real Proof of Work. Direct Hiring.
    </text>

    <!-- Feature Checklist Chips -->
    <g transform="translate(390, 312)">
      <!-- Chip 1 -->
      <g>
        <rect width="180" height="34" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
        <circle cx="20" cy="17" r="5" fill="#4ad1c7" />
        <text x="34" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#ffffff">
          Talent Passport
        </text>
      </g>

      <!-- Chip 2 -->
      <g transform="translate(195, 0)">
        <rect width="190" height="34" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
        <circle cx="20" cy="17" r="5" fill="#4ad1c7" />
        <text x="34" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#ffffff">
          Verified Projects
        </text>
      </g>

      <!-- Chip 3 -->
      <g transform="translate(400, 0)">
        <rect width="180" height="34" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
        <circle cx="20" cy="17" r="5" fill="#4ad1c7" />
        <text x="34" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#ffffff">
          Top Tech Recruiters
        </text>
      </g>
    </g>

    <!-- Footer URL -->
    <text x="390" y="386" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">
      Official Web &amp; Mobile Platform • fresher2work.com
    </text>
  </svg>
  `;

  const outputPath = path.join(__dirname, 'google_play_feature_graphic_1024x500.png');
  await sharp(Buffer.from(svg))
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outputPath);

  console.log('Generated feature graphic:', outputPath);
}

generate().catch(console.error);
