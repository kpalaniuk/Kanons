import { supabase } from "./supabase";
import { Scenario } from "./types";

const TABLE = "purchase_scenarios";

export async function listScenarios(): Promise<Scenario[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`listScenarios: ${error.message}`);
  return (data || []).map((row) => ({
    ...(typeof row.data === "string" ? JSON.parse(row.data) : row.data),
    slug: row.slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getScenario(slug: string): Promise<Scenario | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`getScenario: ${error.message}`);
  }
  if (!data) return null;

  return {
    ...(typeof data.data === "string" ? JSON.parse(data.data) : data.data),
    slug: data.slug,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function createScenario(input: Scenario): Promise<Scenario> {
  const now = new Date().toISOString();
  const scenario: Scenario = { ...input, createdAt: now, updatedAt: now };

  const { error } = await supabase.from(TABLE).insert({
    slug: scenario.slug,
    data: scenario,
    created_at: now,
    updated_at: now,
  });

  if (error) throw new Error(`createScenario: ${error.message}`);
  return scenario;
}

export async function updateScenario(
  slug: string,
  patch: Partial<Scenario>
): Promise<Scenario | null> {
  const existing = await getScenario(slug);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: Scenario = { ...existing, ...patch, slug, updatedAt: now };

  const { error } = await supabase
    .from(TABLE)
    .update({ data: updated, updated_at: now })
    .eq("slug", slug);

  if (error) throw new Error(`updateScenario: ${error.message}`);
  return updated;
}

export async function deleteScenario(slug: string): Promise<boolean> {
  const { error } = await supabase.from(TABLE).delete().eq("slug", slug);
  if (error) throw new Error(`deleteScenario: ${error.message}`);
  return true;
}
