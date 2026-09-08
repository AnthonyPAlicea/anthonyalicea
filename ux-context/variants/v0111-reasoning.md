# Reasoning log: report a crash, single page

Written in the order I made the decisions.

## The first conflict I had to settle: one page vs. one decision per screen

The PM asked for one page. UX.md / World model, W2 says "one decision per screen. Every screen must survive being abandoned mid-answer and returned to cold." Those pull against each other, so I picked a reading that honors both: one page, one URL, no wizard, but the page is cut into numbered parts, each part is one card, and each part holds one topic that a person can answer without remembering anything from a part above it.

The practical test I applied to every part: if you look away for forty seconds (W2 says testing showed people looking away every twenty to forty seconds) and look back, can you tell where you are and what is being asked, without scrolling up? That is why every part gets its own card, its own heading, and a "Part n of 8" overline. The overline is the orientation device that a wizard would normally give you through a progress bar.

## Vocabulary: "crash", not "accident"

The PM's own words were "report a car accident". UX.md / Glossary says the word we use is "report" and the word we use is "crash", with "loss event, incident, occurrence" in the do-not-say column and the reason given as "'Loss' reads as financial. They are thinking about the car and the other driver." "Accident" is not on the forbidden list, but the glossary's closing line settles it: "When there is a choice between the industry word and the word a person on the roadside would use, use theirs." The page title is "Report a crash". I am overriding the PM's phrasing on the strength of the glossary, which is the research-backed document.

Everywhere else I took the left column literally: "your car" not insured vehicle, "the other driver" not third party, "damage" not property damage exposure, "the person handling your claim" not adjuster. I never use the word deductible. Near the submit button I use the glossary's plain replacement, "what you pay", in a sentence that says nobody is being asked to pay anything now.

## 911 goes first, and it is not red

The most important thing on a crash page is not the form. It is the sentence telling a hurt person to stop filling in a form. So the first block below the header is the 911 notice, and DESIGN.md / Writing fixes the number for me: "Emergency number is 911."

I wanted to make it red, and DESIGN.md / Color forbids it: "Danger red is for errors and nothing else. Never use it for emphasis." So the notice gets its prominence from position (first thing under the header), size (title type, not body), and a quiet `--brand-tint` panel, which the token table describes as "selected states, quiet highlights". I kept the icon `--ink` rather than `--brand`, because the same file says brand green is for the primary action and the logo, and I did not want a second green thing competing with the one green button on the page.

## Structure: eight parts

What an opened claim actually needs, split so that each card is one topic:

1. About you
2. When and where it happened
3. Your car
4. What happened
5. Was anyone hurt
6. The other driver
7. Police
8. Photos

Then an unnumbered closing block: how to reach you, the submit button, and what happens next. The order is roughly the order the information is available to someone standing at the roadside: themselves first, then the scene, then their own car (which they can see), then the story, then people, then the other driver's details (which they may not have), then police, then photos. This ordering is my own judgment, not from the materials, but it follows from W3, "Documents are not at hand": everything that depends on a document someone else is holding is pushed late, so a person who abandons the page two thirds of the way through has already given us enough to open the claim.

## Required and optional are labeled in words

DESIGN.md / Rules: "Never communicate meaning with color alone. Pair it with a word or an icon." So no red asterisks. Every single field carries a small "Required" or "Optional" tag in `--ink-soft` at `--t-small`. I tag all of them rather than only the optional ones, because a mixed scheme leaves untagged fields ambiguous, and U1 says to treat everyone as a first-time user with no convention to fall back on.

W3 also drives which fields are optional: "never block progress on a document. Anything from a document is optional or deferred." So policy number, the other driver's insurance details, the police report number, and photos are all optional, and each one says in plain words where the number lives and that leaving it blank is fine.

## Labels above, no placeholder labels, hint text under the label

DESIGN.md / Components, Input: "Label sits above the field, never inside it as a placeholder." I went further and used no placeholder attributes at all. Placeholder text is low contrast, it vanishes when you type, and U4 says the median claimant is 52 with a meaningful share having reduced vision. Every hint that would have been a placeholder is real text between the label and the field, at `--t-small`, in `--ink-soft`.

## Tokens copied literally, and what "Inter" means on a page with no web fonts

The `:root` block is a straight transcription of DESIGN.md / Color, Type, Space and shape. I kept `"Inter"` at the front of the font stack even though the brief forbids external requests, so no Inter file will load. The stack in DESIGN.md already ends in `system-ui, -apple-system, "Segoe UI", sans-serif`, so the page renders in the platform UI font and the first entry costs nothing and stays correct if this markup is ever dropped into the real product, where Inter is presumably self hosted.

