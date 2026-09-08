# Reasoning log: report a car accident

Written in the order the decisions were made.

## Shape of the page

One page, one column, sections stacked in the order a person would tell the story out loud: who you are, what happened, your car, the other car, injuries, photos, anything else. UX.md U1 says "They have done this roughly once in a decade... Treat every person as a first-time user" and asks for "guidance over efficiency. No shortcuts, no power-user affordances." A single column with visible section numbers is the slowest and clearest arrangement, so that is what I used. No accordions, no tabs, no steps: those hide content and all of them would need JavaScript anyway.

Max width around 760px so line length stays readable, centered on `--canvas`, each section in a `--surface` card. Card spec comes straight from DESIGN.md Components: "`--surface` fill, radius `--r-md`, `--shadow-card`, `--s5` padding."

## Tokens

I copied the color, type, space, radius and shadow values verbatim from the DESIGN.md blocks into a `:root` block rather than retyping literals through the stylesheet, so the page can be diffed against the design file. `--danger` is declared but unused: DESIGN.md says "Danger red is for errors and nothing else" and this is an empty static mockup with no error states to show, so nothing on the page may wear it.

## Type sizes, and one judgment call

DESIGN.md gives `--t-label: 14px / 1.4 / 550` but the Button entry says "label `--t-label` at 16px", so the system already accepts the label style rendered at 16px. I render field labels at 16px weight 550 and hint text at `--t-body` 16px regular. The alternative was a 14px label over a 13px hint, which would have put the plain-language explanations that UX.md U2 requires at the smallest size on the page, straight into the eyes of a median claimant of 52 with "reduced vision, tremor" (U4). "Labels never go below 14px" reads as a floor, not a ceiling, so 16px is inside the rule. `--t-small` at 13px is left for meta only: the "Required" tags, the overline, and the footer fine print.

## Header

Built exactly to the DESIGN.md Header spec: 64px tall, `--surface`, 1px `--line` bottom border, wordmark left, the word "Keystone" in `--brand` at `--t-title` weight 650, then an 8px `--brand` square with 2px radius. I made the wordmark a plain element and not a link, because a mockup link that goes nowhere is a trap for a first-time user, and DESIGN.md requires every interactive element to have a focus state that a dead link does not deserve. I considered putting the claims phone number in the header for persistence, but the spec describes the header as wordmark only, so the number goes in the help card at the top and again in the footer instead.

## The 911 notice, and why it is not red

The first thing above the form is a notice to call 911 if anyone is hurt. DESIGN.md is explicit: "Danger red is for errors and nothing else. Never use it for emphasis." So the notice uses `--accent`, which the file assigns to "attention", as a 4px left rule plus a small icon. It carries the caps overline "Important", which is the one place DESIGN.md permits caps: "No title case, no all caps except in a small overline." The word does the work, not the color, per the rule "Never communicate meaning with color alone." The background stays `--surface` because tinting it would mean inventing an accent tint, and "Do not introduce... additional accent colors."

## Before you start

A short card listing what to have on hand, plus two promises: you do not need an account, and if you do not know an answer you may leave it blank and a person will call. UX.md U3 says "Nobody wants an account, a dashboard, or a saved preference," so I say so out loud rather than just omitting the signup. The blank-is-fine promise is my own call: the fastest way to stall a first-time user is a question they cannot answer, and telling them the exit up front is cheaper than validation copy they will never see in a static mockup.

## Vocabulary

UX.md U2: "no term appears without a plain explanation next to it, the first time and every time." So: "claim" is explained in the intro as asking Keystone to pay for covered repairs and costs; "claims specialist" is explained inline as the person who handles the repair from start to finish; "policy number" gets a hint saying where it is printed; "policyholder" is asked as "is the policy in your name" rather than as a noun. I dropped the word deductible entirely, since UX.md reports "most people could not say what a deductible is" and nothing on an intake form needs it. US spelling and US terms throughout per DESIGN.md Writing: windshield, license plate, parking lot, 911, 1-800-555-0142.

## Marking required fields

Every required field carries the actual word "Required" next to the label, and a line at the top of the form says fields without it are optional. An asterisk is a convention, and UX.md U1 forbids "assumption that a convention will be recognized." The tag is `--ink-soft` text, so it is not carried by color.

## Section 1, about you

Name, policy number, phone, email, best time to call, and whether the policy is in your own name. Phone is required and its hint says we will call within one business day, which is the reason the field exists; giving the reason is guidance, my own habit, not something the materials specify. The follow-up field for "reporting for someone else" is always visible with a conditional label, because revealing it would take JavaScript and, per U1, a field that appears out of nowhere is worse than a field that is simply there.

## Section 2, the accident

Date and time as native `date` and `time` inputs so nobody has to guess a format, with hints saying an estimate is fine. Location is street, city, state, ZIP. State is a two-letter text input, not a dropdown, per the publishing rule against writing out a list of states. Conditions are checkboxes labeled "check any that apply" rather than a single choice, since weather is rarely one thing. The narrative box asks what happened in the person's own words and lists the details that help, so the box is not a blank stare. Police questions are yes / no / not sure, with "not sure" a real option everywhere on the page: a first-time user on a bad day should never have to lie to move on.

