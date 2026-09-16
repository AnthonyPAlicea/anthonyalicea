# Sloptris: Build Spec

A browser-based Tetris variant that satirizes AI-assisted coding. Each piece is a ticket. You either build the piece by hand on a small grid or press G and let "the assistant" generate it instantly. Generated pieces look correct when they drop, but after they lock they can change shape. You can hold R while a generated piece falls to find out whether it will, at a cost. The only other pressure is a deadline clock that gets shorter every sprint.

Two voices exist in this game. The game itself speaks in plain, flat sentences. The assistant (chat pane) is cheerful, confident, and wrong. Keep them separate. Copy for both is in section 11. Use it verbatim.

## 1. Stack and constraints

- Static site: `index.html`, `style.css`, `game.js`, `audio.js`, and an `audio/` folder for assets (section 9). No framework, no bundler, no build step. Must run from a local file or Live Server.
- Vanilla JS (ES2020+). No dependencies.
- The well is a single `<canvas>`, cell size computed from the viewport (section 2, Responsive layout), scaled for `devicePixelRatio`. Everything drawn in the well (cells, glow, dither, line flash, mutation swap, review charge and pulse, target outlines) is drawn on that canvas in one coordinate space. No SVG overlay.
- Everything else is DOM: ticket panel, workbench, chat pane, status bar, clock, title, how-to-play, retro text, dev panel. The workbench is 16 DOM cells because it is 16 click targets with a cursor, not a drawing.
- The canvas redraws on a `requestAnimationFrame` loop while in Falling state or while any animation is running, and stops when nothing is changing (Spec state with no pending animation, Retro). Retro draws the frozen board once and stops.
- Runs on desktop and phones. Keyboard, mouse, and touch are all first-class (section 8). Mobile is a shipping target, not a fallback: the game must be fully playable one-handed in portrait on a 390 px wide phone.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. `touch-action: none` on the well and workbench, `user-select: none` on the play screen, and `preventDefault` on touch handlers so nothing scrolls, zooms, or pulls to refresh during play.
- No accounts, no server. `localStorage` holds: best score, the "how to play" seen flag, the sound on/off setting, and the auto-saved run (section 7A). Dev panel settings are never persisted (10.2).
- Deterministic RNG (seeded). See section 10.

## 2. Look

Terminal aesthetic, CRT flavor. Monospace everything. Lit things glow a little.

- Background: near black (`#0b0d0e`).
- One accent color for text, borders, and hand-built cells: amber (`#e6b450`). Do not add a second hue. The highlight used by the review pulse is the same amber pushed toward near-white (`#fff3d6`), never a different color.
- Every filled cell in the well has a soft glow: draw filled cells with `shadowBlur` around 6 px in the accent at about 35% alpha. This is the phosphor. The review pulse (6.4) is this glow turned up, not a new effect. Draw the glow pass once per frame for all cells, then the cells on top, so shadows do not stack on neighbors.
- Slop cells (generated pieces): same amber at about 45% alpha with a checkerboard or dot dither pattern (a small `createPattern` tile) so they read as "not solid" in a screenshot at thumbnail size. Slop cells glow at half the strength of solid cells.
- Muted text (status bar, labels): gray (`#6b7075`).
- Clock turns to a warmer amber at 0:30 and to red (`#d9534f`) at 0:10. This is the one exception to the single-hue rule.
- Optional: faint horizontal scanlines over the play area, a CSS repeating linear gradient on an element over the canvas at 3 to 4% opacity. Keep it subtle enough to disappear in a screenshot.
- Panels have single-line box-drawing borders drawn with CSS borders, not characters. Titles sit in the top border like `┌─ TICKET #47 ──┐`.
- Well cells: filled block. Empty well cells: a faint dot drawn at the cell center.
- Workbench empty cells: a slightly brighter `·`. Hovered or cursor cell: blinking underline or inverted cell.
- Chat pane text types in character by character at roughly 30 characters per second.
- Animation is limited to: piece drop, line flash on clear, the mutation beat (6.2), the review charge and pulse (6.4), and the typing effect.

### Layout

```
┌─ sloptris ── sprint 3 ──────────────────────── 02:14 ─┐
│                                                        │
│  ┌─ main ────────────┐   ┌─ TICKET #47 ──────┐         │
│  │ . . . . . . . . . │   │                   │         │
│  │                   │   │   █ █ █           │         │
│  │       (10 x 20)   │   │       █           │         │
│  │       canvas      │   │                   │         │
│  │                   │   │  Build an L.      │         │
│  │                   │   └───────────────────┘         │
│  │                   │                                 │
│  │                   │   ┌─ workbench ───────┐         │
│  │                   │   │ · · · ·           │         │
│  │ . . ░ ░ . . . . . │   │ · · · ·           │         │
│  │ █ █ ░ ░ █ █ . █ █ │   │ · · · ·           │         │
│  │ █ █ █ █ █ █ █ █ █ │   │ · · · ·           │         │
│  └───────────────────┘   └───────────────────┘         │
│                                                        │
│  ┌─ assistant ───────────────────────────────┐         │
│  │ > Sure! Here's your L-piece.              │         │
│  └───────────────────────────────────────────┘         │
│                                                        │
│  [G] generate   [R] review (hold)                      │
│                                                        │
│  > shipped 6   generated 4   debt 8                    │
└────────────────────────────────────────────────────────┘
```

