
import app from "../dist/server/index.js";



export default async function handler(req: Request) {
  return app.fetch(req);
}
