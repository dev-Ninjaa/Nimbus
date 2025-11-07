const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

const bindingGypPath = path.join(__dirname, '..', 'target', 'node_modules', 'node-pty', 'binding.gyp');

if (!fs.existsSync(bindingGypPath)) {
  console.log('❌ node-pty not found in target/node_modules');
  console.log('Run: yarn install first');
  process.exit(1);
}

console.log('Fixing Spectre mitigation in target/node_modules/node-pty...');
let content = fs.readFileSync(bindingGypPath, 'utf8');

// Remove the SpectreMitigation configuration entirely
const newContent = content.replace(
  /\s*'SpectreMitigation':\s*'Spectre',?\s*/g,
  ''
);

if (content !== newContent) {
  fs.writeFileSync(bindingGypPath, newContent, 'utf8');
  console.log('✓ Fixed Spectre mitigation');
} else {
  console.log('✓ Spectre mitigation already fixed');
}

// Now rebuild node-pty
console.log('\nRebuilding node-pty in target directory...');
try {
  execSync('npm rebuild node-pty', {
    cwd: path.join(__dirname, '..', 'target'),
    stdio: 'inherit',
    env: { ...process.env, npm_config_build_from_source: 'true' }
  });
  console.log('\n✓ node-pty rebuild complete!');
  
  // Verify the build
  const conptyPath = path.join(__dirname, '..', 'target', 'node_modules', 'node-pty', 'build', 'Release', 'conpty.node');
  if (fs.existsSync(conptyPath)) {
    console.log('✓ conpty.node built successfully');
  } else {
    console.log('⚠ conpty.node not found after build');
  }
} catch (err) {
  console.error('\n❌ Failed to rebuild node-pty:', err.message);
  process.exit(1);
}
