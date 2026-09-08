# Reasoning: first report of an accident

## The conflict I had to settle first

The PM asked for one page. UX.md / World model W2 says "one decision per screen. Every screen must survive being abandoned mid-answer and returned to cold." Those pull against each other, and the build constraints (no JavaScript, static mockup) settle it: a real one-decision-per-screen wizard needs state and routing that this page cannot have.

So I treated the page as a stack of screens rather than a form. Every step is its own card on the canvas background, one topic per card, one column, with an overline that reads "Step 4 of 11". The card boundary and the step count do the job the screen boundary would have done: you can look away for thirty seconds (W2 says people looked away every twenty to forty seconds), come back, and see where you are without re-reading anything above. I did not compress steps to make the page shorter. A shorter page here would mean more decisions per card, which is the wrong trade for this audience.

## Page order

The order is set by the research, not by what is convenient to collect.

UX.md / F3: "say what happens next, on the page, before asking for anything." So nothing is asked for until after the "what happens next" card. UX.md / F2: "photos are the first substantive step. Written description is optional and comes last." So photos are step 1, ahead of even the person's name, and the free-text account of the crash is step 10, near the end, marked optional.

That leaves the running order: safety notice, what happens next, saved-state notice, photos, how we reach you, when, where, your car, damage, injuries, the other driver, police and witnesses, what happened in your own words, policy number, send.

## Above the first question

Three blocks sit above step 1.

