import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const WATCH_DIRS = ['src', 'public'];
const WATCH_FILES = ['package.json', 'vite.config.js', 'index.html'];
const DEBOUNCE_MS = 3000;

let timeoutId = null;

console.log('👀 Continuous Sync: Watching for changes in workspace...');

const runSync = () => {
  console.log('🔄 Changes detected. Staging changes...');
  exec('git add .', (err) => {
    if (err) {
      console.error('❌ Error staging files:', err);
      return;
    }
    
    console.log('💾 Committing changes...');
    const commitMsg = `auto: workspace sync at ${new Date().toLocaleTimeString()}`;
    exec(`git commit -m "${commitMsg}"`, (commitErr, stdout, stderr) => {
      if (commitErr) {
        if (stdout.includes('nothing to commit') || stderr.includes('nothing to commit') || stdout.includes('clean')) {
          console.log('ℹ️ Nothing new to commit.');
        } else {
          console.error('❌ Error committing:', commitErr);
        }
        return;
      }
      console.log('✅ Commit complete. Output:\n', stdout);
    });
  });
};

const handleChange = (eventType, filename) => {
  if (!filename) return;
  
  // Ignore temp files, lock files, git, node_modules, dist
  if (
    filename.includes('.git') || 
    filename.includes('node_modules') || 
    filename.includes('dist') || 
    filename.endsWith('.swp') || 
    filename.endsWith('~')
  ) {
    return;
  }
  
  console.log(`📝 File modified: ${filename}`);
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(runSync, DEBOUNCE_MS);
};

// Watch directories recursively
WATCH_DIRS.forEach((dir) => {
  const dirPath = path.resolve(dir);
  if (fs.existsSync(dirPath)) {
    fs.watch(dirPath, { recursive: true }, handleChange);
  }
});

// Watch individual files
WATCH_FILES.forEach((file) => {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath)) {
    fs.watch(filePath, handleChange);
  }
});
