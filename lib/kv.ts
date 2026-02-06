import { createClient } from "@vercel/kv";
import { Scenario } from "./types";

// Create KV client using the kanons-prefixed env vars from Vercel Redis marketplace
const kv = createClient({
  url: process.env.kanons_KV_REST_API_URL!,
  token: process.env.kanons_KV_REST_API_TOKEN!,
});

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
  await kv.set(scenarioKey(scenario.slug), scenario);
  await kv.sadd(SCENARIOS_KEY, scenario.slug);
  return scenario;
}

export async function updateScenario(slug: string, data: Partial<Scenario>): Promise<Scenario | null> {
  const existing = await getScenario(slug);
  if (!existing) return null;
  const updated: Scenario = { ...existing, ...data, slug, updatedAt: new Date().toISOString() };
  await kv.set(scenarioKey(slug), updated);
  return updated;
}

export async function deleteScenario(slug: string): Promise<boolean> {
  await kv.del(scenarioKey(slug));
  await kv.srem(SCENARIOS_KEY, slug);
  return true;
}
