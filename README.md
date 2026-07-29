# Northwind Assist — AI-Powered Workplace Productivity Assistant

## Project overview

Northwind Assist is a single integrated web application (one dashboard) that automates
the repetitive writing, planning and research work that eats into a normal workday.
Instead of five separate tools, the whole suite lives in one responsive dashboard with
sidebar navigation, a shared design system and a consistent Responsible AI framing.

The problem it solves: knowledge workers lose hours every week to drafting emails,
tidying meeting notes, re-planning their to-do list and skim-reading articles. Each
feature turns a messy human input into a structured, review-ready output.

## Features implemented

All five optional features from the brief are implemented (minimum was three):

1. **Smart Email Generator** (`/email`) — professional emails with tone control
   (Formal, Friendly, Persuasive, Apologetic, Concise), length control, recipient and
   key points. Output includes a subject line and a short "Why this works" rationale.
2. **Meeting Notes Summarizer** (`/meetings`) — converts raw notes or a transcript into
   an executive summary, decisions made, an **action item table (Action | Owner | Deadline)**,
   deadlines and open risks. Missing owners/dates are marked `[Unassigned]` / `[No deadline]`
   rather than invented.
3. **AI Task Planner / Scheduler** (`/planner`) — prioritises a raw task list using an
   urgency-vs-impact (Eisenhower) approach, then produces a time-blocked daily or weekly
   schedule that respects the stated working hours, plus coaching notes on what to drop.
4. **AI Research Assistant** (`/research`) — summarises a topic or a pasted article into
   key insights, business implications, recommended next steps and an explicit
   **confidence & gaps** section.
5. **AI Chatbot Interface** (`/assistant`) — streaming interactive workplace assistant
   with suggested prompts, markdown rendering and a "New conversation" reset.

Supporting UX:
- Dashboard landing page with hero, stats and tool cards
- Collapsible sidebar navigation (icon rail when collapsed, sheet drawer on mobile)
- Responsive two-column input/output layout on desktop, stacked on mobile
- Copy-to-clipboard on every generated output, loading and empty states, toast errors
- Responsible AI disclaimer on every feature page and in the sidebar

## Prompt engineering approach

- **Role + task + format**: every feature uses a dedicated system prompt that assigns a
  role (communication assistant, meeting analyst, productivity coach, research assistant)
  and specifies the exact markdown output structure, including tables where structure matters.
- **Parameterised prompts**: UI controls (tone, length, horizon, depth, working hours)
  are injected as explicit constraints instead of being buried in free text.
- **Grounding and anti-hallucination**: a shared ethics block instructs the model to use
  only supplied information, to use placeholders like `[DATE]` for gaps, never to invent
  statistics, names or citations, and to state uncertainty explicitly.
- **Self-explanation**: the email tool returns a brief rationale, making the AI's writing
  choices reviewable rather than opaque.

## Responsible AI practices

- Persistent disclaimer: outputs are drafts, a human is accountable for the final result.
- Users are reminded not to paste confidential or personal data into prompts.
- The research assistant states it has no live web access and must not fabricate sources.
- No AI content is auto-sent, auto-scheduled or stored; nothing leaves the browser session.
- Input validation and length limits (Zod, server-side) on every AI request.
- Neutral, inclusive tone enforced by prompt; harmful/deceptive requests are refused.

## Technologies and tools used

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start v1 (React 19, file-based routing, SSR) |
| Build | Vite 7 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 with a semantic oklch design-token system (`src/styles.css`) |
| UI | shadcn/ui (sidebar, card, select, tabs, textarea…), lucide-react icons, sonner toasts |
| Data/state | TanStack Query, React state |
| AI | Lovable AI (Vercel AI SDK v7 + `@ai-sdk/openai-compatible` via the Lovable AI Gateway), model `google/gemini-3.6-flash` |
| Validation | Zod |
| Markdown | react-markdown |
| AI tools used during development | Lovable AI, ChatGPT (prompt drafting/refinement) |

### Key files

```
src/lib/ai-gateway.server.ts   # Lovable AI Gateway provider (server-only)
src/lib/ai.functions.ts        # Server functions + prompts for the 4 generative tools
src/routes/api/chat.ts         # Streaming chat endpoint for the assistant
src/routes/__root.tsx          # Dashboard shell: sidebar + header + head metadata
src/routes/index.tsx           # Dashboard
src/routes/email|meetings|planner|research|assistant.tsx
src/components/AppSidebar.tsx  # Sidebar navigation
src/components/AiDisclaimer.tsx, ResultPanel.tsx
src/styles.css                 # Design system tokens + AI markdown styles
```

## Setup instructions

Requirements: Node 20+ (or Bun) and a Lovable Cloud/AI-enabled project.

```bash
bun install        # or: npm install
bun run dev        # starts the dev server on http://localhost:8080
bun run build      # production build
```

Environment: the app calls the Lovable AI Gateway using the server-side
`LOVABLE_API_KEY`, which Lovable provisions automatically — it is never exposed to the
browser. If you run this outside Lovable, set `LOVABLE_API_KEY` in your server
environment.

## Team members

- _Add your name(s) and roles here._
