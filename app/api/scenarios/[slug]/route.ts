import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getScenario, updateScenario, deleteScenario } from "@/lib/kv";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const scenario = await getScenario(params.slug);
  if (!scenario) {
    return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
  }
  return NextResponse.json(scenario);
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const updated = await updateScenario(params.slug, data);
  if (!updated) {
    return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteScenario(params.slug);
  return NextResponse.json({ ok: true });
}
