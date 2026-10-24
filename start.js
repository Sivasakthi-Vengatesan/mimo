const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse arguments (e.g. --host 0.0.0.0 --port 10000)
const args = process.argv.slice(2);
let port = process.env.PORT || '8000';
let host = '0.0.0.0';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1]) {
    port = args[i + 1];
    i++;
  } else if (args[i] === '--host' && args[i + 1]) {
    host = args[i + 1];
    i++;
  }
}

// Ensure frontend assets are built
const distIndex = path.join(__dirname, 'frontend', 'dist', 'index.html');
if (!fs.existsSync(distIndex)) {
  console.log('[start.js] Frontend dist not found. Building frontend assets...');
  try {
    execSync('npm --prefix frontend install && npm --prefix frontend run build', {
      stdio: 'inherit',
      cwd: __dirname
    });
    console.log('[start.js] Frontend built successfully.');
  } catch (err) {
    console.error('[start.js] Failed to build frontend:', err.message);
  }
}

// Start Uvicorn backend server
console.log(`[start.js] Starting MIMO app on http://${host}:${port}`);
const pyCmd = process.platform === 'win32' ? 'python' : 'python3';

function runServer(command) {
  const child = spawn(command, ['-m', 'uvicorn', 'backend.app.main:app', '--host', host, '--port', String(port)], {
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) }
  });

  child.on('error', (err) => {
    if (command === 'python3') {
      console.log('[start.js] python3 failed, trying python...');
      runServer('python');
    } else {
      console.error('[start.js] Failed to start server:', err);
      process.exit(1);
    }
  });

  child.on('close', (code) => {
    process.exit(code || 0);
  });

  process.on('SIGTERM', () => child.kill('SIGTERM'));
  process.on('SIGINT', () => child.kill('SIGINT'));
}

runServer(pyCmd);
