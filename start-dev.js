const { spawn } = require('child_process');
const path = require('path');

// Configuration
const SERVER_DIR = path.join(__dirname, 'server');
const CLIENT_DIR = path.join(__dirname, 'client');

console.log('🚀 Starting development environment...');

// Start the server
const server = spawn('npm', ['run', 'dev'], { 
  cwd: SERVER_DIR,
  shell: true,
  stdio: 'pipe'
});

// Start the client
const client = spawn('npm', ['start'], { 
  cwd: CLIENT_DIR,
  shell: true,
  stdio: 'pipe'
});

// Handle server output
server.stdout.on('data', (data) => {
  console.log(`[SERVER] ${data.toString().trim()}`);
});

server.stderr.on('data', (data) => {
  console.error(`[SERVER ERR] ${data.toString().trim()}`);
});

// Handle client output
client.stdout.on('data', (data) => {
  console.log(`[CLIENT] ${data.toString().trim()}`);
});

client.stderr.on('data', (data) => {
  console.error(`[CLIENT ERR] ${data.toString().trim()}`);
});

// Handle process exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development environment...');
  server.kill();
  client.kill();
  process.exit(0);
});

console.log('✅ Development environment started!');
console.log('👉 Press Ctrl+C to stop all processes'); 