import fs from "fs/promises";
import path from "path";

const projectRoot = process.cwd();
const clientDir = path.resolve(projectRoot, "dist/client");
const assetsDir = path.resolve(clientDir, "assets");

async function generateIndexHtml() {
  // 1. Scan client assets directory
  const files = await fs.readdir(assetsDir);

  // 2. Find the CSS file (ending with .css)
  const cssFile = files.find((file) => file.endsWith(".css"));
  if (!cssFile) {
    throw new Error("No CSS file found in dist/client/assets");
  }
  const cssHref = `/assets/${cssFile}`;

  // 3. Find the main JS file
  // Look for files starting with "index-" and ending with ".js".
  // If there are multiple, choose the one with the largest file size (which is the main bundle).
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

  // 4. Generate index.html
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gym Tracker</title>
    <link rel="stylesheet" href="${cssHref}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${scriptSrc}"></script>
  </body>
</html>`;

  await fs.writeFile(path.join(clientDir, "index.html"), html);
  console.log("Generated index.html with assets:", cssHref, scriptSrc);
}

generateIndexHtml().catch((err) => {
  console.error(err);
  process.exit(1);
});
