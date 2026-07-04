const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeAssetFileName } = require("./asset-name");

test("normalizeAssetFileName cleans separators and casing", () => {
  assert.equal(
    normalizeAssetFileName("Model wearing(KingShadP),_2026 05 27.PNG"),
    "model_wearing_kingshadp_2026_05_27.png"
  );
});

test("normalizeAssetFileName preserves safe names", () => {
  assert.equal(
    normalizeAssetFileName("unisex-columbia-soft-shell-jacket-black-front-6a16eba5ad2c4.jpg"),
    "unisex_columbia_soft_shell_jacket_black_front_6a16eba5ad2c4.jpg"
  );
});

test("normalizeAssetFileName trims leading/trailing separators", () => {
  assert.equal(normalizeAssetFileName("__ Hero Reel __.mp4"), "hero_reel_.mp4");
});
