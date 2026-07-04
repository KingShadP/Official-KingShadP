const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { copyRecursiveSync, ensureDirSync, writeFileSyncWithDirs } = require("./fs-helpers");

test("copyRecursiveSync copies nested directories and files", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ksp-copy-"));
  const src = path.join(root, "src");
  const nested = path.join(src, "a", "b");
  const dest = path.join(root, "dest");

  ensureDirSync(nested);
  fs.writeFileSync(path.join(src, "root.txt"), "root");
  fs.writeFileSync(path.join(nested, "child.txt"), "child");

  copyRecursiveSync(src, dest);

  assert.equal(fs.readFileSync(path.join(dest, "root.txt"), "utf8"), "root");
  assert.equal(fs.readFileSync(path.join(dest, "a", "b", "child.txt"), "utf8"), "child");

  fs.rmSync(root, { recursive: true, force: true });
});

test("writeFileSyncWithDirs creates parent folders", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ksp-write-"));
  const filePath = path.join(root, "one", "two", "three.txt");

  writeFileSyncWithDirs(filePath, "ok");

  assert.equal(fs.readFileSync(filePath, "utf8"), "ok");
  fs.rmSync(root, { recursive: true, force: true });
});
