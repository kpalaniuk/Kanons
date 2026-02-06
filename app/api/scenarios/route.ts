import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { listScenarios, createScenario, getScenario } from "@/lib/kv";

export async function GET(req: Request) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const scenarios = await listScenarios();
    return NextResponse.json(scenarios);
  } catch (e: any) {
    console.error("[API] GET /api/scenarios error:", e);
    return NextResponse.json({ error: e.message || "Failed to load scenarios" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    if (!data.slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    const existing = await getScenario(data.slug);
    if (existing) {
      return NextResponse.json({ error: "A scenario with this URL slug already exists" }, { status: 409 });
    }
    const scenario = await createScenario(data);
    return NextResponse.json(scenario, { status: 201 });
  } catch (e: any) {
    console.error("[API] POST /api/scenarios error:", e);
    return NextResponse.json({ error: e.message || "Failed to create scenario" }, { status: 500 });
  }
}
