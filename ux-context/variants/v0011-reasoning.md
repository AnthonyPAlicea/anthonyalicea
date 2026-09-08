# Reasoning

## The one-page instruction versus "one decision per screen"

The PM asked for one page. UX.md W2 says the opposite for this exact situation: "one decision per screen. Every screen must survive being abandoned mid-answer and returned to cold." I am keeping the page count at one because that is the request, and resolving the conflict inside the page instead of arguing with it. The page is a stack of small numbered parts, each one a card with a heading, each one answering a single question or a single tight cluster of questions. Nothing spans two cards. A person who looks away for thirty seconds (W2 says testing showed exactly that interval) comes back to a card that still says what it is asking and where they are in the whole thing. The numbered overline on each card ("Part 4 of 8") is doing the work the screen-to-screen progress indicator would have done in a wizard.

I also added a short "On this page" list of anchor links right after the intro. On a phone this is the only cheap way to return cold and find the thing you were in the middle of without thumb-scrolling past everything. It is my own call, not from the materials, but it follows from W2.

## Order of the parts

Triage first, paperwork last. The order is: when and where it happened, was anyone hurt, did police come, your car, the other driver, photos, other damage and witnesses, how we reach you.

Injuries sits second because it is the answer that changes what Keystone does in the next hour, and because UX.md W2 says these people are "shaken, sometimes in pain." If the page is abandoned after two cards, injuries is the answer I most want to already have.

Everything that requires a document in hand is pushed toward the bottom. UX.md W3: "Insurance card in the glovebox of a car that may be undrivable... never block progress on a document. Anything from a document is optional or deferred." So the other driver's insurance details, the police report number, and the policy number are all late and all optional.

## Required versus optional

Rather than mark twenty fields "required," the form says once, above the first card, that everything is required unless the label says optional. Then the optional ones carry a visible "Optional" word next to the label. Word, not a color or an asterisk, because DESIGN.md rules say "Never communicate meaning with color alone" and an asterisk is not much better than color for a person squinting at a screen in daylight glare (W1).

Which fields are genuinely required: date, city, state, what happened, whether anyone was hurt, whether the car can be driven, your name, your phone. That is enough to open a claim and call someone back. Everything else can arrive later. This split is my judgment about what an insurer minimally needs to open a file, informed by W3's instruction to never block on documents.

## The words

Straight from the UX.md glossary. The page says report, crash, your car, the other driver, damage, and "the person handling your claim." It never says FNOL, loss, incident, third party, insured vehicle, or adjuster. The confirmation copy at the bottom uses "we got it," which the glossary gives as the phrase to use instead of "submission received."

Two glossary terms I deliberately did not need: "what you pay" (deductible) does not belong on a first report, and neither does any policy language. The glossary line "Never introduce a term from the policy document without translating it on the spot" is easiest to honor by not introducing one at all.

DESIGN.md Writing section: US conventions throughout, so license plate, windshield, parking lot, 911, 1-800-555-0142, and dates written as August 21, 2026. Sentence case everywhere, no exclamation marks.

## Visual system

Everything comes from DESIGN.md and I declared its color, type, space, and radius values as custom properties at the top of the stylesheet so nothing is an arbitrary pixel value ("Spacing uses the scale. No arbitrary pixel values."). Font stack is the one given, "Inter" first with the system fallbacks; since the page may not make external requests I do not load Inter, I just name it and let it resolve locally or fall back, which the given stack is already built for.

One primary action on the page: "Send report" in brand green. The only other button is a secondary "Finish this later," which is the surface fill with a `--line-strong` border per the Button spec.

## Header

Built to the Header spec in DESIGN.md: 64px tall, `--surface` background, 1px `--line` bottom border, wordmark left. The wordmark is the word "Keystone" in `--brand` at 20px weight 650 followed by an 8px `--brand` square with a 2px radius, exactly as described.

I added one thing the spec does not list: the claims line, 1-800-555-0142, as small `--ink-soft` text on the right. The spec only calls out the wordmark, so this is my addition. The reason is W1, a person on a phone at the roadside. If the form is not what they need, the number they need should be on screen without scrolling. It is text, not a button, so it does not compete with the one primary action.

