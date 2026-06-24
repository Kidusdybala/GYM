import fs from "fs/promises";
import path from "path";

const projectRoot = process.cwd();
const publicDir = path.resolve(projectRoot, "public");
const clientDir = path.resolve(projectRoot, "dist/client");
const assetsDir = path.resolve(clientDir, "assets");

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

async function generateIndexHtml() {
  // 1. Copy public directory contents to dist/client
  await copyDir(publicDir, clientDir);

  // 2. Scan client assets directory
  const files = await fs.readdir(assetsDir);

  // 3. Find the CSS file (ending with .css)
  const cssFile = files.find((file) => file.endsWith(".css"));
  if (!cssFile) {
    throw new Error("No CSS file found in dist/client/assets");
  }
  const cssHref = `/assets/${cssFile}`;

  // 4. Find the main JS file
  const jsFiles = files.filter((file) => file.startsWith("index-") && file.endsWith(".js"));
  if (jsFiles.length === 0) {
    throw new Error("No index-*.js files found in dist/client/assets");
  }

  let mainJsFile = jsFiles[0];
  if (jsFiles.length > 1) {
    let maxSize = 0;
    for (const file of jsFiles) {
      const stats = await fs.stat(path.join(assetsDir, file));
      if (stats.size > maxSize) {
        maxSize = stats.size;
        mainJsFile = file;
      }
    }
  }
  const scriptSrc = `/assets/${mainJsFile}`;

  // 5. Generate index.html
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gym Tracker</title>
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#000000" />
    <link rel="stylesheet" href="${cssHref}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${scriptSrc}"></script>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
              console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
              console.error('Service Worker registration failed:', error);
            });
        });
      }
    </script>
  </body>
</html>`;

  await fs.writeFile(path.join(clientDir, "index.html"), html);
  console.log("Generated index.html with assets:", cssHref, scriptSrc);
}

generateIndexHtml().catch((err) => {
  console.error(err);
  process.exit(1);
});
