"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendLink() {
    setBusy(true);
    setMsg(null);
    const supabase = supabaseBrowser();

    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/app/login`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setBusy(false);
    if (error) setMsg(error.message);
    else setMsg("Magic link sent! Check your email.");
  }

  async function logout() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    setMsg("Logged out.");
  }

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-2xl font-semibold">Login</h2>
      <p className="text-slate-600 text-sm">
        Enter your email to get a magic login link.
      </p>

      <input
        className="w-full rounded-lg border px-3 py-2"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="rounded-lg bg-slate-900 text-white px-4 py-2 disabled:opacity-60"
        onClick={sendLink}
        disabled={busy || !email.includes("@")}
      >
        {busy ? "Sending..." : "Send magic link"}
      </button>

      <button className="rounded-lg border px-4 py-2" onClick={logout}>
        Logout
      </button>

      {msg && <div className="text-sm text-slate-700">{msg}</div>}
    </div>
  );
}
