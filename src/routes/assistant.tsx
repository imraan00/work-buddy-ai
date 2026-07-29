import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { MessagesSquare, RotateCcw, Send, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader } from "@/components/ResultPanel";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Assistant Chat — Northwind Assist" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant about emails, meetings, prioritisation and day-to-day work questions.",
      },
      { property: "og:title", content: "Assistant Chat — Northwind Assist" },
      {
        property: "og:description",
        content: "An interactive AI workplace assistant for everyday work questions.",
      },
    ],
  }),
  component: AssistantPage,
});

const SUGGESTIONS = [
  "Help me say no to a meeting request politely.",
  "Turn these three bullets into a status update for my manager.",
  "What should I prioritise if I only have four focus hours today?",
  "Draft an agenda for a 30-minute project kickoff.",
];

function AssistantPage() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) =>
      toast.error(e.message || "The assistant is unavailable right now."),
  });

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!isBusy) textareaRef.current?.focus();
  }, [isBusy]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || isBusy) return;
    void sendMessage({ text: value });
    setInput("");
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          icon={MessagesSquare}
          title="Assistant Chat"
          description="Your interactive workplace assistant — ask questions, iterate on drafts, unblock your day."
        />
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setMessages([])}>
            <RotateCcw className="size-4" /> New conversation
          </Button>
        )}
      </div>

      <Card className="shadow-soft">
        <CardContent className="flex h-[26rem] flex-col gap-4 overflow-y-auto pt-6 sm:h-[30rem]">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <span className="bg-hero-gradient flex size-12 items-center justify-center rounded-2xl text-primary-foreground">
                <MessagesSquare className="size-6" />
              </span>
              <p className="max-w-sm text-sm text-muted-foreground">
                Ask anything about your work day. Try one of these:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const text = message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("");
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <span className="bg-hero-gradient mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground">
                      N
                    </span>
                  )}
                  {isUser ? (
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                      {text}
                    </div>
                  ) : (
                    <div className="ai-prose max-w-[85%]">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  )}
                  {isUser && (
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <User className="size-4" />
                    </span>
                  )}
                </div>
              );
            })
          )}
          {status === "submitted" && (
            <p className="animate-pulse text-sm text-muted-foreground">Thinking…</p>
          )}
          <div ref={bottomRef} />
        </CardContent>
      </Card>

      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          rows={2}
          maxLength={4000}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Ask your workplace assistant… (Enter to send, Shift+Enter for a new line)"
          className="resize-none"
        />
        <Button
          size="icon"
          className="size-11 shrink-0"
          onClick={() => send(input)}
          disabled={isBusy || input.trim().length === 0}
        >
          <Send className="size-4" />
        </Button>
      </div>

      <AiDisclaimer context="This chat is not a substitute for HR, legal or financial advice, and conversations are not stored after you refresh." />
    </div>
  );
}
