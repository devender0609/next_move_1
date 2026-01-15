"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Recommendation, TaskInput } from "@/lib/types";

function TaskRow({
  t,
  onChange,
  onRemove,
}: {
  t: TaskInput;
  onChange: (patch: Partial<TaskInput>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="Task title"
          value={t.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <button className="rounded-lg border px-3 py-2" onClick={onRemove}>
          Remove
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        {(["impact", "effort", "anxiety"] as const).map((k) => (
          <label key={k} className="space-y-1">
            <div className="text-slate-600 capitalize">{k}</div>
            <input
              type="number"
              min={1}
              max={5}
              className="w-full rounded-lg border px-3 py-2"
              value={t[k]}
              onChange={(e) => onChange({ [k]: Number(e.target.value) } as any)}
            />
          </label>
        ))}
      </div>

      <label className="space-y-1 text-sm">
        <div className="text-slate-600">Deadline (optional)</div>
        <input
          type="date"
          className="w-full rounded-lg border px-3 py-2"
          value={t.deadline ?? ""}
          onChange={(e) => onChange({ deadline: e.target.value || undefined })}
        />
      </label>
    </div>
  );
}

export default function DecidePage() {
  const [goal, setGoal] = useState("Finish the most important thing.");
  const [timeMinutes, setTimeMinutes] = useState(45);
  const [energy, setEnergy] = useState(3);
  const [tasks, setTasks] = useState<TaskInput[]>([
    { title: "Email cleanup", impact: 2, effort: 2, anxiety: 2 },
    { title: "Work on presentation", impact: 5, effort: 4, anxiety: 3 },
  ]);

  const [rec, setRec] = useState<Recommendation | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function addTask() {
    setTasks((prev) => [...prev, { title: "", impact: 3, effort: 3, anxiety: 3 }]);
  }

  async function getRecommendation() {
    setBusy(true);
    setStatus(null);
    setRec(null);

    const res = await fetch("/api/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, time_minutes: timeMinutes, energy, tasks }),
    });

    setBusy(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus(err?.error || "Failed to decide.");
      return;
    }

    const data = (await res.json()) as Recommendation;
    setRec(data);
  }

  async function saveDecision() {
    setStatus(null);
    const supabase = supabaseBrowser();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      setStatus("Please login first (App → Login).");
      return;
    }
    if (!rec) {
      setStatus("Get a recommendation first.");
      return;
    }

    const { error } = await supabase.from("decisions").insert({
      user_id: auth.user.id,
      goal,
      time_minutes: timeMinutes,
      energy,
      tasks,
      recommendation: rec,
    });

    if (error) setStatus(error.message);
    else setStatus("Saved to history!");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">New Decision</h2>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="space-y-1">
          <div className="text-sm text-slate-600">Goal</div>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </label>

        <label className="space-y-1">
          <div className="text-sm text-slate-600">Time (minutes)</div>
          <input
            type="number"
            className="w-full rounded-lg border px-3 py-2"
            min={5}
            max={600}
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(Number(e.target.value))}
          />
        </label>

        <label className="space-y-1">
          <div className="text-sm text-slate-600">Energy (1–5)</div>
          <input
            type="number"
            className="w-full rounded-lg border px-3 py-2"
            min={1}
            max={5}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-medium">Tasks</h3>
        <button className="rounded-lg border px-4 py-2" onClick={addTask}>
          Add task
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((t, i) => (
          <TaskRow
            key={i}
            t={t}
            onChange={(patch) =>
              setTasks((prev) => prev.map((x, idx) => (idx === i ? { ...x, ...patch } : x)))
            }
            onRemove={() => setTasks((prev) => prev.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          className="rounded-lg bg-slate-900 text-white px-4 py-2 disabled:opacity-60"
          onClick={getRecommendation}
          disabled={busy || tasks.length === 0}
        >
          {busy ? "Thinking..." : "Recommend"}
        </button>

        <button className="rounded-lg border px-4 py-2" onClick={saveDecision} disabled={!rec}>
          Save to History
        </button>
      </div>

      {status && <div className="text-sm text-slate-700">{status}</div>}

      {rec && (
        <div className="rounded-xl border p-5 space-y-3">
          <div className="text-sm text-slate-500">Recommendation ({rec.confidence})</div>
          <div className="text-xl font-semibold">{rec.selectedTaskTitle}</div>
          <div className="text-slate-700">{rec.rationale}</div>

          {rec.alternatives?.length > 0 && (
            <div className="pt-2">
              <div className="text-sm font-medium">Alternatives</div>
              <ul className="list-disc pl-5 text-sm text-slate-700 mt-1 space-y-1">
                {rec.alternatives.map((a, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{a.title}:</span> {a.why}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
