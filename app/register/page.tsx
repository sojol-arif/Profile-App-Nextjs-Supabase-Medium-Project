import Link from "next/link";
import { signup } from "@/app/login/actions";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>

      {error && <p className="mb-3 p-2 border border-red-500">{error}</p>}

      <form action={signup} className="flex flex-col gap-2">
        <label htmlFor="full_name">Full name</label>
        <input id="full_name" name="full_name" type="text" required className="border p-2" />

        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" className="border p-2" />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="border p-2" />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={6} className="border p-2" />

        <button type="submit" className="border p-2 mt-2">Sign up</button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account? <Link href="/login" className="underline">Log in</Link>
      </p>
    </div>
  );
}