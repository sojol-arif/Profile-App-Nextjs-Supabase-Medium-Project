"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string;
  url: string | null; // storage path, e.g. "<user-id>/avatar-123.png"
  size: number;
  onUpload: (path: string) => void;
}) {
  const [supabase] = useState(() => createClient());
  const [uploading, setUploading] = useState(false);

  const publicUrl = url
    ? supabase.storage.from("avatars").getPublicUrl(url).data.publicUrl
    : null;

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) throw new Error("Select an image to upload.");
      if (!file.type.startsWith("image/")) throw new Error("File must be an image.");
      if (file.size > MAX_SIZE) throw new Error("Image must be under 2 MB.");

      const ext = file.name.split(".").pop();
      const filePath = `${uid}/avatar-${Date.now()}.${ext}`;

      const { error } = await supabase.storage.from("avatars").upload(filePath, file);
      if (error) throw error;

      onUpload(filePath);
    } catch (error) {
      alert(`Upload failed: ${(error as Error).message}`);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {publicUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={publicUrl}
          alt="Avatar"
          style={{ width: size, height: size }}
          className="rounded-full object-cover"
        />
      ) : (
        <div style={{ width: size, height: size }} className="rounded-full bg-gray-300" />
      )}

      <label htmlFor="avatar" className="border p-2 cursor-pointer">
        {uploading ? "Uploading..." : "Upload avatar"}
      </label>
      <input
        id="avatar"
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="hidden"
      />
    </div>
  );
}