## The 911 notice, above everything

First block on the page, before the form. UX.md W1 and W2 describe someone who may be in pain and within an hour of the crash, so the first thing the page says is to call 911 if anyone is hurt, and that this report can wait.

Color choice: this is attention, not an error, so it uses `--accent` for the left rule and the icon, not `--danger`. DESIGN.md is explicit: "Danger red is for errors and nothing else. Never use it for emphasis." And because "Never communicate meaning with color alone," the meaning is carried by an inline SVG warning triangle plus the words, with the color only reinforcing it.

The second line, telling them to get out of the traffic lane before filling this in, is my own addition. It is not in the materials, but W1 puts these people physically at the roadside and it would be wrong to hold their attention there without saying it.

## Save status and the visible timestamp

UX.md W4: "save locally and sync. Tell people plainly when something has not been sent yet." So there is a status strip directly under the notice that says, in plain words, that answers save on the phone as they type and nothing has been sent yet. Same strip carries the report start time in the DESIGN.md date format ("August 21, 2026 at 4:12 PM"), which covers W5, "timestamp the report visibly."

The strip also promises that a dropped signal will not lose anything, because W4 says never lose an answer to a failed request and the person needs to be told that before they start typing, not after a failure.

Honest note about the mockup: with no JavaScript, this strip is static presentation of a behavior the real build has to implement. It is the design of the reassurance, not the reassurance itself. The timestamp is page text, not a value sitting in a form control, so it does not violate the empty-controls requirement.

## Card and part pattern

Each part is a `--surface` card with `--r-md` radius, `--shadow-card`, and `--s5` padding, straight out of the Card component in DESIGN.md. Above each card title is a small uppercase overline giving the position, "Part 3 of 8." DESIGN.md Writing allows all caps in exactly one place, "no title case, no all caps except in a small overline," so the overline is where the position marker goes and everything else stays sentence case.

The stack is a single column at every width. W1: "design the phone first. Single column." Nothing gets a second column on a large screen except tight pairs of short fields, and those collapse below 560px.

## Controls

Inputs follow the Input spec: 48px tall, `--r-sm`, 1px `--line-strong` border, `--surface` fill, `--s3` inner padding, and a label above the field. No placeholders standing in for labels, per "Label sits above the field, never inside it as a placeholder." Body copy in the fields is 16px, which the type scale requires and which also stops mobile browsers from zooming when a field is focused.

The radios and checkboxes are custom drawn with `appearance:none`. That is a direct read of the DESIGN.md Focus rule: "Never replace the outline with a border color change. Native radios and checkboxes ignore it." Since the native controls will not show the required outline, I drew the box and the dot in CSS so the focus outline plus `--ring` halo lands on something that will actually render it.

Each choice is a full-width row at least 48px tall with a `--line-strong` border, so the whole row is the tap target. Rules say tap targets are at least 44px in both directions, and W1 says one-handed in daylight glare, which argues for the largest target the layout allows rather than a 20px circle. A selected row picks up `--brand-tint` and a `--brand` border, which DESIGN.md gives as the selected state, and the filled dot or check inside means the selection is never signaled by color alone.

## Focus

Every focusable thing gets `outline: 2px solid var(--focus)` with `outline-offset: 2px` and the `--ring` halo behind it, exactly as specified, including the reason given in the file: the ring alone computes to about 1.6:1 and a focus indicator needs 3:1. Focus blue appears nowhere else, no fills, no text.

## The state field

