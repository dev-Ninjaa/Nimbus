// Wrapper script to patch node-pty and run electron-builder install-app-deps + rebuild
const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

function patchBindingGyp() {
  const bindingGypPath = path.join(__dirname, '..', 'target', 'node_modules', 'node-pty', 'binding.gyp');
  
  if (fs.existsSync(bindingGypPath)) {
    let content = fs.readFileSync(bindingGypPath, 'utf8');
    
    // Remove the SpectreMitigation configuration entirely
    const newContent = content.replace(
      /\s*'SpectreMitigation':\s*'Spectre',?\s*/g,
      ''
    );
    
    if (content !== newContent) {
      fs.writeFileSync(bindingGypPath, newContent, 'utf8');
      console.log('✓ Fixed Spectre mitigation in node-pty binding.gyp');
      return true;
    }
  }
  return false;
}

try {
  // First patch binding.gyp before electron-builder runs (if it exists)
  patchBindingGyp();
  
  // Run electron-builder to install dependencies
  console.log('Running electron-builder install-app-deps...');
  try {
    execSync('electron-builder install-app-deps', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  } catch (builderError) {
    // electron-builder might fail if node-pty can't build
    // We'll try to fix and rebuild
    console.log('\\nelectron-builder had issues, will try to fix and rebuild...');
  }
  
  // Patch binding.gyp again (in case electron-builder reinstalled it)
  console.log('\\nPatching node-pty binding.gyp...');
  patchBindingGyp();
  
  // Now rebuild node-pty with the patched configuration
  console.log('\\nRebuilding node-pty...');
  try {
    execSync('yarn run rebuild-node-pty', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  } catch (rebuildError) {
    console.log('\\n⚠ node-pty rebuild skipped or failed');
    console.log('Note: Terminal functionality may be limited');
  }
  
  console.log('\\n✓ Installation complete!');
} catch (error) {
  console.error('Installation failed:', error.message);
  process.exit(1);
}