## Choice controls: native radios and checkboxes in bordered rows

I used native radios and checkboxes, never a dropdown. A dropdown hides its options until you act, needs a fine motor gesture, and its first option reads as preselected, which the brief forbids. UX.md U4 asks for "large text and large targets... No drag, no hover-dependent behavior," so each option is a full-width bordered row, minimum 48px tall, with the whole row as the clickable label and a 24px control inside it. The row border is `--line-strong` because DESIGN.md says "The boundary of every interactive control uses `--line-strong`."

The selected state uses `--brand-tint` fill plus a `--brand` border, which matches the DESIGN.md note that `--brand-tint` is for "selected states, quiet highlights." Selection is never signaled by the tint alone: the native dot or check is visible and the label text goes to weight 550, which satisfies "Never communicate meaning with color alone." That is pure CSS (`:checked`, `:has`), so it costs no JavaScript and no preselected markup.

## Focus

`outline: 2px solid var(--focus)` with `outline-offset: 2px` plus `--ring` as the halo, exactly as DESIGN.md Focus specifies, and applied nowhere else: no blue fills, no blue text. Because DESIGN.md warns that native radios and checkboxes are the weak case, the option row also picks up the `--brand-tint` fill while it holds focus, so the target is legible from a distance and not only at the 24px control.

## Section 3, your vehicle, and the car diagram

Year, make, model, plate, who was driving, where the damage is, whether it can be driven, and where the car is sitting now. The damage question uses a checkbox per area rather than a clickable diagram, because a clickable diagram needs JavaScript and, per UX.md U4, precise pointing is exactly what this audience cannot rely on. The inline SVG next to it is a top-down car pointing up, drawn in `--ink-soft` strokes on `--surface`. It is decorative and `aria-hidden`, with a plain caption saying what it shows. I labeled the sides "Driver side (left)" and "Passenger side (right)" because DESIGN.md Writing sets US conventions, and left and right on a car are the one thing people reliably reverse.

"Can the car be driven safely right now" and "where is the car now" are here because they decide whether a tow and a rental are needed on day one. That is my own knowledge of how an intake gets used, not something in the materials.

## Section 4, the other driver

One other vehicle gets full fields: driver name, phone, insurance company, their policy number, the car, the plate. Above them sits a single checkbox for "no other vehicle was involved," so a person who hit a deer or a pole is not staring at ten fields that do not apply. If more than one other car was involved, the copy tells the reader to describe the others in the last box rather than pretending the page can grow, since repeating the block would need JavaScript.

Witness name and phone follow, and a count of how many people were in your car. Both are cheap to ask now and expensive to reconstruct in a week.

## Section 5, injuries

Asked as "was anyone hurt, even a little," with "I am not sure yet" as a real answer, then an optional box for who and how, then whether anyone saw a doctor. The section closes with a line saying that some pain shows up a day or two later and to call 1-800-555-0142 if it does. UX.md U2 notes that "Many believed a claim would raise their rate regardless of fault," so I kept every injury question factual and made no promises about rates I have no standing to make.

## Section 6, photos

A single native file input that takes several files at once, plus a line saying which shots are worth taking and that photos are not required. A styled drop zone would need JavaScript and a drag gesture, and UX.md U4 rules out drag outright. The input keeps a 48px minimum height so it matches the other controls and clears the 44px tap target minimum in DESIGN.md Rules.

## Section 7, and then section 8, sending

The last open box catches everything the fixed fields cannot hold: a second other car, a broken fence, a dashcam. Then the send card states what happens next in three numbered steps before the button, because a first-time user is about to hand over the story of a bad day and deserves to know what it triggers. One attestation checkbox, marked Required, and one button. DESIGN.md says "One primary action per screen," so there is no secondary button next to it; a "print" or "save draft" affordance would have needed JavaScript anyway and UX.md U3 says nobody is coming back for a draft.

## Required attributes and error states

Fields whose label says "Required" also carry the HTML `required` attribute, so the browser's own validation matches what the label promises. I did not mock up an error state: DESIGN.md defines errors as a `--danger` border and a `--danger` message below the field, but the brief asks for empty controls, and a hand-placed error message would be sample data in disguise. The tokens are in the stylesheet ready for the build.

## Punctuation and copy mechanics

No dashes of any kind in the page text, per the publishing note, so sentences that wanted an aside were rewritten with a comma or split in two. No exclamation marks, per DESIGN.md Writing. Sentence case for every heading, label, and the button. The one set of caps is the "Important" overline on the 911 notice.

## Responsive behavior

One column at every width; the only changes below 640px are tighter card padding, the two-up option grids collapsing to one column, and the submit button going full width so it is easy to hit one-handed, which is the case UX.md U4 calls out ("operating one-handed with an injury"). Field rows are flex with a `180px` basis, so pairs like city and state break onto their own lines when there is no room rather than shrinking below a usable size.

## What I left out

No progress bar, no save and resume, no address autocomplete, no VIN lookup, no live estimate of payout. Each one is a second-visit or power-user feature, and UX.md U3 says "No features that pay off on a second visit." No dropdowns anywhere, including for state, which the publishing note settles for me and which also happens to be the right control for this audience.
