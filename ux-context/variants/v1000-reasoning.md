# Reasoning: first notice of loss, one page

Written as I go, in the order I made the decisions.

## The order of the page

The PM asked for a page that collects everything needed to open a claim. UX.md decides the order for me, and it is not the order an intake form usually runs in.

UX.md F3 says "say what happens next, on the page, before asking for anything." So the first real content block after the page title is a short "what happens next" panel, not a field. F3 also names what people actually want to know: "what is going to happen to them, their car, and their day," so that panel has one line for each of those three, plus one for the claim number.

UX.md F2 says "photos are the first substantive step. Written description is optional and comes last." So step 1 of the form is photo upload and the free-text description is the last thing on the page, marked optional.

UX.md F1 says "never require a policy number to begin. Identify people by something they carry in their head." So contact details are step 2, not step 1, and the policy number is a clearly optional field sitting at the bottom of that step rather than at the top of the page.

Everything after that is claim substance in the order a person would walk through it at the scene: when and where, your car, the other people, then what happened.

## The 911 notice

A safety line goes above everything, because a page about a crash that does not mention 911 is negligent. My instinct was to set it in red. DESIGN.md line 24 forbids that: "Danger red is for errors and nothing else. Never use it for emphasis." So the notice uses `--accent`, which DESIGN.md line 18 assigns to "attention," and it carries an alert icon and the word "911" so the meaning does not rest on the color, per DESIGN.md line 88.

I kept the notice to two sentences and gave it a way out that is not the form: the claims line 1-800-555-0142 from DESIGN.md line 78. UX.md F4 says people who lose progress "give up and phone in," so the phone number should be easy to find rather than hidden.

## Header

Built to DESIGN.md lines 71 and 72 exactly: 64px tall, `--surface` background, 1px `--line` bottom border, the word "Keystone" in `--brand` at title size weight 650, followed by an 8px `--brand` square with a 2px radius. I put the claims line phone number at the right of the header. That is my own addition; the spec describes only the wordmark, and I judged that on a page people reach in a bad moment the phone number should be visible without scrolling.

## The saved state

UX.md F4 says "save continuously. Make returning obvious and make the saved state visible." The brief forbids JavaScript, so I cannot actually save anything. What I can do is design the surface that a real implementation would drive: a persistent status bar directly under the header that reads "Saved" with a check mark, and a sentence saying the report can be left and picked up later. It is rendered in its saved state, which is the state it would be in almost all of the time.

The bar uses `--brand-tint`, which DESIGN.md line 17 calls a "quiet highlight," with `--ink` text and an ink check mark. I did not color the check green, because DESIGN.md line 23 reserves brand green for the primary action and the logo.

Returning is only obvious if people know how to return, so the mobile number field in step 2 carries a hint saying we text a link back to the report. That is the mechanism F4 implies; if claims operations cannot text that link, the copy has to change.

## Component decisions made before writing markup

Inputs follow DESIGN.md line 61: 48px tall, `--r-sm`, 1px `--line-strong` border, `--surface` fill, `--s3` padding, and the label always sits above the field. No placeholders anywhere on the page, because line 62 says the label is "never inside it as a placeholder," and placeholder text that vanishes on focus is exactly the wrong thing for someone filling this out one handed at a roadside.

Hint text sits between the label and the field rather than under it, so it is read before the person starts typing. DESIGN.md reserves the space below the field for the error message.

Radios and checkboxes are real inputs, but drawn with `appearance: none` and a styled sibling span. DESIGN.md line 67 flags exactly why: "Native radios and checkboxes ignore it," meaning the outline focus treatment the system requires. Since line 85 says every interactive element has a visible focus state, the control has to be one I can put an outline on. Each choice row is at least 44px tall to meet line 89.

## The running promise about being wrong

UX.md F5 says people "believe an error on the report will cost them the claim" and stall on questions they cannot answer, and it requires that we "allow 'I don't know' on any factual question" and "say plainly that details can be corrected later."

