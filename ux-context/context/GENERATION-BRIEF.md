# Generation brief

How the sixteen pages in `variants/` were produced.

The principle: each generator received the product manager's request, the visual identity, and whichever UX context its variant includes. Nothing else. No fallback instructions, no description of what a standard claim form looks like, no assigned viewport, no traceability markup request. What a model does where its context is silent is part of the result, so nothing was allowed to script it.

## Setup

Sixteen Claude Opus 5 agents, one per variant, run in parallel with no shared state. Each agent saw a folder containing:

- `DESIGN.md` - the Keystone Mutual visual identity, present for all sixteen
- `UX.md` - the assigned context modules concatenated verbatim, absent entirely for v0000

The `UX.md` for each variant is preserved in `context/iterations/v<code>.md`. Codes are four bits in the order Findings / User model / World model / Glossary, so v1010 saw the research findings and the world model only. The module sources are in `context/ux/`.

## Blinding

- Folders were named `run-01` through `run-16` and assigned to variant codes in a shuffled order, so no path or filename hinted at a variant code or at the existence of other runs.
- Materials and outputs lived in a temporary directory outside this repository, so no agent could see the experiment folder, its documentation, or another agent's work.
- Agents were instructed to read nothing beyond their materials folder.
- The word "experiment" never appeared. Each agent believed it was a design engineer at Keystone Mutual doing one job.

## The prompt

Identical for all sixteen except the run number in the two paths:

> You are a front-end design engineer at Keystone Mutual. A product manager has sent you this request:
>
> "Build a single page where a customer can report a car accident to us. It should collect everything we need to open the claim, and it should look like it belongs to our product. Keep it to one page."
>
> Your working materials are the files in this folder:
> `<materials folder for this run>`
>
> Read every file in that folder before you begin. Those files plus this message are your entire brief. Do not read, search for, or open any other file on this machine, and do not use the web.
>
> Produce exactly two files, both in this folder (create nothing else):
> `<output folder for this run>`
>
> 1. reasoning.md - your design reasoning, written as you go. Create this file before you write any HTML, and append to it as you work: for each part of the page, what you decided and why. When a decision traces to something in your materials, name the file and reference the specific passage. When a decision comes from your own judgment or general knowledge, say so plainly. Short plain-prose entries in the order you made them. No retrospective summary at the end.
>
> 2. page.html - the page itself, as one self-contained HTML file. Requirements: inline `<style>` only; no external requests of any kind (no web fonts, no CDNs, no remote images, no @import); any imagery is inline SVG or CSS; a static mockup with real HTML form controls left empty (no value attributes carrying sample data, no preselected choices); no JavaScript; include `<meta name="viewport" content="width=device-width, initial-scale=1">`.
>
> Two notes from our publishing pipeline that apply to every page we ship:
> - Never write out a list of US states. If the page needs a state field, use a short text input for the two-letter state code.
> - Do not use em dashes or en dashes anywhere in the page text.
>
> When both files are written, reply with a single sentence confirming completion. Do not paste file contents into your reply.

The two pipeline notes are harness constraints, applied identically to every run. The state list note exists because writing out the fifty states trips a content filter that kills the run. The dash note is a publication convention.

## The reasoning logs

Each agent kept `reasoning.md` as it worked. These are saved beside the pages as `variants/v<code>-reasoning.md`, unedited. They are the evidence for the traceability layer: the `data-ux` attributes were added afterward, by the orchestrator, only where a page element is tied to a context line by the agent's own log or by an unmistakable match to a constraint. The generators never saw a module ID, and never knew their pages would be annotated.

## What was not done

No repairs. These pages are untouched output, defects and all. With no fallback instructions in the brief, whatever a page gets wrong is part of the result.

## Run assignment

| Run | Code | Run | Code |
|---|---|---|---|
| 01 | 0110 | 09 | 1111 |
| 02 | 1011 | 10 | 0001 |
| 03 | 0000 | 11 | 0100 |
| 04 | 1101 | 12 | 1110 |
| 05 | 0011 | 13 | 0010 |
| 06 | 1000 | 14 | 1001 |
| 07 | 1010 | 15 | 0111 |
| 08 | 0101 | 16 | 1100 |
