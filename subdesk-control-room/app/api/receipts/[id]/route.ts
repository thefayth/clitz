import { ensureSchema, getD1 } from "../../../../db/runtime";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = getD1();
  if (!db) return Response.json({ error: "Durable receipt storage is unavailable in this preview." }, { status: 503 });
  try {
    await ensureSchema(db);
    const row = await db.prepare(`SELECT id, run_id AS runId, input_hash AS inputHash, model,
      prompt_version AS promptVersion, decision, output_json AS outputJson,
      output_hash AS outputHash, approved_at AS approvedAt FROM receipts WHERE id = ?`)
      .bind(id).first<Record<string, string>>();
    if (!row) return Response.json({ error: "Receipt not found." }, { status: 404 });
    return Response.json({ receipt: { ...row, output: JSON.parse(row.outputJson), outputJson: undefined } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to retrieve this receipt." }, { status: 500 });
  }
}
