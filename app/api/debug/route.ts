import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const diagnostics: Record<string, any> = {
    has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    has_admin_password: !!process.env.ADMIN_PASSWORD,
  };

  // Test Supabase connection
  try {
    const { data, error } = await getSupabase()
      .from("purchase_scenarios")
      .select("slug")
      .limit(1);

    if (error) {
      diagnostics.connection = "FAILED";
      diagnostics.error = error.message;
      diagnostics.error_code = error.code;
      diagnostics.hint = error.hint || null;
    } else {
      diagnostics.connection = "SUCCESS";
      diagnostics.row_count = data?.length || 0;
    }
  } catch (e: any) {
    diagnostics.connection = "ERROR";
    diagnostics.error = e.message;
  }

  return NextResponse.json(diagnostics);
}
