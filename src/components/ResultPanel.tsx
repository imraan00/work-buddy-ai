import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Loader2, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResultPanel({
  title,
  result,
  isLoading,
  emptyHint,
  children,
}: {
  title: string;
  result: string;
  isLoading: boolean;
  emptyHint: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Card className="shadow-soft flex min-h-[24rem] flex-col">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {result && !isLoading ? (
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            Drafting with Lovable AI…
          </div>
        ) : result ? (
          <div className="ai-prose">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center text-sm text-muted-foreground">
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary">
              <Sparkle className="size-5 text-primary" />
            </span>
            <p className="max-w-xs">{emptyHint}</p>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-hero-gradient flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
