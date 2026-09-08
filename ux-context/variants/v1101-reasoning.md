# Reasoning

Written as I go, in the order I made the decisions.

## What the two files told me before I drew anything

DESIGN.md is prescriptive enough that most visual questions are already answered: the palette, the type scale, the 4px spacing scale, 48px inputs and buttons, 64px header, the wordmark construction. I am not going to invent a look. The design work here is in the ordering of the page and in the restraint, not in novel styling. Where DESIGN.md is silent (page width, section rhythm, illustration) I say so below.

UX.md is the opposite: it barely mentions appearance and instead dictates the shape of the flow. Five findings and four user-model points, each written as "Constraint:". I treated each one as a hard requirement and checked the finished page against all nine.

## Page order

The single biggest decision is what order the page runs in, and UX.md decides it for me.

F3 says "say what happens next, on the page, before asking for anything," so the page opens with an explanation and asks for nothing above it. F2 says "photos are the first substantive step. Written description is optional and comes last," so the first form field on the page is a photo upload and the free-text description is the last thing before the send button. F1 says "never require a policy number to begin," so contact details come second and the policy number appears only as an explicitly optional field far down that block.

That gives the running order: what happens next, then photos, then how we reach you, then when and where, then injuries and police, then your car, then the other driver, then your own words, then send. Everything the claim actually needs is on the page, which is what the PM asked for, but the sequence is UX.md's, not the order an insurance intake form would normally use.

## One page, numbered steps, no wizard

The PM asked for one page and the build rules forbid JavaScript, so a multi-screen wizard was never on the table. But a long form with no landmarks is bad for U1 ("Treat every person as a first-time user") and U4 ("skews older... reduced vision, tremor"). I split the form into eight numbered cards with a numbered badge on each heading. The number is a position marker in a document, not a wizard state, so it stays honest on a static page. This is my judgment; DESIGN.md does not describe a step pattern.

## Language

The glossary in UX.md is a find-and-replace list I applied literally: crash not incident, report not claim submission or FNOL, your car not insured vehicle, the other driver not third party, damage not property damage exposure, we got it not submission received, the person handling your claim not adjuster. The word "deductible" appears exactly once, in "the part of the repair bill that is yours to pay, called your deductible," because the glossary row for "what you pay" says if it must appear, define it in the same breath, every time.

U2 also records that "many believed a claim would raise their rate regardless of fault," so the intro says that reporting a crash does not decide fault and that fault comes later. I deliberately did not write anything about rates going up or not going up, because I do not know that and this page should not promise it. That restraint is my own judgment.

DESIGN.md's Writing section gives me US spelling, sentence case headings and buttons, no exclamation marks, 911, and the claims line 1-800-555-0142. I used windshield and license plate rather than the British forms it names.

## Header

Built exactly to the DESIGN.md Header spec: 64px tall, `--surface` background, 1px `--line` bottom border, wordmark left, the word "Keystone" in `--brand` at `--t-title` weight 650 followed by an 8px `--brand` square at radius 2px. I added the claims phone number at the right of the header. The spec fixes what sits on the left and does not forbid anything else, and F3 tells me a third of calls to the claims line are people asking what happens next, so the number belongs somewhere visible on a page whose whole job is answering that. It is set in `--t-small` `--ink-soft` so it never competes with the wordmark.

## Opening block and the 911 callout

Above any field: a short overline, the h1 "Report a crash," and three promises drawn straight from the constraints. No policy number needed (F1), no account needed (U3, "Nobody wants an account"), and you can stop and come back (F4).

The 911 line is the first thing under the title. DESIGN.md reserves `--danger` for errors and says never use it for emphasis, so a red safety banner is out, even though red is the reflex. `--accent` is documented as "attention," which is what this is, so the callout is a white card with a 4px `--accent` left bar and an `--accent` warning triangle. Rule: "Never communicate meaning with color alone," so the icon and bar are paired with the words "If anyone is hurt, call 911 first."

## What happens next

Four numbered items on a vertical `--line` rule: we got it, someone calls you within one business day, they look at the damage and you pick the shop, they tell you what you pay before work starts. This is the direct answer to F3, and the fourth item is where the deductible gets defined. `--line` is correct here because DESIGN.md restricts it to "dividers that carry no meaning," and this rule is pure decoration connecting the numbers.

## The saved strip

F4 wants continuous saving with "the saved state visible." With no JavaScript I cannot actually save, so I render the resting state of that feature as a static strip above the form: a check mark, "Saved just now," and a line saying the page can be closed and reopened at the same link. It sits at the top of the form rather than pinned to the bottom, because a fixed bar eats screen height and U4 rules out anything that crowds a zoomed page. The strip uses `--brand-tint`, which DESIGN.md assigns to "selected states, quiet highlights." I kept the check mark in `--ink` rather than `--brand`, because brand green is reserved for the primary action and the logo, and there is one primary action on this page.

## Step 1, photos

F2 puts the camera first. The control is a real `<input type="file" multiple accept="image/*">` with `capture` left off so the phone offers both the camera and the photo library. Its native "no file chosen" text stays visible; I styled only the box and the `::file-selector-button` so it reads as the secondary button DESIGN.md describes. Hiding the input behind a fake button would have cost the native focus behavior for no gain.

