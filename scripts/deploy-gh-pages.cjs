const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building bundle for production...');
execSync('npm run build', { stdio: 'inherit' });

const distDir = path.resolve(__dirname, '..', 'dist');

// Ensure .nojekyll exists
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// Also preserve aliases for legacy hashed bundles so stale browser caches do not crash
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const mainFiles = fs.readdirSync(assetsDir).filter(f => f.startsWith('main-') && f.endsWith('.js'));
  if (mainFiles.length > 0) {
    const latestMain = path.join(assetsDir, mainFiles[0]);
    const legacyAliases = ['main-BliVB3h0.js', 'main-CrMHivBn.js', 'main-D5H91F2R.js', 'main-CB0xQj4d.js', 'main-DCkx8tFQ.js'];
    legacyAliases.forEach(alias => {
      fs.copyFileSync(latestMain, path.join(assetsDir, alias));
      console.log(`Created compatibility bundle: ${alias}`);
    });
  }
}

console.log('Deploying dist directory to gh-pages branch...');
try {
  execSync('git init', { cwd: distDir, stdio: 'inherit' });
  execSync('git checkout -b gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync('git commit -m "Deploy latest build to gh-pages"', { cwd: distDir, stdio: 'inherit' });
  execSync('git remote add origin https://github.com/Tarunkumar-Mylipilli/sql_course_learning.git', { cwd: distDir, stdio: 'inherit' });
  execSync('git push -f origin gh-pages', { cwd: distDir, stdio: 'inherit' });
  console.log('Successfully deployed to gh-pages!');
} finally {
  const gitDir = path.join(distDir, '.git');
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }
}
