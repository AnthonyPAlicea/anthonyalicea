# Reasoning: first notice of loss, auto accident

Written as I work. Entries are in the order I made the decisions.

## The tension I have to resolve before anything else

The PM says "keep it to one page." UX.md W2 says "one decision per screen. Every screen must
survive being abandoned mid-answer and returned to cold." Those pull against each other, and I
cannot satisfy both literally without JavaScript, which the build constraints forbid.

My read is that W2's real requirement is not literally one control per viewport. It is that a
person glancing back at a cold screen after a forty second interruption can tell instantly where
they are and what is being asked. So I am keeping the single page the PM asked for, and paying
W2 back structurally: numbered sections, one visible card per section with real vertical
separation between cards, generous spacing so that on a phone roughly one question group fills
the screen at a time, and every label written so it stands alone without the heading above it.
That is my judgment call, and it is the biggest one on this page. I am naming it here so it is
reviewable.

## Frame and identity

Header follows DESIGN.md "Header" verbatim: wordmark left, `--surface` background, 1px `--line`
bottom border, 64px tall. The wordmark is the word "Keystone" in `--brand` at `--t-title` weight
650 followed by a `--brand` square of 8px at radius 2px. I am building the square as a CSS
element rather than an image so there is no external request and nothing to fail on a bad
connection (W4).

Page background is `--canvas`, cards are `--surface`. Straight from the Color block.

Font stack is the `--font` value from DESIGN.md, "Inter" first. Naming Inter in a font stack is
not a network request, it only picks the font up if the device already has it, so this stays
inside the no-external-requests rule while still honoring the design system.

## Layout

Single column, phone first, per W1: "design the phone first. Single column. High contrast.
Nothing that needs two hands or a steady grip." I am capping the content column at a readable
width and centering it so the desktop case is not a stretched phone, but the column never splits
into two. No field sits in a half-width pair, even where one would fit, because a two-up row is
the first thing that breaks a one-handed thumb reach.

Everything uses the `--s1` to `--s8` scale. DESIGN.md: "Spacing uses the scale. No arbitrary
pixel values."

## What goes at the very top

Two things sit above the form.

First, a safety notice pointing at 911. Someone opening this within an hour of a crash (W1) may
be triaging worse things than a claim form, and the form should say so before it asks for
anything. DESIGN.md gives me `--danger` for "errors and destructive actions" and says "Never use
it for emphasis," so red is off the table here. `--accent` is defined as "attention," which is
exactly what this is. I pair the color with both an icon and the literal word so it is not
meaning by color alone, per the Rules block.

Second, the visible timestamp. W5: "timestamp the report visibly. The submission time matters
for coverage." DESIGN.md's Writing block sets the format: "Dates read as July 25, 2026." This is
display text, not a form value, so it does not conflict with the empty-controls constraint.

## Save state

W4 says "save locally and sync. Tell people plainly when something has not been sent yet." The
page has no JavaScript, so I cannot actually implement this, but a mockup that omits it would
send the wrong spec downstream. I am rendering the saved-not-yet-sent status as a static element
in `--accent`, which DESIGN.md defines as "attention, in-progress status." In-progress is
literally what an unsent draft is. Again paired with words, not color alone.

## Section plan

Ordered so the questions a shaken person can answer from memory come first, and the ones needing
paperwork come last. W3: "Insurance card in the glovebox of a car that may be undrivable...
never block progress on a document."

1. About you
2. When and where it happened
3. Your vehicle
4. What happened
5. Anyone hurt
6. The other driver and vehicle
7. Police and witnesses
8. Photos
9. Confirm and send

Policy number, license plate, the other driver's insurer and policy, the police report number,
the VIN: all of these live in a document and all of them are marked optional. Nothing in the
required set needs a person to open a glovebox.

## Decisions made while building

### Red is nowhere on this page

The first instinct for a crash form is red urgency. DESIGN.md forbids it: "Danger red is for
errors and destructive actions... Never use it for emphasis." The 911 notice is therefore built on
`--accent`, which the token file defines as "attention, in-progress status." I kept `--danger` in
the token block because it belongs to the system, but nothing on this page uses it. A static
mockup with empty fields has no honest error to show, and inventing one would mean pre-filling a
field with bad sample data, which the build constraints rule out.

### Accent as a rule, not as text

