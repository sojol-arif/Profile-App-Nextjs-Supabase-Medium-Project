import Link from "next/link";
import { forgotPassword } from "@/app/login/actions";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Forgot password</h1>

      {error && <p className="mb-3 p-2 border border-red-500">{error}</p>}

      <form action={forgotPassword} className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="border p-2" />
        <button type="submit" className="border p-2 mt-2">Send reset link</button>
      </form>

      <p className="mt-4 text-sm">
        <Link href="/login" className="underline">Back to log in</Link>
      </p>
    </div>
  );
}