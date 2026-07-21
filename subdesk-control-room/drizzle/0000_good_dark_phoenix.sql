CREATE TABLE `receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`run_id` text NOT NULL,
	`session_hash` text NOT NULL,
	`input_hash` text NOT NULL,
	`model` text NOT NULL,
	`prompt_version` text NOT NULL,
	`decision` text NOT NULL,
	`output_json` text NOT NULL,
	`output_hash` text NOT NULL,
	`approved_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `runs` (
	`id` text PRIMARY KEY NOT NULL,
	`session_hash` text NOT NULL,
	`input_hash` text NOT NULL,
	`model` text NOT NULL,
	`mode` text NOT NULL,
	`goal` text NOT NULL,
	`audience` text NOT NULL,
	`channels_json` text NOT NULL,
	`analysis_json` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
