# Reasoning log: report a crash, single page

## Page order, decided before anything else

UX.md F3 says "say what happens next, on the page, before asking for anything," and notes roughly a third of calls to the claims line ask only this. So the first thing under the heading is a short "What happens next" block, not a field. UX.md F2 says "photos are the first substantive step. Written description is optional and comes last," so the form opens with photos and closes with an optional free text box. That puts identity in second position, which felt odd to me at first, but F2 is stated as a constraint on what gets built, so the research wins over my instinct.

The resulting order: safety note, what happens next, saved state strip, then photos, how we reach you, when and where, your car, the other driver, anyone hurt, police and witnesses, what happened in your words, send. One scrolling page as the PM asked, with no wizard, which also suits F4 since there are no steps to lose.

## Identity without a policy number

UX.md F1: "never require a policy number to begin. Identify people by something they carry in their head." So the second section asks for name, date of birth, mobile number, email, and home ZIP code, all of which a person knows without looking anything up. Policy number is present but last in that section, tagged optional, with the hint telling people not to go looking for it. That combination is my judgment about how to keep the field available for the people who do have it without letting it read as a gate.

## Naming and wording

Every visible noun comes from the UX.md glossary. The page says report, crash, your car, the other driver, damage, and "the person handling your claim." No FNOL, no loss, no third party, no adjuster, no deductible. Where money comes up in the what happens next block I used the glossary's plain phrase "what you pay" rather than "deductible," per the glossary row for that term. The confirmation line in that block is "We got it," taken directly from the glossary row that says to say it the way a person would.

DESIGN.md Writing says US English and US conventions, so the page says license plate, windshield, parking lot, 911, and the claims line 1-800-555-0142. Headings, labels, and buttons are sentence case, and there are no exclamation marks, per the same section. Per the publishing note I used no em dashes or en dashes anywhere.

## Color and the safety note

Tokens are copied verbatim from the DESIGN.md Color block into `:root`. Two rules shaped the page more than the rest. First, "Danger red is for errors and nothing else. Never use it for emphasis," so the "call 911 first" notice at the top is not red, even though red is the reflex for it. I gave it `--accent`, which DESIGN.md defines as "attention, in-progress status," and paired the color with an alert glyph and the word so meaning never rides on color alone, per the Rules section. Second, "Focus blue appears only in focus rings," so `--focus` appears in exactly one CSS rule group and nowhere as a fill or text color.

Brand green is on the logo, the send button, and the step number badges. Badges are `--brand-tint` fill with `--brand` numerals, which reads as brand without adding a second filled action, keeping "One primary action per screen" intact.

## Type and spacing

Font stack is the DESIGN.md `--font` line as written. Inter will resolve only if the reader already has it locally, since no external requests are allowed on this page; the stack falls through to system-ui, which is what I expect most readers to get. The five type sizes are the ones in the Type block and nothing else. Body sits at 16px and labels at 14px, which is also the floor DESIGN.md sets. All spacing values come from the s1 to s8 scale, per "Spacing uses the scale. No arbitrary pixel values."

## Controls

DESIGN.md Input: 48px tall, `--r-sm`, 1px `--line-strong` border, `--surface` fill, `--s3` inner padding, and "Label sits above the field, never inside it as a placeholder." Because of that last clause I used no `placeholder` attributes at all on the page. Anything a placeholder would have carried became either a real label above the field or small hint text under it.

`--line-strong` is #8A8A8A, which computes to about 3.4:1 against white, so it clears the 3:1 that a control boundary needs. That is why the Rules line reserving it for interactive boundaries works, and why `--line` at #DCE3EA is only on the header rule, the card header divider, and the footer rule, all decorative.

Focus follows the DESIGN.md Focus component exactly: a 2px `--focus` outline at 2px offset with `--ring` behind it. DESIGN.md also warns that "Native radios and checkboxes ignore it." My answer is to wrap every radio and checkbox in a bordered row and put the focus treatment on the row using `:focus-within`, so the visible indicator is drawn on an element that does respect outline and offset. Those rows are 48px minimum, which also satisfies the 44px tap target rule, and they give the choices a real hit area on a phone at the roadside.

I avoided `select` entirely. Part of it is the brief, since a select always has something selected and the mockup must carry no preselected choices, but mostly a select is a poor control on a phone with one hand, and every list here is short enough to sit out in the open as radios.

## Saved state

UX.md F4: "save continuously. Make returning obvious and make the saved state visible." There is a strip above the form with an in progress dot and the word, plus "Saved a moment ago," and a sentence saying the page saves as you type and that we text a link that brings you back with your answers still there. The saved line is repeated next to the send button because that is the moment people worry about losing what they typed. This page has no JavaScript, so those are static, but they are the states the built page should show.

## Photos section