Everything spatial comes from the scale, per "Spacing uses the scale. No arbitrary pixel values." The one raw pixel value I kept is the `2px` corner on the wordmark square, and that is quoted from DESIGN.md / Components, Header: "a `--brand` square of 8px, radius 2px."

## Header

Straight from the Header spec: wordmark left, `--surface` background, 1px `--line` bottom border, 64px tall, which is exactly `--s8`. Nothing else lives in the header. I considered putting the claims phone number up there and decided against it, because the 911 notice sits immediately below and two phone numbers within 100px of each other is the kind of thing a shaken person misreads.

## The save status strip, and the one thing this mockup cannot honestly do

W4 says "Tell people plainly when something has not been sent yet" and W5 says "timestamp the report visibly." The strip under the intro does both: "Not sent yet", then a plain sentence saying answers stay on this phone until you press send, then a visible "Started 2:14 PM, August 21, 2026" in the date format DESIGN.md / Writing sets out ("Dates read as July 25, 2026").

`--accent` carries it, which is the token's stated job: "attention, in-progress status". A report that is typed but unsent is precisely an in-progress status. The color never carries the meaning alone; the words "Not sent yet" are the meaning and the color is emphasis, per the rule "Never communicate meaning with color alone."

Being honest about the limit: the actual local save and sync behavior W4 asks for is JavaScript, which this deliverable excludes. The strip describes the behavior the built page must have. If it ships without that behavior the strip is a lie, and I would rather flag that here than quietly drop the requirement.

## Part 1, about you

Name and a phone number for today are the only two things I made required here. The phone hint says "even if it is not your usual one", because W1 puts this person at the roadside and their own phone may be dying (W3 mentions the battery). Policy number is optional with a hint that says where it lives and, more importantly, that we can find them without it. That is W3 applied literally: "never block progress on a document."

## Part 2, when and where

Native `date` and `time` inputs. They give big platform pickers and they carry the correct US formatting for free, which matters given DESIGN.md / Writing insists on US conventions. Both hints give permission to guess ("Close is good enough"), because W2 describes people who are shaken and W5 says outright that "People change their account of events once they are calm, and that is normal and expected." A form that demands precision from someone who does not have it just produces a wrong answer stated confidently.

The location field asks for "Street or highway" and the hint offers a cross street, an exit number, a mile marker, or a parking lot name. "Parking lot" is the required US word per DESIGN.md / Writing.

State is a two letter text input with `maxlength="2"`, not a dropdown, per the publishing rule about never listing states. `autocapitalize="characters"` so a phone keyboard offers capitals.

## Part 3, your car

Ordered by what a person can answer while standing next to it. Make and model are required, year is optional, because year is the one people blank on under stress and it is trivially recoverable from the plate.

"Where is the damage?" is checkboxes rather than a body diagram. A diagram would be prettier and it fails U4 flatly: "no drag, no hover-dependent behavior" and a meaningful share of users have tremor or are one-handed. Tapping "Front" at 48px tall works with a thumb, in the rain. I added "I cannot tell yet" as a real option because U1 says treat everyone as a first timer, and a first timer who is unsure will otherwise guess wrong or stop.

"Can the car still be driven?" gets Yes, No, and "I am not sure". The hint explains why we ask, which is the tow and the rental. U2 says no term appears without a plain explanation, and I read that as extending to unexplained questions, not just unexplained words. Every question on this page says what it is for when the reason is not obvious.

All the option rows are real `input` elements inside a `label` that draws the box. DESIGN.md / Components, Focus warns that "Native radios and checkboxes ignore" the outline, so the focus treatment is on the wrapper via `:focus-within`, which gets the 2px `--focus` outline, the 2px offset, and the `--ring` halo together. The selected row fills with `--brand-tint`, the token's own stated use ("selected states"), and the control itself is tinted with `accent-color: var(--brand)`. That last one is my judgment call: `--brand-tint` is far too pale to read as a checked dot, and a selected state is brand family behavior rather than a second primary action, so I do not think it conflicts with "One primary action per screen."

## Part 4, what happened

Two questions. A closed list of crash types, then a free text box.

The closed list is the risky one, because every option is a sentence about who hit whom, and U2 records that people "believed a claim would raise their rate regardless of fault." So the hint above the list says it in plain words: "This does not decide who was at fault, and picking one does not put you at fault." That sentence exists because of U2, not because a claims system needs it.

The free text hint gives permission twice over: "There is no wrong way to say it and you do not need any legal or insurance words", and then "If more comes back to you later, you can add it." The second half is W5: "People change their account of events once they are calm, and that is normal and expected." A person who fears being pinned to a first draft will write less, and less is worse for the claim than a correction later.

## Part 5, was anyone hurt

