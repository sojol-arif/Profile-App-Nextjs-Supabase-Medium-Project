import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/login/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "User Profile App",
  description: "Next.js + Supabase profile app with avatar upload",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="font-bold">Profile App</Link>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <Link href="/account">Account</Link>
                <form action={signout}>
                  <button type="submit">Sign out</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">Log in</Link>
                <Link href="/register">Sign up</Link>
              </>
            )}
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}