// Copies the generated logo files from @unipal/brand into an app's public/brand folder,
// so favicons and downloads always match the pinned brand version. Run from the app directory.
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(join(process.cwd(), 'package.json'));
const logos = dirname(require.resolve('@unipal/brand/logos/symbol-group.svg'));
const target = join(process.cwd(), 'public', 'brand');

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(logos, target, { recursive: true });
console.log(`Copied @unipal/brand logos to ${target}`);
