/*
 * Post-build CSP generator: scans every built HTML file for inline
 * scripts, hashes them (SHA-256), and writes the complete
 * Content-Security-Policy into dist/_headers (replacing __CSP__).
 *
 * This keeps the policy strict — no 'unsafe-inline' for scripts —
 * without hand-maintaining hashes that change whenever a script does.
 * style-src allows inline styles because Shiki (syntax highlighting)
 * emits style attributes by design.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

const htmlFiles = [];
const walk = (dir) => {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) walk(path);
		else if (path.endsWith('.html')) htmlFiles.push(path);
	}
};
walk(DIST);

const hashes = new Set();
const inlineScript = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
for (const file of htmlFiles) {
	for (const [, body] of readFileSync(file, 'utf8').matchAll(inlineScript)) {
		if (body.trim().length === 0) continue;
		hashes.add(
			`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`,
		);
	}
}

const csp = [
	"default-src 'self'",
	`script-src 'self' ${[...hashes].join(' ')}`.trimEnd(),
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data:",
	"font-src 'self'",
	// web3forms: contact-form submission endpoint.
	"connect-src 'self' https://api.web3forms.com",
	"object-src 'none'",
	"base-uri 'self'",
	"frame-ancestors 'none'",
	"form-action 'self'",
].join('; ');

const headersPath = join(DIST, '_headers');
writeFileSync(
	headersPath,
	readFileSync(headersPath, 'utf8').replace('__CSP__', csp),
);
console.log(
	`[csp] ${hashes.size} inline script hash(es) across ${htmlFiles.length} pages -> dist/_headers`,
);
