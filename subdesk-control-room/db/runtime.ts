import { env } from "cloudflare:workers";

type RuntimeEnv = {
  DB?: D1Database;
  OPENAI_API_KEY?: string;
};

export const runtimeEnv = env as unknown as RuntimeEnv;

let schemaReady: Promise<void> | null = null;

export function getOpenAIKey() {
  return runtimeEnv.OPENAI_API_KEY?.trim() || "";
}

export function getD1() {
  return runtimeEnv.DB;
}

export function ensureSchema(db: D1Database) {
  schemaReady ??= db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      session_hash TEXT NOT NULL,
      input_hash TEXT NOT NULL,
      model TEXT NOT NULL,
      mode TEXT NOT NULL,
      goal TEXT NOT NULL,
      audience TEXT NOT NULL,
      channels_json TEXT NOT NULL,
      analysis_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      run_id TEXT NOT NULL,
      session_hash TEXT NOT NULL,
      input_hash TEXT NOT NULL,
      model TEXT NOT NULL,
      prompt_version TEXT NOT NULL,
      decision TEXT NOT NULL,
      output_json TEXT NOT NULL,
      output_hash TEXT NOT NULL,
      approved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS runs_session_created_idx ON runs(session_hash, created_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS receipts_run_idx ON receipts(run_id)"),
  ]).then(() => undefined);
  return schemaReady;
}
