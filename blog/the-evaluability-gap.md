---
layout: post.njk
title: "The Evaluability Gap: Designing for Scalable Human Review of AI Output"
excerpt: AI output outpaces human review capacity. How we tackle this is a software design frontier.
date: 2026-04-13
og_image: 'assets/eval_card.png'
tags: ['post','front-page']
---
# {{ title }}

In the age of AI, output velocity is no longer a limiting factor. AI can generate massive amounts of output in a fraction of the time it would take for a human. Code, designs, documents, analysis, and nearly anything else you can think of.

However, as LLMs are integrated in more and more processes, we are left with a new problem: evaluation.

In this post we'll look at the next great usability and reliability problem facing us all: **The Evaluability Gap**. By that we mean *the gulf between the amount of output an AI can generate and the amount a human can reliably review*.

This gap shows up everywhere that AI is used, from legal paperwork to software development. It appears every time flawed output is blamed on AI hallucination.

One of the dangers of AI is human complacency or burnout due to being simply overwhelmed with output. AI output is unreliable by its nature, so how do we design software systems that bring the speed of human evaluation anywhere close to AI inference guesswork, without subjecting the human to unreasonable expectations?

This is a design problem. In fact the gap shows us something important: design is not "dead". Rather, we are at the cusp of some of the most important design work yet to be done. Design that mitigates the dangers of non-determinism and the psychological effects of LLM confidence is a new software design frontier.

## A Design Approach for Accelerated Evaluation

To accelerate the pace of evaluation, we must accept that humans cannot review every piece of every LLM output *at scale*. For smaller amounts of output, a complete review may be preferable, but building human evaluation methodologies for large amounts of AI output must be tackled by teams as a design and development challenge.

We divide the design approach for meeting this challenge into two areas: a research area to understand the evaluators' work, and the software workflow that must be designed and built.

We'll call these two areas **lenses** and **projections**.

### Lenses

**A lens is the researched viewpoint of an evaluator of AI output**. It is a dimension of quality that a specific evaluator needs to judge, discovered through research, perhaps through direct observation and conversation with the people who actually do the evaluating.

Consider a senior engineer reviewing someone else's code. They might need to see whether the code follows the team's established patterns, whether it introduces a new approach intentionally or accidentally, and whether it will be maintainable by someone who arrives six months from now. Those are three separate lenses, even though the engineer experiences them as a single act of reading code.

Lenses aren't generic checklists. They encode what "good" means for a specific person in a specific context.

When designing at-scale evaluations, lenses are always defined first, because the human's judgment needs should shape the system, not the other way around.

### Projections

A projection is what you get when you project AI output through a lens. It is **an evaluation interface designed for that lens** (or lenses), a view of the output rendered into a form optimized for a specific kind of judgment.

A projection is not a summary. It's a structural view that makes a specific dimension of quality visible. If one of the lenses for reviewing a financial forecast is "assumption decay" (are the model's inputs fresh or stale?), the corresponding projection might be a single-page document that maps every input, tags it with when it was last updated, and flags anything older than a set threshold. The reviewer doesn't read the entire forecast. They read the projection and know immediately where to focus.

The lower the risk tolerance for projection unreliability, the more deterministic the projection needs to be. Designing the right projection at the right fidelity level requires deep interaction between the designer (who understands what the evaluator needs to see) and the developer (who understands what can be extracted reliably).

The lens/projection framework isn't a method to provide AI judgment, rather to scale human judgment closer to AI output rates.

A well-researched lens leading a well-designed projection helps the right person make the right judgment more easily.

