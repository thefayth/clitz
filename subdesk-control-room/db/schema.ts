import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const runs = sqliteTable("runs", {
  id: text("id").primaryKey(),
  sessionHash: text("session_hash").notNull(),
  inputHash: text("input_hash").notNull(),
  model: text("model").notNull(),
  mode: text("mode").notNull(),
  goal: text("goal").notNull(),
  audience: text("audience").notNull(),
  channelsJson: text("channels_json").notNull(),
  analysisJson: text("analysis_json").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const receipts = sqliteTable("receipts", {
  id: text("id").primaryKey(),
  runId: text("run_id").notNull(),
  sessionHash: text("session_hash").notNull(),
  inputHash: text("input_hash").notNull(),
  model: text("model").notNull(),
  promptVersion: text("prompt_version").notNull(),
  decision: text("decision").notNull(),
  outputJson: text("output_json").notNull(),
  outputHash: text("output_hash").notNull(),
  approvedAt: text("approved_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
