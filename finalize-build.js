const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  console.log('// === RUNNING FINALIZE BUILD PROTOCOL ===');
  const outPath = path.join(__dirname, 'out');
  const distPath = path.join(__dirname, 'dist');

  if (!fs.existsSync(outPath)) {
    console.error('Error: "out" directory was not found!');
    console.log('List of root files:', fs.readdirSync(__dirname));
    throw new Error('Next.js build did not produce the "out/" export directory. Make sure next build completed.');
  }

  const outFiles = fs.readdirSync(outPath);
  console.log(`// Files found in "out" path:`, outFiles);
  if (outFiles.length === 0) {
    throw new Error('The "out" directory is empty! Critical failure in static export production.');
  }

  // Clear or prepare dist
  if (fs.existsSync(distPath)) {
    console.log('// Removing existing "dist" directory...');
    fs.rmSync(distPath, { recursive: true, force: true });
  }

  console.log('// Copying static exports recursively to "dist" directory...');
  copyRecursiveSync(outPath, distPath);

  const distFiles = fs.readdirSync(distPath);
  console.log('// Copy completed successfully.');
  console.log(`// Verified elements in "dist":`, distFiles);

  if (distFiles.length === 0) {
    throw new Error('The destination "dist" directory remains empty after copy protocol.');
  }

  console.log('// === BUILD FINALIZATION COMPLETED SUCCESSFULLY ===');
} catch (err) {
  console.error('// Build finalization script failed:', err.message);
  process.exit(1);
}
