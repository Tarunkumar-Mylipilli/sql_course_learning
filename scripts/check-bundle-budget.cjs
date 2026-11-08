const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const distAssets = path.join(__dirname, '..', 'dist', 'assets');
if (!fs.existsSync(distAssets)) {
  console.error('Dist assets not found!');
  process.exit(1);
}

const files = fs.readdirSync(distAssets).filter(f => f.endsWith('.js'));
let hasBudgetFailure = false;

console.log('\n--- Production Bundle Budget Audit ---');
files.forEach(f => {
  const filePath = path.join(distAssets, f);
  const rawSize = fs.statSync(filePath).size;
  const content = fs.readFileSync(filePath);
  const gzSize = zlib.gzipSync(content).length;

  console.log(`• ${f.padEnd(30)}: ${(rawSize / 1024).toFixed(2)} KB raw | ${(gzSize / 1024).toFixed(2)} KB gzipped`);

  // Target: No individual chunk exceeds 500 KB gzipped
  if (gzSize > 500 * 1024) {
    console.error(`🚨 BUDGET FAILURE: ${f} exceeds 500 KB gzipped limit!`);
    hasBudgetFailure = true;
  }
});

if (hasBudgetFailure) {
  process.exit(1);
}
console.log('✓ All chunks within performance budget (< 500 KB gzipped)!\n');
