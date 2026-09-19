import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const base = process.env.APP_BASE_PATH || '/';
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('APP_BASE_PATH must start and end with /');
export default defineConfig({
  base,
  server: { host: '0.0.0.0', allowedHosts: true },
  preview: { host: '0.0.0.0', allowedHosts: true },
  plugins: [{
    name: 'precache-offline-app',
    closeBundle() {
      const assets = fs.readdirSync('dist/assets').map(f => `${base}assets/${f}`);
      const sw = fs.readFileSync('public/sw.js', 'utf8')
        .replace('const BUILD_ASSETS = [];', `const BUILD_ASSETS = ${JSON.stringify(assets)};`)
        .replace('build-v1', createHash('sha256').update(assets.join()).digest('hex').slice(0, 10));
      fs.writeFileSync(path.join('dist', 'sw.js'), sw);
    }
  }]
});
