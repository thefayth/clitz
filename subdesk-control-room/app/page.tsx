import { ControlRoom } from "./components/ControlRoom";

export default function Home() {
  return (
    <main id="main-content">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Subdesk home">
          <span className="wordmark-mark" aria-hidden="true">S</span>
          <span><strong>SUBDESK</strong><small>CREATOR CONTROL ROOM</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#workspace" aria-current="page">Control room</a>
          <a href="#receipts">Why receipts</a>
          <a href="#constellation">What comes next</a>
        </nav>
        <span className="build-badge">OPENAI BUILD WEEK 2026</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">WOMEN-CREATED · USEFUL TO EVERY CREATOR</p>
          <h1>Turn scattered creative work into <em>one approved move.</em></h1>
          <p className="hero-lede">
            Subdesk uses GPT‑5.6 to help you understand a draft, shape it for
            different audiences, and keep the final decision—and the receipt—in
            human hands.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#workspace">Open the control room</a>
            <a className="button button-secondary" href="#receipts">See the trust model</a>
          </div>
          <div className="trust-row" aria-label="Product commitments">
            <span><i /> Raw inputs are not saved</span>
            <span><i /> No automatic posting</span>
            <span><i /> Every approval leaves a receipt</span>
          </div>
        </div>
        <aside className="hero-panel" aria-label="The Subdesk method">
          <p className="panel-kicker">THE METHOD</p>
          <ol>
            <li><span>01</span><div><strong>Capture</strong><small>Bring one safe idea or draft.</small></div></li>
            <li><span>02</span><div><strong>Clarify</strong><small>GPT‑5.6 finds the signal.</small></div></li>
            <li><span>03</span><div><strong>Choose</strong><small>Edit before anything moves.</small></div></li>
            <li><span>04</span><div><strong>Prove</strong><small>Export the work and its receipt.</small></div></li>
          </ol>
        </aside>
      </section>

      <section className="ticker" aria-label="Subdesk principles">
        <span>AI THAT ADVISES</span><b>✦</b><span>HUMANS WHO DECIDE</span><b>✦</b>
        <span>WORK WITH PROVENANCE</span><b>✦</b><span>CREATORS KEEP CONTROL</span>
      </section>

      <ControlRoom />

      <section className="receipt-story" id="receipts">
        <div>
          <p className="eyebrow dark">WHY RECEIPTS</p>
          <h2>Creative AI should leave more than a vibe.</h2>
        </div>
        <div className="receipt-copy">
          <p>
            A Subdesk receipt records what the creator approved, which model and
            prompt version assisted, and a fingerprint of the source—without
            publishing the private source itself.
          </p>
          <div className="receipt-fields">
            <span>INPUT HASH</span><span>MODEL ROUTE</span><span>HUMAN DECISION</span>
            <span>APPROVED OUTPUT</span><span>UTC TIMESTAMP</span><span>EXPORTABLE JSON</span>
          </div>
        </div>
      </section>

      <section className="constellation" id="constellation">
        <div className="section-heading">
          <p className="eyebrow">THE CLITZ CONSTELLATION</p>
          <h2>One focused tool now. A larger owned ecosystem next.</h2>
          <p>These are separate products with separate privacy boundaries—not a pile of unfinished tabs.</p>
        </div>
        <div className="constellation-grid">
          <article className="constellation-card active">
            <span>LIVE FIRST</span><h3>Subdesk</h3>
            <p>Creator intake, AI-assisted decisions, approvals, exports, and provenance.</p>
          </article>
          <article className="constellation-card">
            <span>SAFETY LANE</span><h3>DICKZ Shield</h3>
            <p>Blur-first evidence review and repeat-pattern matching, designed for private infrastructure.</p>
          </article>
          <article className="constellation-card">
            <span>COMMUNITY LANE</span><h3>Rooms With Purpose</h3>
            <p>AI-assisted rooms whose norms match their purpose: support, prayer, learning, or debate.</p>
          </article>
          <article className="constellation-card">
            <span>LEARNING LANE</span><h3>Creator Kit</h3>
            <p>Free Academy paths, templates, booking, profiles, and owned audience infrastructure.</p>
          </article>
        </div>
      </section>

      <footer>
        <div className="footer-title"><strong>SUBDESK</strong><span>A CLITZ / XXYYZZ SOCIETY PROJECT</span></div>
        <p>Women-centered in origin. Built for creators of every gender. Human approval stays final.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
