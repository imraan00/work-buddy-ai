import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { BookOpenCheck, Search } from "lucide-react";
import { toast } from "sonner";
import { researchTopic } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader, ResultPanel } from "@/components/ResultPanel";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Northwind Assist" },
      {
        name: "description",
        content:
          "Summarise topics or pasted articles into key insights, business implications and recommended next steps.",
      },
      { property: "og:title", content: "AI Research Assistant — Northwind Assist" },
      {
        property: "og:description",
        content: "Fast research briefs with explicit confidence and knowledge gaps.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick brief", "Standard", "Deep dive"] as const;

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [depth, setDepth] = useState<(typeof DEPTHS)[number]>("Standard");

  const fn = useServerFn(researchTopic);
  const mutation = useMutation({
    mutationFn: () => fn({ data: { topic, sourceText, depth } }),
    onError: (e: Error) => toast.error(e.message || "Could not complete the research."),
  });

  const submit = () => {
    if (topic.trim().length < 3) {
      toast.error("Enter a topic or research question.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={BookOpenCheck}
        title="AI Research Assistant"
        description="Ask a question or paste an article, and get a structured brief with insights, implications and next steps."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Research request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or question</Label>
              <Input
                id="topic"
                maxLength={1000}
                placeholder="How are mid-size logistics firms using AI for route planning?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select
                value={depth}
                onValueChange={(v) => setDepth(v as (typeof DEPTHS)[number])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPTHS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Article or source text (optional)</Label>
              <Textarea
                id="source"
                rows={10}
                maxLength={20000}
                placeholder="Paste an article, report extract or internal document to summarise…"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={submit} disabled={mutation.isPending}>
              <Search className="size-4" />
              {mutation.isPending ? "Researching…" : "Generate brief"}
            </Button>
            <AiDisclaimer context="This assistant has no live web access, so it never cites sources it cannot verify — check every fact and figure." />
          </CardContent>
        </Card>

        <ResultPanel
          title="Research brief"
          isLoading={mutation.isPending}
          result={mutation.data?.text ?? ""}
          emptyHint="Your summary, insights, business implications, next steps and confidence notes will appear here."
        />
      </div>
    </div>
  );
}
