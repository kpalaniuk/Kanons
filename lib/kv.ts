import { Redis } from "@upstash/redis";
import { Scenario } from "./types";

/**
 * Lazy-initialized Redis client.
 * Derives REST credentials from kanons_REDIS_URL if REST-specific vars aren't set.
 */
let _kv: Redis | null = null;

function getKv(): Redis {
  if (_kv) return _kv;

  // Pattern 1: Vercel KV style with kanons prefix
  if (process.env.kanons_KV_REST_API_URL && process.env.kanons_KV_REST_API_TOKEN) {
    _kv = new Redis({ url: process.env.kanons_KV_REST_API_URL, token: process.env.kanons_KV_REST_API_TOKEN });
    return _kv;
  }

  // Pattern 2: Upstash REST with kanons prefix
  if (process.env.kanons_REST_URL && process.env.kanons_REST_TOKEN) {
    _kv = new Redis({ url: process.env.kanons_REST_URL, token: process.env.kanons_REST_TOKEN });
    return _kv;
  }

  // Pattern 3: Standard Upstash env vars
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    _kv = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
    return _kv;
  }

  // Pattern 4: Non-prefixed KV
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    _kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
    return _kv;
  }

  // Pattern 5: Derive REST credentials from Redis protocol URL
  const redisUrl = process.env.kanons_REDIS_URL || process.env.REDIS_URL;
  if (redisUrl) {
    const parsed = new URL(redisUrl);
    _kv = new Redis({ url: `https://${parsed.hostname}`, token: parsed.password });
    return _kv;
  }

  throw new Error("No Redis credentials found in environment");
}

const SCENARIOS_KEY = "scenarios:index";
const scenarioKey = (slug: string) => `scenario:${slug}`;

export async function listScenarios(): Promise<Scenario[]> {
  const kv = getKv();
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
  const kv = getKv();
  return await kv.get<Scenario>(scenarioKey(slug));
}

export async function createScenario(data: Scenario): Promise<Scenario> {
  const kv = getKv();
  const now = new Date().toISOString();
  const scenario: Scenario = { ...data, createdAt: now, updatedAt: now };
  await kv.set(scenarioKey(scenario.slug), JSON.stringify(scenario));
  await kv.sadd(SCENARIOS_KEY, scenario.slug);
  return scenario;
}

export async function updateScenario(slug: string, data: Partial<Scenario>): Promise<Scenario | null> {
  const kv = getKv();
  const existing = await getScenario(slug);
  if (!existing) return null;
  const updated: Scenario = { ...existing, ...data, slug, updatedAt: new Date().toISOString() };
  await kv.set(scenarioKey(slug), JSON.stringify(updated));
  return updated;
}

export async function deleteScenario(slug: string): Promise<boolean> {
  const kv = getKv();
  await kv.del(scenarioKey(slug));
  await kv.srem(SCENARIOS_KEY, slug);
  return true;
}
