import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";

const cacheTagPrefix = "sanity:";
const maximumTagsPerRequest = 100;

function secretsMatch(actual: string | null, expected: string): boolean {
  if (!actual?.startsWith("Bearer ")) return false;

  const supplied = Buffer.from(actual.slice("Bearer ".length));
  const configured = Buffer.from(expected);

  return (
    supplied.length === configured.length &&
    timingSafeEqual(supplied, configured)
  );
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_TAGS_SECRET;

  if (!secret) {
    return Response.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  if (!secretsMatch(request.headers.get("authorization"), secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const tags =
    typeof body === "object" && body !== null && "tags" in body
      ? (body as { tags?: unknown }).tags
      : undefined;

  if (
    !Array.isArray(tags) ||
    tags.length === 0 ||
    tags.length > maximumTagsPerRequest ||
    !tags.every((tag) => typeof tag === "string" && tag.length > 0)
  ) {
    return Response.json(
      { error: `tags must contain 1-${maximumTagsPerRequest} strings` },
      { status: 400 },
    );
  }

  for (const tag of tags) {
    revalidateTag(`${cacheTagPrefix}${tag}`, { expire: 0 });
  }

  return Response.json({ revalidated: tags.length });
}