Yes, No, and "I am not sure", plus an optional box for who and what. The hint says "Sore, dizzy, or shaken counts, and it often shows up hours later", which is the honest thing to say and also the thing that gets injuries reported at all. The detail box explicitly tells people not to guess at medical detail, since U2 says insurance and medical vocabulary is not just unfamiliar but actively misunderstood.

The card intro repeats the 911 line. Repetition is the right call under W2: someone who lands here after an interruption may never have seen the top of the page.

## Part 6, the other driver

The whole card is optional, and the intro says why in the plainest terms I could manage: "Do not walk back into traffic and do not argue with anyone to get it." That is W1 and W3 together. A form that implies you must collect the other driver's policy number is a form that sends a shaken person back toward moving cars.

One field is singled out in its hint: the license plate, "If you can only get one thing, get this." That is my own knowledge of claims work rather than anything in the materials. A plate finds the car, the owner, and usually the insurer, so it is the single highest value thing a person can capture in five seconds.

## Part 7, police

Same shape. A three way question that allows "I am not sure", then two optional fields. The report number hint describes the physical object it arrives on, "a slip or a card", because U1 says there is no learned pattern to draw on and nobody knows what a police report number looks like the first time.

## Part 8, photos, and the deliberately weak call to action

W3 and W4 both land here. The card intro says photos are "Helpful, never required", and tells people to send without them if the signal or battery is poor, with a promise to text a link for adding them later. The checklist of what to photograph is guidance for a first timer who has no idea what a claim needs, per U1.

The file input's browser button is styled as the secondary button from DESIGN.md / Components ("Secondary is `--surface` fill with a `--line-strong` border and `--ink` text"), at the full 48px height. It is deliberately not green. DESIGN.md says "One primary action per screen", and the one primary action on this page is sending the report, not attaching a picture.

## The closing block

No part number, because it is not more questions to answer, it is the end.

It opens by explaining who will call, using the glossary's phrase: "the person handling your claim", never adjuster, and it spends a sentence saying what that person actually does, because the glossary's stated reason for the substitution is that "'Adjuster' tested as adversarial. Say what the person does for them."

Then the contact preference choice, then the "Not sent yet" strip a second time directly above the button, then one full width green submit button, which is the only `--brand` fill in the whole page besides the wordmark.

Under a `--line` divider, three plain paragraphs that exist because W5 and U2 require them:

- The timestamp. W5: "timestamp the report visibly. The submission time matters for coverage." So the page says we stamp it, we show it on the confirmation, and that the time can matter for coverage.
- Corrections. W5 again: "Corrections must remain possible after submission, and the page must say so." The page says so, and adds that adding to your account later "does not count against you", which addresses the fear rather than just the policy.
- Money and fault. This is where the glossary's "what you pay" replaces deductible: "the person handling your claim will tell you plainly what you pay, if anything." The word deductible never appears on the page.

## Footer

The claims line, 1-800-555-0142, exactly as DESIGN.md / Writing gives it, described as "Need a person instead?" because U1 says treat everyone as a first timer and some of those people should not be filling in a form at all. Then 911 one final time, then the company name. Small type here is fine; nothing in the footer is needed to complete the report.

## No error states are shown

DESIGN.md / Components describes the error treatment, and I did not render one. The brief asks for a static mockup with controls left empty, and inventing a red bordered field with a fake message would put fabricated content into a page whose whole job is truthfulness. The `required` attributes are on the fields that genuinely are required, so the native validation path is real, and the styled error treatment is a build task with a note here rather than a decoration in the mockup.

## Type sizes, corrected partway through

I first wrote the hint text under each label at `--t-small`, 13px, because it looked like secondary text. Then I reread U4, "large text and large targets", median age 52, reduced vision common, alongside U2, "no term appears without a plain explanation next to it". Those hints are not decoration. They are the explanation U2 demands, and a person cannot complete the form correctly without reading them. So I moved every hint, the photo checklist, the save status, and the three closing paragraphs up to 16px body type, which also satisfies DESIGN.md's "Body text never goes below 16px."

What stayed at 13px is only the material that carries no instruction: the "Part n of 8" overline, the Required and Optional tags, and the footer. If a sentence tells you how to answer, it is body size on this page.

## Multi column rows, corrected last

Where two or three short fields share a row on wider screens (date and time, city and state and ZIP, year and make and model), hints of different lengths were leaving the inputs at different heights, which reads as sloppy and, worse, makes the row look like separate unrelated things. I made each field in a row a flex column with the hint set to `flex:1`, so the inputs line up along one baseline regardless of how many lines each hint takes, and I gave a hint to the few fields in those rows that did not have one. The added hints are useful in their own right: city now says the nearest town is fine if you are out on a highway, which is a real roadside problem from W1.
