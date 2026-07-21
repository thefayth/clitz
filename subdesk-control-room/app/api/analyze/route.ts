import { ensureSchema, getD1, getOpenAIKey } from "../../../db/runtime";
import { analysisSchema, extractOutputText, guidedDemo, MODEL, PROMPT_VERSION, sha256, type CoreAnalysis } from "../../../lib/subdesk";

type AnalyzeRequest = {
  title?: string;
  source?: string;
  goal?: string;
  audience?: string;
  channels?: string[];
  sessionId?: string;
};

const allowedChannels = new Set(["LinkedIn", "Instagram", "Newsletter", "YouTube", "Blog"]);

export async function POST(request: Request) {
  try {
    const body = await request.json() as AnalyzeRequest;
    const title = body.title?.trim().slice(0, 100) || "Untitled creator project";
    const source = body.source?.trim().slice(0, 6000) || "";
    const goal = body.goal?.trim().slice(0, 180) || "";
    const audience = body.audience?.trim().slice(0, 180) || "";
    const channels = [...new Set((body.channels || []).filter((channel) => allowedChannels.has(channel)))].slice(0, 5);
    const sessionId = body.sessionId?.trim().slice(0, 100) || crypto.randomUUID();

    if (source.length < 30 || goal.length < 6 || audience.length < 3 || channels.length === 0) {
      return Response.json({ error: "Add at least 30 characters of source material, a goal, an audience, and one channel." }, { status: 400 });
    }

    const [inputHash, sessionHash] = await Promise.all([
      sha256(source),
      sha256(`subdesk:${sessionId}`),
    ]);
    const runId = `run_${crypto.randomUUID()}`;
    const apiKey = getOpenAIKey();
    let analysis: CoreAnalysis;
    let mode: "gpt-5.6" | "guided-demo" = "guided-demo";
    let warning = "The hosted OpenAI key is not configured, so this run used the clearly labeled guided demo engine.";

    if (apiKey) {
      try {
        const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
          body: JSON.stringify({
            model: MODEL,
            store: false,
            reasoning: { effort: "low" },
            safety_identifier: sessionHash.slice(0, 64),
            instructions: [
              "You are Subdesk, a creator-control assistant.",
              "Help the creator understand and adapt their own material while preserving their authorship.",
              "Return distinct drafts for exactly the requested channels.",
              "Do not invent claims, metrics, testimonials, lived experiences, identities, or affiliations.",
              "Do not moralize about identity, politics, faith, sexuality, or dialect.",
              "Keep recommendations practical, family-safe, inclusive, and ready for human editing.",
              "Never imply that anything has been posted or approved.",
            ].join(" "),
            input: `Project: ${title}\nGoal: ${goal}\nAudience: ${audience}\nChannels: ${channels.join(", ")}\n\nCreator source material:\n${source}`,
            text: {
              verbosity: "low",
              format: { type: "json_schema", name: "subdesk_analysis", strict: true, schema: analysisSchema },
            },
            max_output_tokens: 2600,
          }),
        });
        const payload = await openAIResponse.json() as Record<string, unknown>;
        if (!openAIResponse.ok) {
          const error = payload.error && typeof payload.error === "object" ? JSON.stringify(payload.error) : `OpenAI returned ${openAIResponse.status}`;
          throw new Error(error);
        }
        const outputText = extractOutputText(payload);
        if (!outputText) throw new Error("The model returned no structured text.");
        analysis = JSON.parse(outputText) as CoreAnalysis;
        mode = "gpt-5.6";
        warning = "GPT‑5.6 analysis is ready. Review and edit every word before approving.";
      } catch (error) {
        analysis = guidedDemo(source, goal, audience, channels);
        warning = `GPT‑5.6 was temporarily unavailable, so Subdesk used its labeled guided-demo fallback. ${error instanceof Error ? error.message.slice(0, 160) : ""}`.trim();
      }
    } else {
      analysis = guidedDemo(source, goal, audience, channels);
    }

    const modelRoute = mode === "gpt-5.6" ? MODEL : "guided-demo-v1";
    let persistence: "durable" | "ephemeral" = "ephemeral";
    const db = getD1();
    if (db) {
      try {
        await ensureSchema(db);
        const recent = await db.prepare("SELECT COUNT(*) AS count FROM runs WHERE session_hash = ? AND created_at > datetime('now', '-1 hour')")
          .bind(sessionHash).first<{ count: number }>();
        if ((recent?.count || 0) >= 20) {
          return Response.json({ error: "This demo session reached its hourly analysis limit. Try again later." }, { status: 429 });
        }
        await db.prepare(`INSERT INTO runs
          (id, session_hash, input_hash, model, mode, goal, audience, channels_json, analysis_json)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(runId, sessionHash, inputHash, modelRoute, mode, goal, audience, JSON.stringify(channels), JSON.stringify(analysis)).run();
        persistence = "durable";
      } catch {
        persistence = "ephemeral";
      }
    }

    return Response.json({ runId, mode, model: modelRoute, inputHash, persistence, warning, promptVersion: PROMPT_VERSION, ...analysis });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to analyze this material." }, { status: 500 });
  }
}
