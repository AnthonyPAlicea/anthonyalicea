# Reasoning

## The conflict I had to resolve first

The PM says "keep it to one page." UX.md W2 says "one decision per screen. Every screen must survive being abandoned mid-answer and returned to cold." Those pull in opposite directions, so I picked a reading of both that I can defend.

One page, single column, but the page is built as a stack of numbered step cards, each roughly one phone screen tall, each with its own heading and a "Step N of 6" marker. On a phone in a single column, a card that fills the viewport behaves like a screen. The step marker is there so that someone who looked away for forty seconds (W2: "people looking away from the screen every twenty to forty seconds") can find their place cold without reading the whole page. That is my judgment about how to honor W2 inside a one page constraint, not something either material states.

## Order of the page

The order is dictated by the findings, not by what is convenient to collect.

1. Safety, then "what happens next," before any field. UX.md F3: "say what happens next, on the page, before asking for anything." F3 also says roughly a third of calls to the claims line ask only this, so this block is doing real work, it is not throat clearing.
2. Photos. F2: "photos are the first substantive step." I am reading that literally, so photos come before the person's name. The tradeoff is real: if someone abandons after step 1 we have no way to reach them. I accepted it because F2's mechanism is time sensitive in a way that contact details are not, "At the scene they can point a camera. They cannot compose a paragraph," and the scene gets cleared while a phone number does not. I put the contact step immediately after and kept it to four fields to keep that exposure short.
3. Contact details, no policy number. F1: "never require a policy number to begin. Identify people by something they carry in their head." So name, mobile, email, and the ZIP on the policy. Policy number appears as an explicitly optional field near the bottom of that card with a line saying we can find the policy without it.
4. When and where, then the vehicle, then what happened.
5. Free text description last and optional. F2: "Written description is optional and comes last."

## Persistent state strip

UX.md F4 wants saved state visible, W4 wants people told plainly when something has not been sent, W5 wants the report timestamped visibly. I gave all three one thin sticky strip under the header: a status dot, "Saved on this device. Not sent yet," and the time the report was started. Sticky rather than placed once, because F4's failure mode is a person who does not believe their answers survived the interruption. It is the only sticky element, and the 64px header scrolls away, because W1 says phone first and I did not want to spend a third of a phone viewport on chrome.

The timestamp is rendered display text, not a form value, so it does not violate the empty controls requirement. Date format follows DESIGN.md Writing: "Dates read as July 25, 2026."

## Tokens

Everything visual comes from DESIGN.md verbatim: the color block, the type scale, the space scale, the radii, the shadow, the ring. Font stack is declared as written, "Inter", system-ui, and so on, with no font loaded, so the page falls back to a system face. That satisfies the no external requests rule with no change to the declaration.

## Reading of "no preselected choices"

I kept `value` attributes on radios, checkboxes, and select options, because for those controls the value is the identity of the choice rather than sample data, and stripping them would make the controls meaningless. Nothing is `checked` or `selected`, no text input carries a value, and every select opens on an empty placeholder option. That is my reading of the requirement.

## Header and safety notice

The header is exactly what DESIGN.md specifies under Components: "Keystone wordmark left, --surface background, 1px --line bottom border, 64px tall," with the wordmark as the word Keystone in brand at 20px weight 650 followed by an 8px brand square at radius 2px. I wanted to put the claims phone number in the header, because on a roadside that is the most valuable thing on the page, but the spec describes the header as the wordmark and nothing else, so I put the number in the safety notice, the send block, and the footer instead. That is a deliberate choice to follow the spec over my instinct.

Above everything else on a car accident form there has to be a line about calling 911, and DESIGN.md Writing fixes that number: "Emergency number is 911." My first instinct was to make it red. DESIGN.md forbids that twice, "Danger red is for errors and nothing else. Never use it for emphasis." So the notice is a normal card with a 4px left rule in --accent, which the token comment describes as "attention," plus a warning triangle icon and a heading that says the thing in words. That also satisfies the rule "Never communicate meaning with color alone. Pair it with a word or an icon." As it turns out, --danger appears nowhere on the finished page, which I think is correct: an empty mockup has no errors to show.

## What happens next

Four numbered items answering F3's actual question, "what is going to happen to them, their car, and their day": a claim number immediately, a call within one business day, a tow or a rental if they need it, and permission to change their story later. The fourth item is doing double duty for F5 ("People are afraid of getting it wrong") and W5 ("People change their account of events once they are calm, and that is normal and expected"), so I said that in plain words on the page rather than treating it as an internal policy.

I avoided promising anything about money or coverage, since I have no material telling me what Keystone covers. Item 3 says we start on it today, not that it is free.

## Step 1, photos

The photo control is a large dashed target with a camera icon and a secondary button. It is secondary, not brand green, because DESIGN.md says "One primary action per screen" and the primary on this page is Send report. The real file input is visually hidden and driven by its label, which is the standard way to get a decent looking file control with no JavaScript. The focus indicator is drawn on the surrounding box using focus-within, so tabbing to the hidden input still shows a visible ring, which the Rules section requires of every interactive element.

