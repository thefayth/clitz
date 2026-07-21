"use client";

import { useMemo, useState } from "react";

type Draft = { channel: string; headline: string; copy: string; cta: string };
type Analysis = {
  runId: string;
  mode: "gpt-5.6" | "guided-demo";
  model: string;
  summary: string;
  contentType: string;
  audienceRead: string;
  risks: string[];
  opportunities: string[];
  recommendedActions: string[];
  drafts: Draft[];
  inputHash: string;
  warning?: string;
  persistence: "durable" | "ephemeral";
};

const sample = {
  title: "Sunday studio notes",
  source:
    "I spent the morning turning a messy folder of sketches into three clean homepage directions. The real lesson was not to ask AI for more ideas—it was to decide what the page needed to make obvious in the first five seconds. I want to share that lesson and invite small business owners to bring me one page that feels stuck.",
  goal: "Teach something useful and invite qualified website leads",
  audience: "Independent creators and small business owners",
  channels: ["LinkedIn", "Instagram", "Newsletter"],
};

const channelOptions = ["LinkedIn", "Instagram", "Newsletter", "YouTube", "Blog"];

function getSessionId() {
  if (typeof window === "undefined") return "server";
  const key = "subdesk-demo-session";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

export function ControlRoom() {
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [channels, setChannels] = useState<string[]>(["LinkedIn", "Instagram"]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [status, setStatus] = useState<"idle" | "analyzing" | "ready" | "approving" | "approved" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [receiptId, setReceiptId] = useState("");

  const canAnalyze = source.trim().length >= 30 && goal.trim().length >= 6 && audience.trim().length >= 3;
  const step = status === "approved" ? 4 : analysis ? 3 : source ? 1 : 0;
  const exportPayload = useMemo(() => analysis ? {
    product: "Subdesk Creator Control Room",
    runId: analysis.runId,
    receiptId: receiptId || null,
    sourceFingerprint: analysis.inputHash,
    modelRoute: analysis.model,
    mode: analysis.mode,
    humanDecision: status === "approved" ? "approved" : "pending",
    summary: analysis.summary,
    drafts,
  } : null, [analysis, drafts, receiptId, status]);

  function loadSample() {
    setTitle(sample.title);
    setSource(sample.source);
    setGoal(sample.goal);
    setAudience(sample.audience);
    setChannels(sample.channels);
    setAnalysis(null);
    setDrafts([]);
    setStatus("idle");
    setNotice("Safe sample loaded. Change anything, or analyze it as-is.");
  }

  function toggleChannel(channel: string) {
    setChannels((current) => current.includes(channel)
      ? current.filter((item) => item !== channel)
      : [...current, channel]);
  }

  async function analyze() {
    if (!canAnalyze || channels.length === 0) return;
    setStatus("analyzing");
    setNotice("GPT‑5.6 is finding the signal and preparing distinct channel drafts…");
    setReceiptId("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, source, goal, audience, channels, sessionId: getSessionId() }),
      });
      const payload = await response.json() as Analysis & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Analysis failed.");
      setAnalysis(payload);
      setDrafts(payload.drafts);
      setStatus("ready");
      setNotice(payload.warning || "Analysis ready. Edit every word you want before approving.");
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "Analysis failed. Please try again.");
    }
  }

  function updateDraft(index: number, field: keyof Draft, value: string) {
    setDrafts((current) => current.map((draft, draftIndex) =>
      draftIndex === index ? { ...draft, [field]: value } : draft));
    if (status === "approved") {
      setStatus("ready");
      setReceiptId("");
      setNotice("Draft changed after approval. Approve again to create a new receipt.");
    }
  }

  async function approve() {
    if (!analysis) return;
    setStatus("approving");
    setNotice("Recording the human decision and preparing the receipt…");
    try {
      const response = await fetch("/api/approve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ runId: analysis.runId, inputHash: analysis.inputHash, drafts, sessionId: getSessionId() }),
      });
      const payload = await response.json() as { receiptId?: string; persistence?: string; error?: string };
      if (!response.ok || !payload.receiptId) throw new Error(payload.error || "Approval failed.");
      setReceiptId(payload.receiptId);
      setStatus("approved");
      setNotice(payload.persistence === "durable"
        ? "Approved. Your durable provenance receipt is ready."
        : "Approved in preview mode. The receipt is exportable but will not survive a server restart.");
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "Approval failed. Please try again.");
    }
  }

  function download(format: "json" | "md") {
    if (!exportPayload) return;
    const body = format === "json"
      ? JSON.stringify(exportPayload, null, 2)
      : [
          "# Subdesk Approved Creator Pack",
          `Receipt: ${receiptId || "pending"}`,
          `Model route: ${analysis?.model}`,
          `Source fingerprint: ${analysis?.inputHash}`,
          "",
          ...drafts.flatMap((draft) => [
            `## ${draft.channel}`,
            `### ${draft.headline}`,
            draft.copy,
            `CTA: ${draft.cta}`,
            "",
          ]),
        ].join("\n");
    const blob = new Blob([body], { type: format === "json" ? "application/json" : "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `subdesk-${receiptId || analysis?.runId}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="workspace-section" id="workspace" aria-labelledby="workspace-title">
      <div className="workspace-heading">
        <div><p className="eyebrow dark">WORKING DEMO</p><h2 id="workspace-title">Bring one idea. Leave with an approved kit.</h2></div>
        <p>This public demo is for non-confidential material. Raw source text is sent for analysis but is not stored by Subdesk.</p>
      </div>

      <ol className="stepper" aria-label="Workflow progress">
        {["Capture", "Analyze", "Review", "Approve", "Receipt"].map((label, index) => (
          <li key={label} className={index <= step ? "active" : ""} aria-current={index === step ? "step" : undefined}>
            <span>{index + 1}</span>{label}
          </li>
        ))}
      </ol>

      <div className="control-room">
        <form className="intake-panel" onSubmit={(event) => { event.preventDefault(); void analyze(); }}>
          <div className="panel-header">
            <div><span className="live-dot" /> SOURCE DESK</div>
            <button type="button" className="text-button" onClick={loadSample}>Load safe sample</button>
          </div>
          <label>Project title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give this work a name" maxLength={100} /></label>
          <label>Source material<textarea value={source} onChange={(event) => setSource(event.target.value)} placeholder="Paste a safe draft, note, transcript excerpt, or campaign idea…" rows={8} maxLength={6000} /></label>
          <p className="field-note">Do not paste private evidence, passwords, medical details, or material you do not have permission to use.</p>
          <div className="field-pair">
            <label>What should it do?<input value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="Teach, invite, explain, sell…" maxLength={180} /></label>
            <label>Who is it for?<input value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="Describe the real audience" maxLength={180} /></label>
          </div>
          <fieldset>
            <legend>Prepare for</legend>
            <div className="channel-pills">
              {channelOptions.map((channel) => (
                <label key={channel} className={channels.includes(channel) ? "selected" : ""}>
                  <input type="checkbox" checked={channels.includes(channel)} onChange={() => toggleChannel(channel)} />{channel}
                </label>
              ))}
            </div>
          </fieldset>
          <button className="button button-primary analyze-button" type="submit" disabled={!canAnalyze || channels.length === 0 || status === "analyzing"}>
            {status === "analyzing" ? "Finding the signal…" : "Analyze with GPT‑5.6"}<span aria-hidden="true">↗</span>
          </button>
        </form>

        <section className="output-panel" aria-live="polite" aria-busy={status === "analyzing"}>
          <div className="panel-header">
            <div><span className={analysis?.mode === "gpt-5.6" ? "live-dot" : "live-dot amber"} /> DECISION DESK</div>
            {analysis && <span className="mode-chip">{analysis.mode === "gpt-5.6" ? "GPT‑5.6 LIVE" : "GUIDED DEMO"}</span>}
          </div>

          {!analysis && status !== "analyzing" && (
            <div className="empty-state">
              <span aria-hidden="true">✦</span><h3>The desk is listening.</h3>
              <p>Load the safe sample or bring a non-confidential draft. Your analysis and editable channel kit will appear here.</p>
            </div>
          )}
          {status === "analyzing" && (
            <div className="working-state"><span className="working-orbit" aria-hidden="true" /><h3>Finding the useful signal…</h3><p>Reading for purpose, audience, risk, and the shape each channel actually needs.</p></div>
          )}
          {analysis && (
            <div className="analysis-stack">
              <div className="signal-card">
                <div><span>SIGNAL READ</span><b>{analysis.contentType}</b></div>
                <h3>{analysis.summary}</h3><p>{analysis.audienceRead}</p>
              </div>
              <div className="insight-columns">
                <div><span>KEEP AN EYE ON</span><ul>{analysis.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></div>
                <div><span>USE THE LEVERAGE</span><ul>{analysis.opportunities.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
              <div className="drafts-heading"><div><span>EDITABLE OUTPUTS</span><h3>Your channel kit</h3></div><small>Nothing is posted automatically.</small></div>
              {drafts.map((draft, index) => (
                <article className="draft-card" key={`${draft.channel}-${index}`}>
                  <div className="draft-channel"><span>{String(index + 1).padStart(2, "0")}</span><strong>{draft.channel}</strong></div>
                  <label>Headline<input value={draft.headline} onChange={(event) => updateDraft(index, "headline", event.target.value)} /></label>
                  <label>Draft<textarea rows={5} value={draft.copy} onChange={(event) => updateDraft(index, "copy", event.target.value)} /></label>
                  <label>Call to action<input value={draft.cta} onChange={(event) => updateDraft(index, "cta", event.target.value)} /></label>
                </article>
              ))}
              <div className="approval-bar">
                <div><span>HUMAN GATE</span><p>Review the words above. Approval records your decision; it never publishes for you.</p></div>
                <button className="button button-primary" onClick={() => void approve()} disabled={status === "approving" || status === "approved"}>
                  {status === "approved" ? "Approved ✓" : status === "approving" ? "Recording…" : "Approve this kit"}
                </button>
              </div>
              {receiptId && (
                <div className="receipt-card">
                  <div><span>PROVENANCE RECEIPT</span><strong>{receiptId}</strong><small>Source {analysis.inputHash.slice(0, 16)}… · {analysis.model} · Human approved</small></div>
                  <div className="export-actions"><button onClick={() => download("md")}>Export Markdown</button><button onClick={() => download("json")}>Export JSON</button></div>
                </div>
              )}
            </div>
          )}
          {notice && <p className={`notice ${status === "error" ? "error" : ""}`} role={status === "error" ? "alert" : "status"}>{notice}</p>}
        </section>
      </div>
    </section>
  );
}
