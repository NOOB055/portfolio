/*
 * One-shot generator for the OpenGraph card (public/og-default.png,
 * 1200x630). Run `npm run og` after changing it; the PNG is committed.
 * Uses system fonts (DejaVu) — the card is terminal-styled on purpose.
 */
import sharp from 'sharp';

const accent = '#34d399';
const ink = '#f4f4f5';
const muted = '#a1a1aa';
const line = '#2a2a31';

const stages = ['build', 'test', 'secure', 'deploy', 'observe'];
const nodes = stages
	.map((label, i) => {
		const x = 80 + i * 235;
		const lit = i < 4; // line "in progress" — observe not yet reached
		return `
			<circle cx="${x}" cy="500" r="11" fill="#15151a" stroke="${lit ? accent : line}" stroke-width="3"/>
			${lit ? `<circle cx="${x}" cy="500" r="4" fill="${accent}"/>` : ''}
			<text x="${x}" y="550" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="22" fill="${lit ? muted : '#52525b'}">${label}</text>`;
	})
	.join('');

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
	<rect width="1200" height="630" fill="#15151a"/>
	<text x="80" y="130" font-family="DejaVu Sans Mono, monospace" font-size="36" fill="${accent}">~/joel.thomas</text>
	<text x="80" y="250" font-family="DejaVu Sans, sans-serif" font-size="60" font-weight="bold" fill="${ink}">DevSecOps engineer who keeps</text>
	<text x="80" y="330" font-family="DejaVu Sans, sans-serif" font-size="60" font-weight="bold" fill="${ink}">mission-critical deploys boring.</text>
	<text x="80" y="400" font-family="DejaVu Sans, sans-serif" font-size="28" fill="${muted}">AWS · Kubernetes · GitOps · PCI DSS &amp; SOC 2</text>
	<line x1="80" y1="500" x2="1120" y2="500" stroke="${line}" stroke-width="3"/>
	<line x1="80" y1="500" x2="785" y2="500" stroke="${accent}" stroke-width="3"/>
	${nodes}
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-default.png');
console.log('[og] public/og-default.png written (1200x630)');
