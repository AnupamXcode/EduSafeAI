/**
 * EduRisk AI - Full-Stack Local Development Runner
 * Concurrently boots:
 *   1. FastAPI Python Machine Learning Backend (Port 8000)
 *   2. React + TypeScript Vite Frontend (Port 5173)
 * Automatically opens browser to http://localhost:5173
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');

const isWin = os.platform() === 'win32';

console.log('='.repeat(65));
console.log('   EduRisk AI — Academic Analytics & Risk Prediction Platform');
console.log('   Launching FastAPI Backend (Port 8000) & Vite Frontend (Port 5173)');
console.log('='.repeat(65) + '\n');

// Detect Python command
const pythonCmd = isWin ? 'py' : 'python3';
const pythonArgs = isWin
  ? ['-3.11', '-m', 'uvicorn', 'app.main:app', '--app-dir', 'backend', '--port', '8000', '--host', '127.0.0.1']
  : ['-m', 'uvicorn', 'app.main:app', '--app-dir', 'backend', '--port', '8000', '--host', '127.0.0.1'];

// 1. Spawn FastAPI Backend
console.log('[Backend] Starting FastAPI Scikit-Learn server on http://127.0.0.1:8000 ...');
const backend = spawn(pythonCmd, pythonArgs, {
  cwd: __dirname,
  shell: true,
  stdio: 'pipe',
  env: { ...process.env, PYTHONUNBUFFERED: '1', LOKY_MAX_CPU_COUNT: '2' }
});

backend.stdout.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.log(`\x1b[32m[FastAPI]\x1b[0m ${line}`);
});

backend.stderr.on('data', (data) => {
  const line = data.toString().trim();
  if (line && !line.includes('warning') && !line.includes('UserWarning')) {
    console.log(`\x1b[32m[FastAPI]\x1b[0m ${line}`);
  }
});

backend.on('error', (err) => {
  console.error('\x1b[31m[FastAPI Error]\x1b[0m', err.message);
});

// 2. Spawn Vite Frontend
console.log('[Frontend] Starting React TypeScript Vite dev server on http://127.0.0.1:5173 ...\n');
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const frontend = spawn(npmCmd, ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true,
  stdio: 'pipe'
});

frontend.stdout.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.log(`\x1b[36m[Vite]\x1b[0m ${line}`);
});

frontend.stderr.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.error(`\x1b[33m[Vite Notice]\x1b[0m ${line}`);
});

frontend.on('error', (err) => {
  console.error('\x1b[31m[Vite Error]\x1b[0m', err.message);
});

// 3. Open browser after short delay
setTimeout(() => {
  const openCmd = isWin
    ? 'start http://localhost:5173'
    : os.platform() === 'darwin'
    ? 'open http://localhost:5173'
    : 'xdg-open http://localhost:5173';
  exec(openCmd, () => {});
  console.log('\n\x1b[35m[Browser]\x1b[0m Dispatched browser to \x1b[1mhttp://localhost:5173\x1b[0m\n');
}, 2500);

// Cleanup on exit
function shutdown() {
  console.log('\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
