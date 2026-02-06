import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export async function GET() {
  const allKeys = Object.keys(process.env);
  const redisKeys = allKeys.filter(
    (k) =>
      k.toLowerCase().includes("redis") ||
      k.toLowerCase().includes("kv") ||
      k.toLowerCase().includes("upstash") ||
      k.toLowerCase().includes("kanons")
  );

  // Try to connect and diagnose
  const diagnostics: Record<string, any> = {
    found_env_vars: redisKeys,
    has_admin_password: !!process.env.ADMIN_PASSWORD,
    node_env: process.env.NODE_ENV,
  };

  // Check what we can derive from kanons_REDIS_URL
  const redisUrl = process.env.kanons_REDIS_URL;
  if (redisUrl) {
    try {
      const parsed = new URL(redisUrl);
      diagnostics.parsed_protocol = parsed.protocol;
      diagnostics.parsed_hostname = parsed.hostname;
      diagnostics.parsed_port = parsed.port;
      diagnostics.parsed_username = parsed.username;
      diagnostics.has_password = !!parsed.password;
      diagnostics.password_length = parsed.password?.length || 0;
      diagnostics.derived_rest_url = `https://${parsed.hostname}`;
    } catch (e: any) {
      diagnostics.parse_error = e.message;
    }
  }

  // Actually try connecting
  try {
    const url = process.env.kanons_REDIS_URL;
    if (url) {
      const parsed = new URL(url);
      const client = new Redis({
        url: `https://${parsed.hostname}`,
        token: parsed.password,
      });
      await client.ping();
      diagnostics.connection = "SUCCESS";
    } else {
      diagnostics.connection = "NO_URL";
    }
  } catch (e: any) {
    diagnostics.connection = "FAILED";
    diagnostics.connection_error = e.message;
    diagnostics.connection_error_name = e.name;
  }

  return NextResponse.json(diagnostics);
}
