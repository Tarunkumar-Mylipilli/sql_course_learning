const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building bundle for production...');
execSync('npm run build', { stdio: 'inherit' });

const distDir = path.resolve(__dirname, '..', 'dist');

// Ensure .nojekyll exists
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

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
