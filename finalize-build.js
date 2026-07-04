const { finalizeBuild } = require("./scripts/finalize-build-core");

try {
  finalizeBuild({ rootDir: __dirname });
} catch (err) {
  console.error("// Build finalization script failed:", err.message);
  process.exit(1);
}
