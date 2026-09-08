# Reasoning

## The one conflict I had to settle first

The PM says one page. UX.md / World model W2 says "one decision per screen. Every screen must survive being abandoned mid-answer and returned to cold." Those pull against each other, so I resolved it before drawing anything: one page, one column, but each question group gets its own card with a numbered overline ("Step 3 of 8"), a heading, and generous space between cards. On a phone that means roughly one card fills the viewport, which is the practical thing W2 is protecting: you look away for thirty seconds, you look back, and the card you are inside tells you where you are. A person returning cold reads a step number and a plain heading, not a wall of fields. So the page is a single document, but it is paced like a sequence.

## Order of the page

The order is set by UX.md findings, not by what an insurer's intake form usually does.

F3 says "say what happens next, on the page, before asking for anything." So the first thing under the title is a short "What happens next" block with the three things that actually happen, and no field appears above it.

F2 says "photos are the first substantive step. Written description is optional and comes last." So Step 1 is photos, and the free text box is Step 8, marked optional. This is the biggest departure from a normal claim form, which usually opens with policy and personal details.

F1 says "never require a policy number to begin. Identify people by something they carry in their head." So Step 2 is name, phone, email, date of birth, home ZIP. The policy number field exists, sits last in that card, and is labeled optional with the sentence that they do not need it. Putting it in at all is my judgment: some people file from their kitchen with the card in front of them, and it saves us a lookup. Putting it last and optional is F1.

Everything after that is ordered by what a person can answer from where they are standing (W1: roadside, phone, one hand): when and where, is anyone hurt, your car, the other driver, police and witnesses, then the story.

## The safety note goes above everything, including "what happens next"

This is my own call, not from the materials. A page that can be opened within sixty minutes of a crash (W1) should say "call 911 first" before it says anything about insurance. DESIGN.md / Writing fixes the number: "Emergency number is 911." I used --accent for it, which DESIGN.md / Color defines as "attention, in-progress status." I did not use --danger, because DESIGN.md is explicit: "Danger red is for errors and nothing else. Never use it for emphasis." A safety note is emphasis, not an error.

## Saved state and the timestamp

F4 says "save continuously. Make returning obvious and make the saved state visible." W4 says "Tell people plainly when something has not been sent yet." W5 says "timestamp the report visibly." I merged those into one status strip that sits directly under the title block and before Step 1: it names when the report was started, says the answers are held on this device, and says plainly that nothing reaches us until the button at the bottom is pressed. This page cannot actually save anything (no JavaScript, static mockup), so the strip is showing the state the real page would show. I put a concrete date in it because a mockup with an empty timestamp communicates nothing, and I formatted it the way DESIGN.md / Writing requires: "Dates read as July 25, 2026."

## Vocabulary

I took the glossary in UX.md literally. The page says report, crash, your car, the other driver, damage, the person handling your claim, and "we got it" in the confirmation sentence. It never says FNOL, loss, incident, third party, insured vehicle, or adjuster.

One term needed a decision: deductible. The glossary says say "what you pay" and adds "If 'deductible' must appear, define it in the same breath, every time." I let it appear exactly once, in the "what happens next" block, as "what you pay toward the repair (your policy calls this your deductible)". My reason for letting it in at all rather than avoiding it: U2 says people actively misunderstand the word, and the word is on their policy and in the letter they will get from us. Pretending it does not exist leaves them to meet it cold somewhere else. Defining it once, in their words first, is the version of the rule that helps them.

## What I am not asking for

F5: "They stall on questions they cannot answer exactly, especially time, speed, and damage estimates." So there is no speed field and no repair cost field anywhere on this page. We do not need either to open a claim, and asking would cost us the report. Time of the crash is asked but paired with a checkbox that says the exact time is not known, which is F5's "allow 'I don't know' on any factual question" applied to the one place people freeze most.

## Marking what is actually required

W3 says "never block progress on a document" and F5 says people are afraid of getting it wrong. If I tag half the form "required" I have built the thing those findings warn about. So only three fields carry a "Needed" tag: your name, your phone number, and the date of the crash. A line at the top of the form says everything else can be left blank and can be added later. That is my judgment about how to express W3 and F5 in a form layout, since neither file prescribes a required-field convention.

## Visual system: I am implementing DESIGN.md, not designing

DESIGN.md is a finished system, so the job here is fidelity, not invention. Every color, radius, shadow, and space value on the page is a token declared as a CSS custom property with the same name, so an engineer reading the source can check it against the file line by line. No value is off the scale. DESIGN.md / Space and shape: "Spacing uses the scale. No arbitrary pixel values."

Header is built exactly to DESIGN.md / Components: wordmark left, --surface background, 1px --line bottom border, 64px tall, and the wordmark is the word "Keystone" in --brand at --t-title weight 650 followed by a --brand square of 8px at radius 2px. The company is Keystone Mutual, but the wordmark spec names only "Keystone", so that is what the header shows. I did not add a phone number or a help link to the header, because the spec describes the header as the wordmark and nothing else. The claims line lives in the body and the footer instead.

## Type sizes, and one reading I had to make

The scale is fixed: display 28, title 20, body 16, label 14, small 13. U4 says the median claimant is 52 and a meaningful share have reduced vision, which argues for larger text than a form usually gets. I did not invent sizes to satisfy it. Instead:

Every piece of guidance and helper text on the page is body at 16px, not small at 13px. DESIGN.md says "Body text never goes below 16px," and hint text under a label is body text. The 13px small size is used in exactly two places: the step overlines and the footer meta.

