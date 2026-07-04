const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { finalizeBuild } = require("./finalize-build-core");

function quietLogger() {
  return { log: () => {}, error: () => {} };
}

test("finalizeBuild copies out to dist and replaces existing dist", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ksp-finalize-"));
  const out = path.join(root, "out");
  const oldDist = path.join(root, "dist");
  fs.mkdirSync(out, { recursive: true });
  fs.mkdirSync(path.join(out, "nested"), { recursive: true });
  fs.writeFileSync(path.join(out, "index.html"), "<html/>");
  fs.writeFileSync(path.join(out, "nested", "data.txt"), "payload");

  fs.mkdirSync(oldDist, { recursive: true });
  fs.writeFileSync(path.join(oldDist, "stale.txt"), "remove me");

  finalizeBuild({ rootDir: root, logger: quietLogger() });

  assert.equal(fs.existsSync(path.join(root, "dist", "stale.txt")), false);
  assert.equal(fs.readFileSync(path.join(root, "dist", "index.html"), "utf8"), "<html/>");
  assert.equal(fs.readFileSync(path.join(root, "dist", "nested", "data.txt"), "utf8"), "payload");

  fs.rmSync(root, { recursive: true, force: true });
});

test("finalizeBuild throws when out directory is missing", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ksp-finalize-"));

  assert.throws(
    () => finalizeBuild({ rootDir: root, logger: quietLogger() }),
    /did not produce the "out\/" export directory/
  );

  fs.rmSync(root, { recursive: true, force: true });
});

test("finalizeBuild throws when out directory is empty", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ksp-finalize-"));
  fs.mkdirSync(path.join(root, "out"), { recursive: true });

  assert.throws(
    () => finalizeBuild({ rootDir: root, logger: quietLogger() }),
    /"out" directory is empty/
  );

  fs.rmSync(root, { recursive: true, force: true });
});
