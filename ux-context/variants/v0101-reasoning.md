# Reasoning

## Before writing anything

I read DESIGN.md and UX.md. DESIGN.md is the visual identity and says it "says how things should look, not how they should work." UX.md is the user model and the glossary. So DESIGN.md decides color, type, spacing, and component shape, and UX.md decides wording, question order, and how much explaining the page does. Where the two pull against each other I say so below.

## What the page is called and how it talks

The page is titled "Report a crash." That comes straight from the UX.md glossary: the "Say" column has "report" against "First Notice of Loss, FNOL, claim submission" ("People say they are 'reporting' a crash"), and "crash" against "loss event, incident, occurrence." Following the same table, the page says "your car" and never "insured vehicle," "the other driver" and never "third party," "damage" and never "property damage exposure," and "the person handling your claim" and never "adjuster," which UX.md notes "tested as adversarial."

Headings, labels, and buttons are sentence case with no exclamation marks, per DESIGN.md Writing. US spelling and US conventions throughout, so "license plate," "windshield," "parking lot," "color." The two phone numbers in the material are the only ones on the page: 911 for emergencies and 1-800-555-0142 for the claims line.

## The shape of the page

One page, top to bottom, one column, no account, no save, no login. UX.md U3 says "Nobody wants an account, a dashboard, or a saved preference. This is one errand on one bad day," with the constraint "no registration before the report is filed." So there is no sign-in, no "save and continue later," and no promise of a returning-user experience. Because there is also no JavaScript, I cannot honestly offer autosave, so the intro says plainly that nothing is kept until they send it and gives the claims line as the way to stop and finish with a person.

UX.md U1 says they have done this "roughly once in a decade" and the constraint is "guidance over efficiency. No shortcuts, no power-user affordances." That produces three things: a short "what you will need" list before the first question so people can go find their card and the other driver's details before they start, a plain hint under most labels, and a "what happens next" block before the send button so the ending is not a mystery. It also rules out the compressed, dense layout I would otherwise reach for on a form this long. Long and calm beats short and clever here.

UX.md U2 says "no term appears without a plain explanation next to it, the first time and every time." The two industry words I cannot avoid are "policy number" and "deductible." Policy number gets a hint saying where to find it and permission to leave it blank. Deductible appears only inside the glossary's preferred phrase, "what you pay," and is defined in the same sentence, which is what the glossary row asks for.

## Type and target sizes

DESIGN.md gives `--t-body: 16px`, `--t-label: 14px`, `--t-small: 13px`, and the floor "Body text never goes below 16px. Labels never go below 14px." UX.md U4 says the median claimant is 52 and "A meaningful share have reduced vision, tremor, or are operating one-handed with an injury," with the constraint "large text and large targets."

I read the DESIGN.md numbers as floors, not targets, and I take U4 to push everything up to the top of that range. So labels are 16px rather than 14px, and every hint is 16px body text rather than 13px small text, because under U2 the hints are the explanation and the explanation has to be as readable as the question. I use 14px only for the small "Required" tags beside a label and for the footer line. Nothing on the page is 13px. That is a deliberate departure from `--t-small`, and it is the only place I go outside the type scale.

Also from U4: no hover-dependent behavior, so every explanation is visible on the page at all times and nothing lives in a tooltip. No timed anything. No drag. Tap targets at 44px minimum is already a DESIGN.md rule; I use 48px rows for every choice, matching the 48px input and button height in DESIGN.md Components.

## Color plan

Straight from DESIGN.md Color. Brand green for the wordmark and the single primary button, and nothing else, per "Brand green is for the primary action and the logo. One primary action per screen." Brand tint for the section number badges and for the fill of a chosen radio or checkbox row, per "--brand-tint: selected states, quiet highlights."

The 911 callout at the top uses `--accent`, not `--danger`. DESIGN.md says "Danger red is for errors and nothing else. Never use it for emphasis," and lists accent as "attention, in-progress status." A safety notice is attention, not an error, so it gets the accent rule down its left edge and an accent phone icon. Its heading stays in `--ink` so the sentence itself does the work, which also satisfies "Never communicate meaning with color alone."

