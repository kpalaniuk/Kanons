import { Redis } from "@upstash/redis";
import { Scenario } from "./types";

/**
 * Auto-detect Redis credentials from environment.
 * Vercel Redis marketplace injects env vars with a custom prefix.
 * We try multiple naming patterns to find the REST API credentials.
 * As a last resort, we derive REST credentials from the Redis protocol URL.
 */
function getRedisClient(): Redis {
  // Pattern 1: Direct REST API vars (Vercel KV style with prefix)
  if (process.env.kanons_KV_REST_API_URL && process.env.kanons_KV_REST_API_TOKEN) {
    return new Redis({
      url: process.env.kanons_KV_REST_API_URL,
      token: process.env.kanons_KV_REST_API_TOKEN,
    });
  }

  // Pattern 2: Upstash standard REST vars with prefix
  if (process.env.kanons_REST_URL && process.env.kanons_REST_TOKEN) {
    return new Redis({
      url: process.env.kanons_REST_URL,
      token: process.env.kanons_REST_TOKEN,
    });
  }

  // Pattern 3: Standard Upstash env vars (no prefix)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  // Pattern 4: Non-prefixed KV vars
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }

  // Pattern 5: Derive from Redis protocol URL
  // redis://default:{password}@{host}:{port} → REST: https://{host}, token: {password}
  const redisUrl = process.env.kanons_REDIS_URL || process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const parsed = new URL(redisUrl);
      const restUrl = `https://${parsed.hostname}`;
      const restToken = parsed.password;
      if (restUrl && restToken) {
        return new Redis({ url: restUrl, token: restToken });
      }
    } catch (e) {
      console.error("[KV] Failed to parse REDIS_URL:", e);
    }
  }

  // Log available env vars for debugging (names only, not values)
  const kvVars = Object.keys(process.env).filter(
    (k) => k.toLowerCase().includes("redis") || k.toLowerCase().includes("kv") || k.toLowerCase().includes("upstash")
  );
  console.error("[KV] No Redis credentials found. Available related env vars:", kvVars);

  throw new Error(
    "Redis not configured. Available env vars with redis/kv/upstash: " + kvVars.join(", ")
  );
}

const kv = getRedisClient();

const SCENARIOS_KEY = "scenarios:index";
const scenarioKey = (slug: string) => `scenario:${slug}`;

export async function listScenarios(): Promise<Scenario[]> {
  const slugs: string[] = (await kv.smembers(SCENARIOS_KEY)) || [];
  if (slugs.length === 0) return [];
  const pipeline = kv.pipeline();
  slugs.forEach((s) => pipeline.get(scenarioKey(s)));
  const results = await pipeline.exec();
  return (results.filter(Boolean) as Scenario[]).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getScenario(slug: string): Promise<Scenario | null> {
  return await kv.get<Scenario>(scenarioKey(slug));
}

export async function createScenario(data: Scenario): Promise<Scenario> {
  const now = new Date().toISOString();
  const scenario: Scenario = { ...data, createdAt: now, updatedAt: now };
  await kv.set(scenarioKey(scenario.slug), JSON.stringify(scenario));
  await kv.sadd(SCENARIOS_KEY, scenario.slug);
  return scenario;
}

export async function updateScenario(slug: string, data: Partial<Scenario>): Promise<Scenario | null> {
  const existing = await getScenario(slug);
  if (!existing) return null;
  const updated: Scenario = { ...existing, ...data, slug, updatedAt: new Date().toISOString() };
  await kv.set(scenarioKey(slug), JSON.stringify(updated));
  return updated;
}

export async function deleteScenario(slug: string): Promise<boolean> {
  await kv.del(scenarioKey(slug));
  await kv.srem(SCENARIOS_KEY, slug);
  return true;
}
