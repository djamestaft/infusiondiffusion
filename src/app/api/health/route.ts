export function GET() {
  return Response.json({
    status: "ok",
    service: "infusion-diffusion",
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "development",
    timestamp: new Date().toISOString(),
  });
}
