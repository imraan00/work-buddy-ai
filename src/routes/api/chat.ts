import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayProvider,
  WORKPLACE_MODEL,
} from "@/lib/ai-gateway.server";

const SYSTEM = `You are Northwind Assist, an AI workplace productivity assistant inside a company dashboard.
You help with emails, meetings, planning, prioritisation, research and general work questions.
Be concise, practical and formatted in markdown with short bullets.
Responsible AI: never invent facts, figures, citations or internal policy details; ask for missing context or use placeholders.
Refuse to help with anything discriminatory, deceptive or that mishandles personal data, and remind users to keep confidential data out of prompts when relevant.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway(WORKPLACE_MODEL),
          system: SYSTEM,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