The well is on the left, ticket and workbench stacked on the right. The assistant pane, hints, and status bar run the full width underneath. The header's left side holds the sound toggle (section 9), rendered as `[m] sound on` or `[m] sound off` on keyboard devices and `[sound on]` / `[sound off]` on touch devices.

### Responsive layout

- Cell size is not fixed. Compute it on load, resize, and orientation change:

  ```
  cell = clamp(14, floor(min((vw - rightColumn - gutters) / 10, (vh - chrome) / 20)), 24)
  ```

  where `rightColumn` is the ticket/workbench column width, `gutters` is the sum of horizontal padding, and `chrome` is header + assistant pane + hint row + status bar. Resize the canvas and redraw.
- The arrangement is the same on every screen size: well left, ticket and workbench stacked right, full-width rows below. Nothing reflows into a different order. On a portrait phone it is simply tighter.
- The right column is never narrower than 144 CSS px so workbench cells are at least 32 px square (36 px preferred). The workbench is a tap target first.
- All buttons are at least 44 CSS px tall.
- The assistant pane shows 2 lines instead of 3 when `vh < 700`.
- Hover-only affordances (workbench cursor blink, hover states) are skipped when the primary pointer is coarse (`@media (pointer: coarse)`). The hint row content also depends on this query (section 8).

The chat pane holds the last 3 assistant lines, newest at the bottom.

## 3. Screens

1. **Title.** Shown only when no saved run exists. Copy in 11.1. `Enter` or a tap starts. This gesture also unlocks audio (section 9). Shows best score from localStorage if present. Nothing about seeds or modes appears here. A sound toggle sits in the header (section 9).
2. **How to play.** Copy in 11.2, with the controls block chosen by pointer type (11.2 has both). Shown once (localStorage flag), reachable later with `?` or by tapping the sprint label in the header. Any key or tap dismisses.
3. **Play.** Section 4 onward.
3a. **Resume.** Shown instead of the title when a saved run exists (7A). The play screen renders underneath exactly as it was, with the clock stopped, and a small panel sits over the well with the copy in 11.8. `Enter` or `[resume]` continues the run. `N` or `[new game]` asks once for confirmation, then discards the save and starts a fresh run. This is the only paused state in the game.
4. **Retro.** Shown on game over. The well canvas stays where it is, drawn once more with the final board (all cells, slop dither and glow intact, no falling piece) and the loop stops. The ticket and workbench panels on the right are replaced by the stats block (11.6). On touch devices the `[enter] again    [s] copy share text` line is replaced by two buttons, `[again]` and `[share]`; share uses `navigator.share` when available and falls back to the clipboard. `Enter` restarts. `S` copies the share text (11.7) to the clipboard and shows `copied.` in the status bar.

## 4. Core loop

The game has two states that alternate: **Spec** and **Falling**.

### Spec state

- A ticket appears: a tetromino shape rendered in the ticket panel, plus one line of ticket copy (11.3). The ticket shape is shown in one fixed orientation.
- The workbench is a 4x4 grid, empty.
- The player can:
  - **Build:** toggle workbench cells with click, tap, or arrow keys plus `Space`/`Enter`. When the set of filled cells matches the ticket shape (any rotation, any position within the 4x4; see 5.1), the piece is accepted automatically and spawns in the well. No confirm key is needed.
  - **Generate:** press `G` or tap the button. The workbench clears, the chat pane types a line from 11.4a, and the correct ticket shape spawns in the well immediately, marked as slop. The mutation roll and target are decided now (6.1, 6.2).
- Filled workbench cells that do not yet match the shape stay filled. The player can clear the workbench with `Esc`, `C`, or the `[clear]` button.
- If the player fills 4 cells that do not match the ticket, the workbench border flashes once and nothing else happens. They fix it.
- The clock runs during Spec state.

### Falling state

Standard Tetris behavior, plus review on slop pieces.

