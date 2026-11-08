const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '..', 'src', 'data', 'modules');
const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.ts'));

const solutions = {};

files.forEach(f => {
  const content = fs.readFileSync(path.join(modulesDir, f), 'utf8');

  // Match JSON style blocks in interview50.ts
  const jsonRegex = /"id":\s*"([^"]+)"[\s\S]*?"solutionSql":\s*"([^"]+)"/g;
  let match;
  while ((match = jsonRegex.exec(content)) !== null) {
    solutions[match[1]] = match[2];
  }

  // Match TS object style: id: 'xxx', ... solutionSql: `...` or '...'
  const blockRegex = /id:\s*['"]([^'"]+)['"][\s\S]*?solutionSql:\s*(?:`([^`]+)`|'([^']+)'|"([^"]+)")/g;
  while ((match = blockRegex.exec(content)) !== null) {
    const id = match[1];
    const sol = match[2] || match[3] || match[4];
    if (id && sol) {
      solutions[id] = sol.trim();
    }
  }
});

console.log('Extracted solutions count:', Object.keys(solutions).length);

const outContent = `// Dynamically loaded solution chunk (isolated from main bundle)
// Limitation note: On client-side static sites, solutions loaded on demand are still inspectable via DevTools.
// For true non-bypassable validation, query results should be submitted to a backend evaluation server.

export const SOLUTIONS_MAP: Record<string, string> = ${JSON.stringify(solutions, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'solutionsRegistry.ts'), outContent);
console.log('Successfully wrote src/data/solutionsRegistry.ts');
