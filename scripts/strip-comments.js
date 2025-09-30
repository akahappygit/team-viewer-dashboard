// Strip comments from JS/TS/JSX/TSX and CSS files in the repository.
// Uses @babel/parser + @babel/generator for code files to safely remove comments.
// For CSS, removes block comments via regex.
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

import { parse } from '@babel/parser';
import generator from '@babel/generator';
const generate = generator.default || generator;

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const targets = [
  path.join(root, 'src'),
  root // include config files at repo root
];

const codeExts = new Set(['.js', '.jsx', '.ts', '.tsx']);
const cssExts = new Set(['.css']);

function stripCodeComments(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  try {
    const ast = parse(code, {
      sourceType: 'unambiguous',
      allowReturnOutsideFunction: true,
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'decorators-legacy',
        'dynamicImport',
        'importMeta',
        'topLevelAwait',
        'optionalChaining',
        'nullishCoalescingOperator'
      ]
    });
    const output = generate(ast, { comments: false, retainLines: true }, code).code;
    fs.writeFileSync(filePath, output, 'utf8');
    return true;
  } catch (err) {
    // If parsing fails, do not modify the file.
    return false;
  }
}

function stripCssComments(filePath) {
  const css = fs.readFileSync(filePath, 'utf8');
  // Remove all /* ... */ comments (non-greedy, multiline)
  const output = css.replace(/\/\*[\s\S]*?\*\//g, '');
  fs.writeFileSync(filePath, output, 'utf8');
  return true;
}

function processDir(dir) {
  const patterns = [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
    '**/*.css'
  ];
  patterns.forEach((pattern) => {
    const files = globSync(pattern, { cwd: dir, nodir: true, absolute: true, ignore: ['**/node_modules/**', '**/dist/**'] });
    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      let changed = false;
      if (codeExts.has(ext)) {
        changed = stripCodeComments(file);
      } else if (cssExts.has(ext)) {
        changed = stripCssComments(file);
      }
      if (changed) {
        console.log(`Stripped comments: ${path.relative(root, file)}`);
      }
    });
  });
}

targets.forEach(processDir);
console.log('Comment stripping complete.');