#!/usr/bin/env node
const { spawn } = require('child_process');

// Run Next.js development server
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
});

nextProcess.on('error', (err) => {
  console.error('Failed to start Next.js:', err);
});