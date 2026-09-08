# Reasoning log: report a crash, one page

Written in the order the decisions were made.

## The first conflict: one page vs. one decision per screen

The PM asked for one page. UX.md / World model W2 says "one decision per screen. Every screen must survive being abandoned mid-answer and returned to cold." Those pull against each other, and I cannot satisfy both literally.

I resolved it by treating a vertical scroll on a phone as a stack of screens. The page is a single column with one numbered section per card, roughly one card per phone viewport, generous space between them, and a heading on every card that re-establishes context for someone who looked away. W2's real requirement is that a person returning cold can tell where they were and what is being asked, and a card with a number, a title, and nothing competing for attention does that on a scroller as well as it does on a wizard. What I lose is the wizard's forced pacing. What I gain is that nothing is hidden behind a Next button that a dropped connection (W4) could break.

## Order of the page: what happens next comes first

UX.md F3: "say what happens next, on the page, before asking for anything." So the first block after the title is a "what happens next" card, and it sits above every field. F3 says roughly a third of claims line calls ask only this, so it is not decoration, it is the thing that stops the phone call.

I put a 911 line above even that. Nothing in the materials says to, so this is my own judgment: an insurer's crash page that does not say to call 911 first if someone is hurt is negligent. DESIGN.md / Writing fixes the emergency number as 911.

## The 911 line is not red

My instinct was danger red for the 911 note. DESIGN.md / Color forbids it: "Danger red is for errors and nothing else. Never use it for emphasis." So the safety note is a bordered card with an ALL CAPS overline, which DESIGN.md / Writing permits ("no all caps except in a small overline"), and the emphasis comes from position and border weight rather than color. This is the rule doing its job. If red meant urgency here it would mean less when a field is actually wrong.

## No policy number gate

UX.md F1: "never require a policy number to begin. Identify people by something they carry in their head." So section 2 asks for name, mobile number, and email, all of which people know cold. Policy number appears as an optional field at the bottom of that same section with the label saying we can find them without it. Deleting the field entirely would be worse: the person who does have it in an email wants to give it, and F1 only bans requiring it.

I put identity second, not first. F2 says photos are the first substantive step, and I read "first substantive step" literally.

## Photos are section 1

UX.md F2: "photos are the first substantive step. Written description is optional and comes last." So the first thing asked for is photos, and the free text box describing the crash is the last thing on the page and is labeled optional. F2's reasoning is that at the scene people can point a camera but cannot compose a paragraph, so the page has to be finishable with a camera alone.

The photo input carries a "photos on your phone" file control and a checkbox for adding them later, because W3 ("never block progress") extends naturally to anything that needs the person to be standing in a particular place.

## "I don't know" on every factual question

UX.md F5: "allow 'I don't know' on any factual question. Say plainly that details can be corrected later." F5 names time, speed, and damage estimates as the places people stall. So:

- Time of the crash gets a "not sure of the time" checkbox next to the time field.
- Location gets a landmark field for people who cannot give a street address.
- Is your car drivable is yes / no / not sure.
- Was anyone hurt is yes / no / not sure.
- Were police there is yes / no / not sure.
- Damage areas include a "not sure yet" choice in the same checkbox list.

I did not ask for speed at all. F5 lists it as a stall point, and nothing in the materials says the claim needs it to open, so the cheapest way to honor F5 there is to not ask. A person who wants to say it can put it in the optional description at the end.

The "you can correct this later" promise appears twice, once in the what happens next card and once directly above the send button, because F5 says to say it plainly and W5 says the page itself must say corrections stay possible after submission.

## Saved state and the timestamp

UX.md F4: "save continuously. Make returning obvious and make the saved state visible." W4: "Tell people plainly when something has not been sent yet." W5: "timestamp the report visibly."

This is a static mockup with no JavaScript, so I cannot actually save anything. What I can do is show the surface that a real implementation would drive: a status bar pinned directly under the header that states the report is saved on this device, that it has not been sent yet, and when it was started. It uses --accent, which DESIGN.md / Color assigns to "attention, in-progress status," and it pairs the color with the words "saved" and "not sent yet" plus an icon, because DESIGN.md / Rules says never to communicate meaning with color alone.

The started timestamp is written in the page as text in the July 25, 2026 format DESIGN.md / Writing mandates. It is not a form value, so it does not violate the empty-controls requirement.

## Words

Straight from UX.md / Glossary: the page says report, crash, the other driver, your car, damage, what you pay, the person handling your claim, we got it. Nowhere does it say FNOL, loss, incident, third party, insured vehicle, adjuster, or deductible. The heading is "Report a crash" and the button says "Send report."

