// Fix Spectre mitigation issue in node-pty binding.gyp
const fs = require('fs');
const path = require('path');

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
    console.log('Fixed Spectre mitigation in node-pty binding.gyp');
  } else {
    console.log('Spectre mitigation already fixed or not found in binding.gyp');
  }
} else {
  console.log('node-pty binding.gyp not found. Skipping Spectre mitigation fix.');
}
