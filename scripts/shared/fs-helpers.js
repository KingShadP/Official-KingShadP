const fs = require("fs");
const path = require("path");

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyRecursiveSync(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    ensureDirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
    return;
  }

  ensureDirSync(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function writeFileSyncWithDirs(filePath, content) {
  ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

module.exports = {
  ensureDirSync,
  copyRecursiveSync,
  writeFileSyncWithDirs,
};
