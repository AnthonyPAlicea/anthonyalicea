# Reasoning: report a car accident

Written as I go, in the order the decisions happened.

## Reading the brief against the materials

The PM wants one page that collects everything needed to open the claim. UX.md pushes the
other way: W2 says "one decision per screen. Every screen must survive being abandoned
mid-answer and returned to cold." I cannot have both literally, so I am taking the one page
as fixed and buying back what W2 is actually protecting: orientation after an interruption.
That means a single column of numbered parts, each part visually separated as its own card,
each with a heading that says plainly what it is about, and no state that a person has to
hold in their head between parts. Someone who looks up for forty seconds and looks back
should be able to see which part they are in from the heading directly above their thumb.

I am not using an accordion or a stepper for the same reason, and also because the page must
have no JavaScript. Collapsed content that a person cannot see is exactly the thing W2 warns
about.

## Scope: what an accident report has to collect

The materials do not contain a field list, so this part is my own general knowledge of a
first notice of loss: who is reporting and how to reach them, which policy, when and where it
happened, what happened in their words, whether anyone was hurt, the insured vehicle and its
condition, the other driver and their insurance, witnesses. I have ordered these so the
questions a shaken person can answer from memory come first and the ones that need a document
or the other driver's cooperation come last. That ordering is mine, but it follows from W3
("Documents are not at hand") and W2 (interruption is near certain): if they get pulled away
after part 4, we still have a usable report.

## Emergency first

Before anything else on the page: if anyone is hurt, call 911. DESIGN.md line 78 fixes the
emergency number as 911 and the claims line as 1-800-555-0142, so both are used verbatim.

I am deliberately not styling that notice in danger red. DESIGN.md line 24: "Danger red is
for errors and nothing else. Never use it for emphasis." The notice uses `--accent`, which
line 18 assigns to "attention", plus an inline SVG icon and the literal words, because line
88 says never to communicate meaning with color alone.

## Vocabulary

U2 is the hardest constraint here: "no term appears without a plain explanation next to it,
the first time and every time." My approach is to avoid the vocabulary rather than gloss it.
There is no "deductible", no "liability", no "adjuster", no "coverage type", no "at fault"
as a question, because none of them are needed to open the claim. The words I cannot avoid
are "claim", "policy number", "make", and "model", and each gets a plain sentence next to it
every time it appears.

U2 also records a live misconception: "Many believed a claim would raise their rate
regardless of fault." I want to defuse that, but I will not assert what happens to a rate,
because that is a business and legal statement and nothing in my materials authorizes it.
So the page says what is true about the form itself: filing the report does not decide fault,
that comes later. Anything beyond that points at the claims line.

## Required versus optional

W3 says "never block progress on a document. Anything from a document is optional or
deferred." So policy number, license plate, ZIP code, the police report number, and every
field about the other driver are optional and say so in words next to the label, not by
color or by an asterisk. Date of birth is required instead, because it comes from memory and
it is what lets us find the policy when the insurance card is in the glovebox of a car that
may be undrivable. That substitution is my own call.

Optional is marked with the word "Optional" beside the label. Required is the unmarked
default, which is the pattern with the least to explain to a first-time user (U1).

## Tokens and type

The `:root` block is DESIGN.md lines 9 to 21 and 43 to 51 copied verbatim, so the page and
the design file can be diffed. Font stack is line 30 as written, with "Inter" first; it will
resolve if a person has Inter installed locally and fall back to system-ui otherwise, which
is the only way to honor line 30 with no external requests allowed.

Two type decisions of my own, both driven by U4 ("reduced vision", median claimant 52):

Field labels are 16px at weight 550 rather than the 14px of `--t-label`. DESIGN.md line 38
says "Labels never go below 14px", which is a floor, not a ceiling, so 16px is inside the
system. On a phone in daylight glare (W1) the extra two pixels matter more than the size
contrast between a label and its own field does.

Help text under a label is also 16px, not `--t-small`. U2 requires an explanation next to
every term, and an explanation set at 13px is an explanation people skip. I kept `--t-small`
for one job only: the "Part 3 of 8" overline, which DESIGN.md line 80 permits in caps.

## Focus

DESIGN.md line 65 to 67 is explicit: 2px solid `--focus` outline, 2px offset, `--ring` behind
it, and the outline alone is what carries the 3:1 contrast. Text inputs and buttons take that
directly. Line 67 also warns that "Native radios and checkboxes ignore it."

My answer to that is to wrap every radio and checkbox in a full-width label row with a border,
give the row a minimum height of 48px, and put the focus treatment on the row with
`:focus-within`. That solves three things at once: the focus indicator becomes visible again,
the tap target goes from a 20px dot to a row that clears the 44px minimum in line 89, and it
is comfortable one-handed with a thumb (W1). The selected row also fills with `--brand-tint`,
which line 17 assigns to selected states, but the native dot or check is still the primary
signal so selection is never carried by color alone.