A 911 notice comes first. Nothing in the materials tells me to put it there, but a page that a shaken person opens within an hour of a crash (W1) should say the one thing that matters more than the report. DESIGN.md assigns `--danger` to "errors, destructive actions" and says "Never use it for emphasis," so the notice is built on `--accent` (#C2610F, "attention"), not red. Per DESIGN.md Rules, "Never communicate meaning with color alone," so it carries an alert glyph and the words as well as the color.

Then "What happens next," answering F3's three worries in the order the finding states them: what happens to them, to their car, and to their day. I deliberately did not invent a service level. No "we call you within one business day" and no "this takes ten minutes," because no file in my materials gives me those numbers and a first report is a legal record (W5). I said what happens without promising when.

Then the saved-state notice. F4 says "save continuously. Make returning obvious and make the saved state visible," and W4 says "Tell people plainly when something has not been sent yet." With no JavaScript I cannot actually save, so the mockup shows the two sentences that behavior would need: answers stay on this device as you type, and nothing reaches Keystone until the button at the bottom is pressed. That is the visible saved state F4 asks for, in the only form a static page can carry.

## What is required

Only two fields: full name and mobile number. Everything else can be left blank.

This comes from three findings at once. F1: "never require a policy number to begin. Identify people by something they carry in their head." W3: "never block progress on a document." F5: "allow 'I don't know' on any factual question."

I stated that rule once, in plain words, at the top of the form, and tagged only the two required fields. The alternative was tagging all thirty-odd fields "Optional," which is honest but adds thirty pieces of small type to a page read outdoors in glare by a median-52-year-old user (U4). One clear sentence plus two tags carries the same information with less to look at.

## Policy number

It is step 11, the last question, and it is optional. F1 says asking for it first is "the single largest cause of abandonment we have measured," and W3 puts the insurance card "in the glovebox of a car that may be undrivable." So the field says not to go looking for it and not to go back to the car for it. Instead, step 2 asks for name, mobile, email, and home ZIP code, which is F1's "something they carry in their head," and says out loud that we will find the policy from those.

## Step by step

**1. Photos.** F2 is unambiguous: "At the scene they can point a camera. They cannot compose a paragraph." Three separate file inputs rather than one, because "photos of your car," "photos of the scene," and "the other driver's card or plate" are three different errands and a single input gives no guidance about what to shoot. Each has a hint saying what to aim at, which is U1's "guidance over efficiency" applied to the one thing this user can actually do well. The step ends by saying photos can be added after sending, so a person who cannot safely take them now is not stuck (W3).

**2. How we reach you.** Name, mobile, email, home ZIP. The mobile hint says it is where a specialist will call, because that is the field doing the real work. Email is optional and framed as a copy of the report. No account, no password, no "create a login to save your progress," per U3: "no registration before the report is filed."

**3. When it happened.** Date, then time with a checkbox reading "I am not sure of the exact time." F5 names time as one of the three things people stall on, alongside speed and damage estimates. The date field says a best guess is fine and can be corrected later, which is F5's second half: "Say plainly that details can be corrected later."

**4. Where it happened.** Street or intersection, city, two-letter state, ZIP, road type, and a landmark field. The landmark field is my own addition and not from the materials: someone standing on a highway shoulder (W1) may genuinely not know the street name, and "the gas station just past exit 12" is a real answer. The road type choices are radios ending in "I am not sure."

The state field is a short text input for the two-letter code. That is the publishing pipeline rule.

**5. Your car.** Year, make, model, plate, who was driving, whether it can be driven, and where it is now. Plate is optional and says to leave it blank if you cannot see it from where you are, since walking around a wrecked car to read a plate is exactly the kind of thing W3 says not to require. "Can it be driven" and "where is it now" are the two answers that decide whether a tow gets arranged, which is the car half of F3.

**6. Damage.** Checkboxes for the damaged areas, with "I am not sure" in the group. Then a severity question in plain buckets ("scratches and dents," "a part is broken or hanging off") rather than a dollar estimate, because F5 says people stall on damage estimates, and the step says out loud that this is a first impression and no one will be held to it. Airbags sit here too, since it is the one damage fact that also predicts injury.

**7. Injuries.** "Is anyone hurt, even a little" with a "not sure yet" option, plus a note that aches often show up the next day and can be added later. That note is general knowledge on my part, and it exists to stop someone answering "no" now and then believing they are locked out of it.

**8. The other driver.** Every field optional, plus two checkboxes: could not get their details, and they left before I could get anything. Without those, a person who was left at the scene has no way to say so except by leaving the whole section blank, which reads as an unfinished form rather than as the fact it is.

**9. Police and witnesses.** The police report number field explains what it is ("the number on the card or slip an officer gives you") rather than assuming the term lands, per U2: "no term appears without a plain explanation next to it, the first time and every time." "Not yet, they are on the way" is a real state at the roadside and gets its own option. Witnesses are one free-text box, not name and phone fields, because there might be nobody or there might be three people.

**10. What happened, in your own words.** Optional, near the end, per F2. W5 says "People change their account of events once they are calm, and that is normal and expected," so the hint says exactly that: a sentence is enough, you can leave it blank, and it is normal for your account to change later.

**11. Policy number.** Covered above.

## Vocabulary

U2 says most people in testing could not define a deductible and many believed any claim raises their rate. My response was not to explain those terms but to avoid needing them. There is no deductible, no adjuster, no liability, no first party, and no coverage determination anywhere on the page. The two industry words that survive are "claim" and "claims specialist," and both get a plain gloss where they first appear: a specialist is "a person at Keystone who looks at what happened and sorts out what we pay." Nothing is left for the reader to look up.

I also kept US conventions throughout, per DESIGN.md Writing: license plate, windshield, parking lot, 911, 1-800-555-0142.

## Decisions made while building

**The header.** Built to the letter of DESIGN.md Header: 64px tall, `--surface`, 1px `--line` bottom border, the word "Keystone" in `--brand` at 20px weight 650, followed by an 8px `--brand` square at 2px radius. I made the wordmark plain text rather than a link home. On a real page a logo links home, but F4 says progress gets lost and people do not retype it, and a full-width tappable link back to a marketing site is a way to lose a half-finished report on a phone. There is nowhere on this page it would be safe to send someone.

**Where each color went.** `--brand` appears three times only: the wordmark, the Send report button, and the phone number link, which DESIGN.md Components sanctions as a text button. `--accent` appears once, on the 911 notice. `--focus` appears only in focus rings. `--danger` appears nowhere on the page, which I want to state plainly rather than have it read as an oversight: this is a static mockup with empty controls, so there is no error to show, and painting a red message under an untouched field would be a lie about the state of the form. `--brand-tint` does the two jobs its comment assigns it, as the quiet highlight behind "What happens next" and as the fill of a selected choice.

**Radios and checkboxes.** DESIGN.md Focus ends with "Native radios and checkboxes ignore it," which is a problem stated without a solution, so I picked one. Every choice is a full-width tile, at least 48px tall, with the whole label clickable and a `--line-strong` border, and the focus outline plus `--ring` is drawn on the tile with `:focus-within` while the native control's own focus ring is suppressed. That gives a 3:1 indicator DESIGN.md asks for on a control that cannot carry it, and the tile also solves U4's tremor and one-handed cases, since the target is the width of the screen rather than a 13px circle.

**No dropdowns anywhere.** Not one `select` on the page. A dropdown hides its options until tapped, needs a precise second tap to choose, and on this page would have needed a preselected first item, which the brief forbids. Radio tiles show every option at once, which suits U1's first-time user who has no idea what the choices are going to be.

**Type sizes.** Body and hints are 16px, not the 13px `--t-small`. DESIGN.md says "Body text never goes below 16px," and the hints on this page are doing real explanatory work for U2 and U4, so they are body, not fine print. `--t-small` is used only for the step overlines and the "Required" tag. Field labels are 16px at weight 550, above the 14px `--t-label` floor. DESIGN.md's own Button spec sets a precedent for that by specifying "label `--t-label` at 16px," and U4's median 52-year-old reading outdoors in glare is the reason to take it.

**Widths and spacing.** Every margin, padding, and radius comes from the scale, per "No arbitrary pixel values." Where a field needed to be narrower than the column, such as the two-letter state code or the year, I used rem-based max-widths rather than inventing pixel values, so nothing off-scale enters the stylesheet. A full-width input for two characters looks like a mistake and invites people to type the whole state name.

**File inputs.** Native file controls cannot be restyled without JavaScript, so I styled what CSS can reach: the field gets the standard input border and radius, and `::file-selector-button` is drawn as the secondary button from DESIGN.md Components, `--surface` fill with a `--line-strong` border and `--ink` text. The button text itself stays whatever the browser calls it, which is why the label and hint above each input carry the real instruction.

**The header does not stick.** A sticky bar would eat vertical space on a phone held one-handed in the rain (W1) and would gain nothing, since there is no navigation in it.

**No jump links.** I considered a contents list at the top so someone returning cold could jump back to where they stopped. I left it out under U1: "no shortcuts, no power-user affordances." Numbered steps and one topic per card are enough to find your place, and eleven anchor links at the top of a phone screen is a wall to scroll past on every visit.

**The timestamp.** W5 says "timestamp the report visibly." With no JavaScript I could only have printed a fixed fake date, which would be sample data in a mockup and, worse, a false timestamp on a document the same finding calls admissible. So the send card states the rule in words instead: we stamp it when it reaches us, and that time is what counts for coverage. A live build fills in the real time there.

**Calling.** The claims line is a `tel:` link, since two thirds of these arrive from a phone (W1). The 911 number is deliberately not a link. Given U4's tremor and one-handed users, a tappable 911 sitting in the top notice of a page people are scrolling through in a hurry is an accidental emergency call waiting to happen, so it is set as plain bold text that says to dial it.

**One primary action.** One `Send report` button, full width, at the bottom of the last card, per "One primary action per screen." Nothing competes with it: no save button (F4 says saving is continuous and automatic, not a thing you press), no "start over," no print.