I did that in two places rather than one. A sentence sits at the top of the form, above step 1, saying nothing here is final and anything can be corrected. Then every factual question that has a fixed set of answers carries a "not sure" or "I don't know" option as a real choice, sitting last in the group. It is a real option, not a hidden escape, because F5 says the fear is of being wrong rather than of answering.

## Step 1, photos

First substantive step per F2. Four separate file inputs rather than one, because the categories tell people what to shoot without making them read a paragraph: their vehicle, the other vehicle or property, the wider scene, and the other driver's license and insurance card.

That last one is doing real work for F1 and F2 together. A photo of the other driver's insurance card is faster and more accurate than typing an insurer name and policy number at a roadside, so the corresponding text fields in step 5 are all marked optional and the hint there says a photo is enough.

Under the inputs is a short list of what helps most, in plain terms: four corners of each car, close view of each dent, both license plates, one wide shot. That is general claims knowledge on my part, not something in the materials.

I added a checkbox for "I could not take photos." Photos being first must not become photos being a wall. That is my judgment, following the spirit of F5.

I left `capture` off the file inputs deliberately. It can restrict some phones to the live camera only, and someone filing an hour later needs the photos already in their camera roll.

## Step 2, about you

The identification set is name, mobile number, email, date of birth, and home ZIP code. F1 says to identify people by "something they carry in their head," and those five are all recall, not retrieval. Together they are enough for a claims system to match a policy with reasonable confidence, which is my own judgment about what a match needs.

The policy number is the last field in the step, labeled optional, with a hint saying leaving it blank does not slow anything down. F1 calls asking for it first "the single largest cause of abandonment we have measured," so it stays present but demoted.

## Step 3, when and where

Date and time of the accident, with a checkbox reading "I do not know the exact time" directly under the time field. F5 names time as one of the three things people stall on.

Location is street or nearest intersection, city, a two-letter state code in a short text input, and ZIP. The state field is a short text input with `maxlength="2"` and an uppercase transform, per the publishing pipeline rule against writing out a list of US states. There is also an optional "landmark or nearest exit" field for people who are on a highway and have no address to give.

Conditions are a checkbox group rather than a text field: dry, wet, snow or ice, fog, dark, and not sure. Multiple answers are legitimate here, and tapping beats typing at a scene.

## Step 4, your vehicle

Year, make, model, license plate, and plate state, then the facts an adjuster needs before the call: where the damage is, whether the car can be driven, whether airbags deployed, where the car is now, roughly how fast the person was going, and who was driving.

Damage location is a checkbox group including "windshield or glass," using the US term required by DESIGN.md line 77, and ending in "not sure yet."

Speed is a set of ranges, not a number field. F5 names speed as a stall point, so asking for an exact figure invites people to freeze. Ranges plus "I do not know" let them answer honestly.

I deliberately did not ask for a repair cost estimate anywhere on the page. F5 names damage estimates as the third stall point, and the estimate is the adjuster's job. The page collects the facts an estimate is built from instead.

"Can the car be driven" ties back to the "what happens next" panel, which tells people that answering no here is how a tow gets arranged. That link is the point of asking.

## Step 5, other people

Injuries come first, because it is the most important fact on the page. The options are "no one that I know of," "yes," and "not sure," which is F5 applied to a question people genuinely cannot answer at the scene. The follow-up field is optional and asks who and how they are, in those words.

Number of other vehicles is a small radio group rather than a number input. Then the other driver's details, all optional, with a checkbox for "I do not have the other driver's details," since people leave scenes without them.

Police presence is yes, no, or not sure, and the report number is optional with a hint saying we can request it later. Witness details are one optional field, because a witness name and phone is usually all anyone has.

## Step 6, what happened

Last on the page and optional, per F2: "written description is optional and comes last."

Before the text area I put a single radio group of common situations: hit from behind, hit another vehicle from behind, intersection, lane change, parked, animal or object, something else, not sure how to describe it. That is my own addition. F2 says people at a scene "cannot compose a paragraph," and picking the closest of eight sentences gives the claim a usable shape even when the text area stays empty.

The text area is labeled optional, and its hint says plain words are fine and it can be added to later.

