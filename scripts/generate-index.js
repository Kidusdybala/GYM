import fs from "fs/promises";
import path from "path";

const projectRoot = process.cwd();
const publicDir = path.resolve(projectRoot, "public");
const clientDir = path.resolve(projectRoot, "dist/client");

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  await copyDir(publicDir, clientDir);
  console.log("Copied public directory to dist/client");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