<figure class="eg-widget" aria-labelledby="eg-caption">
  <style>
    .eg-widget {
      --eg-lens-1: #3B82F6;
      --eg-lens-2: #F59E0B;
      --eg-lens-3: #10B981;
      --eg-cell-fill: #F5F5F7;
      --eg-cell-stroke: #D1D1D3;
      --eg-panel-bg: var(--bg-subtle, #F5F5F7);
      --eg-panel-border: var(--border, #E5E5EA);
      --eg-label: var(--text, #1D1D1F);
      --eg-label-muted: var(--text-2, #6E6E73);
      margin: 2rem 0;
      padding: 1.25rem;
      background: var(--eg-panel-bg);
      border: 1px solid var(--eg-panel-border);
      border-radius: 12px;
      color: var(--eg-label);
      font-family: var(--font-body, system-ui, sans-serif);
    }
    html[data-theme="dark"] .eg-widget {
      --eg-cell-fill: #FFFFFF;
      --eg-cell-stroke: #FFFFFF;
      --eg-panel-bg: transparent;
      --eg-panel-border: #48484A;
    }
    @media (prefers-color-scheme: dark) {
      html:not([data-theme="light"]) .eg-widget {
        --eg-cell-fill: #FFFFFF;
        --eg-cell-stroke: #FFFFFF;
        --eg-panel-bg: transparent;
        --eg-panel-border: #48484A;
      }
    }
    .eg-widget__legend {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem 1.25rem;
      justify-content: center;
      margin: 0 0 1rem;
      padding: 0 !important;
      list-style: none;
      font-size: 0.9rem;
    }
    .eg-widget__legend li {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .eg-widget__swatch {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      flex: 0 0 auto;
    }
    .eg-widget__grid {
      display: block;
      width: 100%;
      max-width: 420px;
      height: auto;
      margin: 0 auto 0.25rem;
    }
    .eg-widget__grid-label {
      text-align: center;
      font-size: 0.72rem;
      color: var(--eg-label-muted);
      margin: 0 auto 1.5rem;
      max-width: none;
      letter-spacing: 0.02em;
    }
    .eg-widget__grid circle {
      transition: fill 0.25s ease;
    }
    .eg-widget__controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.5rem 0.75rem;
      margin: 0;
    }
    .eg-widget__controls-label {
      font-size: 0.9rem;
      color: var(--eg-label-muted);
      margin-right: 0.25rem;
    }
    @media (max-width: 520px) {
      .eg-widget__controls {
        flex-direction: column;
        gap: 0.75rem;
      }
      .eg-widget__controls-label {
        margin-right: 0;
        text-align: center;
      }
      .eg-widget__controls-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem 0.75rem;
      }
    }
    .eg-widget__btn {
      appearance: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      font: inherit;
      font-size: 0.9rem;
      color: var(--eg-label);
      background: transparent;
      border: 1.5px solid var(--eg-btn-color, var(--eg-label-muted));
      border-radius: 999px;
      padding: 0.4rem 0.9rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
    }
    .eg-widget__btn:hover,
    .eg-widget__btn:focus-visible {
      border-color: var(--eg-btn-color, var(--eg-label-muted));
      outline: none;
    }
    .eg-widget__btn:focus-visible {
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-btn-color, currentColor) 35%, transparent);
    }
    .eg-widget__btn[aria-pressed="true"] {
      background: var(--eg-btn-color);
      border-color: var(--eg-btn-color);
      color: #fff;
    }
    .eg-widget__btn-dot {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
      background: var(--eg-btn-color);
      flex: 0 0 auto;
    }
    .eg-widget__btn[aria-pressed="true"] .eg-widget__btn-dot {
      background: #fff;
    }
    .eg-widget__caption {
      margin: 0.9rem 0 0;
      font-size: 0.85rem;
      color: var(--eg-label-muted);
      text-align: center;
    }
  </style>

  <ul class="eg-widget__legend" aria-label="Lenses">
    <li><span class="eg-widget__swatch" style="background: var(--eg-lens-1)" aria-hidden="true"></span>Lens 1</li>
    <li><span class="eg-widget__swatch" style="background: var(--eg-lens-2)" aria-hidden="true"></span>Lens 2</li>
    <li><span class="eg-widget__swatch" style="background: var(--eg-lens-3)" aria-hidden="true"></span>Lens 3</li>
  </ul>

  <svg class="eg-widget__grid" viewBox="0 0 280 200" role="img" aria-label="7 by 5 grid of output cells" data-eg-grid>
    <!-- cells injected statically; JS only flips fill colors -->
  </svg>
  <p class="eg-widget__grid-label">AI output</p>

  <div class="eg-widget__controls" role="group" aria-label="Projections">
    <span class="eg-widget__controls-label">Projections:</span>
    <div class="eg-widget__controls-buttons">
      <button type="button" class="eg-widget__btn" data-eg-projection="1" aria-pressed="false" style="--eg-btn-color: var(--eg-lens-1)">
        <span class="eg-widget__btn-dot" aria-hidden="true"></span>1
      </button>
      <button type="button" class="eg-widget__btn" data-eg-projection="2" aria-pressed="false" style="--eg-btn-color: var(--eg-lens-2)">
        <span class="eg-widget__btn-dot" aria-hidden="true"></span>2
      </button>
      <button type="button" class="eg-widget__btn" data-eg-projection="3" aria-pressed="false" style="--eg-btn-color: var(--eg-lens-3)">
        <span class="eg-widget__btn-dot" aria-hidden="true"></span>3
      </button>
    </div>
  </div>

  <figcaption class="eg-widget__caption" id="eg-caption">
    Each projection surfaces a different subset of the same output through its lens, surfacing problems more easily.
  </figcaption>

  <script>
    (function () {
      var root = document.currentScript.closest('.eg-widget');
      if (!root) return;

      var COLS = 7, ROWS = 5, CELL = 40, R = 12;
      var svg = root.querySelector('[data-eg-grid]');
      var SVG_NS = 'http://www.w3.org/2000/svg';
      var cells = [];

      for (var y = 0; y < ROWS; y++) {
        for (var x = 0; x < COLS; x++) {
          var c = document.createElementNS(SVG_NS, 'circle');
          c.setAttribute('cx', x * CELL + CELL / 2);
          c.setAttribute('cy', y * CELL + CELL / 2);
          c.setAttribute('r', R);
          c.setAttribute('fill', 'var(--eg-cell-fill)');
          c.setAttribute('stroke', 'var(--eg-cell-stroke)');
          c.setAttribute('stroke-width', '1.5');
          svg.appendChild(c);
          cells.push(c);
        }
      }

      function idx(x, y) { return y * COLS + x; }

      // Each projection draws a distinct shape plus one outlier cell —
      // the outlier represents a problem the lens surfaces.
      var projections = {
        '1': {
          // Vertical line down column 3 (rows 1-4), outlier at (6,0)
          color: 'var(--eg-lens-1)',
          cells: [[6,0],[3,1],[3,2],[3,3],[3,4]]
        },
        '2': {
          // Diagonal top-left toward bottom-right (stops short), outlier at (0,4)
          color: 'var(--eg-lens-2)',
          cells: [[0,0],[1,1],[2,2],[3,3],[0,4]]
        },
        '3': {
          // Hollow plus centered at (3,2) — four arms, no center — outlier at (6,4)
          color: 'var(--eg-lens-3)',
          cells: [[3,1],[2,2],[4,2],[3,3],[6,4]]
        }
      };

      var active = null;

      function render() {
        for (var i = 0; i < cells.length; i++) {
          cells[i].setAttribute('fill', 'var(--eg-cell-fill)');
        }
        if (!active) return;
        var p = projections[active];
        for (var j = 0; j < p.cells.length; j++) {
          var pt = p.cells[j];
          var cell = cells[idx(pt[0], pt[1])];
          if (cell) cell.setAttribute('fill', p.color);
        }
      }

      var buttons = root.querySelectorAll('[data-eg-projection]');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-eg-projection');
          active = (active === id) ? null : id;
          buttons.forEach(function (b) {
            b.setAttribute('aria-pressed', b.getAttribute('data-eg-projection') === active ? 'true' : 'false');
          });
          render();
        });
      });
    })();
  </script>
