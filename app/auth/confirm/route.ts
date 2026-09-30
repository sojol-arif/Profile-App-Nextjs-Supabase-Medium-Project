import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Handles links from Supabase emails (confirm signup + reset password).
// Works with BOTH email link styles:
//   1. token_hash link (custom template): /auth/confirm?token_hash=...&type=recovery&next=/update-password
//   2. code link (default template):      /auth/confirm?code=...&next=/update-password
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  // Only allow redirects inside this site
  const nextParam = searchParams.get("next") ?? "/account";
  const next = nextParam.startsWith("/") ? nextParam : "/account";

  const supabase = await createClient();

  // Style 1: token_hash
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) redirect(type === "recovery" ? "/update-password" : next);
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Style 2: code (default Supabase template)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect(next);
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?error=Invalid or expired link. Please request a new one.");
}