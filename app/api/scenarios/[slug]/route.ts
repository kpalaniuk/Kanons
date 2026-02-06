import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getScenario, updateScenario, deleteScenario } from "@/lib/kv";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const scenario = await getScenario(params.slug);
    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }
    return NextResponse.json(scenario);
  } catch (e: any) {
    console.error("[API] GET /api/scenarios/[slug] error:", e);
    return NextResponse.json({ error: e.message || "Failed to load scenario" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const updated = await updateScenario(params.slug, data);
    if (!updated) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("[API] PUT /api/scenarios/[slug] error:", e);
    return NextResponse.json({ error: e.message || "Failed to update scenario" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await deleteScenario(params.slug);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[API] DELETE /api/scenarios/[slug] error:", e);
    return NextResponse.json({ error: e.message || "Failed to delete scenario" }, { status: 500 });
  }
}