Because this is an empty static mockup with no error states to show, `--danger` appears nowhere on the page. I would rather have it unused than invent a fake error to display it.

Focus blue is only ever an outline, per "Focus blue appears only in focus rings. Never as a fill or a text color."

Links get `--brand` with an underline. DESIGN.md does not define a link color; it defines text buttons as "`--brand` text with no fill," so I extended that to links. That is my judgment, not the file.

## Which questions the page asks, and in what order

The order is the order a person can answer from memory on a bad afternoon, not the order a claim file wants: who you are, when and where, what happened, your car, whether anyone is hurt, the other driver, police and witnesses, photos, anything else. Injuries come before the other driver's insurance details because that is the order of what matters, and because the other driver's block is the one most people will have to leave partly blank.

That block gets an explicit permission line at the top of the section, since UX.md U1 means nobody will guess that a half-filled form is acceptable. Same for the police report number: the hint says the officer usually hands you a card with it and that leaving it blank is fine.

The "anyone hurt" section says that some injuries turn up a day or two later and to call if that happens. That is general knowledge on my part, not something in the materials, but it prevents a person answering "no one was hurt" and then believing they are stuck with that answer.

## Controls I chose and controls I refused

Every choice is a radio group or a checkbox group. No `<select>` anywhere. Three reasons: a select hides its options until you open it, which fails U1's "no assumption that a convention will be recognized"; its target is small and its list is fiddly with a tremor, which fails U4; and a select always has a first option selected, which the brief forbids. Radios rendered as full-width 48px rows are large, always visible, and start genuinely empty.

No placeholder text anywhere. DESIGN.md Input says "Label sits above the field, never inside it as a placeholder." So the label sits above the field, the hint sits between the label and the field, and the field itself is empty. The hint is tied to the input with `aria-describedby` so it is announced rather than skipped.

For the state field I use a short text input capped at two characters, with a hint saying two letters, per the publishing note against writing out a list of states. The same pattern is used for the license plate state.

Required fields are marked with the word "Required" next to the label, not an asterisk and not a color, per "Never communicate meaning with color alone." Only the handful we truly need to open a claim are marked; the intro says everything else can be left blank. I add `autocomplete` attributes to the name, phone, email, city, ZIP, and date of birth fields so a browser can fill them in, which is the only labor saving that costs the first-time user nothing.

## Decisions I made while building it

**Header.** Built to the DESIGN.md Header spec: "Keystone wordmark left, `--surface` background, 1px `--line` bottom border, 64px tall," and the wordmark as "the word 'Keystone' in `--brand` at `--t-title` weight 650, followed by a `--brand` square of 8px, radius 2px." I set 64px as a minimum height rather than a fixed one, because I put the claims line on the right and on a narrow phone it wraps to a second line. A fixed 64px would clip it. Everything else about the header is exactly as specified, and I did not invent a logo mark: the spec describes the wordmark completely, so anything else would be me adding brand where none was given.

I put the claims line in the header because of U1 and U3 together. Someone who cannot face a form on the worst day of their year should be able to see the phone number without scrolling, and that number is in DESIGN.md Writing.

**The 8px brand square as a list marker.** The wordmark's square is the only shape the brand actually owns, so I reused it at the same 8px and 2px radius as the bullet for both lists on the page. It is the one decorative move I make. It costs nothing, needs no image, and ties the two lists to the mark at the top. My judgment, extended from the DESIGN.md wordmark description.

**The only image on the page** is a phone icon in the 911 notice, drawn as inline SVG with `stroke="currentColor"` so it takes the accent color from its parent. Everything else is CSS. DESIGN.md's rule "Never communicate meaning with color alone. Pair it with a word or an icon" is what the icon is for.

