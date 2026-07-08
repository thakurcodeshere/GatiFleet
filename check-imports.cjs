const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/AI/.gemini/antigravity/scratch/GatiFleet/src/pages');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('useEffect(')) {
    const reactImport = content.match(/import\s+[^'"]*from\s+['"]react['"]/);
    if (reactImport && !reactImport[0].includes('useEffect')) {
      console.log('Missing useEffect in:', file);
    }
  }
});
