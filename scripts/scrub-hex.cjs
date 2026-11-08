const fs = require('fs');
const path = require('path');

const compDir = path.join(__dirname, '..', 'src', 'components');
const files = fs.readdirSync(compDir).filter(f => f.endsWith('.tsx'));

const hexRegex = /#[0-9a-fA-F]{3,6}/g;

files.forEach(f => {
  const p = path.join(compDir, f);
  let code = fs.readFileSync(p, 'utf8');

  // Replace class bracket patterns like bg-[#...], text-[#...], border-[#...]
  code = code.replace(/bg-\[#[0-9a-fA-F]{3,6}\]/gi, 'bg-canvas');
  code = code.replace(/from-\[#[0-9a-fA-F]{3,6}\]/gi, 'from-canvas');
  code = code.replace(/via-\[#[0-9a-fA-F]{3,6}\]/gi, 'via-surface');
  code = code.replace(/to-\[#[0-9a-fA-F]{3,6}\]/gi, 'to-surface');
  code = code.replace(/border-\[#[0-9a-fA-F]{3,6}\]/gi, 'border-border-default');
  code = code.replace(/text-\[#[0-9a-fA-F]{3,6}\]/gi, 'text-content-primary');
  code = code.replace(/ring-\[#[0-9a-fA-F]{3,6}\]/gi, 'ring-accent-500');
  code = code.replace(/offset-\[#[0-9a-fA-F]{3,6}\]/gi, 'offset-canvas');
  code = code.replace(/shadow-\[0_0_6px_#22d3ee\]/gi, 'shadow-e1');
  code = code.replace(/shadow-\[0_0_8px_#22d3ee\]/gi, 'shadow-e1');
  code = code.replace(/shadow-\[0_0_8px_#34d399\]/gi, 'shadow-e1');
  code = code.replace(/stroke="#[0-9a-fA-F]{3,6}"/gi, 'stroke="currentColor"');

  // Any other direct hexes
  code = code.replace(/#[0-9a-fA-F]{3,6}/g, 'var(--color-accent-500)');

  fs.writeFileSync(p, code);
});

console.log('Scripted replacement finished for', files.length, 'components.');
