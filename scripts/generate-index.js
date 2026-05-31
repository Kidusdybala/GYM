import fs from "fs/promises";
import path from "path";

const projectRoot = process.cwd();
const clientDir = path.resolve(projectRoot, "dist/client");
const manifestPath = path.resolve(projectRoot, "dist/server/.vite/manifest.json");

async function generateIndexHtml() {
  const manifestJson = await fs.readFile(manifestPath, "utf-8");
  const manifest = JSON.parse(manifestJson);

  const cssFile = manifest["C:/Users/user/Documents/GYM/src/styles.css"]?.file;
  const entryFile = manifest["_server-BnNEd8Q6.js"]?.file;

  const cssHref = cssFile ? `/assets/${path.basename(cssFile)}` : "/assets/styles-D9jJPAB3.css";
  const scriptSrc = entryFile ? `/assets/${path.basename(entryFile)}` : "/assets/index-Dm1EisBZ.js";

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
