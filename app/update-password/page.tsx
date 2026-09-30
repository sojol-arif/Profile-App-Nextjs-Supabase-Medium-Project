import Link from "next/link";
import { updatePassword } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

// Reached from the reset-password email link (the user is logged in by /auth/confirm)
export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session = the reset link didn't work or has expired
  if (!user) {
    return (
      <div className="max-w-sm mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Link expired</h1>
        <p className="mb-4">This reset link is invalid or has expired. Please request a new one.</p>
        <Link href="/forgot-password" className="underline">Send a new reset link</Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Set a new password</h1>
      <p className="mb-4 text-sm">For {user.email}</p>

      {error && <p className="mb-3 p-2 border border-red-500">{error}</p>}

      <form action={updatePassword} className="flex flex-col gap-2">
        <label htmlFor="password">New password</label>
        <input id="password" name="password" type="password" required minLength={6} className="border p-2" />

        <label htmlFor="confirm">Confirm password</label>
        <input id="confirm" name="confirm" type="password" required minLength={6} className="border p-2" />

        <button type="submit" className="border p-2 mt-2">Update password</button>
      </form>
    </div>
  );
}
