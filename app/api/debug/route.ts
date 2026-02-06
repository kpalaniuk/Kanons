import { NextResponse } from "next/server";

export async function GET() {
  // Return names of Redis/KV-related env vars (never values) for debugging
  const allKeys = Object.keys(process.env);
  const redisKeys = allKeys.filter(
    (k) =>
      k.toLowerCase().includes("redis") ||
      k.toLowerCase().includes("kv") ||
      k.toLowerCase().includes("upstash") ||
      k.toLowerCase().includes("kanons")
  );

  return NextResponse.json({
    found: redisKeys,
    total_env_count: allKeys.length,
    node_env: process.env.NODE_ENV,
    has_admin_password: !!process.env.ADMIN_PASSWORD,
  });
}
