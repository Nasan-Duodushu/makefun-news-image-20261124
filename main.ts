// Sum up 24 November's world news in one image: the repository holds the
// finished front-page illustration as asset.jpg — Ukraine's strike on a
// Russian warship docked in Benghazi, the Russian strike on Zaporizhzhia,
// the Israeli airstrike that killed Hamas's security chief in Gaza City,
// and the US states suing Musk's firms over Grok images — and this program
// copies it to entry.png in the output directory (the file is a JPEG,
// which the rules allow: the name stays entry.png and the format is told
// by its first bytes). The four stories were verified across AP, SCMP,
// Just Security and Naharnet before the page was drawn, and the date on
// the masthead is the day the page sums up: Tuesday 24 November 2026.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576;
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'asset.jpg');
if (!existsSync(source)) throw new Error('asset.jpg is missing from the entry');
const bytes = readFileSync(source);
if (bytes.length > MAX_BYTES) {
  throw new Error(`asset.jpg is ${bytes.length} bytes, over the 1 MiB limit`);
}
if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
  throw new Error('asset.jpg is not a whole JPEG (bad magic or end marker)');
}

const out = process.env['MAKEFUN_OUTPUT_DIR'] ?? '/output';
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'entry.png'), bytes, { mode: 0o644 });
