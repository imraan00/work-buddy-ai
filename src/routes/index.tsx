import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  ClipboardList,
  CalendarClock,
  BookOpenCheck,
  MessagesSquare,
  ArrowRight,
  Clock,
  Brain,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Northwind Assist AI Workplace Suite" },
      {
        name: "description",
        content:
          "Five AI workplace tools in one dashboard: email writer, meeting summariser, task planner, research assistant and workplace chat.",
      },
      { property: "og:title", content: "Northwind Assist — AI Workplace Suite" },
      {
        property: "og:description",
        content:
          "Automate routine workplace writing, planning and research from a single AI dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description:
      "Draft professional emails in Formal, Friendly, Persuasive, Apologetic or Concise tones.",
    url: "/email",
    icon: Mail,
    tag: "Communication",
  },
  {
    title: "Meeting Notes Summarizer",
    description:
      "Turn messy notes into an executive summary plus decisions, action items and deadlines.",
    url: "/meetings",
    icon: ClipboardList,
    tag: "Meetings",
  },
  {
    title: "AI Task Planner",
    description:
      "Prioritise your backlog and get a realistic daily or weekly time-blocked schedule.",
    url: "/planner",
    icon: CalendarClock,
    tag: "Planning",
  },
  {
    title: "AI Research Assistant",
    description:
      "Summarise topics or pasted articles into insights, implications and next steps.",
    url: "/research",
    icon: BookOpenCheck,
    tag: "Research",
  },
  {
    title: "Assistant Chat",
    description:
      "Ask anything about your work day and iterate on drafts conversationally.",
    url: "/assistant",
    icon: MessagesSquare,
    tag: "Chat",
  },
] as const;

const stats = [
  { label: "AI tools in one place", value: "5", icon: Brain },
  { label: "Typical drafting time saved", value: "~4h / week", icon: Clock },
  { label: "Human review required", value: "Always", icon: ShieldCheck },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="bg-hero-gradient shadow-lift relative overflow-hidden rounded-2xl px-6 py-10 text-primary-foreground sm:px-10 sm:py-14">
        <Badge className="bg-accent-gradient border-0 text-accent-foreground">
          Powered by Lovable AI
        </Badge>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
          Your workplace busywork, handled by one AI assistant
        </h1>
        <p className="mt-3 max-w-xl text-sm/relaxed text-primary-foreground/80 sm:text-base">
          Northwind Assist replaces the daily scramble of writing emails, cleaning up
          meeting notes, planning the week and researching topics — with carefully
          engineered prompts and a human always in the loop.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-gradient px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            Draft an email <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/assistant"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
          >
            Open assistant chat
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-soft">
            <CardContent className="flex items-center gap-3 pt-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <s.icon className="size-5" />
              </span>
              <div>
                <p className="text-lg font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold">AI workspace tools</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.url} to={tool.url} className="group">
              <Card className="shadow-soft hover:shadow-lift h-full transition-all group-hover:-translate-y-1">
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      <tool.icon className="size-5" />
                    </span>
                    <Badge variant="secondary">{tool.tag}</Badge>
                  </div>
                  <h3 className="text-base font-semibold">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <AiDisclaimer />
    </div>
  );
}