- Piece spawns at top center in the ticket's orientation.
- Gravity: one cell per 700 ms. Soft drop: one cell per 50 ms. Move, rotate, soft drop, hard drop, and review are bound to keys and to touch gestures in section 8.
- Review: hold `R`, or press and hold on the well, on a slop piece. See 6.4 and section 8. Does nothing on a hand-built piece. No other input is accepted while a review hold is active.
- Lock delay: 300 ms after the piece lands. Moving or rotating resets it once per landing.
- On lock: if the piece is slop and has a pre-rolled mutation, attempt to apply it (6.2). Then check line clears. Then return to Spec state with a new ticket.
- Line clear: full rows flash for 150 ms, then remove and shift down. Status bar line from 11.5.
- Top-out: a piece locks with any cell in the top two rows, or a new piece cannot spawn. Game over, go to Retro.
- The clock runs during Falling state.

There is no hold piece and no next-piece preview. The ticket is the preview.

## 5. Shapes

### 5.1 Tetrominoes and the local frame

The seven standard tetrominoes: I, O, T, S, Z, J, L. Represent every piece as a 4x4 local grid (a set of `(x, y)` cells with `0 <= x, y < 4`). Rotation is a 90-degree rotation of the whole 4x4 grid about its center; wall kicks translate the grid. Precompute all distinct orientations for each shape (I, S, Z have 2; O has 1; T, J, L have 4; 19 total).

The local frame matters because a slop piece carries a hidden second shape (its mutation target, 6.2) in the same 4x4 grid. Rotating or moving the piece rotates and moves the target with it.

Workbench matching: normalize the filled workbench cells by translating them so the min x and min y are 0, then compare the cell set against every orientation of the ticket shape, also normalized. Match on any orientation. The piece spawns in the ticket's orientation regardless of how the player drew it.

### 5.2 Cell data

Every well cell stores:

```js
{ filled: bool, pieceId: number|null, slop: bool, mutated: bool }
```

Every locked piece has an entry in a `pieces` map: `{ id, slop, cells: [...] }`. When line clears remove cells, update the piece's cell list. A piece with fewer than 4 cells remaining is no longer "intact."

The falling piece additionally stores:

```js
{ shape, orientation, x, y, slop, willMutate, targetLocal, reviewCharge, reviewed }
```

## 6. Mutation (the one surprise)

Generated pieces always drop as the correct shape. The surprise happens after lock. Whether it will happen, and into what, is decided the moment the piece is generated.

### 6.1 Odds

On Generate, roll once against this table using the current sprint. The chance is flat for the whole sprint; how often the player generates versus builds does not change it.

| sprint | mutation chance |
|---|---|
| 1 | 35% |
| 2 | 40% |
| 3 | 45% |
| 4 | 50% |
| 5+ | 60% |

If the roll hits, roll again: `REFACTOR_CHANCE` (5%) that this piece's lock triggers a **board refactor** (6.3) in addition to its own mutation.

`generateStreak` (consecutive tickets resolved by Generate; building resets it to 0) is still tracked and saved, but only as a stat for the dev panel's `show streak` toggle.

Keep the table in a single config object at the top of `game.js` so it can be tuned.

### 6.2 Single-piece mutation

**Choosing the target (at generate time, board-independent).** If the roll hit:

1. Take the spawned orientation's cells in the 4x4 local frame and compute their bounding box.
2. Candidates: every one of the 19 orientations, at every offset such that all its cells lie inside that bounding box, excluding any candidate whose cell set equals the spawned cells exactly.
3. Pick one uniformly at random with the seeded RNG. Store it as `targetLocal` (cells in the local frame). Every tetromino bounding box admits at least one different tetromino, so this never fails.
4. Also compute the outline path of `targetLocal` (the boundary of the union of its cells, as an ordered list of edge segments in the local frame) for use by review (6.4) and the `show hidden targets` debug toggle (10.2).

**Applying it (at lock).**

1. Translate `targetLocal` into well coordinates using the piece's final `x`, `y`, and orientation.
2. Temporarily remove the piece's four cells from the board.
3. If every target cell is inside the well and none overlaps a filled cell, place the target cells with `slop: true, mutated: true` and the same `pieceId`. Otherwise put the original cells back unchanged. The mutation fizzles, with no message in either voice.
4. Do not apply gravity to the new cells or anything above them. Floating cells and gaps underneath are the intended result.
5. Run line-clear check. If the mutation completes a row, it clears normally.

The fizzle rule is deliberate. A player who reviewed the piece knows what it wants to become and can place it where that shape cannot fit.

Presentation on a successful mutation: after lock, the chat pane shows `…` for 400 ms, then the cells swap in one frame, then a line from 11.4b types in. Status bar line from 11.5. Count it in `mutated`.

### 6.3 Board refactor

Triggered by the lock of a piece flagged for refactor in 6.1, after that piece's own mutation attempt. Every other intact slop piece on the board (4 cells still present) attempts a mutation, in random order, choosing its target at this moment against the current board: candidates are the 19 orientations at offsets inside that piece's current bounding box, not identical to it, not overlapping any filled cell, inside the well. Pieces with no valid candidate stay. Earlier mutations in the same refactor affect later ones. After all attempts, run one line-clear check.

