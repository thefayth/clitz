import { ensureSchema, getD1 } from "../../../db/runtime";
import { MODEL, PROMPT_VERSION, sha256, type Draft } from "../../../lib/subdesk";

type ApproveRequest = { runId?: string; inputHash?: string; drafts?: Draft[]; sessionId?: string };

export async function POST(request: Request) {
  try {
    const body = await request.json() as ApproveRequest;
    const runId = body.runId?.trim() || "";
    const inputHash = body.inputHash?.trim() || "";
    const drafts = Array.isArray(body.drafts) ? body.drafts.slice(0, 5) : [];
    const sessionId = body.sessionId?.trim().slice(0, 100) || "preview";
    if (!runId || !/^[a-f0-9]{64}$/.test(inputHash) || drafts.length === 0) {
      return Response.json({ error: "A valid run, source fingerprint, and at least one reviewed draft are required." }, { status: 400 });
    }
    if (drafts.some((draft) => !draft.channel?.trim() || !draft.copy?.trim())) {
      return Response.json({ error: "Each approved draft needs a channel and content." }, { status: 400 });
    }

    const [sessionHash, outputHash] = await Promise.all([
      sha256(`subdesk:${sessionId}`),
      sha256(JSON.stringify(drafts)),
    ]);
    const receiptId = `sdr_${crypto.randomUUID()}`;
    let persistence: "durable" | "ephemeral" = "ephemeral";
    let model = MODEL;
    const db = getD1();
    if (db) {
      try {
        await ensureSchema(db);
        const run = await db.prepare("SELECT model FROM runs WHERE id = ? AND session_hash = ? AND input_hash = ?")
          .bind(runId, sessionHash, inputHash).first<{ model: string }>();
        if (!run) return Response.json({ error: "That analysis run could not be verified for this session." }, { status: 404 });
        model = run.model;
        await db.prepare(`INSERT INTO receipts
          (id, run_id, session_hash, input_hash, model, prompt_version, decision, output_json, output_hash)
          VALUES (?, ?, ?, ?, ?, ?, 'approved', ?, ?)`)
          .bind(receiptId, runId, sessionHash, inputHash, model, PROMPT_VERSION, JSON.stringify(drafts), outputHash).run();
        persistence = "durable";
      } catch (error) {
        if (error instanceof Response) throw error;
        persistence = "ephemeral";
      }
    }

    return Response.json({ receiptId, runId, inputHash, outputHash, model, promptVersion: PROMPT_VERSION, decision: "approved", approvedAt: new Date().toISOString(), persistence });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to approve this kit." }, { status: 500 });
  }
}
