"use client";

import { useCallback, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import Avatar from "./avatar";

export default function AccountForm({ user }: { user: User }) {
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // Load the profile
  const getProfile = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, phone, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (error) setStatus(`Error: ${error.message}`);
    if (data) {
      setFullName(data.full_name ?? "");
      setPhone(data.phone ?? "");
      setAvatarUrl(data.avatar_url);
    }
    setLoading(false);
  }, [user.id, supabase]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  // Save the profile (upsert creates it if missing)
  async function updateProfile(newAvatarUrl?: string) {
    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      phone,
      avatar_url: newAvatarUrl ?? avatarUrl,
      updated_at: new Date().toISOString(),
    });
    setStatus(error ? `Error: ${error.message}` : "Profile saved!");
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col gap-3">
      <h1 className="text-2xl font-bold">My account</h1>

      {status && <p className="p-2 border">{status}</p>}

      <Avatar
        uid={user.id}
        url={avatarUrl}
        size={120}
        onUpload={(path) => {
          setAvatarUrl(path);
          updateProfile(path);
        }}
      />

      <label htmlFor="email">Email</label>
      <input id="email" type="text" value={user.email ?? ""} disabled className="border p-2 opacity-60" />

      <label htmlFor="fullName">Full name</label>
      <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border p-2" />

      <label htmlFor="phone">Phone</label>
      <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2" />

      <button onClick={() => updateProfile()} disabled={loading} className="border p-2">
        {loading ? "Loading..." : "Save profile"}
      </button>
    </div>
  );
}