## Errors

I am not rendering an error state anywhere on this mockup, and I am not using CSS `:invalid`.
Every required field on this page starts empty, so `:invalid` matches on load and would paint
the whole page in `--danger` before the person has done anything, which is the exact misuse
DESIGN.md line 24 forbids. The error pattern in line 63 belongs to the shipped page, where
validation runs after a submit attempt. I did keep native `required` attributes on the fields
that genuinely are required, because that is honest markup and it carries into assistive
technology; the shipped page would intercept submission and draw the designed error instead
of the browser bubble.

## Header

Built exactly to DESIGN.md lines 71 and 72: surface background, 1px `--line` bottom border,
64px tall, the word "Keystone" in brand green at 20px weight 650, followed by an 8px brand
square with a 2px radius. I wanted to put the claims phone number in the top right, since a
person at the roadside may want to call rather than type, but the header spec describes one
element and I am not going to quietly extend it. The number appears instead in the safety
notice at the top of the page, in the send block, and in the footer, which is three chances
to see it without touching the component.

## No placeholders

DESIGN.md line 62: "Label sits above the field, never inside it as a placeholder." There are
zero placeholder attributes on the page. Everything that would have been a placeholder is
either the label or a help line above the field, which is also what U2 and U4 need, since
placeholder text disappears the moment a shaky thumb starts typing.

## Part order and a few specific fields

The parts run: about you, when and where, what happened, injuries, your vehicle, the other
driver, witnesses, photos. Injuries sit at four rather than last because it is the answer
that changes what we do next, and W2 says the person may be interrupted and not come back.

"Were you the one driving?" needs a follow up question for the driver's name, and with no
JavaScript I cannot reveal it conditionally. Rather than hide it, I left it visible with the
condition stated in the label and a help line that says to leave it blank if you were driving.
For a first-time user (U1) a visible question with a clear condition beats a field that
appears out of nowhere.

The other driver part opens by saying every field in it is optional and that skipping it is
fine, because W3 and W2 together mean the other driver may have left or may be unreachable,
and this is the most likely place for someone to feel stuck and abandon the report.

## Autofill, and where I turned it off

Name, date of birth, phone, and email carry `autocomplete` values, which saves typing for
someone with a tremor or one working hand (U4).

The accident location fields deliberately have none. Browser address autofill would offer the
person's home address, and W5 says this report is a legal record that is admissible. A
one-tap wrong location in a legal record is worse than a few seconds of typing, so those
fields autofill nothing.

## Layout

Single column the whole way down, per W1, with a 680px cap so the line length stays readable
on a laptop without the layout ever changing shape between phone and desktop. The state and
ZIP fields are capped at 120px and 180px wide so they read as short answers, but they keep
their own rows rather than sitting in a row with city. Per the publishing rule, state is a
two letter text input and no list of states appears anywhere on the page.

## Photos

This is the one place I dropped a control the PM might have expected. There is no file input.
W4 says "Roadside, in a parking garage, under an overpass. Uploads fail," and W3 says never
block progress on a document. An upload control at the top of a bad connection invites a
failed submit at the worst moment, and photos are not needed to open the claim. So part 8
explains that plainly and offers one checkbox: text me a link so I can add photos later. The
help line says the link needs no account and no password, because U3 says nobody here wants
an account.

## The send block

One primary action on the page, per DESIGN.md line 23: the brand filled Send report button.
Everything else is a link or a field. No sticky action bar, since a fixed bar eats screen on
a small phone and it would tempt someone to press it before reading the three things above it.

Those three things are all from W5. The report is timestamped when you press the button and
the copy says so, and says why it matters. Corrections stay possible after submission, and the
copy says that too, along with the reason: people remember more once they are calm, and W5
says that is normal and expected. Saying so out loud is what stops someone from freezing over
a detail they are unsure of.

The fourth line, about answers staying on the phone until the connection comes back, is W4's
"Tell people plainly when something has not been sent yet." It is copy describing behavior a
static file with no JavaScript cannot actually perform. I am flagging it rather than hiding
it: whoever builds this owes the page that behavior, and the words are here so it does not
get dropped.

## Two small notes on the markup

The radio and checkbox inputs carry `value` attributes. Those are option identifiers, not
sample data, and nothing on the page is checked or preselected. Every text field, date, time,
and textarea is empty, and there is no `placeholder`, `checked`, or `selected` anywhere.

Finally, the footer repeats the claims line and the 911 instruction. It is the same
information as the top of the page, and the repetition is on purpose: W2 says people look
away every twenty to forty seconds, and someone who has scrolled to the end and hit a problem
should not have to scroll back up to find a phone number.
