# Sloptris implementation notes

SPEC.md is the source of truth. These are the places where the implementation had to
decide something the spec leaves open or gets wrong. Code comments that mention a
"CONTRACT resolution" refer to the numbered items here.

1. **Mutation candidates for I and O.** SPEC 6.2 says every tetromino bounding box admits a
   different tetromino. That is false for I (4x1) and O (2x2). Rule used: compute candidates
   in the tight bounding box; if there are none, widen the box by one cell along its shorter
   axis (toward the higher index when that stays inside the frame or well, else the lower)
   and retry. Generate-time targets widen as far as the 4x4 local frame allows (I gets a 4x2
   box, O a 3x2 box). Board-aware picks (refactors, and the lock-time fallback in item 12)
   widen at most `TARGET_WIDEN_MAX` (2) steps so a boxed-in piece stays instead of moving to
   a distant empty area.
2. **Retro buttons on coarse pointers.** On a coarse pointer the stats block omits its
   `[enter] again` line and the hint row shows `[again]` (and `[help]`, item 17) in place
   of `[generate]` `[clear]`.
3. **Ticket number.** The ticket title is `TICKET #{n}` where n is the id the piece will get,
   starting at 1.
4. **Spawn orientations** in the 4x4 local frame, `(x, y)` with y down:
   I (0,1)(1,1)(2,1)(3,1); O (1,0)(2,0)(1,1)(2,1); T (1,0)(0,1)(1,1)(2,1);
   S (1,0)(2,0)(0,1)(1,1); Z (0,0)(1,0)(1,1)(2,1); J (0,0)(0,1)(1,1)(2,1);
   L (2,0)(0,1)(1,1)(2,1). The piece spawns with its topmost cell in well row 0 and local
   x=0 at well column 3.
5. **Rotation.** Clockwise: cell `(x, y) -> (3 - y, x)`; outline vertex `(vx, vy) -> (4 - vy, vx)`.
   A piece stores `orientation` as a rotation count 0..3 applied to its spawn-frame cells;
   `targetLocal` is stored in the spawn frame and rotated by the same count. Wall kicks try
   `(0,0) (-1,0) (1,0) (-2,0) (2,0) (0,-1)` in that order.
6. **The 19 orientations** used for workbench matching and mutation candidates are
   normalized cell sets (min x = min y = 0), deduplicated, tagged with the shape letter.
7. **Backgrounded tab.** Elapsed time per clock tick is capped at 1000 ms so a throttled tab
   cannot chain several deadlines at once. The falling piece is driven by
   `requestAnimationFrame`, which browsers pause in hidden tabs, so a hidden tab's piece does
   not fall while the clock keeps counting.
8. **`locking` state.** Between a piece landing and the return to Spec, the lock pipeline
   (mutation beat, refactor beat, line flash) runs with `state = 'locking'`. It is never
   saved; for the deadline rule it counts as Falling; workbench input is ignored during it.
9. **Pointer type.** `matchMedia('(pointer: coarse)')` decides the hint row, the how-to
   controls block, the sound toggle label and the retro buttons. `body.coarse` mirrors it.
10. **Assistant `…` beat.** The `…` line is pushed instantly, the change applies after the
    beat, and the same line is then replaced by the typed assistant line. Saved chat lines
    are the completed texts.
11. **Held inputs.** A held R or Down key (or a touch hold) ends when the piece locks; the
    next piece needs a new press.
12. **Lock-time fallback target.** SPEC 6.2 says a target that does not fit at lock fizzles,
    full stop. Measured against a snug-placing player (see Tuning), 61% of rolled mutations
    fizzled that way, which is why mutations felt rare next to refactors, which never fizzle.
    Rule used: if the pre-rolled target does not fit and the piece was **not reviewed**, pick
    a new target against the live board, the same way a refactor does (bounding box, widen at
    most `TARGET_WIDEN_MAX`, no overlap, inside the well). If that finds nothing, the fizzle
    stands. A **reviewed** piece never falls back: the outline the player paid for is a
    promise, and placing it where that shape cannot fit is the intended counterplay. The
    fallback consumes PRNG at lock, so the run is still deterministic for the same inputs.
    Caveat: the `show hidden targets` dev toggle draws the pre-rolled target, so when the
    fallback fires the result on the board will differ from the outline that was shown.
