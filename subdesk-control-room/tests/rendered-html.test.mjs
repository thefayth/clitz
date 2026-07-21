import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { after, before, test } from "node:test";

const port = 3141;
const baseUrl = `http://localhost:${port}`;
let server;
let serverLog = "";

before(async () => {
  server = spawn(
    process.execPath,
    ["node_modules/vinext/dist/cli.js", "dev", "--port", String(port)],
    {
      cwd: new URL("../", import.meta.url),
      env: { ...process.env, OPENAI_API_KEY: "" },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );

  server.stdout.on("data", (chunk) => { serverLog = `${serverLog}${chunk}`.slice(-8000); });
  server.stderr.on("data", (chunk) => { serverLog = `${serverLog}${chunk}`.slice(-8000); });

  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Dev server stopped early.\n${serverLog}`);
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for the dev server.\n${serverLog}`);
});

after(() => {
  if (!server || server.exitCode !== null) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { windowsHide: true });
  } else {
    server.kill("SIGTERM");
  }
});

test("server-renders the Subdesk control room", async () => {
  const response = await fetch(baseUrl, { headers: { accept: "text/html" } });

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Subdesk — Creator Control Room<\/title>/);
  assert.match(html, /Turn scattered creative work into/);
  assert.match(html, /one approved move\./);
  assert.match(html, /AI THAT ADVISES/);
  assert.match(html, /HUMANS WHO DECIDE/);
  assert.match(html, /Creator Control Room/);
  assert.match(html, /DICKZ Shield/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("analysis rejects incomplete creator material", async () => {
  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ source: "too short", channels: [] }),
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /source material/i);
});

test("approval rejects an unverifiable payload", async () => {
  const response = await fetch(`${baseUrl}/api/approve`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ runId: "", inputHash: "not-a-hash", drafts: [] }),
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /valid run/i);
});

test("guided fallback receipts name the actual model route", async () => {
  const sessionId = `test-${Date.now()}`;
  const analysisResponse = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      title: "Safe test note",
      source: "A creator is testing a safe note about choosing clarity before generating more homepage options.",
      goal: "Teach one practical lesson",
      audience: "Independent creators",
      channels: ["LinkedIn"],
      sessionId,
    }),
  });
  const analysis = await analysisResponse.json();
  assert.equal(analysisResponse.status, 200);
  assert.equal(analysis.mode, "guided-demo");
  assert.equal(analysis.model, "guided-demo-v1");

  const approvalResponse = await fetch(`${baseUrl}/api/approve`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      runId: analysis.runId,
      inputHash: analysis.inputHash,
      drafts: analysis.drafts,
      sessionId,
    }),
  });
  const approval = await approvalResponse.json();
  assert.equal(approvalResponse.status, 200);
  assert.equal(approval.model, "guided-demo-v1");
});
