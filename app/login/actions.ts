"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const err = (path: string, msg: string) =>
  redirect(`${path}?error=${encodeURIComponent(msg)}`);

// ---------- Log in ----------
export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) err("/login", error.message);

  revalidatePath("/", "layout");
  redirect("/account");
}

// ---------- Sign up ----------
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      // Saved in user metadata; the trigger copies it to profiles
      data: {
        full_name: formData.get("full_name") as string,
        phone: formData.get("phone") as string,
      },
    },
  });
  if (error) err("/register", error.message);

  redirect("/");
}

// ---------- Sign out ----------
export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// ---------- Forgot password ----------
export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${origin}/auth/confirm?next=/update-password` }
  );
  if (error) err("/forgot-password", error.message);

  redirect("/");
}

// ---------- Update password ----------
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (password !== confirm) err("/update-password", "Passwords do not match");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) err("/update-password", error.message);

  redirect("/account?message=Password updated");
}