F2 again. The photo panel comes first, uses a real `input type=file` with `multiple` and `accept="image/*"` so a phone opens the camera roll, and carries a short shot list, since at the scene people can point a camera but do not know what we need pictures of. The shot list content is my own general knowledge of what an auto claim needs: all four corners, the other plate, the wide scene, the road, the windshield. There is a checkbox for "I cannot take photos right now" so the section is never a wall, which is F5 applied to a step rather than a question.

## Header and the claims line

DESIGN.md Header specifies the wordmark left, surface background, 1px `--line` bottom border, 64px tall, and the wordmark itself as "Keystone" in `--brand` at title size weight 650 followed by an 8px brand square with 2px radius. I built exactly that, with the square as a styled span rather than an image so it stays crisp and costs no request. I made the header sticky, which is my own call: on a long single page the claims line should stay reachable, and F3 is partly about giving people an exit to a human. The number, 1-800-555-0142, is the one in DESIGN.md Writing. It sits on the right at small size with a phone glyph next to the words, never icon alone, per the Rules line about icon-only controls.

## Letting people say "I don't know"

UX.md F5 names time, speed, and damage estimates as the specific places people stall, and says to allow "I don't know" on any factual question and to say plainly that details can be corrected later. So:

Time has both a time input and a separate "I am not sure of the time" checkbox. Speed is optional, capped at a rough guess, and has "I do not know how fast I was going" underneath. Damage has "Not sure yet" as the last checkbox in the list. Whether the car is drivable has "I am not sure." Road type and conditions both end with "Not sure." Every section subhead repeats some version of "close is close enough," and the send block says it once more in full.

I deliberately did not ask for a dollar estimate of the damage anywhere. F5 lists it as a stall point, and the person handling the claim can produce that number better than a shaken driver at the roadside can.

## Section 3 and 4 field choices

Location is street or nearest intersection, city, state, ZIP. Per the publishing note, state is a short text input capped at two characters with a "Two letters" hint and uppercase styling, not a list. ZIP for the crash site is optional because people often do not know the ZIP of a road they were driving down.

Section 4 asks year, make, model, license plate, plate state, where the damage is, whether it can be driven, and where the car is right now. The drivable question carries a subline saying a "no" starts towing immediately, which is the promise made in item 3 of what happens next, repeated at the moment it becomes actionable. "Who was driving" includes "Nobody, it was parked," which is a common enough case that leaving it out would force people to lie or stop.

The list of damage locations uses windshield, license plate, and parking lot rather than the British equivalents, per DESIGN.md Writing.

## The other driver

The heading and every label in section 5 says "the other driver" and "their car," per the glossary row that rules out third party and adverse party, with the note that "third party" tested as meaning a company rather than a person. The section opens with a checkbox for "No other driver was involved," so the single car crashes and the parked car in the lot do not have to scroll past nine irrelevant fields. The plate field says a photo of the plate counts, which ties back to section 1 and gives people permission to leave it blank.

## Anyone hurt, police, witnesses

Section 6 leads with the injury question because it changes how fast we move, and it offers "I am not sure yet" alongside yes and no. The subhead says aches that show up tomorrow are common and can be reported then, which is F5 applied to the one question people most fear answering wrong. Section 7 is marked optional in its subhead in full: it speeds things up when we have it and costs nothing when we do not.

## What happened, in your own words

Last, and tagged optional in the heading, per F2: "Written description is optional and comes last." The subhead tells people to stop whenever they want and says the person handling the claim will go through the rest on the phone, so the empty box does not read as an obligation.

## Send block

One primary action on the page, the green "Send my report" button, per DESIGN.md Color: "One primary action per screen." Next to it, "Save and finish later" is the secondary style from the Button component, surface fill with a `--line-strong` border and `--ink` text, which serves F4 by making leaving a deliberate, supported act rather than an abandonment. Above the buttons is the plainest statement of F5 on the page: nothing is final, any answer can be corrected, and a blank line will not cost you your claim. Below them the saved state repeats, because that is where the fear of losing work peaks.

## Two small visual calls

Hover on a choice row is `--canvas`, not `--brand-tint`, so hover can never be mistaken for selection. Selection is the tint plus a `--brand` boundary plus the control's own check mark, which keeps meaning off color alone per the DESIGN.md Rules. The injury textarea got a shorter minimum height than the free text box in section 8, since a few words is what the label asks for and a tall box silently asks for more.

## Verification pass

Checked the finished file for the things that would break the brief or the house rules: no em dashes or en dashes, no exclamation marks, no `http`, `@import`, or `url()` so nothing leaves the page, no script tags or event handlers, no `placeholder` attributes, no `value` attributes anywhere, and nothing carrying `checked` or `selected`, so every control renders empty. `:checked` appears once, as a CSS selector for the selected style. All ids are unique, every `for` resolves, and the controls without ids are the radios and checkboxes wrapped inside their own labels. No list of states appears; both state fields are two character text inputs.
