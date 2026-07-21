# Devpost submission packet

## Project name

Subdesk Creator Control Room

## Track

Work & Productivity

## One-line pitch

AI that advises, humans who decide: turn one scattered creator draft into an approved multi-channel kit with a provenance receipt.

## Inspiration

Creators are told to use more AI and publish more often, but the hidden cost is loss of context and control. Women creators are especially often asked to surrender voice, audience, or unpaid strategy in exchange for visibility. Subdesk makes the creator's decision the center of the workflow while remaining useful to creators of every gender.

## What it does

Subdesk accepts one non-confidential idea, audience, goal, and set of channels. Its GPT-5.6 Responses API route is implemented with strict structured output and `store: false`. The creator edits every word, explicitly approves the kit, and exports a receipt recording the source fingerprint, actual model route, prompt version, output fingerprint, and human decision.

When the operator's API project has no quota, Subdesk remains fully demonstrable through a clearly labeled `guided-demo-v1` engine. The fallback is never represented as GPT-5.6. It never auto-posts and does not store raw source material.

## How we built it

Codex with GPT-5.6 helped inspect and separate a broad existing CLITZ archive into one coherent contest product, implement the Sites/Vinext application, design the D1 receipt model, build the GPT-5.6 Responses API route, create accessible interaction states, test the production worker, and prepare the release evidence. Faith retained product direction, brand authorship, safety boundaries, and final approval.

## Accomplishments

- Complete Capture -> Analyze -> Review -> Approve -> Receipt workflow.
- GPT-5.6 Responses API integration with strict structured output and a truthful guided fallback.
- Durable D1 receipts without raw-source persistence.
- Editable channel drafts and exportable Markdown/JSON packages.
- Women-centered design that welcomes creators of every gender.

## What we learned

The best creator AI is not the system that produces the most content. It is the system that makes the human decision visible, reversible, and attributable.

## Links and testing

- Live application: https://subdesk-control-room.indigo-iris-5804.chatgpt.site
- Public source: https://github.com/thefayth/clitz/tree/main/subdesk-control-room
- Codex `/feedback` session ID: `019f64c2-ba63-7ac3-900e-1e493b1853b3`
- YouTube demo: pending final upload receipt
- Safe test: choose `Load safe sample`, select LinkedIn and Newsletter, run analysis, edit a draft, approve it, and retrieve the durable receipt.

## Build-window provenance

The broader private CLITZ archive predates Build Week. This standalone Sites application, D1 receipt workflow, GPT-5.6 integration, tests, release packaging, and submission materials were created during the contest window. See `ORIGIN_AND_BUILD_WINDOW.md` in the repository.

## Current runtime disclosure

At submission time, the hosted API project returned `insufficient_quota`, so the public demo uses the app's labeled `guided-demo-v1` path. The GPT-5.6 implementation is present in the repository and activates when an operator supplies an owned funded `OPENAI_API_KEY`; no credential is included in source or submission materials.
