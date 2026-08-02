import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const redirectTo = url.searchParams.get("redirect") ?? "/";

  if (
    !process.env.SANITY_PREVIEW_SECRET ||
    secret !== process.env.SANITY_PREVIEW_SECRET
  ) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  (await draftMode()).enable();
  redirect(redirectTo.startsWith("/") ? redirectTo : "/");
}