I checked `--accent` (#C2610F) against white and it lands near 4.2:1. That clears the 3:1 bar for
non-text UI but misses the 4.5:1 bar for small text. So accent appears only as the 4px left rule on
the notice, the icon, the border of the draft-state pill, and the 8px square inside it. All the
words next to it are `--ink`. This also keeps me inside the Rules line "Never communicate meaning
with color alone," because the pill literally reads "Saved on this device, not sent yet."

### The notice icon is a phone, not a warning triangle

The standard warning triangle carries an exclamation mark, and DESIGN.md's Writing block says "No
exclamation marks." Rather than argue about whether a glyph counts as punctuation, I drew a phone
handset. It is also the better icon, because the instruction is to make a call.

### Custom radios and checkboxes, because the design system told me to

DESIGN.md's Focus block ends with "Native radios and checkboxes ignore it," meaning the specified
`outline` plus `--ring` treatment will not render on native controls. That is an instruction to
build them, so I set `appearance: none` and drew both: 24px, `--line-strong` boundary per the Rules
block, brand fill when checked. The radio dot is an inset box-shadow, and because the focus ring is
also a box-shadow I wrote an explicit `:checked:focus-visible` rule that carries both. The checkbox
tick is a rotated border on `::after`, and the checked state also changes the fill, so even if the
tick fails to paint the state is still readable.

I deliberately avoided a radial-gradient dot, which is the usual shortcut, because DESIGN.md says
"Do not introduce gradients."

### The whole row is the tap target

Each choice is a full-width `label` with a 48px minimum height and a `--line-strong` border. W1 says
"Often one-handed... Nothing that needs two hands or a steady grip," and the Rules block sets a 44px
minimum in both directions. A bare 24px circle would technically satisfy the control but not the
grip, so I made the row the control. Selected rows pick up `--brand-tint`, which the token file
assigns to "selected states, quiet highlights," on top of the dot or tick so it is never color alone.

### No placeholders anywhere

DESIGN.md, Input: "Label sits above the field, never inside it as a placeholder." So there are zero
`placeholder` attributes. Anything I would have put in a placeholder became a hint line between the
label and the field, where it survives the field being filled in. That also matters for W2, since a
placeholder is exactly the kind of instruction that vanishes while you are looking away.

### Hint text is 16px, not 13px

I was tempted to set hints at `--t-small`. DESIGN.md says "Body text never goes below 16px," and
hints are body text that people actually have to read. Under W1's "outdoors in daylight glare" I did
not want the load-bearing instructions to be the smallest thing on the page. `--t-small` is reserved
for the overline, the "Optional" tag, the timestamp, and the footer.

### Marking optional rather than required

Roughly half the fields are optional, so asterisking the required ones would leave the page speckled.
Instead the lede states the rule once ("Every question is required unless it says optional") and each
optional field carries the word "Optional." The word does the work, not a color or a symbol, per the
Rules block.

Which fields are optional is not a style choice, it comes straight from W3: policy number, VIN,
license plate, the other driver's insurer and policy number, the police report number, ZIP, and every
photo. Each of those lives in a document, on a card, or on a piece of paper that may be inside an
undrivable car. Several of them say so out loud. The policy number hint tells you to leave it blank
and that we can find you by name and phone. The police report hint says these take days to issue and
to add it later.

### Section 6 is optional end to end

The other driver may have left, or may not be someone you want to walk back over to. Rather than mark
seven fields one by one and leave a person wondering whether they have failed, I put a plain sentence
under the heading giving them permission to skip the entire card. That is my own judgment about the
roadside situation W1 and W3 describe, not a line I can point to in either file.

### Photos are a real file input and explicitly deferrable

W4: "Roadside, in a parking garage, under an overpass. Uploads fail." So the photos hint says to send
the report now and add photos later if the signal is weak, and ends "Nothing here holds up your claim."
The input is a genuine file control rather than a styled fake, because the mockup should show what
ships.

### W5 shows up in four places

W5 asks for a visible timestamp, and for the page to say that corrections stay possible after
submission. So: the timestamp line sits above the form, formatted "August 21, 2026 at 9:14 AM" per the
Writing block's "Dates read as July 25, 2026." The description hint says you can correct it or add to
it after you send. The attestation is worded "true and complete as far as I know right now" rather
than a flat truth oath, because W5 says "People change their account of events once they are calm, and
that is normal and expected" and I did not want the checkbox to make a person feel locked in. And the
paragraph under the buttons repeats the correction promise with the claims line, 1-800-555-0142, from
the Writing block.

### One primary action

DESIGN.md: "One primary action per screen." Only "Send report" is brand filled. "Save and finish later"
is the secondary treatment, `--surface` fill with a `--line-strong` border. It earns its place from W2
and W4: a form that expects to be abandoned should offer leaving as a normal move, not just as
something that happens to you. Both are full width at every breakpoint, which is a phone-first call
from W1 that I let carry through to desktop rather than switching to an auto-width button.

### The form carries novalidate

The page has no JavaScript and no server, so native constraint validation would pop browser tooltips
that are not part of the design and not part of the spec. I kept `required` on the genuinely required
fields because it is correct semantics and assistive tech announces it, and added `novalidate` so the
mockup does not fight anyone poking at it. My call.

### State field

Per the publishing rule, a short text input with `maxlength="2"`, `autocapitalize="characters"`, and a
hint reading "Two-letter code." No dropdown, no list. I gave the same short treatment to ZIP, year, and
license plate so the phone keyboard and the field width match what is being asked for.

### Header is not sticky

I considered pinning the 64px header so the wordmark stays visible for orientation on a cold return
(W2). It would cost a fixed slice of a phone screen on a page this long. I decided the numbered section
headings do the orientation job better and cheaper, and left the header at the top of the document.
DESIGN.md specifies the header's appearance and says nothing about its behavior, so this one is mine.

### Vocabulary

Windshield, license plate, parking lot, color, 911, 1-800-555-0142. All of these are set by the Writing
block in DESIGN.md, and I used the VIN hint as the natural place for "windshield" rather than forcing
the word in somewhere it did not belong.

### Things I passed on

An autosave progress bar, a step-by-step wizard, a map picker for the location, and a VIN scanner all
came to mind. Each needs JavaScript, and the wizard would break the one-page instruction. The map and
the scanner would also fail exactly when W4 says the connection fails, which is when this page is most
likely to be open.