Per the publishing pipeline note, no list of states anywhere. Every place a state is needed (crash location, plate state on your car, plate state on the other driver's car) is a short text input with `maxlength="2"`, a "Two letters" hint, and `autocapitalize="characters"` so a one-handed typist does not have to reach for shift.

## Part by part

**1. What happened.** Date, time, place, the story, and how many cars. The time field says a guess is fine, because W2 describes shaken people and an exact minute is not worth stalling on. The story field is the one open text box that matters and its hint tells them a sentence or two is enough for now, which pairs with W5's point that people fill in detail once they are calm.

**2. Was anyone hurt.** Deliberately its own part with an intro telling them to answer this one even if they skip the rest. The options include "I am not sure yet," which is the honest state at the roadside, and the optional follow-up hint mentions that aches often show up the next day and can be added later. That is my own knowledge of how injury reporting actually goes, and it is consistent with W5.

**3. Police.** Whether they came, then the report number and agency, both optional. W3 is the reason the number is optional: it comes off a slip of paper. The hint says plainly that if they do not have it we will request the report ourselves, so leaving it empty does not feel like failure.

**4. Your car.** Year, make, model, plate, who was driving, where the damage is, whether it can still be driven, where it is now, and whether it needs a tow. Drivable and tow are here because they are the two answers that trigger something useful in the next hour. Plate is optional with the hint that we can pull it from the policy, again W3.

The damage question is a checkbox group rather than a diagram. I considered a top-down car illustration with selectable zones, and dropped it: with no JavaScript the illustration could not reflect what was checked, so it would show a car that never changes while the person is picking parts, which is worse than no picture. Vocabulary follows DESIGN.md Writing, "windshield," "license plate," "parking lot."

**5. The other driver.** Titled with the glossary's words, never "third party." Every field optional, and the intro says so and tells them not to go back into traffic or hunt for paperwork, and that we can get it from the other insurer. That is W3 applied to the part of the form most likely to make someone climb back into a damaged car.

**6. Photos.** A real file input, optional, with the useful shot list in the hint and a plain warning not to step into traffic for a picture. W4 says the connection is unreliable and uploads fail, so the hint tells them to skip photos now and add them later on a weak signal rather than watch a progress bar at the roadside.

**7. Other damage and witnesses.** Other property, passengers, witnesses. All optional, all things that are easy to capture while still at the scene and painful to reconstruct later, which is why they are on the page at all rather than deferred.

**8. How we reach you.** Name and phone required, email optional, preferred contact method, and policy number last and optional. The policy number hint says outright that the card is probably in the glovebox, not to go get it, and that name and phone are enough. That is W3 stated as plainly as I could manage.

## What happens after you send this

A four-item numbered list before the submit button, because W2 says the page must survive being returned to cold and because someone shaken deserves to know what they just started. The wording uses the glossary: "we got it," and "the person handling your claim calls you," never "adjuster." Item three mentions "what you pay before your coverage starts," which is the glossary's plain phrase for deductible and avoids introducing the policy term at all. Item four says corrections are possible and that remembering more later is normal, which W5 requires the page to say.

## Sending

The attest checkbox is one line, plain: "This is true as best I know it right now." The hedge is intentional. W5 says people change their account once they are calm and that this is normal and expected, so the wording must not make an honest later correction feel like an admission of lying.

The fine print under the buttons says we record the send time and that it can matter for coverage, which is W5's "the submission time matters for coverage," and repeats that corrections are welcome and do not count against them.

Primary "Send report" in brand green, one per page. Secondary "Finish this later" in surface fill with a `--line-strong` border, which exists because W2 says every screen must survive abandonment, and giving abandonment a button is better than leaving people to guess whether closing the tab loses the work.

## What I left out

No error states are rendered. DESIGN.md specifies them, a `--danger` border with a `--danger` message below the field, but the brief asks for a static mockup with controls left empty, and painting an error onto an empty field would show a state that no user action produced. The `required` attribute is on the genuinely required fields so the semantics are in the markup for whoever builds this.

No JavaScript, so several things in this design are stated rather than working: the local save, the sync status, the sent versus not sent distinction. Those are the parts of W4 that the real implementation owns.

The `value` attributes on radios and checkboxes are kept. They are not sample data, they are what the control submits, and stripping them would leave a form that posts "on" for every answer.

No gradients, no shadow other than `--shadow-card`, no color outside the eleven in the file, no icon-only buttons, and no dashes of any kind in the page text.
