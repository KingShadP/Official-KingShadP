const fs = require("fs");
const path = require("path");
const { copyRecursiveSync } = require("./shared/fs-helpers");

function finalizeBuild({
  rootDir = __dirname,
  outDirName = "out",
  distDirName = "dist",
  logger = console,
} = {}) {
  logger.log("// === RUNNING FINALIZE BUILD PROTOCOL ===");
  const outPath = path.join(rootDir, outDirName);
  const distPath = path.join(rootDir, distDirName);

  if (!fs.existsSync(outPath)) {
    logger.error('Error: "out" directory was not found!');
    logger.log("List of root files:", fs.readdirSync(rootDir));
    throw new Error('Next.js build did not produce the "out/" export directory. Make sure next build completed.');
  }

  const outFiles = fs.readdirSync(outPath);
  logger.log('// Files found in "out" path:', outFiles);
  if (outFiles.length === 0) {
    throw new Error('The "out" directory is empty! Critical failure in static export production.');
  }

  if (fs.existsSync(distPath)) {
    logger.log('// Removing existing "dist" directory...');
    fs.rmSync(distPath, { recursive: true, force: true });
  }

  logger.log('// Copying static exports recursively to "dist" directory...');
  copyRecursiveSync(outPath, distPath);

  const distFiles = fs.readdirSync(distPath);
  logger.log("// Copy completed successfully.");
  logger.log('// Verified elements in "dist":', distFiles);

  if (distFiles.length === 0) {
    throw new Error('The destination "dist" directory remains empty after copy protocol.');
  }

  logger.log("// === BUILD FINALIZATION COMPLETED SUCCESSFULLY ===");
}

module.exports = {
  finalizeBuild,
};
