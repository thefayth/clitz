# Subdesk Build Receipt

Date: 2026-07-21 (America/Los_Angeles)

## Verified

- Vinext production build completed with `/`, `/api/analyze`, `/api/approve`, and `/api/receipts/:id` routes.
- Authored-source ESLint completed with no findings.
- HTTP integration tests passed: page render, invalid analysis guard, invalid approval guard, and accurate fallback-model provenance.
- Safe-sample browser journey completed through guided analysis, human approval, and receipt creation.
- Responsive checks passed at 1440 by 1000 and 390 by 844; the mobile page had no horizontal overflow.
- Social card verified at 1200 by 630.

## Package

- File: `artifacts/subdesk-site-v3-20260721.tar.gz`
- SHA-256: `640A2151F71DBFDFAB52EDE4B0F677D32EE9D089C3B01481DA3BDCD663FBAD3A`
- Required entries verified: `dist/server/index.js` and `dist/.openai/hosting.json`

## Boundaries

- The existing CLITZ WordPress project and `clitz.xyz` deployment were not changed.
- Raw creator source text is not written to the receipt schema.
- Public publishing, domain changes, and contest submission remain explicit final gates.

## Private Sites release

- URL: `https://subdesk-control-room.indigo-iris-5804.chatgpt.site`
- Project: `appgprj_6a5f573d9e7c8191884224caebf66fbe`
- Version: 3 (`appgprj_6a5f573d9e7c8191884224caebf66fbe~appgver_1813d4e7a85081918fe9e2e05f00dc20`)
- Deployment: `appgdep_6a5f5a3117f8819187dd7bb1f2404458`
- Source commit: `b00dcf431077fb7aa284e743dc4c79e1acc9e545`
- Environment revision: 1; the OpenAI key is stored as a write-only secret.
- Access: Faith-only custom policy, with no allowed groups.
- Live proof: homepage 200, canonical Open Graph image URL correct, favicon 200, D1 analysis and receipt persistence durable, and zero recent Worker error events.
- OpenAI proof: the Responses API authentication succeeds, but the current API account reports `exceeded current quota`; Subdesk therefore activates its labeled guided fallback.
- API recovery retest at `2026-07-21T22:32:57.004Z`: both the private production route and the current process-level key still returned `insufficient_quota`; D1 approval/receipt persistence remained durable and the Worker error window remained clean.
