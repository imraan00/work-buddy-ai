import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayProvider,
  requireApiKey,
  WORKPLACE_MODEL,
} from "./ai-gateway.server";

const ETHICS = `Responsible AI rules you must always follow:
- Never invent facts, names, numbers, dates or quotes that are not in the input. If something is missing, use a clear placeholder like [DATE] or state the assumption.
- Keep a respectful, inclusive, non-discriminatory professional tone.
- Do not include sensitive personal data beyond what the user supplied.
- Never present guesses as certainties; flag uncertainty explicitly.
Format the answer in clean markdown.`;

async function run(system: string, prompt: string) {
  const gateway = createLovableAiGatewayProvider(requireApiKey());
  const { text } = await generateText({
    model: gateway(WORKPLACE_MODEL),
    system: `${system}\n\n${ETHICS}`,
    prompt,
  });
  return { text };
}

/* ---------- 1. Smart Email Generator ---------- */

const EmailInput = z.object({
  purpose: z.string().trim().min(3).max(2000),
  recipient: z.string().trim().max(200).default(""),
  tone: z.enum(["Formal", "Friendly", "Persuasive", "Apologetic", "Concise"]),
  keyPoints: z.string().trim().max(2000).default(""),
  length: z.enum(["Short", "Medium", "Detailed"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EmailInput.parse(data))
  .handler(({ data }) =>
    run(
      `You are an expert workplace communication assistant writing business emails.
Structure: a subject line ("**Subject:** ..."), greeting, body, professional sign-off.
Match the requested tone exactly and keep it culturally neutral.
After the email, add a short "### Why this works" section with 2-3 bullets of writing rationale.`,
      `Write a business email.
Tone: ${data.tone}
Desired length: ${data.length}
Recipient / audience: ${data.recipient || "not specified — use a neutral greeting"}
Purpose: ${data.purpose}
Key points to include: ${data.keyPoints || "none supplied"}`,
    ),
  );

/* ---------- 2. Meeting Notes Summarizer ---------- */

const NotesInput = z.object({
  notes: z.string().trim().min(20).max(20000),
  meetingTitle: z.string().trim().max(200).default(""),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => NotesInput.parse(data))
  .handler(({ data }) =>
    run(
      `You are a meeting analyst. Summarise raw meeting notes into this exact markdown structure:
## Executive summary
3-5 bullets.
## Decisions made
Bullets; write "None recorded" if absent.
## Action items
A markdown table with columns: Action | Owner | Deadline. Use [Unassigned] / [No deadline] when not stated.
## Deadlines & key dates
Bullets.
## Risks & open questions
Bullets.
Only use information present in the notes.`,
      `Meeting title: ${data.meetingTitle || "Untitled meeting"}\n\nRaw notes:\n${data.notes}`,
    ),
  );

/* ---------- 3. AI Task Planner / Scheduler ---------- */

const PlannerInput = z.object({
  tasks: z.string().trim().min(5).max(5000),
  horizon: z.enum(["Daily", "Weekly"]),
  workHours: z.string().trim().max(100).default("09:00-17:00"),
  focus: z.string().trim().max(500).default(""),
});

export const planSchedule = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PlannerInput.parse(data))
  .handler(({ data }) =>
    run(
      `You are a productivity coach and scheduler. Produce:
## Prioritised tasks
A markdown table: Task | Priority (P1-P3) | Est. time | Rationale. Prioritise with urgency vs impact (Eisenhower).
## Schedule
A markdown table of time blocks (${"Daily"} => Time | Task | Focus level; Weekly => Day | Time block | Task). Include breaks and one buffer block per day.
## Coaching notes
3 bullets on realistic workload, dependencies and what to drop or delegate if time runs short.`,
      `Planning horizon: ${data.horizon}
Available working hours: ${data.workHours}
Priority focus / constraints: ${data.focus || "none supplied"}
Task list:
${data.tasks}`,
    ),
  );

/* ---------- 4. AI Research Assistant ---------- */

const ResearchInput = z.object({
  topic: z.string().trim().min(3).max(1000),
  sourceText: z.string().trim().max(20000).default(""),
  depth: z.enum(["Quick brief", "Standard", "Deep dive"]),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ResearchInput.parse(data))
  .handler(({ data }) =>
    run(
      `You are a workplace research assistant. Produce:
## Summary
## Key insights
## Implications for the business
## Recommended next steps
## Confidence & gaps
State clearly what you are unsure about and what should be verified with a primary source. You have no live web access, so never fabricate citations, statistics or URLs.`,
      `Depth requested: ${data.depth}
Topic / question: ${data.topic}
${data.sourceText ? `Article or source text supplied by the user:\n${data.sourceText}` : "No source text supplied — rely on general knowledge and flag uncertainty."}`,
    ),
  );
