import { NextResponse } from "next/server";
import { checkPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  const token = checkPassword(password);
  if (!token) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  return NextResponse.json({ token });
}
