const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[ChopConnect Build] Running universal build...');

const hasWebDir = fs.existsSync(path.join(__dirname, 'web'));

if (hasWebDir) {
  console.log('[ChopConnect Build] Found web/ directory. Compiling web application...');
  execSync('npm --prefix web install', { stdio: 'inherit' });
  execSync('npm --prefix web run build', { stdio: 'inherit' });

  // Sync dist to root dist so Vercel can find it regardless of configured output directory
  const webDist = path.join(__dirname, 'web', 'dist');
  const rootDist = path.join(__dirname, 'dist');
  if (fs.existsSync(webDist)) {
    try {
      fs.rmSync(rootDist, { recursive: true, force: true });
    } catch (e) {
      // Ignore
    }
    fs.cpSync(webDist, rootDist, { recursive: true });
    console.log('[ChopConnect Build] Synced output into both ./dist and ./web/dist');
  }
} else {
  console.log('[ChopConnect Build] In web app root directory. Building directly...');
  execSync('npm install', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
}

console.log('[ChopConnect Build] Build finished successfully.');
