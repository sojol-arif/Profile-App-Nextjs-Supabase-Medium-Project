import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { message, error } = await searchParams;

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>

      {message && <p className="mb-3 p-2 border border-green-500">{message}</p>}
      {error && <p className="mb-3 p-2 border border-red-500">{error}</p>}

      <form action={login} className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="border p-2" />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required className="border p-2" />

        <button type="submit" className="border p-2 mt-2">Log in</button>
      </form>

      <div className="mt-4 flex flex-col gap-1 text-sm">
        <Link href="/forgot-password" className="underline">Forgot password?</Link>
        <p>
          No account? <Link href="/register" className="underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}