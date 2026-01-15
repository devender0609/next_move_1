export type TaskInput = {
  title: string;
  impact: number;   // 1-5
  effort: number;   // 1-5
  anxiety: number;  // 1-5
  deadline?: string; // ISO date string (optional)
};

export type DecisionRequest = {
  goal: string;
  time_minutes: number;
  energy: number; // 1-5
  tasks: TaskInput[];
};

export type Recommendation = {
  selectedTaskTitle: string;
  rationale: string;
  confidence: "low" | "medium" | "high";
  alternatives: { title: string; why: string }[];
};
