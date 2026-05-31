export const runtime = "edge";

export default async function handler(req: Request) {
  const { default: app } = await import("../vercel-entry");
  return app.fetch(req);
}