Presentation: chat pane shows `…` for 700 ms, then all changes apply in one frame, then the line from 11.4c types in. Status bar line from 11.5. Count it in `refactors`.

### 6.4 Review

Review lets the player find out, while a slop piece is falling, whether it will change and into what. The piece falls slowly while you look and you cannot steer it, and the clock keeps running the whole time. The answer is all or nothing.

- Available only on slop pieces, only in Falling state. `R` (or a touch hold, section 8) on a hand-built piece does nothing.
- While the review hold is active: move, rotate, soft drop, and hard drop are all ignored (not queued). Gravity slows to one cell per 1200 ms. Keep the review gravity in the config object. Sound: the `review_charge` cue runs for the duration (section 9).
- Each row the piece falls while `R` is held adds 1 to `reviewCharge`. The charge is kept when `R` is released, so the player can hold in bursts, but the total price never drops. At review gravity, a full charge takes about 7 seconds of clock.
- **Charge threshold: 6 rows.** Keep in the config object.
- Presentation while charging: the piece's glow builds from its resting level toward the highlight, proportional to `reviewCharge / threshold`. Nothing else is shown. The player can see how close they are to the answer and nothing about the answer.
- **When the charge reaches the threshold, the pulse fires once:**
  - If `willMutate` is false: the inner light fills the whole piece from the center outward to the highlight over about 300 ms and fades back over about 500 ms. Draw it by clipping to the piece's four cells and filling a radial gradient centered on the piece's bounding box, with the radius animated. Nothing remains afterward.
  - If `willMutate` is true: the light instead traces the outline of the target shape, a short bright head traveling once around the whole outline over about 600 ms, then the outline settles to a dim stroke (accent at about 40%) that stays for the rest of the fall. The outline is a canvas path built each frame from `targetLocal` transformed by the piece's current position and orientation, stroked with `setLineDash` and an animated `lineDashOffset` for the traveling head. Because it is drawn in the same pass as the cells, it moves and rotates with the piece by construction. Cells of the current piece outside the outline are the ones that will vanish; they need no separate treatment.
  - Either way, set `reviewed = true` and count it in `reviewed`. Further holding of `R` still locks controls and falls at review gravity but adds nothing.
- Releasing `R` before the threshold reveals nothing. Partial reveals do not exist.
- If the piece lands while `R` is held, lock delay runs as normal and the review ends. Any charge is lost with the piece.
- Status bar while `R` is held: `reviewing.` (persists while held, not the 2-second event timer).
- No chat pane line. Review is the player's action, not the assistant's.

## 7. Clock, sprints, deadline

- The clock counts down and never pauses during play. There is no pause key. The one exception is the Resume screen after a reload (7A), where the clock holds until the player continues.
- Sprint deadlines: 3:00, 2:30, 2:00, 1:30, then 1:00 for every sprint after.
- When the clock hits 0:00:
  1. If in Spec state: the workbench is cleared and the current ticket is **auto-generated** (counts as a Generate, increments the streak, rolls for mutation, spawns as slop). Chat pane types a line from 11.4d.
  2. If in Falling state: nothing happens to the piece; it keeps falling.
  3. The sprint counter increments, the clock resets to the next deadline, and the status bar shows the sprint transition line (11.5).
- The board is not cleared between sprints. Score carries.
- The game ends only on top-out.

## 7A. Auto-save and resume

A run survives a page reload. The game saves itself continuously and reopens paused where it left off.

### 7A.1 What is saved

One JSON object under `localStorage` key `sloptris.save`, with a `schemaVersion` integer. Everything needed to continue the run exactly:

- screen (`play` or `retro`), state (`spec` or `falling`), sprint number, clock remaining in ms
- PRNG internal state (not just the seed; the stream must continue from where it was)
- the 7-bag state and the current ticket (shape, orientation, copy line index)
- the board: every cell's `{ filled, pieceId, slop, mutated }`, and the `pieces` map
- the falling piece, if any: `shape, orientation, x, y, slop, willMutate, targetLocal, reviewCharge, reviewed`, and whether it has landed (lock delay pending)
- workbench cells
- `generateStreak` and all counters: `lines, generated, built, mutated, refactors, reviewed`
- the assistant pane's current lines
- `nextPieceId`

Not saved: dev panel values, animation progress, whether a key or finger is currently held.

### 7A.2 When it saves

Saves happen only at quiet points, so a restored game is never mid-animation:

- after every discrete event completes, including its animation: workbench toggle, generate, spawn, move, rotate, lock and any mutation or refactor, line clear, sprint transition, top-out
- once per second during Falling state while no animation is running (so the clock and piece position are never more than a second stale)
- on `visibilitychange` to hidden and on `pagehide`

