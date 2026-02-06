import { NextResponse } from "next/server";

export const maxDuration = 10;

export async function GET() {
  const allKeys = Object.keys(process.env);
  const redisKeys = allKeys.filter(
    (k) =>
      k.toLowerCase().includes("redis") ||
      k.toLowerCase().includes("kv") ||
      k.toLowerCase().includes("upstash") ||
      k.toLowerCase().includes("kanons")
  );

  const diagnostics: Record<string, any> = {
    found_env_vars: redisKeys,
    has_admin_password: !!process.env.ADMIN_PASSWORD,
  };

  // Parse the Redis URL to see what we're working with
  const redisUrl = process.env.kanons_REDIS_URL;
  if (redisUrl) {
    try {
      const parsed = new URL(redisUrl);
      diagnostics.protocol = parsed.protocol;
      diagnostics.hostname = parsed.hostname;
      diagnostics.port = parsed.port;
      diagnostics.has_password = !!parsed.password;
      diagnostics.password_length = parsed.password?.length || 0;
      diagnostics.derived_rest_url = `https://${parsed.hostname}`;

      // Try REST API with 4 second timeout
      const restUrl = `https://${parsed.hostname}`;
      const token = parsed.password;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      try {
        const res = await fetch(`${restUrl}/PING`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const body = await res.text();
        diagnostics.rest_status = res.status;
        diagnostics.rest_body = body.substring(0, 200);
        diagnostics.connection = res.ok ? "SUCCESS" : "FAILED";
      } catch (e: any) {
        clearTimeout(timeout);
        diagnostics.connection = "FAILED";
        diagnostics.rest_error = e.name === "AbortError" ? "TIMEOUT (4s)" : e.message;
      }
    } catch (e: any) {
      diagnostics.parse_error = e.message;
    }
  }

  return NextResponse.json(diagnostics);
}
