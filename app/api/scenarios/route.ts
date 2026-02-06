import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { listScenarios, createScenario, getScenario } from "@/lib/kv";

export async function GET(req: Request) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const scenarios = await listScenarios();
  return NextResponse.json(scenarios);
}

export async function POST(req: Request) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const existing = await getScenario(data.slug);
  if (existing) {
    return NextResponse.json({ error: "A scenario with this URL slug already exists" }, { status: 409 });
  }
  const scenario = await createScenario(data);
  return NextResponse.json(scenario, { status: 201 });
}