**Focus.** Implemented exactly as DESIGN.md Focus describes: `outline: 2px solid var(--focus)` with `outline-offset: 2px` plus `--ring` as a soft halo behind it, on links, buttons, text fields, textareas, and the file input. The file explains why both are needed: the ring alone "computes to roughly 1.6:1 against white, and a focus indicator needs 3:1." I never change a border color to show focus, per the same passage.

**Radios and checkboxes.** DESIGN.md warns that "Native radios and checkboxes ignore" the focus treatment. So I do not rely on native ones. The real input is still there and still focusable, sitting at opacity 0 over its own spot, and a sibling `<span class="mark">` draws the control: 24px, `--surface` fill, 1px `--line-strong` border, per the rule that "The boundary of every interactive control uses `--line-strong`." The radio's chosen state is a brand dot, and the checkbox's is a brand fill with a white check drawn from two CSS borders. Focus is forwarded to that span with `input:focus-visible + .mark`, so the outline and halo appear on the shape you can actually see. The whole row is the label, so the target is the full width of the card at 48px tall, well past the 44px minimum and forgiving of a tremor or a one-handed tap.

A chosen row also fills with `--brand-tint`, which DESIGN.md assigns to "selected states." I do that with `:has()`. If a browser does not support it the row simply does not tint and the dot or the check still shows the answer, so no meaning is lost.

**No gradients anywhere**, per the DESIGN.md rule, which is why the radio dot is a child element rather than the radial gradient that would have been the quicker way to draw it. The only shadows on the page are `--shadow-card` on cards and the focus halo, which the file defines.

**Layout.** One column at 760px maximum, cards for each section, `--s5` between them. Body copy and hints are capped near 60 characters a line, which is my own call for readability on a long form. Two-up and three-up field rows collapse to one column under 640px. Card padding drops from `--s5` to `--s4` on small screens, which is a step on the DESIGN.md scale rather than an arbitrary value, per "Spacing uses the scale. No arbitrary pixel values."

**Sections are numbered 1 to 9** with a `--brand-tint` badge. On a page this long a first-timer needs to know where they are and roughly how much is left, and numbers do that without any script. The badges are marked `aria-hidden` because the numbering is orientation, not content.

**File input for photos.** A plain multiple file input, native, no script. The hint says which photos help most and says clearly that missing photos will not hold up the claim, since U1 means a person will otherwise assume they have failed a step.

**What happens after you send this** sits directly above the button. It says they get a text and an email that "says we got it," which is the glossary's phrasing against "submission received, acknowledgement." It says one person takes over, described as "the person handling your claim" rather than adjuster. It says what they pay toward the repair will be explained before work starts, and names deductible in that same sentence, which is what the glossary row demands.

The last line of that list is aimed at the belief UX.md records in U2, that "a claim would raise their rate regardless of fault." I did not answer it, because I do not know their policy and the materials do not tell me. Asserting that reporting is free of consequence would be a promise the page cannot keep. Instead the page acknowledges the question by name and points at the person who can actually answer it. That is my judgment about what is honest here.

**One button.** "Send my report," brand fill, white text, 48px, `--r-md`, per DESIGN.md Components and "One primary action per screen." There is no secondary button, no draft save, no print. Printing would need script, and I would rather ship nothing than a dead control. The line under the button offers the phone as the other way through.

**An attestation checkbox** sits above the button, worded as "What I have written here is true as best I know." An insurance report needs one. "As best I know" matters: U2 says people misunderstand these terms, and a person should not feel they are signing something binding about facts they are unsure of.

**Danger red, `--t-small` at 13px, and `<select>` appear nowhere on the page**, each for the reasons above.

**Checked before finishing:** no em dashes or en dashes anywhere; no non-ASCII characters at all; no `checked`, `selected`, or `placeholder` attributes; no `value` attributes except the option identifiers on radios and checkboxes, which carry no user data; no script, no link, no img, no `url()`, no `@import`, no external anything; no state list; every `for`, `aria-describedby`, and `aria-labelledby` resolves to a real id, with no duplicate ids; the viewport meta is present.