Above it, four small inline SVG tiles showing what to shoot: the whole car from a few steps back, each damaged area up close, the other car and its plate, and the street with its signs and signals. These are line drawings in `--ink-soft` on `--canvas`, no photographs, which suits the no-external-requests rule and also avoids showing a wrecked car to someone who is standing next to one. Illustration is not covered by DESIGN.md; the restraint level is my own call.

Under the control: "If you could not take photos, keep going." F5 says people stall when they think an omission will cost them the claim.

## Steps 2 to 6, and how "I don't know" is handled

F5 requires an out on any factual question. Every radio group on the page carries a third option, "I am not sure," in the same size and weight as yes and no, so it does not read as a lesser answer. Time of day gets a checkbox saying the time is a guess, and speed gets one saying you do not know, because F5 names time, speed and damage estimates specifically as the questions people stall on.

Damage is asked as four plain descriptions (scratches and scuffs, dents or a broken light, heavy damage, not sure) rather than a dollar estimate. U2 and F5 together make a dollar box the wrong control: people do not know the number and are frightened of guessing it wrong.

The other driver block opens with two checkboxes, "no other car was involved" and "the other driver left before I got their details," so the whole block can be answered honestly with nothing filled in. Its fields are all marked optional.

The policy number appears once, in step 2, marked optional, with a note that it is not needed. That is F1's constraint kept intact while still letting the rare prepared person type it in.

State is a two-letter text input with `maxlength="2"` in both places it appears, per the publishing rule against writing out a state list. It also happens to be the better control for U4: no long dropdown to scroll one-handed.

## Step 7 and the send block

The free-text box is last and marked optional, per F2. The consent checkbox is worded as "as best I know" and sits next to a reminder that details can be corrected later, which is F5 again. One primary action, "Send my report," in `--brand` at 48px, and under it the phone number for anyone who would rather talk to a person.

Only two fields are marked required, name and phone, because those are the only two things we cannot open a claim without. Required and optional are stated in words next to the label rather than with an asterisk or a color, following "Never communicate meaning with color alone."

## Decisions I only hit once I was writing the markup

**Radios and checkboxes are custom, not native.** DESIGN.md's Focus section ends with "Native radios and checkboxes ignore it," which is a warning that the required outline plus halo will not render on default controls. So they are `appearance:none` boxes at 24px with a `--line-strong` border, which also lets me give them the real focus treatment. Checked state is a `--brand-tint` row with an `--ink` dot or check mark, matching the "selected states" note on `--brand-tint`. The state is a shape as well as a color, per "Never communicate meaning with color alone." Each option is a full-width label at 48px minimum, so the whole row is the target, not the 24px box, which matters for the tremor and one-handed cases in U4.

**No `<select>` anywhere.** A dropdown with a first option showing is a preselected choice, which the build rules forbid, and a long native picker is exactly the kind of control U4 warns against. Every choice on the page is a radio group instead. This also happens to be why the two-letter state input is the right call rather than a workaround.

**Hints sit above the field, not inside it.** DESIGN.md says the label goes above the field and never inside it as a placeholder. I took that further and used no placeholder text at all, since placeholder-as-hint disappears the moment someone types and is low contrast by default. Hints are `--t-small` `--ink-soft` between the label and the input, wired up with `aria-describedby`.

**No error styling is rendered.** DESIGN.md defines an error state, but the brief asks for an empty static mockup, and painting a fake `--danger` message under a field nobody has touched would misrepresent the page. I left the error pattern out rather than fake it.

**Required and optional are words.** Only two fields are marked required. Everything else that could cause hesitation is marked "Optional" in the label, in `--ink-soft`, because F5 says people stall when they think a blank will cost them the claim. No asterisks, since an asterisk is a convention U1 tells me not to assume.

**Autocomplete is on the contact fields only.** Name, phone and email get `autocomplete`, but the crash location fields deliberately do not, because the browser would offer the person's home address for a place they were not standing. That is my own judgment, not from the materials.

**One primary action.** The only filled brand-green control on the page is "Send my report." The file picker button is the secondary treatment from DESIGN.md, and the two phone numbers are text links. That is the "One primary action per screen" rule taken literally.

**Small deviations from the spacing scale.** All layout spacing uses the 4px scale. Three places do not: the optical nudge on the timeline dots, and the position of the check mark inside the checkbox. Those are drawing coordinates inside a 24px control rather than layout spacing, so I did not force them onto the scale.

**Type is left at the specified sizes.** 28px is small for a hero, and my instinct was to push the h1 larger, but the scale in DESIGN.md tops out at `--t-display` and the page is a form, not a landing page. Body stays at 16px and labels at 14px, which are the stated floors, and the whole page is a single column with a 760px maximum so lines stay readable when zoomed.

**"Inter" is declared and will not load.** DESIGN.md names Inter first in the font stack. No web fonts are allowed here, so the stack falls through to `system-ui`. I left Inter in the declaration because it is the house font and the file should match the token when it ships somewhere that has it locally.
