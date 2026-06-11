/*
 * Post-build: one OpenGraph card per published blog post, written to
 * dist/og/<id>.png. Runs after astro build so new posts get cards with
 * zero extra steps; drafts are skipped like everywhere else.
 */
import sharp from 'sharp';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const BLOG = fileURLToPath(new URL('../src/content/blog/', import.meta.url));
const OUT = fileURLToPath(new URL('../dist/og/', import.meta.url));

const accent = '#34d399';
const ink = '#f4f4f5';
const muted = '#a1a1aa';
const line = '#2a2a31';

const escapeXml = (s) =>
	s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/* Greedy word-wrap tuned to the card's 56px bold face (~30 chars/line). */
const wrap = (text, max = 30) => {
	const lines = [''];
	for (const word of text.split(/\s+/)) {
		const current = lines[lines.length - 1];
		if (current && (current + ' ' + word).length > max) lines.push(word);
		else lines[lines.length - 1] = current ? `${current} ${word}` : word;
	}
	return lines.slice(0, 3);
};

const pipeline = ['build', 'test', 'secure', 'deploy', 'observe']
	.map((label, i) => {
		const x = 80 + i * 235;
		const lit = i < 4;
		return `
		<circle cx="${x}" cy="520" r="11" fill="#15151a" stroke="${lit ? accent : line}" stroke-width="3"/>
		${lit ? `<circle cx="${x}" cy="520" r="4" fill="${accent}"/>` : ''}
		<text x="${x}" y="566" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="20" fill="${lit ? muted : '#52525b'}">${label}</text>`;
	})
	.join('');

mkdirSync(OUT, { recursive: true });

let count = 0;
for (const file of readdirSync(BLOG)) {
	if (!file.endsWith('.mdx')) continue;
	const source = readFileSync(join(BLOG, file), 'utf8');
	const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
	if (/^draft:\s*true/m.test(frontmatter)) continue;
	const title = frontmatter
		.match(/^title:\s*(.+)$/m)?.[1]
		?.trim()
		.replace(/^['"]|['"]$/g, '');
	if (!title) continue;

	const titleLines = wrap(escapeXml(title))
		.map(
			(text, i) =>
				`<text x="80" y="${250 + i * 74}" font-family="DejaVu Sans, sans-serif" font-size="56" font-weight="bold" fill="${ink}">${text}</text>`,
		)
		.join('');

	const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
	<rect width="1200" height="630" fill="#15151a"/>
	<text x="80" y="120" font-family="DejaVu Sans Mono, monospace" font-size="30" fill="${accent}">~/joel.thomas <tspan fill="${muted}">/ blog</tspan></text>
	${titleLines}
	<line x1="80" y1="520" x2="1120" y2="520" stroke="${line}" stroke-width="3"/>
	<line x1="80" y1="520" x2="785" y2="520" stroke="${accent}" stroke-width="3"/>
	${pipeline}
</svg>`;

	const id = file.replace(/\.mdx$/, '');
	await sharp(Buffer.from(svg)).png().toFile(join(OUT, `${id}.png`));
	count++;
}
console.log(`[og] ${count} per-post card(s) -> dist/og/`);
