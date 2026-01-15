"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Row = {
  id: string;
  created_at: string;
  goal: string;
  recommendation: any;
  user_feedback: string | null;
};

export default function HistoryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setMsg(null);
    const supabase = supabaseBrowser();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setMsg("Please login first (App → Login).");
      return;
    }

    const { data, error } = await supabase
      .from("decisions")
      .select("id, created_at, goal, recommendation, user_feedback")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) setMsg(error.message);
    else setRows((data as any) || []);
  }

  async function setFeedback(id: string, val: "helpful" | "not_helpful") {
    const supabase = supabaseBrowser();
    const { error } = await supabase.from("decisions").update({ user_feedback: val }).eq("id", id);
    if (error) setMsg(error.message);
    else load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">History</h2>
        <button className="rounded-lg border px-4 py-2" onClick={load}>
          Refresh
        </button>
      </div>

      {msg && <div className="text-sm text-slate-700">{msg}</div>}

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl border p-4 space-y-2">
            <div className="text-xs text-slate-500">
              {new Date(r.created_at).toLocaleString()}
            </div>
            <div className="text-sm text-slate-700">
              <span className="font-medium">Goal:</span> {r.goal}
            </div>
            <div className="text-lg font-semibold">
              {r.recommendation?.selectedTaskTitle ?? "—"}
            </div>
            <div className="text-sm text-slate-700">
              {r.recommendation?.rationale ?? ""}
            </div>

            <div className="flex gap-2 pt-2 flex-wrap">
              <button
                className="rounded-lg border px-3 py-1 text-sm"
                onClick={() => setFeedback(r.id, "helpful")}
              >
                Helpful
              </button>
              <button
                className="rounded-lg border px-3 py-1 text-sm"
                onClick={() => setFeedback(r.id, "not_helpful")}
              >
                Not helpful
              </button>
              {r.user_feedback && (
                <span className="text-xs text-slate-500 self-center">
                  Saved: {r.user_feedback}
                </span>
              )}
            </div>
          </div>
        ))}

        {rows.length === 0 && !msg && (
          <div className="text-slate-600">No saved decisions yet.</div>
        )}
      </div>
    </div>
  );
}
