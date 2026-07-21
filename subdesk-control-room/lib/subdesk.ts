export const MODEL = "gpt-5.6";
export const PROMPT_VERSION = "subdesk-creator-signal-v1";

export type Draft = { channel: string; headline: string; copy: string; cta: string };
export type CoreAnalysis = {
  summary: string;
  contentType: string;
  audienceRead: string;
  risks: string[];
  opportunities: string[];
  recommendedActions: string[];
  drafts: Draft[];
};

export const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    contentType: { type: "string" },
    audienceRead: { type: "string" },
    risks: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
    opportunities: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
    recommendedActions: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
    drafts: {
      type: "array",
      minItems: 1,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          channel: { type: "string" },
          headline: { type: "string" },
          copy: { type: "string" },
          cta: { type: "string" },
        },
        required: ["channel", "headline", "copy", "cta"],
      },
    },
  },
  required: ["summary", "contentType", "audienceRead", "risks", "opportunities", "recommendedActions", "drafts"],
} as const;

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function extractOutputText(payload: Record<string, unknown>) {
  if (typeof payload.output_text === "string") return payload.output_text;
  const output = Array.isArray(payload.output) ? payload.output : [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = Array.isArray((item as { content?: unknown[] }).content) ? (item as { content: unknown[] }).content : [];
    for (const part of content) {
      if (part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string") {
        return (part as { text: string }).text;
      }
    }
  }
  return "";
}

export function guidedDemo(source: string, goal: string, audience: string, channels: string[]): CoreAnalysis {
  const clean = source.replace(/\s+/g, " ").trim();
  const firstSentence = clean.split(/(?<=[.!?])\s+/)[0] || clean.slice(0, 180);
  return {
    summary: firstSentence.length > 180 ? `${firstSentence.slice(0, 177)}…` : firstSentence,
    contentType: "creator insight",
    audienceRead: `The strongest version speaks directly to ${audience.toLowerCase()} and makes the promised value concrete before asking for attention.`,
    risks: [
      "The lesson may disappear if the invitation arrives before the useful insight.",
      "Identical copy across channels can make the work feel automated instead of authored.",
    ],
    opportunities: [
      "Lead with the decision or transformation rather than the amount of work performed.",
      "Use one specific invitation so the right reader knows what to do next.",
    ],
    recommendedActions: [
      "Keep the creator's own language in the opening line.",
      `Measure success against the stated goal: ${goal}.`,
    ],
    drafts: channels.map((channel) => {
      const isNewsletter = channel === "Newsletter" || channel === "Blog";
      const isInstagram = channel === "Instagram";
      return {
        channel,
        headline: isInstagram ? "The useful part was deciding what mattered" : `A clearer way to ${goal.toLowerCase()}`,
        copy: isNewsletter
          ? `${firstSentence}\n\nThe shift was simple: stop generating more possibilities and make the first decision visible. For ${audience.toLowerCase()}, clarity is not decoration—it is the beginning of trust.`
          : isInstagram
            ? `${firstSentence}\n\nMore options were not the answer. A clearer first decision was. That is the work I want creators to keep control of.`
            : `${firstSentence}\n\nThe useful lesson: AI can expand the field, but the creator still has to name the decision. That is how the work stays authored—and how ${audience.toLowerCase()} know what to do next.`,
        cta: `Bring one piece of work that feels stuck and let's make the next decision obvious.`,
      };
    }),
  };
}