</figure>

## A Non-Deterministic Wrinkle

Creating derived views for human evaluation is nothing new. Construction drawings render a building as plumbing, electrical, and landscape plans. Each projection exists because a specific expert needs a specific view.

But construction plans share one assumption that AI breaks: the source data is faithful. The measurements reflect the actual design.

AI output doesn't come with that guarantee. A strategy document may present analysis built on a statistic the model invented. A codebase may import a library that doesn't exist. A contract may define a term precisely in one section and apply it inconsistently in another.

This means projections for AI output must serve two functions: making quality dimensions visible, *and* making unreliability detectable. There are useful mechanisms for this, for example:

### Provenance

A provenance projection doesn't answer "is this claim true?" It answers "where did this come from?"

A projection that extracts every factual claim from a document and tags each one with its source, or flags the absence of a source, doesn't verify accuracy. But it changes what the reviewer sees. Instead of reading fluent prose hoping to notice an unsupported assertion, they see "this document contains twelve claims; four have no identifiable source." Now the evaluator knows where to focus.

### Internal Consistency

AI output can contradict itself in ways that are invisible inside polished prose but obvious when the logical structure is extracted and laid side by side.

If a financial model assumes 15% growth in one section and builds on 8% growth in another, a projection that aligns all numerical assumptions makes the contradiction immediately visible, without needing to know which number is correct.

### Deterministic Projections
If your projections themselves are AI-generated then you must make the unreliability *of the projection* detectable. The projection should at least facilitate a quick provenance check back to the original AI output.