## Submitting

One primary action, per DESIGN.md line 23: a brand-filled "Send report." Next to it, a secondary button in the specified style for texting a link to finish later, which is the F4 return path made explicit at the moment someone is most likely to bail.

Above the buttons is a single unchecked confirmation box. I softened its wording to "everything here is true as far as I know, and I can correct it later," which keeps the attestation an insurer needs while avoiding the exact fear F5 documents. If legal requires harder language, this is the line they will want to change, and the fear it creates is measured in F1 and F5 terms.

Below the buttons, the claims line again for anyone who would rather talk to a person.

## Footer

Kept to the company name, the claims line, and a note that it is open 24 hours. Nothing else belongs on a page someone is filling out at a roadside.

## Decisions made while writing the markup

**The color of a selected control.** This is the one place where DESIGN.md pulls in two directions. Line 23 says brand green is for the primary action and the logo. Line 17 assigns `--brand-tint` to selected states. A tinted dot inside a tinted box would be invisible, so the selection has to be carried by something darker. I resolved it by giving the checked mark an `--ink` fill with a white dot or check, and tinting the whole choice row with `--brand-tint`. Green stays on the one primary button and the wordmark, the selected row still reads as brand green, and the mark itself has real contrast. A dark checkbox with a light check is a common and legible pattern, so I do not think this costs anything.

**Accent as text.** I wanted to set "call 911 first" in `--accent` and checked the contrast first. #C2610F on white computes to about 4.2:1, under the 4.5:1 that normal text needs. So accent appears only as the 3px left rule and the alert icon, both of which clear the 3:1 that non-text needs, and the words stay in `--ink`. DESIGN.md states the AA case for text on brand at line 87 but says nothing about accent, so this is my own check.

**No error state on the page.** DESIGN.md line 63 specifies the error treatment, and I built none. Every control here is empty, so any error shown would be invented, and a red border on a blank form is exactly the message UX.md F5 says drives people off. The pattern is specified well enough for whoever wires up validation.

**Marking optional rather than required.** No asterisks and no "required" markers. Optional fields say "(optional)" next to the label and everything else is simply expected. F5 says people are afraid of getting it wrong, and a page dense with required markers reads as a test. I also left the `required` attribute off the controls, since this is a static mockup with no submission handling and native blocking would misrepresent how the real page should behave, which is to accept a partly filled report.

**Value attributes.** The only `value` attributes on the page are the option identities on radios and checkboxes, which are what makes a choice group a working control rather than decoration. No text, date, or file input carries a value, no control is checked, and there are no placeholders, so the page renders completely empty.

**Two column rows.** Rows split into columns only above 600px and stack below it, which is where most of this traffic will be given F1 says ninety-one percent of reports are filed away from home. While building I found that a hint under one label in a row pushed its input out of line with its neighbor, so in paired rows the guidance moved into the label itself, which is why the state fields read "State (2 letters)" instead of carrying a hint line. That also keeps the two-letter state field working as the publishing pipeline requires, with `maxlength="2"` and an uppercase transform, and no list of states anywhere on the page.

**Focus.** One rule sets the specified 2px `--focus` outline with a 2px offset and the soft ring behind it, on links, buttons, text inputs, and text areas. For radios and checkboxes the outline is moved onto the styled sibling span, since the real input is transparent and stacked over it. Every interactive thing on the page has a visible focus state, per DESIGN.md line 85.

**What the missing JavaScript costs.** Two things on this page are drawn but inert: the saved bar and the "text me a link to finish later" button. Both are the surface of F4, and both need a back end to mean anything. They are in the mockup because the copy and the layout have to be designed around them, not bolted on later.

**Copy I could not verify.** The timings in the "what happens next" panel, the tow and rental line, and the wording of the confirmation checkbox are all written to be plausible and plain. They are the parts of this page that describe what Keystone will actually do, and none of them came from the materials, so claims operations and legal need to confirm or replace them before this ships. The phone number, the 911 reference, and the US spelling conventions all come from DESIGN.md lines 76 to 78.

