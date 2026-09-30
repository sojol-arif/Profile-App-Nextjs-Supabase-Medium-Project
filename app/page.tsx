import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">User Profile App</h1>
      <p className="mb-6">Sign up, edit your profile and upload an avatar.</p>

      {user ? (
        <Link href="/account" className="border p-2">Go to my account</Link>
      ) : (
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="border p-2">Log in</Link>
          <Link href="/register" className="border p-2">Sign up</Link>
        </div>
      )}
    </div>
  );
}