Writes are synchronous `localStorage.setItem` of the serialized object. If it throws (quota, private mode), the game keeps running without saving and logs once to the console. Never surface storage errors to the player.

### 7A.3 Restore

On load, if `sloptris.save` exists and parses with a matching `schemaVersion`, rebuild the full state from it, render the play screen (or the retro if `screen` is `retro`), and show the Resume screen over it with the clock stopped. If the key is absent, fails to parse, or has a different `schemaVersion`, delete it and show the title.

On resume:

- the clock continues from the saved remaining time (real time that passed while the tab was closed does not count)
- a falling piece that had landed restarts its 300 ms lock delay
- a review hold is not active until the player holds again; `reviewCharge` is preserved
- music restarts from the top, since the resume press is the audio unlock gesture

On new game: the player confirms once (11.8), the save is deleted, and a fresh run begins with a new seed under the current seed mode. Best score is untouched.

On `[again]` from the retro: same as new game, no confirmation needed.

### 7A.4 What this changes

Reloading is effectively a pause. That is accepted. There is still no pause key, and the Resume screen does not offer one; it only appears after a load.

## 8. Input

Keyboard, mouse, and touch are all supported at all times. Detection of a coarse pointer only changes which hints are shown and whether hover affordances exist; it never disables an input method.

### 8.1 Keyboard

| action | keys |
|---|---|
| move left / right | `Left` / `Right`, `H` / `L` |
| rotate clockwise | `Up`, `X`, `K` |
| rotate counterclockwise | `Z` |
| soft drop | `Down`, `J` (held) |
| hard drop | `Space` |
| review | `R` (held) |
| generate | `G` |
| workbench cursor | arrows; `Space` / `Enter` toggles the cell |
| clear workbench | `Esc`, `C` |
| sound on/off | `M` |
| how to play | `?` |
| dev panel | backtick |
| start / resume / again | `Enter` |
| new game (Resume screen) | `N`, twice |
| copy share text | `S` (retro only) |

### 8.2 Touch

All falling-piece gestures happen on the well canvas. `touch-action: none` there; handle `pointerdown` / `pointermove` / `pointerup` with `preventDefault`.

| action | gesture |
|---|---|
| move | horizontal drag; the piece moves one cell per `cell` px of horizontal travel, following the finger with snapping |
| rotate clockwise | tap: touch and release within 200 ms with less than 8 px of travel |
| soft drop | vertical drag downward; one cell per `cell` px of travel |
| hard drop | downward flick: velocity above 1.2 px/ms with at least 2 cells of travel, released |
| review | press and hold without moving for 250 ms on a slop piece; review runs until the finger lifts; movement after the hold begins is ignored |
| generate | `[generate]` button in the hint row |
| clear workbench | `[clear]` button in the hint row |
| toggle workbench cell | tap the cell |
| sound on/off | `[sound on]` / `[sound off]` in the header |
| start / dismiss / again | tap anywhere on title, how-to-play; `[again]` on retro |
| resume / new game | `[resume]` / `[new game]` on the Resume screen; `[new game]` a second time to confirm |
| share | `[share]` on retro |
| how to play | tap the sprint label in the header |
| dev panel | `?dev` in the URL, or long-press the `sloptris` title for 2 s |

Gesture rules:

- A single pointer is tracked. Additional touches are ignored.
- A gesture is classified once: a touch that becomes a drag cannot become a tap or a hold; a hold that has begun cannot become a drag.
- During a review hold on a slop piece, the finger may move; nothing happens. During a hold on a hand-built piece, nothing happens at all.
- Drags are relative to the touch start, so the piece never jumps to the finger's absolute position.
- A tap during lock delay still rotates and resets the delay once, same as the keyboard.

### 8.3 Hint row

The row under the assistant pane depends on pointer type.

- Fine pointer: `[G] generate   [R] review (hold)`
- Coarse pointer: three buttons, `[generate]`, `[clear]`, and, on retro only, `[again]` `[share]`. Buttons are at least 44 px tall and use the same box-drawing border treatment as the panels.

## 9. Sound

Sound is in scope with placeholders. `audio.js` wraps the Web Audio API with no dependencies. Every cue is defined now with a synthesized fallback so the game is fully playable and testable before a single asset exists.

### 9.1 Structure

- A cue manifest, one object at the top of `audio.js`, maps cue names to file paths under `audio/` (for example `lock: 'audio/lock.mp3'`). No audio files ship in this version. The `audio/` folder contains only a `README.md` listing the expected file names from the manifest.
- On load, attempt to fetch and decode each file. If a file is missing or fails to decode, the cue uses its synthesized fallback: a short oscillator tone with a per-cue frequency and envelope defined next to it in the manifest. Fallbacks should sound like a terminal, not a synth: short, square or triangle wave, low volume.
- Music: `audio/loop.mp3`, looped. Its fallback is silence; do not synthesize music.
- The `AudioContext` is created and resumed on the start gesture (`Enter` or tap on the title screen). Never before. If the context is suspended later (tab backgrounded on mobile), resume it on the next user gesture.
- Cue playback is fire-and-forget except `review_charge`, which is a sustained tone started on hold and stopped on release or pulse, with its pitch tracking `reviewCharge / threshold`.

