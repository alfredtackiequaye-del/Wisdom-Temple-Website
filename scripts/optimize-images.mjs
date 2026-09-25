import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const sourceDirectories = [path.join(projectRoot, "public"), path.join(projectRoot, "src/assets")];
const outputDirectory = path.join(projectRoot, "public/assets/optimized");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png"]);

async function collectImages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "optimized") files.push(...await collectImages(fullPath));
    if (entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase())) files.push(fullPath);
  }
  return files;
}

await fs.mkdir(outputDirectory, { recursive: true });
const images = (await Promise.all(sourceDirectories.map(collectImages))).flat();
const manifest = {};

for (const sourcePath of images) {
  const name = `${path.basename(sourcePath, path.extname(sourcePath)).replace(/[^a-z0-9_-]/gi, "-")}.webp`;
  const outputPath = path.join(outputDirectory, name);
  await sharp(sourcePath)
    .rotate()
    .resize({ width: 2400, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(outputPath);
  manifest[path.relative(projectRoot, sourcePath)] = `/assets/optimized/${name}`;
}

await fs.writeFile(path.join(outputDirectory, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`Optimized ${images.length} images into public/assets/optimized`);
