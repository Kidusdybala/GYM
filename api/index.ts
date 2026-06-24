// @ts-ignore
import app from "../dist/server/server.js";
import { IncomingMessage, ServerResponse } from "http";
import { createReadStream, existsSync, statSync } from "fs";
import { join, resolve } from "path";

const CLIENT_DIR = resolve(__dirname, "../dist/client");
const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webmanifest": "application/manifest+json",
};

function getMimeType(filePath: string): string {
  const ext = filePath.slice(filePath.lastIndexOf("."));
  return MIME_TYPES[ext] || "application/octet-stream";
}

async function serveStaticFile(req: IncomingMessage, res: ServerResponse, filePath: string): Promise<boolean> {
  const fullPath = join(CLIENT_DIR, filePath);
  
  if (!existsSync(fullPath)) {
    return false;
  }

  const stats = statSync(fullPath);
  if (stats.isDirectory()) {
    const indexPath = join(fullPath, "index.html");
    if (existsSync(indexPath)) {
      return serveStaticFile(req, res, filePath + "/index.html");
    }
    return false;
  }

  // Handle range requests for videos
  const range = req.headers.range;
  if (range && filePath.endsWith(".mp4")) {
    const size = stats.size;
    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    let start = parseInt(startStr, 10) || 0;
    let end = endStr ? parseInt(endStr, 10) : size - 1;
    
    if (start >= size) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` });
      res.end();
      return true;
    }
    
    const chunkSize = end - start + 1;
    const stream = createReadStream(fullPath, { start, end });
    
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": getMimeType(filePath),
    });
    
    stream.pipe(res);
    return true;
  }

  res.writeHead(200, {
    "Content-Type": getMimeType(filePath),
    "Content-Length": stats.size,
  });

  const stream = createReadStream(fullPath);
  stream.pipe(res);
  return true;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // First try to serve static files
  let filePath = req.url || "/";
  if (filePath === "/") {
    filePath = "/index.html";
  }

  const servedStatic = await serveStaticFile(req, res, filePath);
  if (servedStatic) {
    return;
  }

  // If not a static file, pass to the TanStack Start app
  const host = req.headers.host || "localhost";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const url = `${protocol}://${host}${req.url}`;

  const init: RequestInit = {
    method: req.method,
    headers: new Headers(),
  };

  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        for (const v of value) {
          init.headers.append(key, v);
        }
      } else {
        init.headers.set(key, value);
      }
    }
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req;
    // @ts-ignore
    init.duplex = "half";
  }

  const webRequest = new Request(url, init);
  const webResponse = await app.fetch(webRequest);

  res.statusCode = webResponse.status;
  for (const [key, value] of webResponse.headers.entries()) {
    res.setHeader(key, value);
  }

  if (webResponse.body) {
    const reader = webResponse.body.getReader();
    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) {
        res.end();
        return;
      }
      res.write(value);
      await pump();
    };
    await pump();
  } else {
    res.end();
  }
}