### 9.2 Cues

| cue | fires when |
|---|---|
| `wb_toggle` | a workbench cell is toggled |
| `wb_reject` | four cells are filled that do not match the ticket |
| `build` | a hand-built piece is accepted and spawns |
| `generate` | a piece is generated (also on auto-generate) |
| `move` | the falling piece moves one cell horizontally |
| `rotate` | the falling piece rotates |
| `soft_drop` | each cell of soft drop |
| `hard_drop` | a hard drop lands |
| `lock` | any piece locks |
| `clear` | one or more lines clear (once per clear event) |
| `mutate_beat` | the `…` beat before a mutation |
| `mutate` | the cells swap |
| `refactor` | a board refactor applies |
| `review_charge` | sustained while a review hold is active |
| `pulse_stable` | the pulse fires on a stable piece |
| `pulse_mutate` | the pulse fires on a mutating piece |
| `sprint` | a sprint transition |
| `deadline_warn` | the clock reaches 0:10 (once per sprint) |
| `typing` | each character the assistant types (very quiet, can be disabled in the manifest) |
| `topout` | game over |
| `music` | loops from start gesture until retro |

### 9.3 Sound toggle

- One control, on/off, for music and effects together. Header top-left. `M` toggles it on keyboard devices.
- Off means nothing is scheduled, not muted-but-running. Music stops on off and restarts from the top on on.
- Persisted in `localStorage` under `sloptris.sound` as `"on"` or `"off"`. Default `"on"`.
- The toggle is the game's voice: `sound on` / `sound off`. No icon-only state; the word is always present.

## 10. Seeding, daily mode, and the dev panel

All randomness is seeded, but the player never sees this. Modes and seeds live behind a dev panel.

### 10.1 Seeding

- Every RNG roll (ticket sequence, mutation roll, target choice, refactor roll and order, ticket copy selection, chat line selection) comes from one seeded PRNG. Review consumes no randomness. Two runs with the same seed and the same inputs are identical.
- Ticket sequence: 7-bag randomizer, seeded.
- Use a small xorshift or mulberry32 PRNG. Never call `Math.random` anywhere in game logic.
- Three seed modes:
  - **random** (default): seed from `Date.now()`.
  - **daily**: seed = `YYYY-MM-DD` in the player's local time, hashed to a 32-bit integer.
  - **fixed**: a seed the dev panel supplies.
- A `?seed=<integer>` query parameter forces fixed mode with that seed for the session, so a run can be reproduced from a link. `?dev` opens the dev panel on load.

### 10.2 Dev panel

