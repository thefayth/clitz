# Subdesk Creator Control Room

Subdesk is a women-created control room for creators of every gender. It turns one safe draft into structured signal analysis, distinct channel drafts, a human approval gate, exports, and a provenance receipt.

Built for OpenAI Build Week 2026 in the **Work & Productivity** track.

## Working flow

1. Load the safe sample or paste non-confidential source material.
2. Set the goal, audience, and channels.
3. Run analysis.
4. Edit every draft.
5. Approve the kit and export its Markdown or JSON receipt.

The GPT-5.6 Responses API route uses strict structured output and `store: false`. Without an API key or quota, the interface remains testable through a clearly labeled `guided-demo-v1` engine and never claims the fallback is GPT-5.6. Subdesk never auto-posts and does not persist raw source text.

## Local setup

Requirements: Node.js 22.13 or newer.

```powershell
npm ci
$env:OPENAI_API_KEY = '<your owned key>'
npm run dev
```

Never commit an API key. The guided demo works without one.

## Tests

```powershell
npm run build
npm test
```

## Runtime interfaces

- `POST /api/analyze` - analyze a creator draft and return structured outputs.
- `POST /api/approve` - record human approval and create a receipt.
- `GET /api/receipts/:id` - retrieve a durable D1 receipt.

## Deployment

OpenAI Sites hosts the application. Production uses logical D1 binding `DB`; an optional secret `OPENAI_API_KEY` activates the GPT-5.6 route. No R2 bucket, uploads, user accounts, automatic posting, or social credentials are required.

## Codex and GPT-5.6

Codex with GPT-5.6 separated this contest product from the larger CLITZ archive, implemented the application and D1 workflow, tested it, prepared the deployment, and documented the build window. Faith made the product, brand, privacy, authorship, and approval decisions.

See [ORIGIN_AND_BUILD_WINDOW.md](./ORIGIN_AND_BUILD_WINDOW.md) for provenance and [SUBMISSION.md](./SUBMISSION.md) for judge instructions.

## License and ownership

Application source in this directory is available under Apache-2.0. The Subdesk and CLITZ names, copy, artwork, and brand identity remain copyright 2026 Faith Cheltenham / XXYYZZ Society LLC and are not licensed as trademarks.