Field labels render at 16px using the --t-label style (weight 550, line height 1.4) rather than at 14px. My reading: DESIGN.md's own Button spec says "label --t-label at 16px," which shows --t-label is a style that gets set at more than one size inside this system. The floor in the file is "Labels never go below 14px," and 16px is above it. Given U4 I took the larger end. Flagging it because it is an interpretation, not a quotation.

## Controls: radios and text inputs, no dropdowns anywhere

DESIGN.md / Components defines Button, Input, Focus, Card, and Header. There is no select in the system. Rather than invent one, I built every choice as a radio or checkbox group in a bordered row at least 48px tall. That also serves U4 ("no drag, no hover-dependent behavior, no small close buttons") and W1 (one hand, glare): a stack of tappable rows beats a dropdown that opens a scrolling wheel you have to hold steady. It costs vertical length, which on a one-page form is a real cost, and I accepted it.

The publishing rule about US states lands the same way: the two state fields on the page (crash location, license plate) are short text inputs, maxlength 2, with a hint saying two letters.

## Focus

DESIGN.md / Components is unusually specific and gives the reason: outline 2px solid --focus at 2px offset, plus --ring as a halo behind it, because "The ring on its own is not enough. It computes to roughly 1.6:1 against white, and a focus indicator needs 3:1." I implemented exactly that on every focusable element. --focus appears nowhere else on the page, per "Focus blue appears only in focus rings. Never as a fill or a text color."

The file also warns that native radios and checkboxes ignore a border color change. So on a choice row, the native control keeps its own outline and the surrounding row gets the soft ring, which reads as one focused row without me replacing the outline with anything.

## Selected state without color alone

A checked choice row gets a --brand-tint background, which DESIGN.md / Color assigns to "selected states, quiet highlights". The row border stays --line-strong in both states, because "The boundary of any interactive control uses --line-strong." The tint is never the only signal: the native radio or checkbox is filled at the same time, which satisfies "Never communicate meaning with color alone."

## One primary action

DESIGN.md: "One primary action per screen." The only --brand filled button on the page is "Send my report" at the bottom. The photo pickers use the secondary treatment (surface fill, --line-strong border), and the two phone numbers are text links, not buttons, so nothing competes with the send.

## Decisions I made while actually building it

**Accent stays a graphic color, never text.** I wanted the safety heading in --accent and checked it first. #C2610F on white computes to about 4.2:1, which is under the 4.5:1 AA needs for normal text. So --accent appears only as the 4px bar on the safety card, the warning triangle, and the small dot in the save strip, and every word next to it is --ink. DESIGN.md does this same arithmetic out loud for the focus ring, so I treated checking it as part of using the system rather than an extra.

**The "Needed" tag is --ink, not --brand.** My first instinct was green, and that is wrong: "Brand green is for the primary action and the logo." The two tags are distinguished by the words Needed and Optional, with weight and case doing the work, which also keeps to "Never communicate meaning with color alone."

**--danger is declared and never used.** The page ships with empty fields, so showing an error state would mean inventing a mistake the person has not made. The token stays in the sheet so the error styling in DESIGN.md drops in unchanged when this gets built for real.

**No capture attribute on the photo inputs.** I nearly set capture="environment" to open the camera straight away, which sounds right for F2. It is wrong here: it takes away the photo library. By the time many people open this page the photos are already taken, sometimes by a passenger or before the phone was handed over. accept="image/*" and multiple lets them do either.

**The car diagram is a picture, not a control.** Where is the damage is the one question a diagram genuinely helps with, so there is a top down car above the checkboxes with Front, Rear, Driver side, and Passenger side labeled on it. I did not make its panels clickable. DESIGN.md: "Do not use icon-only buttons for anything a person can get wrong," and U4 rules out small targets and fine pointing. The SVG is aria-hidden and the eight checkboxes carry all the meaning, so the diagram is pure help for anyone who reads pictures faster than words.

**"I did not get their details" is a checkbox, not a branch.** With no JavaScript I cannot hide the other driver fields when it is ticked. Rather than fake it, the fields stay visible and the card opens by saying to leave blank whatever they do not have. That matches W3 anyway: nothing here is blocked on a document or on the other driver cooperating.

**Two state fields, both short text inputs, both hinted "Two letters."** One for where the crash happened, one for the plate. I dropped a third for the other driver's plate and folded it into a hint on that field ("Include the state if you noticed it"), because three state boxes on one page is fussy and their plate is a single thing a person read off a car.

**Date and time use native inputs.** type="date" and type="time" give the phone's own picker, which is the control this audience is most likely to have used before (U1: no learned pattern for our interface, but they do know their phone). Autocomplete tokens are set on name, phone, email, birthday, postal code, address, and city, so a returning phone can fill most of Step 2 with one tap. That is the closest thing to a shortcut on the page, and it costs the user nothing to ignore.

**Measure and column.** Everything sits in one 640px column, centered, single column at every width, which is W1's "design the phone first. Single column." The desktop version is deliberately the phone version with air around it rather than a two column layout, because a returning person on either device should meet the same page in the same order.

**Length.** This page is long, and that is the honest cost of one page plus eight steps of guidance. I spent the length on plain explanation rather than on more fields: the whole form is thirty something inputs, and roughly half of them are marked optional. What keeps it navigable is the step overline on every card, which gives a person who looked away a place to land.

**The claims line appears three times.** In the safety card, in what happens next next to the tow, and under the send button. F3 says a third of calls ask only what happens next, and this page answers that, but the number still has to be easy to find for the people whose answer is that they would rather talk to a person. All three are text links, never buttons, so the single --brand button at the bottom stays the only primary action on the screen.
