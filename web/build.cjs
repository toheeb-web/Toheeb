const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[ChopConnect Build] Running universal build in web directory...');

const hasWebDir = fs.existsSync(path.join(__dirname, 'web'));

if (hasWebDir) {
  console.log('[ChopConnect Build] Found web/ subdirectory. Compiling web application...');
  execSync('npm --prefix web install', { stdio: 'inherit' });
  execSync('npm --prefix web run build', { stdio: 'inherit' });

  const webDist = path.join(__dirname, 'web', 'dist');
  const rootDist = path.join(__dirname, 'dist');
  if (fs.existsSync(webDist)) {
    try {
      fs.rmSync(rootDist, { recursive: true, force: true });
    } catch (e) {
      // Ignore
    }
    fs.cpSync(webDist, rootDist, { recursive: true });
  }
} else {
  console.log('[ChopConnect Build] Already in web app root directory. Building directly...');
  execSync('npm install', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
}

console.log('[ChopConnect Build] Build finished successfully.');