13. **Dev panel close.** SPEC 10.2 gives only the backtick to close the panel, which a touch
    device does not have and which the keyboard handler ignored while a dev field had focus.
    Added an `[x]` in the panel's top border, made backtick work from inside a dev field
    (blurring it), and made Escape and Enter leave a dev field. Checkboxes, radios and the
    cue dropdown blur themselves after a change, and a pointer click on any button blurs it,
    so the next Space or Enter goes to the game instead of re-clicking the control.

14. **Review threshold and the answer's look.** SPEC 6.4 sets the charge threshold at 6 rows
    (about 7 seconds at review gravity). Playtesting found that too long; `REVIEW_THRESHOLD`
    went to 3, then the owner set it to 2 (about 2.4 seconds), still editable in the dev
    panel. SPEC 6.4 has the glow build "proportional to reviewCharge / threshold", i.e. in
    whole-row steps, which at 2 rows is one jump to half and then the answer. The glow and
    the charge tone now use `reviewProgress`, which adds the fraction of the next row
    already fallen while the hold is active, so the build is continuous at any threshold;
    a released charge still holds its last whole-row value. The pulse in 6.4 is kept, and
    two things are added on top because the pulse alone was easy to miss: when the charge
    reaches the threshold the whole well flashes the highlight and drains over
    `REVIEW_FLASH_MS` (600) while a ring runs out from the piece; and for the rest of the
    fall the reviewed piece is drawn as one tetromino, seams closed, fill pushed toward the
    highlight, with its **final** shape stroked in the highlight. For a stable piece that is
    its own silhouette; for a mutating piece it is the target outline, which replaces the
    dim 40% accent stroke the spec asked for. Same palette, no new hue.

