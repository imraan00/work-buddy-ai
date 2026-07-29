import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Northwind Assist" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in formal, friendly or persuasive tones with AI.",
      },
      { property: "og:title", content: "Smart Email Generator — Northwind Assist" },
      {
        property: "og:description",
        content: "AI-drafted business emails with tone and length control.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive", "Apologetic", "Concise"] as const;
const LENGTHS = ["Short", "Medium", "Detailed"] as const;

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const [length, setLength] = useState<(typeof LENGTHS)[number]>("Medium");

  const fn = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: () =>
      fn({ data: { purpose, recipient, keyPoints, tone, length } }),
    onError: (e: Error) => toast.error(e.message || "Could not generate the email."),
  });

  const submit = () => {
    if (purpose.trim().length < 3) {
      toast.error("Describe what the email should achieve.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the situation and get a polished, on-tone business email you can edit and send."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Email brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient / audience</Label>
              <Input
                id="recipient"
                maxLength={200}
                placeholder="e.g. Amina, Head of Operations"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">What should this email achieve?</Label>
              <Textarea
                id="purpose"
                rows={4}
                maxLength={2000}
                placeholder="Request a two-week extension on the Q3 supplier audit because the data export was delayed."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points (optional)</Label>
              <Textarea
                id="points"
                rows={3}
                maxLength={2000}
                placeholder="- New deadline: 14 August&#10;- Offer an interim summary next Friday"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select
                  value={tone}
                  onValueChange={(v) => setTone(v as (typeof TONES)[number])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select
                  value={length}
                  onValueChange={(v) => setLength(v as (typeof LENGTHS)[number])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={submit}
              disabled={mutation.isPending}
            >
              <Send className="size-4" />
              {mutation.isPending ? "Writing…" : "Generate email"}
            </Button>
            <AiDisclaimer context="Emails are AI drafts written only from the details you provide." />
          </CardContent>
        </Card>

        <ResultPanel
          title="Generated email"
          isLoading={mutation.isPending}
          result={mutation.data?.text ?? ""}
          emptyHint="Fill in the brief and your email draft will appear here, with a short note on why it works."
        />
      </div>
    </div>
  );
}
