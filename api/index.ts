// @ts-ignore
import app from "../dist/server/server.js";

export default async function handler(req: Request) {
  let url = req.url;
  if (!url.startsWith("http")) {
    const host = req.headers.get("host") || "localhost";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    url = `${protocol}://${host}${url}`;
  }

  // Create a new request with the absolute URL
  const newReq = new Request(url, req);
  return app.fetch(newReq);
}