However, when the risk is high enough, you should consider designing projections that are not generated by AI at all. 

For high-stakes evaluation (financial models, legal contracts, production code in critical systems) projections should use rule-based extraction, structured queries, or templated analysis with constrained scope. The projection becomes less flexible but more trustworthy.

This creates a spectrum from flexible-but-interpretive to rigid-but-reliable. The design decision about where on that spectrum to operate is a judgment call itself that requires domain expertise. I call this <a href="/blog/entropy-tolerance-ai">entropy tolerance</a>: the higher the stakes of the process, the less uncertainty you can afford in the tools that support it.

## Projections in Practice

Let's look at three concrete examples to demonstrate how lens research and projection design works. In each case the pattern is the same: research the evaluator's judgment needs, derive lenses, then design projections that make each lens usable without requiring the evaluator to evaluate the entire raw output.

### Contract Review: Obligation Maps

A legal team reviews a 40-page vendor contract that AI drafted from a standard template plus deal-specific terms. The document reads well, but review currently means two attorneys spending half a day reading end to end. Most of that time is spent *locating* relevant clauses, not *judging* them.

Observing the attorneys reveals one particular lens: obligation structure.

An *obligation map projection* extracts every obligation and renders them as a structured view: party, action required, trigger condition, deadline, and consequence of non-performance. The attorney sees the full obligation architecture on one page instead of hunting through 40 pages. 

The designers and developers might also create a *consistency projection* cross-referencing every defined term against its usage throughout the document, catching situations where a definition says "business days" in one section but is applied as "calendar days" elsewhere.

The attorneys spend their time on *judgment instead of extraction*. And the consistency projection catches drafting errors that aren't easily noticed by humans across 40 pages of legal language.

### Financial Report: Provenance

A strategy team uses AI to build quarterly revenue forecasts. The outputs are polished, but the forecasts are continuously over-optimistic and no one can figure out why.

Sitting with the stakeholders reveals another lens: assumption decay.

An *assumption decay projection* maps every input to the model, tags it with when it was last updated, and flags stale data.

The systematic optimism gets traced back to two stale inputs nobody was updating because the LLM made the output look authoritative. The projections made its internal logic legible enough for humans to judge it themselves.

### Code Review: Pattern Divergence

A software development team ships features using AI-generated code. Each set of new or edited code looks clean in isolation, but over three months the codebase loses its architectural coherence. Patterns get quietly replaced by alternatives that work just as well technically but weren't chosen deliberately. Nobody decided to change the approach. It drifted.

Observing senior reviewers reveals a lens: pattern divergence.

A *pattern divergence projection* compares structural choices in the PR against actual patterns in the codebase and surfaces divergences.

Some lenses may not need a custom projection, for example test suites for code and linters handle some of the concerns. Projections are only designed where human judgment is the bottleneck.

## Lens Research and Projection Design

Both the user research needed to identify evaluation lenses, and the UX design skills to design usable projections are known skills.

Lens research follows familiar methods: contextual inquiry, structured observation, and interviews with domain experts. The user being studied is the evaluator of AI output. What are they actually looking at? What makes them stop and scrutinize? What do they skip?

Projection design draws on interaction design and information architecture. The question "what derived view would make this judgment fast, reliable, and consistent?" is a design question that requires understanding what to surface, what to suppress, and how to structure the result so the evaluator's cognitive load is reduced.

The person authoring projections needs domain expertise that AI cannot replace, because it depends on judgment from years of experience. What makes code sound? What makes a contract safe? What makes a forecast trustworthy? That knowledge shapes the projection set.

There are, of course, caveats. Projections can themselves be wrong, giving reviewers false confidence. Not everything deserves a full projection set, and without stakes calibration teams may over-engineer low-stakes review. People can start checking projections mechanically, turning them into theater rather than tools for judgment. These limitations deserve attention as teams adopt the approach.

## Closing Thoughts

AI can produce faster than humans can evaluate, and that gap is widening. The instinct in many organizations is to respond by speeding up AI trust. That's the wrong answer.

The correct answer is to *design for evaluability*. To treat the review of AI output not as a burden to be minimized, but as a practice to be deliberately designed. The evaluator's needs  shape the system. Projections are designed and built with care. The AI's role is to make judgment legible, not to replace it.

The evaluability gap is real, and it's growing. But it's also an important and exciting design problem. Solving it unlocks the real power of LLMs: output velocity tempered, but not bottlenecked, by human judgment. And it helps prevent burnout, helping to solve a real human problem in the age of AI.