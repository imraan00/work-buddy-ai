import { ShieldCheck } from "lucide-react";

export function AiDisclaimer({ context }: { context?: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        <span className="font-semibold text-foreground">Responsible AI:</span>{" "}
        {context ??
          "Responses are AI-generated and may be incomplete or inaccurate."}{" "}
        Always review and edit before acting, keep confidential or personal data out
        of your prompts, and verify facts, figures and names with a trusted source.
        A human stays accountable for the final output.
      </p>
    </div>
  );
}
