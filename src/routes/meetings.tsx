import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { ClipboardList, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader, ResultPanel } from "@/components/ResultPanel";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Northwind Assist" },
      {
        name: "description",
        content:
          "Summarise long meeting notes into decisions, action items with owners, and deadlines using AI.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Northwind Assist" },
      {
        property: "og:description",
        content: "Paste raw notes and get an executive summary plus a clear action table.",
      },
    ],
  }),
  component: MeetingsPage,
});

const SAMPLE = `Weekly ops sync - attendees: Sara, Dan, Priya, Mo
Sara: the supplier data export slipped again, vendor says API fix lands Thursday.
Dan: we agreed to push the audit report to 14 August rather than rush it.
Priya: onboarding checklist rewrite is done, needs Mo to review by Friday.
Mo: raised concern that two warehouses still use the old labels; wants budget sign-off.
Decision: proceed with phased rollout, region A first in September.
Dan will send the revised timeline to the client tomorrow.
Open question: who owns the label budget request?`;

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");

  const fn = useServerFn(summarizeMeeting);
  const mutation = useMutation({
    mutationFn: () => fn({ data: { notes, meetingTitle } }),
    onError: (e: Error) => toast.error(e.message || "Could not summarise the notes."),
  });

  const submit = () => {
    if (notes.trim().length < 20) {
      toast.error("Paste at least a few lines of meeting notes.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. Get a summary, the decisions made, action items with owners and every deadline."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Raw notes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setNotes(SAMPLE)}>
              Load sample
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting title (optional)</Label>
              <Input
                id="title"
                maxLength={200}
                placeholder="Weekly operations sync"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes or transcript</Label>
              <Textarea
                id="notes"
                rows={14}
                maxLength={20000}
                placeholder="Paste your meeting notes here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {notes.length.toLocaleString()} / 20,000 characters
              </p>
            </div>
            <Button className="w-full" onClick={submit} disabled={mutation.isPending}>
              <Wand2 className="size-4" />
              {mutation.isPending ? "Summarising…" : "Summarise notes"}
            </Button>
            <AiDisclaimer context="The summary only reflects what appears in your notes; missing owners or dates are marked as placeholders." />
          </CardContent>
        </Card>

        <ResultPanel
          title="Summary & action items"
          isLoading={mutation.isPending}
          result={mutation.data?.text ?? ""}
          emptyHint="Your executive summary, decisions, action table and deadlines will appear here."
        />
      </div>
    </div>
  );
}
