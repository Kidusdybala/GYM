// @ts-ignore
import app from "../dist/server/server.js";
import { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Convert Node.js IncomingMessage to Web Request
  const host = req.headers.host || "localhost";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const url = `${protocol}://${host}${req.url}`;

  const init: RequestInit = {
    method: req.method,
    headers: new Headers(),
  };

  // Copy headers from Node.js req to Web Headers
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

  // Handle body if it exists
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req;
    // @ts-ignore
    init.duplex = "half";
  }

  const webRequest = new Request(url, init);

  // Get Web Response from app.fetch()
  const webResponse = await app.fetch(webRequest);

  // Convert Web Response to Node.js ServerResponse
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
