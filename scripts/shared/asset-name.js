function normalizeAssetFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/[\s,()_-]+/g, "_")
    .replace(/^[_\s]+|[_\s]+$/g, "")
    .replace(/_png$/i, ".png")
    .replace(/_jpg$/i, ".jpg")
    .replace(/_mp4$/i, ".mp4");
}

module.exports = {
  normalizeAssetFileName,
};