The what happens next card says "the person handling your claim will call you," which is the glossary's replacement for adjuster and also answers F3's actual question, which is what happens to them and their day.

DESIGN.md / Writing: sentence case everywhere, no exclamation marks, US spellings. So the page says license plate, windshield, and parking lot, and the damage checklist uses windshield rather than windscreen.

## Sections, in this order

1 Photos, 2 How we reach you, 3 When and where, 4 Your car, 5 The other driver, 6 Damage, 7 Injuries and police, 8 Anything you want to tell us.

Eight cards is more cards than a desktop form would need, but each one is short enough to sit in a phone viewport with its own number and title, which is the compromise described at the top. The order runs from what a person can do standing at a car with a phone in one hand toward what needs a document or a memory, so the further down you get, the more skippable it becomes. That is W3 ("never block progress on a document") applied to sequence rather than to a single field.

## The tow checkbox

Not asked for anywhere in the materials. I added "I need help getting my car towed" because F3 says the question people actually have is what happens to their car and their day, and a checkbox that changes what the first phone call is about answers that question better than another paragraph of reassurance does.

## Colors I did not use

No red anywhere. There are no error states in this mockup, so --danger appears in the token block and nowhere else, which is the correct amount for a page with no errors on it. Inventing a filled-in error state would also have meant putting sample data in a field.

Focus blue appears only in outlines and the halo, never as text or fill, per DESIGN.md / Color.

--accent carries the saved status, since DESIGN.md assigns it to "in-progress status." I used it for the icon only and left the words in --ink and --ink-soft. #C2610F on white computes to about 4.2:1, under the 4.5:1 that 13px and 14px text needs, so as a text color it would have been a quiet accessibility failure. The icon plus the words "Saved" and "Not sent to us yet" carry the meaning, which is what DESIGN.md / Rules asks for anyway.

## Focus on radios and checkboxes

DESIGN.md / Focus warns that "native radios and checkboxes ignore it." So every radio and checkbox sits inside a bordered row and the row takes the focus treatment with :focus-within: a 2px --focus outline at 2px offset plus --ring behind it. The indicator is drawn on something that can actually render an outline. The rows are also 48px minimum, which covers the 44px tap target rule with room to spare for a shaky hand at the roadside (W1).

## No placeholders anywhere

DESIGN.md / Input: "Label sits above the field, never inside it as a placeholder." I went further and used no placeholder attributes at all. Where a field needs an example, it gets a hint line under the label in --t-small, which stays on screen after the person starts typing. Someone interrupted every twenty to forty seconds (W2) will come back to a half typed field, and a placeholder would be gone exactly when they need it.

## No dropdowns

There is not a single select element on the page. Year, make, and model are text inputs. This partly follows from the state rule (the state field is a two-letter text input with maxlength 2, autocapitalize on, and an autocomplete hint) and partly from W1: a native select on a phone is a modal wheel that needs a deliberate two-step gesture, and text inputs with inputmode and autocomplete let the keyboard and the browser's own autofill do the work.

## Nothing is marked required in the markup

The form carries novalidate and no field has the required attribute. F1 and W3 both say never to block, and a browser validation bubble that stops a submit at the roadside is a block. Instead the page says in words, in section 2, that a name and a number are all we need, and the send card says to send it with blanks in it. The stakes of a report that arrives half empty are lower than the stakes of one that never arrives, which is what F1's abandonment finding is about.

## One primary action

DESIGN.md / Color: "One primary action per screen." Send report is the only --brand filled button on the page. Save and finish later sits under it in the secondary style, white with a --line-strong border. The photo controls are labels styled as secondary buttons wrapping real file inputs, so they are visibly a rung below the send button and the file inputs stay real, focusable controls rather than decoration.

## Radio and checkbox value attributes

The empty-controls rule bans value attributes carrying sample data. Radios and checkboxes still have value attributes, because for those controls the value is the identifier of the option, not prefilled user data. Every text input, date, time, and the textarea is genuinely empty, no option is preselected, and no checkbox is checked.

## What is faked, and what a real build would do

Three things on this page are static text standing in for behavior: the saved on this phone strip, the started timestamp, and the promise that the confirmation will show an arrival time. F4, W4, and W5 are all requirements about behavior rather than layout, and with no JavaScript allowed I can only show the surface they would drive. I wrote them as the copy a real implementation would put there rather than leaving them out, so the page is a truthful picture of the intended product and the missing piece is clearly the wiring.
