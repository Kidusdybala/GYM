
export default async function handler(req: Request) {
  // @ts-ignore
  const { default: app } = await import("../dist/server/index.js");
  return app.fetch(req);
}
