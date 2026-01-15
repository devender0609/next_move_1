import type { DecisionRequest, Recommendation, TaskInput } from "@/lib/types";

function scoreTask(t: TaskInput, req: DecisionRequest) {
  // Heuristic:
  // - Favor high impact
  // - Penalize effort if energy is low
  // - Penalize anxiety slightly
  // - Add small bonus if deadline exists and is near
  const energyFactor = req.energy <= 2 ? 1.4 : req.energy === 3 ? 1.15 : 1.0;

  const impact = t.impact * 2.2;
  const effortPenalty = t.effort * 1.7 * energyFactor;
  const anxietyPenalty = t.anxiety * 0.6;

  let deadlineBonus = 0;
  if (t.deadline) {
    const d = new Date(t.deadline).getTime();
    const now = Date.now();
    const days = (d - now) / (1000 * 60 * 60 * 24);
    if (days <= 1) deadlineBonus = 2.0;
    else if (days <= 3) deadlineBonus = 1.2;
    else if (days <= 7) deadlineBonus = 0.6;
  }

  // Time fit penalty: if effort high and time is short, penalize
  const timePenalty = req.time_minutes < 30 && t.effort >= 4 ? 1.2 : 0;

  const score = impact + deadlineBonus - effortPenalty - anxietyPenalty - timePenalty;
  return score;
}

export function decideWithRules(req: DecisionRequest): Recommendation {
  const scored = req.tasks
    .map((t) => ({ t, s: scoreTask(t, req) }))
    .sort((a, b) => b.s - a.s);

  const best = scored[0];
  const second = scored[1];

  const gap = second ? best.s - second.s : 999;
  const confidence: Recommendation["confidence"] =
    gap > 2 ? "high" : gap > 0.8 ? "medium" : "low";

  const rationale =
    `Pick "${best.t.title}" because it scores highest for your goal: ` +
    `high impact relative to effort given your current energy (${req.energy}/5)` +
    (best.t.deadline ? ` and it has a relevant deadline.` : ".");

  const alternatives = scored.slice(1, 3).map(({ t }) => ({
    title: t.title,
    why:
      t.impact >= 4
        ? "High impact, but may cost more energy/time."
        : "Lower lift, good if your energy drops.",
  }));

  return {
    selectedTaskTitle: best.t.title,
    rationale,
    confidence,
    alternatives,
  };
}
