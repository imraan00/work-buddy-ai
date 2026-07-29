import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { CalendarClock, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { planSchedule } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader, ResultPanel } from "@/components/ResultPanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner & Scheduler — Northwind Assist" },
      {
        name: "description",
        content:
          "Turn a messy task list into a prioritised daily or weekly time-blocked schedule with AI.",
      },
      { property: "og:title", content: "AI Task Planner — Northwind Assist" },
      {
        property: "og:description",
        content: "Prioritise by urgency and impact, then get a realistic time-blocked plan.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<"Daily" | "Weekly">("Daily");
  const [workHours, setWorkHours] = useState("09:00-17:00");
  const [focus, setFocus] = useState("");

  const fn = useServerFn(planSchedule);
  const mutation = useMutation({
    mutationFn: () => fn({ data: { tasks, horizon, workHours, focus } }),
    onError: (e: Error) => toast.error(e.message || "Could not build the schedule."),
  });

  const submit = () => {
    if (tasks.trim().length < 5) {
      toast.error("Add the tasks you need to fit in.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={CalendarClock}
        title="AI Task Planner & Scheduler"
        description="Dump your task list, set your working hours, and get a prioritised, time-blocked plan you can actually finish."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Planning inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Planning horizon</Label>
              <Tabs
                value={horizon}
                onValueChange={(v) => setHorizon(v as "Daily" | "Weekly")}
              >
                <TabsList className="w-full">
                  <TabsTrigger className="flex-1" value="Daily">
                    Daily
                  </TabsTrigger>
                  <TabsTrigger className="flex-1" value="Weekly">
                    Weekly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Working hours</Label>
              <Input
                id="hours"
                maxLength={100}
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                placeholder="09:00-17:00, no meetings after 15:00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks (one per line)</Label>
              <Textarea
                id="tasks"
                rows={9}
                maxLength={5000}
                placeholder={"Finish supplier audit draft (due Friday)\nReview Priya's onboarding checklist\nPrepare board slides\n1:1 with Dan\nInbox triage"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="focus">Priorities or constraints (optional)</Label>
              <Textarea
                id="focus"
                rows={3}
                maxLength={500}
                placeholder="Audit is the top priority; protect two hours of deep work in the morning."
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={submit} disabled={mutation.isPending}>
              <ListChecks className="size-4" />
              {mutation.isPending ? "Planning…" : `Build ${horizon.toLowerCase()} plan`}
            </Button>
            <AiDisclaimer context="Suggested schedules are estimates — sanity-check effort, dependencies and your calendar." />
          </CardContent>
        </Card>

        <ResultPanel
          title="Prioritised plan"
          isLoading={mutation.isPending}
          result={mutation.data?.text ?? ""}
          emptyHint="Your priority table, time-blocked schedule and coaching notes will appear here."
        />
      </div>
    </div>
  );
}