Hidden by default. Toggle with the backtick key (`` ` ``) on any screen, or load with `?dev`. It is a small panel in the bottom-right corner, same terminal styling, titled `dev`. It is not mentioned in any player-facing copy.

Contents, top to bottom:

- `seed mode` : `random` / `daily` / `fixed` (radio). Switching modes takes effect on the next run, not mid-run.
- `seed` : the current run's seed, read-only in random and daily mode, editable in fixed mode. A `copy` button copies `?seed=<n>` as a full URL.
- `mutation table` : the five per-sprint percentages, editable.
- `refactor chance` : editable.
- `review threshold` and `review gravity (ms)` : editable.
- `deadlines` : the five sprint values in seconds, editable.
- `gravity (ms)` : normal fall speed, editable.
- Toggles: `force mutation on next generate`, `force refactor on next generate`, `show hidden targets` (draws every falling and locked slop piece's target outline at all times, for debugging the local-frame math), `show streak` (adds `streak {n}` to the status bar).
- `play cue` : a dropdown of every cue name in the manifest and a `play` button, for checking assets as they arrive.
- `reset to defaults` button.

Panel values live in memory only and reset to the config object's defaults on every reload. Nothing about the dev panel is persisted. The only things that survive a reload are the query parameters (`?dev`, `?seed=<n>`), so a reproducible run is a URL, not a saved setting.

When the dev panel is open, the retro stats block gains a final line `seed {n} ({mode})` and the share text gains ` seed {n}` at the end. When it is closed, neither appears.

## 11. Copy

Use these strings exactly. Do not add exclamation points, emoji, or extra lines to the game's own voice (11.1, 11.2, 11.3, 11.5, 11.6, 11.7). The assistant's voice (11.4) is the only place that sounds upbeat.

### 11.1 Title screen

```
sloptris

There's a spec and a clock. Build the piece on the workbench, or press G and let the assistant do it. Building takes a few seconds each time. Generating takes none, and the piece usually comes out right.

[enter] start    [?] how to play
```

### 11.2 How to play

```
Each ticket is a shape. Click the cells on the workbench until they match and the piece drops. Or press G and it drops now.

A generated piece can change shape after it locks. The more you generate in a row, the more likely that gets. Building one by hand resets it.

Hold R while a generated piece falls to find out. It falls slower while you look, you can't move it, and the clock doesn't care. The answer comes all at once or not at all.

The deadline gets shorter every sprint.

move: arrows or hjkl    rotate: up / x / z    hard drop: space
generate: g    review: r (hold)    clear workbench: esc    sound: m
```

Coarse pointer: replace the two controls lines with:

```
move: drag sideways    rotate: tap    drop: drag down    slam: flick down
review: press and hold    generate and clear: buttons below
```

### 11.3 Ticket lines

Pick by shape, then a seeded random line from that shape's list.

- I: `Line piece. Don't overthink it.` / `Need a straight one.`
- O: `Square. Should be easy.` / `Just a square.`
- T: `Need a T here.` / `T piece.`
- S: `S piece. Same as last time.` / `Build an S.`
- Z: `Z this time.` / `Build a Z.`
- J: `J. Not L. J.` / `Need a J.`
- L: `Build an L.` / `L piece, standard.`

### 11.4 Assistant lines

**a. On generate** (pick one; `{shape}` is the letter):

- `Sure! Here's your {shape}-piece.`
- `Great choice. Dropping a {shape} now.`
- `Absolutely. One {shape} piece, coming right up.`
- `Done! I've generated the {shape}-piece you asked for.`

**b. After a single-piece mutation** (`{old}` and `{new}` are shape letters):

- `You're absolutely right, that should have been a {new}. Fixed!`
- `I noticed the {old} wasn't optimal, so I've gone ahead and adjusted it.`
- `Quick improvement: I restructured the piece for better fit.`
- `Small update! I refined the {old} into a {new} for consistency.`

**c. After a board refactor:**

- `I took the liberty of refactoring the whole board for consistency. Let me know if you'd like any other changes!`

**d. On auto-generate at deadline:**

- `Looks like time was tight, so I went ahead and generated the {shape} for you!`

### 11.5 Status bar

Default line, always visible, updated live:

```
shipped {lines}   generated {generated}   debt {slopCellsOnBoard}
```

Event lines replace the default line for 2 seconds, then it returns:

- Line clear, no slop in the row(s): `shipped.`
- Line clear, slop present: `shipped. {n} slop cells in that row.` (`those rows` if more than one)
- Single mutation: `piece changed after lock.`
- Board refactor: `board changed.`
- Sprint transition: `Sprint {n} done. Sprint {n+1} deadline is {m:ss}.` For sprint 4 and later: `Sprint {n} done. Every sprint from here is 1:00.`
- Share copied: `copied.`

Held line (shown while the condition holds, overriding the above):

- `R` held on a slop piece: `reviewing.`

### 11.6 Retro

```
Board is full with {m:ss} left in sprint {n}.

{lines} shipped
{generated} generated
{reviewed} reviewed before they landed
{mutated} changed after lock
{refactors} board refactors
{slopCells} slop cells still on the board
{built} built by hand

[enter] again    [s] copy share text
```

Omit the refactor line when it is 0. No other line is omitted, even at 0. See 10.2 for the seed line that appears only with the dev panel open.

### 11.7 Share text

```
sloptris: {lines} shipped, {mutated} changed shape after I placed them.
```

### 11.8 Resume screen

Panel over the well. First line, then the controls line.

```
Reloaded. The clock is stopped at {m:ss}, sprint {n}.

[enter] resume    [n] new game
```

After the first press of `N` (or tap of `[new game]`), the controls line becomes:

```
Press n again to throw this run away.
```

On touch: `[new game]` is relabeled `[throw it away]`. Any other input returns the line to normal.

If the saved screen is the retro, the first line is `Reloaded.` and the controls line is `[enter] see retro    [n] new game`.

## 12. Scoring

The only score is `lines` (rows cleared). Best score saved to localStorage under `sloptris.best`. No points for speed, combos, hard drops, or reviews.

## 13. Out of scope for this version

- Real audio assets. Every cue exists with a synthesized fallback; the files come later.
- Tablet-specific layout. Tablets get the desktop arrangement at the computed cell size.
- Haptics.
- Wrong-shape drops, lying reviews, or any second kind of surprise.
- Slop cells vanishing over time.
- Leaderboards or any network call.
- Pause.

## 14. Acceptance checklist

- [ ] Runs by opening `index.html` directly, no console errors, with the `audio/` folder empty except its README.
- [ ] Fully playable in portrait on a 390 px wide phone: well, ticket, workbench, assistant pane, buttons, and status bar all visible without scrolling; workbench cells at least 32 px.
- [ ] Nothing on the play screen scrolls, zooms, or pulls to refresh during any gesture.
- [ ] Touch: drag moves with snapping, tap rotates, drag down soft-drops, flick hard-drops, hold for 250 ms starts review on a slop piece and does nothing on a hand-built piece.
- [ ] A gesture never changes class mid-touch (a drag cannot become a tap or hold, a hold cannot become a drag).
- [ ] Hint row shows key hints on fine pointers and buttons on coarse pointers; both input methods work regardless.
- [ ] Retro on touch shows `[again]` and `[share]`; share uses `navigator.share` where available.
- [ ] Every cue in the manifest plays its synthesized fallback when the file is missing; dropping a valid file into `audio/` with the manifest's name makes it play instead, with no code change.
- [ ] `AudioContext` is not created until the start gesture; music begins on start and stops on retro.
- [ ] Sound toggle is off means silence, persists across reloads, and reads `sound on` / `sound off`.
- [ ] `review_charge` pitch rises with charge and stops on release or pulse.
- [ ] Drawing any rotation of the ticket shape on the workbench spawns the piece in the ticket's orientation.
- [ ] Drawing four cells that are not the ticket shape does nothing except a border flash.
- [ ] `G` spawns the correct shape instantly, dithered, and types an assistant line.
- [ ] Hand-built cells render solid with glow; generated cells render dithered with weaker glow; the difference is visible at 25% zoom. The canvas is crisp on a 2x display.
- [ ] The mutation roll and target are fixed at generate time and do not change during the fall.
- [ ] The target rotates and translates with the piece; rotating a reviewed piece rotates its outline on the canvas with no lag or offset.
- [ ] At lock, the target applies only if it fits inside the well without overlapping filled cells; otherwise the piece stays with no message.
- [ ] Mutation can complete a row, and that row clears.
- [ ] Board refactor triggers only from a piece that rolled a mutation and re-mutates every other intact slop piece against the live board.
- [ ] The mutation chance depends only on the current sprint; building by hand or generating in a row does not change it.
- [ ] `R` does nothing on hand-built pieces.
- [ ] While `R` is held on a slop piece: no move, rotate, soft drop, or hard drop; gravity at 1200 ms per cell; the clock keeps running; status bar reads `reviewing.`
- [ ] Charge accumulates one per row fallen while held, persists across releases, and reveals nothing before 6.
- [ ] At charge 6 the pulse fires exactly once: whole-piece inner light for a stable piece, traveling outline of the target for a mutating piece.
- [ ] After the pulse on a mutating piece, the dim outline persists for the rest of the fall and matches the shape that appears at lock (given a placement where it fits).
- [ ] Holding `R` past the threshold changes nothing further.
- [ ] Clock never pauses during play. Deadlines: 3:00, 2:30, 2:00, 1:30, 1:00, 1:00, ...
- [ ] Reloading mid-fall restores the board, the falling piece (position, orientation, hidden target, review charge), the workbench, the ticket, the clock, the streak, all counters, and the assistant pane, and shows the Resume screen with the clock stopped.
- [ ] Reloading mid-animation restores the last completed state, never a half-applied mutation, clear, or pulse.
- [ ] Time elapsed while the tab was closed does not reduce the clock.
- [ ] After resume, the ticket sequence and every roll continue exactly as they would have without the reload (PRNG state restored, not reseeded).
- [ ] `N` twice on the Resume screen deletes the save and starts a fresh run; `N` once then any other key cancels.
- [ ] Reloading on the retro shows the retro again; `[again]` clears the save.
- [ ] A save with a different `schemaVersion` or corrupt JSON is discarded and the title shows.
- [ ] With `localStorage` unavailable, the game plays normally without saving.
- [ ] At 0:00 in Spec state, the ticket auto-generates with the 11.4d line.
- [ ] Same seed plus same inputs produces the same tickets, the same rolls, and the same targets, in every seed mode.
- [ ] With no query params, the game seeds from `Date.now()` and no seed, mode, or dev text appears anywhere.
- [ ] Backtick toggles the dev panel; `?dev` opens it on load; `?seed=<n>` forces fixed mode.
- [ ] Dev panel edits are lost on reload; `reset to defaults` restores the config object's values without a reload.
- [ ] `show hidden targets` draws target outlines that match what appears at lock.
- [ ] Retro shows the frozen board with dither and glow intact, the render loop stopped, and the stats block exactly as in 11.6 where the ticket and workbench were.
- [ ] `S` on Retro copies the 11.7 string.
- [ ] No text anywhere except the assistant pane uses an exclamation point.