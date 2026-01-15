import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1).max(140),
  impact: z.number().int().min(1).max(5),
  effort: z.number().int().min(1).max(5),
  anxiety: z.number().int().min(1).max(5),
  deadline: z.string().optional(),
});

export const decisionSchema = z.object({
  goal: z.string().min(1).max(240),
  time_minutes: z.number().int().min(5).max(600),
  energy: z.number().int().min(1).max(5),
  tasks: z.array(taskSchema).min(1).max(20),
});