15. **Sprint goals (2026-09-15).** SPEC 7 has the clock as the only sprint pressure: at 0:00
    the sprint counter just increments. The owner asked for a shipping goal per sprint and a
    clock that is impossible to miss. Rule used: `GOALS_LINES` (3, 4, 5, 5, 5, dev-panel
    editable) is the number of lines to clear within the sprint (`G.sprintLines`,
    `G.sprintGoal`, both saved). Meeting it ends the sprint at once, mid-lock, right after
    the line clear; the clock resets to the next deadline. Lines cleared past a goal carry
    forward (capped at goal - 1), so a four-line clear is never wasted. **Missing the
    deadline ends the run** (owner's call, replacing an earlier carry-over draft): the
    auto-generate of SPEC 7 and the `AUTOGEN` line are gone, `deadlineReached` calls
    `endRun('deadline')`, the same path as top-out (`G.overReason` is saved so a reload lands
    on the same retro). Presentation: the header shows `{k}/{goal} lines` and a much larger
    clock (24px bold; 18px on phones) right after the sprint label, over the well, not
    pushed to the far right; both flare and swell for 0.9 s at a transition and the clock
    pulses in the danger state. The well flashes and a band across its upper third reads
    `SPRINT n DONE` then `SPRINT n+1 / ship g lines / by m:ss` for `SPRINT_BANNER_MS`
    (3000) and the status bar carries the same line for that long. On a missed deadline the
    band is held (`hold: true`, no flash or fade, no animation loop) reading
    `DEADLINE MISSED / sprint n / k of g lines`, the assistant types one last upbeat line,
    and the retro head reads `Sprint {n} deadline missed with {k} of {goal} lines shipped.`
    (top-out keeps its head plus `k of g lines shipped this sprint`). The 11.5 lines
    `Sprint {n} done. Sprint {n+1} deadline is {m:ss}.` and the 1:00 variant are replaced.

16. **Title and how-to copy (2026-09-15).** The owner found SPEC 11.1 and 11.2 too long and
    asked for a ruthless rewrite in his own voice. The title body and the four how-to
    paragraphs in index.html and in `COPY` are new text (about half the length); the
    controls lines are unchanged. The paragraphs no longer name keys ("press G", "hold R"),
    because the same paragraphs show on touch devices where there is no G or R; they use the
    game's own verbs, generate and review, and the controls block under them maps each verb
    to a key or a gesture. Since the owner started editing the how-to in `COPY` directly
    (2026-09-15), `applyCopyToDom` writes `TITLE_BODY` and `HOWTO_P1..P4` into
    `#title-copy` and `#howto-p1..4` at startup, so `COPY` is the one source and the
    markup holds placeholders.

17. **A visible way into how-to-play.** SPEC 8 reaches the how-to after the title only by
    `?` or by tapping the sprint label, and nothing on screen said so. The fine-pointer hint
    row now ends with `[?] help` and the coarse-pointer button row has a `[help]` button
    (shown during play and on the retro). The sprint-label tap still works.

18. **No sharing.** The owner dropped the share feature (2026-09-15): SPEC 11.7 share text,
    the `S` key and `[share]` button on the retro (SPEC 8, 11.6), the `copied.` status line
    (11.5) and the share-text seed suffix (10.2) are all gone. The retro controls line is
    `[enter] again`. The clipboard helpers stay only for the dev panel's seed copy button.

19. **Audio assets (2026-09-15).** The owner asked for royalty-free retro music and effects.
    Shipped: sixteen CC0 Ogg Vorbis clips from Kenney's Interface Sounds and Digital Audio
    packs, chosen by name and by measured length (move and rotate are 7 to 20 ms clicks,
    the rest 100 to 1000 ms), and Juhani Junkala's CC0 "Level 1" chiptune as `loop.mp3`,
    downmixed to mono and encoded at 96 kbps (891 KB, 74 s, 9 ms of silence at each end).
    The manifest now names `.ogg` for those sixteen cues; `mutate`, `refactor`,
    `review_charge` and `typing` keep their synthesized versions on purpose (see the
    audio.js header). A browser that cannot decode Ogg Vorbis falls back to the synth per
    cue. Credits and the file-to-clip mapping are in audio/README.md, and the how-to
    screen ends with a one-line credit. No ffmpeg was available, so the MP3 was made with
    lamejs in a scratchpad script; the WAV originals are not in the repo.
    The synthesized review_charge sweep was 220 to 880 Hz; the owner found it far too high,
    so it is 110 to 330 Hz (A2 up a twelfth), same exponential mapping over the charge.
    The four synthesized cues also fetched files that did not exist (four 404s in the
    console on every start), so mutate, refactor, review_charge and typing now ship as
    generated low-pitched WAVs (gen script in the session scratchpad, parameters in
    audio/README.md); the synth fallbacks stay in the manifest.
    The owner could not hear the workbench tick: the manifest gains were tuned for the
    square-wave fallbacks, and the clips are far softer per unit gain. Each file-backed cue
    now has a fileGain (0.3 to 1.0, set against each clip's measured RMS) used for the
    decoded file, while gain stays the fallback's peak.

20. **New game during play.** SPEC only starts a run from the title, the resume screen or
    the retro. Added `N` during play (fine pointer, listed in the hint row) and a `[new]`
    button (coarse pointer, hidden on the retro where `[again]` already is). The first press
    shows `Press n again to throw this run away.` (touch: `Tap again ...`) and turns the
    button into `[throw it away]` for `NEW_CONFIRM_MS` (3000); a second press inside that
    window calls `newRun`. Any state is allowed, including mid-lock: `newRun` bumps
    `G.runId` and `runLock` re-checks it after each of its awaits, so a pipeline from the
    old run stops touching the new board.

21. **Balance model and the build time (2026-09-15).** The owner's brief: some generation
    must always be necessary, never all of it, there must be time to review even in the
    hardest sprint, and hard-dropping unreviewed pieces must sometimes be forced. Measured
    first (greedy hole-avoiding bot through the real UI, seed 1234, 80 pieces, no reviews):

    | play style | pieces per line | outcome |
    |---|---|---|
    | every piece hand-built | 2.6 | no top-out |
    | two generated, one built (streak stays at 2) | 3.3 | no top-out |
    | four generated, one built (streak reaches 4) | 5.6 | top-out at 67 pieces, 12 lines |
    | every piece generated | 5.8 | top-out at 64 pieces, 11 lines |

    So slop, not the clock, kills heavy generation, and hand-building was nearly as fast per
    line as generating while producing no slop: no deadline could make generating necessary.
    Hence `BUILD_MS` (2500, dev-panel "build time"): the fourth matching cell starts a build,
    the status bar reads `building...`, the workbench border breathes, and the piece spawns
    when the timer ends. The clock runs meanwhile. Generate or clear cancels it; a reload
    mid-build resumes it on the resume screen's continue; `newRun` and `endRun` cancel it
    and the timer is guarded by `G.runId`. The title copy's "Building takes a few seconds
    each time" (SPEC 11.1) is now literally true.

    Human time assumptions (unmeasured, retune from playtests): generate and place 2.8 s
    including the average lock beat; build 7 s (3 s of clicks + 2.5 s build + 1.5 s to
    place); a review adds 3.6 s. Pace per line: hand-only 2.6 x 7 = 18.2 s; the best mixed
    pattern 3.3 x (0.67 x 2.8 + 0.33 x 7) = 13.8 s; four-in-a-row generation 21 s and the
    board dies. Sprint targets sit between those: seconds per line 18, 16.7, 16.3, 15.8,
    16.3, giving `DEADLINES_S` 180/150/130/95/65 and `GOALS_LINES` 10/9/8/6/4. Slack over
    the best pace is 42, 26, 20, 12, 10 seconds per sprint, i.e. roughly 11, 7, 5, 3 and 2
    reviews' worth, so a hand-only player misses sprint 1 by a few seconds, a mixed player
    has time to review a good share early and only a couple of pieces late, and anyone who
    generates four in a row is punished by the board rather than the clock. SPEC 7's
    deadlines (3:00 to 1:00) are replaced by this table.

22. **Owner's playtest values (2026-09-15).** After playing with the build timer the owner
    set `MUTATION_TABLE` 35/45/65/75/80, `GOALS_LINES` 4/3/3/2/2, `BUILD_MS` 1600 and
    `REVIEW_THRESHOLD` 2 directly in CONFIG. These override the model numbers in item 21;
    the deadlines from item 21 stand. Seconds per line are now 45, 50, 43, 48, 33, so the
    clock pressure comes from the last sprint and from slop rather than from raw line count.

23. **Mutation crossfade.** SPEC 6.2 applies a mutation "in one frame" with nothing but the
    assistant line and the `mutate` cue. The owner asked for a visible beat, darker than the
    review flash, without a ring, and one that makes the change legible. On commit (and on
    a board refactor) `G.mutateFlash` runs for `MUTATE_FLASH_MS` (700) with two cell lists:
    `gone` (old shape minus new) fades out, painted in the slop look over the now-empty
    cells; `came` (new minus old) fades in as the background lifts off them, with a halo of
    `COLORS.darkRGB` (the accent pushed toward black, same hue) around the arriving cells,
    drawn outside them only via an even-odd clip. Shared cells never flicker. The board
    itself still swaps in one frame; the crossfade is drawn over it. `boardRefactor`
    returns `{ gone, came }` across every piece it moved.

24. **Changed pieces drop into place.** SPEC 6.2 says "no gravity on anything" after a
    mutation. The owner wanted the opposite, so that a reviewed piece can be placed where
    its coming shape will fall into a gap: `SETTLE_DELAY_MS` (700, the crossfade) after a
    mutation or refactor, every changed piece falls as a unit one cell per `SETTLE_MS` (45)
    until it rests on the floor, on other cells or on the falling piece (`G.settling`,
    `updateSettling` in the frame loop, lowest piece first). This runs while the next ticket
    is already in play. When a piece that fell comes to rest, the `lock` cue plays and full
    rows ship. Row clearing moved out of the lock pipeline into `shipFullRows`, a serialized
    queue, so a settling piece and a locking piece cannot double-clear the same rows; if a
    clear drops cells into the falling piece, that piece is lifted until it fits. A settle in
    progress is not saved (saves wait for it), so a reload mid-settle leaves the piece where
    the last save put it. The how-to's review paragraph gains "Whatever it becomes drops
    into place."

25. **The how-to pauses a running game.** SPEC 7 says the clock never pauses except on the
    resume screen, but the how-to covers the well, so with a run in progress it now holds
    everything the resume screen holds: the clock (`tickClock` returns while `G.howtoOpen`),
    the falling piece and any settling pieces (the frame loop skips them), and a build in
    progress (its timer fires into nothing and `closeHowto` restarts it through
    `resumePendingBuild`). Lock-pipeline beats already under way run to completion; the
    piece they belong to has landed. On the title screen nothing is running, so nothing
    changes there.

26. **Sound starts with the run.** SPEC 9.1 unlocks audio on the start gesture, and the
    first-visit flow opened the how-to after that unlock, so music played under the
    instructions before any game began. `startFromTitle` now unlocks only when it goes
    straight to `newRun`; when the how-to comes first, the dismiss that starts the run
    unlocks. The title screen never creates an AudioContext, so the sound toggle there only
    sets the preference (label and localStorage) and is honoured when the run starts.

27. **Sound starts off.** SPEC 9.1 persists the sound setting and defaults it to on. The owner
    wants every page load to start silent so nobody is ambushed by music: `isEnabled`
    defaults to false, `setEnabled` no longer writes localStorage, and the old
    `sloptris.sound` key is removed on load. The header shows `[m] sound off` until the
    player turns it on, and the choice lasts for that page load only.

28. **Name in the footer.** SPEC 2's header held sound, name, sprint and clock; with the goal
    readout added (item 15) it overflowed on phones. The name moved out of the header into
    a footer row at the right end of the status line, above the title and how-to overlays
    so its touch long-press for the dev panel (SPEC 8.2) still works on every screen; the
    status text itself is hidden under those overlays. The touch sound label reads
    `[sound: on]` / `[sound: off]` so that, with sound off by default (item 27), the
    button reads as a state and not as an instruction. The long-press itself was fragile
    on touch: browsers claim a held finger for the context menu or selection and send
    `pointercancel`, which cancelled the 2 s timer. The label now has `touch-action: none`,
    captures the pointer on `pointerdown`, prevents the context menu, and no longer cancels
    on `pointerleave` (capture means leave does not fire until release anyway).

## Tuning

Defaults in `CONFIG` differ from the numbers in SPEC 6.1 after playtesting. The owner found
mutations too rare and refactors too frequent. A headless simulation (an all-generate
player with a greedy hole-avoiding placement, 200 seeded games) measured:

| rule set | rolled at streak 5+ | visible at streak 5+ | fizzle of rolled | refactors per 100 generated |
|---|---|---|---|---|
| spec: 10/20/35/50/60, refactor 25, no fallback | 60% | 23% | 61% | 14 |
| spec table + fallback (item 12) | 60% | 54% | 11% | 14 |
| 15/25/40/55/65, refactor 10, fallback | 64% | 57% | 11% | 6 |
| **shipped: 25/40/55/70/80, refactor 10, fallback** | not measured | not measured | | |

The first tuning pass lifted the low-streak odds so a player who builds every few tickets
still sees a change now and then. A second pass (2026-09-15) raised every entry by 10 to 15
points after the owner still found mutations too rare in play; the simulation was not
re-run for that row. `REFACTOR_CHANCE` 10 makes a refactor roughly one in twelve max-streak
pieces at the new odds. All of it stays editable in the dev panel.

## Testing

No automated framework, per the site's convention. Throwaway Node harnesses were used during
development to check the shape math, the lock pipeline, a full run to top-out and the
mutation odds in the Tuning table; they are not part of the site. Manual checks in Chrome covered the checklist in SPEC.md
section 14 over http; opening `index.html` directly from disk was not exercised in a browser.
