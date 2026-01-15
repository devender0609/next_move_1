import { NextResponse } from "next/server";
import { decisionSchema } from "@/lib/validate";
import { decideWithRules } from "@/lib/decide/rules";
import type { DecisionRequest } from "@/lib/types";

async function aiRationale(req: DecisionRequest, base: ReturnType<typeof decideWithRules>) {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!key) return base;

  try {
    const prompt = {
      role: "user",
      content: [
        "You are an assistant that rewrites decision recommendations clearly and briefly.",
        "Rules: do NOT change which task is recommended, do NOT invent facts.",
        "Return JSON with keys: rationale (string), alternatives (array of {title, why}), confidence (low|medium|high).",
        `Goal: ${req.goal}`,
        `Time minutes: ${req.time_minutes}`,
        `Energy: ${req.energy}/5`,
        `Tasks: ${JSON.stringify(req.tasks)}`,
        `Selected: ${base.selectedTaskTitle}`,
        `Base rationale: ${base.rationale}`,
        `Base alternatives: ${JSON.stringify(base.alternatives)}`,
        `Confidence: ${base.confidence}`
      ].join("\n")
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: "Output strictly valid JSON." }, prompt]
      })
    });

    if (!res.ok) return base;
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) return base;

    const parsed = JSON.parse(content);
    return {
      ...base,
      rationale: typeof parsed.rationale === "string" ? parsed.rationale : base.rationale,
      alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : base.alternatives,
      confidence: ["low", "medium", "high"].includes(parsed.confidence) ? parsed.confidence : base.confidence
    };
  } catch {
    return base;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = decisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const req = parsed.data as DecisionRequest;
  const base = decideWithRules(req);
  const enriched = await aiRationale(req, base);

  return NextResponse.json(enriched);
}