The list of useful shots is mine, from general knowledge of what an adjuster needs: corners, damage close ups, the other plate, the street and its signals, a wide shot, and road conditions. I hedged every one of them with "if you can get them safely" and told people not to walk back into traffic, because W1 puts these people at a roadside.

The card ends with permission to skip. W3 says "never block progress on a document," and while photos are not a document, the same logic holds, and F2 would be self defeating if a photo step became a wall.

## Step 2, how we reach you

Four fields, three of them optional, and the policy number is the last one with an explicit line telling people to skip it. That is F1 followed literally: "never require a policy number to begin." The ZIP on the policy is there as the cheap identity match that F1 asks for, "something they carry in their head."

The card opens with the one line that I think does the most work on the whole page: only a name and a phone number are required, everything else can be blank or a guess. F5 says people "stall on questions they cannot answer exactly." Saying so once, early, is cheaper than reassuring them field by field. I still marked optional fields with a small Optional tag rather than marking required fields with asterisks, because on a page where almost everything is optional the asterisk convention reads backwards.

## Step 3, when and where

Date and time sit side by side, with a checkbox under them saying "I am not sure of the exact time." F5 names time explicitly as a stalling point, so the escape hatch is right where the stall happens rather than buried in a hint.

The location is a street or nearest intersection, a city, a two letter state code, and an optional ZIP. The state field is a short text input with maxlength 2, which is the publishing rule about never writing out a list of states, and it also happens to be the right call for W1, since a fifty item picker one handed in glare is miserable.

## Step 4, your car

Year, make, model, and license plate, using "License plate" because DESIGN.md Writing insists on it: "License plate, not number plate." The card opens by saying a guess is fine if the registration is locked in the car, which is W3, "Insurance card in the glovebox of a car that may be undrivable."

Two questions here exist purely because of F3. "Can your car still be driven?" and "Do you need help today?" with tow, rental, and a ride as checkboxes. F3 says people ask what happens to their car and their day before they ask about money, so the page should let them ask for the tow rather than making them call the claims line to get one. Every question in this card has an "I do not know" or "I am not sure yet" option, per F5's constraint to "allow I don't know on any factual question."

## Step 5, what happened

Ordered from what they can answer without thinking to what takes composure: injuries, police, other vehicles, other driver, then the scenario list, then damage location.

The scenario radio list is my main piece of invention. F2's stated mechanism is "At the scene they can point a camera. They cannot compose a paragraph," so I gave the crash description as a set of ten prewritten sentences to pick from, including "Something else" and "I do not know." Picking one is the same order of effort as pointing a camera. If the finding is right about why free text fails, this should capture most reports without anyone writing a word. "Backing up or maneuvering in a parking lot" uses parking lot, not car park, per DESIGN.md Writing.

Damage location is checkboxes with "I cannot tell," which is F5 again, this time on damage estimates.

The other driver block is entirely optional and says so, with a line telling people not to argue with anyone to get the information. That is my own judgment about roadside safety, not something in the materials, and I think a claims form is allowed to give that instruction.

The injury follow up mentions that pain often shows up hours later and that reporting it then changes nothing. That is F5 fear management applied to the one question where a wrong answer feels most consequential.

## Step 6 and the send block

The free text box is last, labeled optional, and framed as something they can come back and write tonight. F2: "Written description is optional and comes last."

The send block states plainly that the report is a legal record and that the arrival time can matter for coverage, which is W5, then immediately says corrections are expected afterward. I deliberately did not add an "I confirm this is accurate" attestation checkbox. It is a common pattern on claims forms and it would work directly against F5, which says people already believe an error will cost them the claim.

Two buttons: Send report as the one brand filled primary, and Finish later as a secondary. Finish later is there for W2, "Every screen must survive being abandoned mid-answer," and it pairs with the sticky saved strip so that leaving feels like a supported action rather than a loss.

## Component and cleanup decisions, made last

Radios and checkboxes are drawn with appearance none, and the row label is a 48px tall card. DESIGN.md's Focus note says the outline plus ring pattern is required and warns that "Native radios and checkboxes ignore it," so the focus indicator is drawn on the whole option row with focus-within. It also gets the tap target past the 44px minimum in the Rules section, with room to spare.

I first drew the checked dot and checkmark in brand green, then took it out. DESIGN.md says "Brand green is for the primary action and the logo," and it gives a separate token for exactly this case, "--brand-tint: selected states, quiet highlights." So a selected option is a tint background with an ink colored mark and an ink border. Green is now only on the wordmark, the links, which the Components section sanctions as text buttons, and the single Send report button.

Field labels use --t-label at 14px as specified. Group questions like "Was anyone hurt?" are set at 16px with the label weight of 550, which combines two values already on the scale rather than inventing a size, because a question that governs four options needs more presence than a field label, and 20px title type would have made the page a third longer.

I moved every inline style attribute into utility classes so the file has no styling outside the single style block, and I checked the finished file for em dashes, en dashes, external references, and any prefilled control. There are none. The only value attributes are on radios, checkboxes, and select options, and the selects open on an empty placeholder option.
