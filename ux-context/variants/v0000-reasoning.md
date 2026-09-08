# Reasoning: auto accident report page

## What I have to work from

The only material in the folder is DESIGN.md. It is explicit that it covers appearance and not behavior: "It says how things should look, not how they should work." So every color, type size, spacing step, radius, and component shape on this page comes from that file, and every decision about what the form asks for is mine, from general knowledge of how a US auto insurer opens a claim. I say which is which as I go.

## The job the page has to do

The PM asked for a page that "collects everything we need to open the claim." In US insurance that is a first notice of loss. My own knowledge of what a carrier needs to open an auto claim and assign an adjuster: who the policyholder is and how to reach them, the policy number, when and where the crash happened, what happened, who was driving, whether anyone was hurt, whether police responded and under what report number, the insured vehicle and where the damage is, the other vehicle and its driver and insurer, witnesses, and photos. That list is the outline of the page.

## One page, but sectioned

Kept to one page as asked. A flat run of sixty fields is hard to hold in your head, so I grouped them into ten numbered cards, in the order a person naturally tells the story: policy and contact, when and where, police, my vehicle and its damage, who was driving, injuries, the other party, witnesses, photos, then review and send. DESIGN.md gives me a Card component ("--surface fill, radius --r-md, --shadow-card, --s5 padding") so cards are the sanctioned way to make groups visible. Numbering the sections is my own call: it gives someone a sense of how much is left without a JavaScript progress bar, which I am not allowed to use anyway.

## Safety notice at the top

Before any field I put a short notice: if anyone is hurt, call 911, and the claims line is 1-800-555-0142. Both numbers are given in DESIGN.md under Writing: "Emergency number is 911. Claims line is 1-800-555-0142." Putting it above the form is my judgment. Someone filling out an accident report may be at the roadside, and the most useful thing the page can do in the first two seconds is tell them to stop typing if there is an injury.

Color for that notice: I used --accent (#C2610F), which DESIGN.md assigns to "attention, in-progress status." I deliberately did not use --danger, because that file says "Danger red is for errors and nothing else. Never use it for emphasis." I also paired the accent with an icon and the words themselves so the notice does not depend on color, per the rule "Never communicate meaning with color alone. Pair it with a word or an icon."

## Header

Built exactly as specified: 64px tall, --surface background, 1px --line bottom border, wordmark left. The wordmark is the word "Keystone" in --brand at --t-title weight 650 followed by an 8px --brand square with 2px radius. That is a literal read of the Header section of DESIGN.md. I added "Mutual" after the mark in --ink-soft at label size, since the PM called the company Keystone Mutual and the wordmark spec only covers the word "Keystone" plus the square. That addition is my own, kept quiet in weight and color so the specified mark still reads as the mark.

## Fields, labels, and hints

DESIGN.md: "Label sits above the field, never inside it as a placeholder." I took that further and used no placeholder attributes at all. Where a field needs a format example (VIN, plate, report number) it gets a hint line under the label in --t-small and --ink-soft. A placeholder would also have been wiped out the moment someone typed, and the brief asks for controls left empty, so hint text is both on brand and more durable.

Marking required versus optional: most fields on a loss report are required, so tagging the many would be noise. I tagged the few optional ones with the word "Optional" instead. That is my call. It follows the spirit of "Never communicate meaning with color alone," since the marker is a word rather than a colored asterisk.

## State field

Per the publishing pipeline note, no list of US states anywhere. Every state field is a short text input capped at two characters with a hint that says two-letter code. Four places need one: the policyholder mailing address, the accident location, the driver license issuing state, and the other driver's plate state. Each of those inputs sits in a narrow column so its width signals a short entry.

## Colors I chose not to use

--focus is in focus rings only and never as a fill or text color, per DESIGN.md. --danger appears nowhere on this page, because the mockup ships with empty controls and no error state to show. I considered rendering one field in its error state to demonstrate the pattern, and decided against it: an error on a blank field would be a lie about the state of the form, and the brief asks for a clean empty mockup. The error styling in DESIGN.md is therefore defined in the stylesheet but not applied to any field.

One primary action on the screen, as required: the submit button. The "Save and finish later" control next to it uses the specified secondary treatment (--surface fill, --line-strong border, --ink text), so the count of primary actions stays at one.

## Decisions that came up while building

**Radios and checkboxes.** DESIGN.md warns under Focus that "Native radios and checkboxes ignore it," meaning the specified outline plus ring will not render on a native control. Since the file also states as a hard rule that "Every interactive element has a visible focus state," I could not leave them native. I rebuilt both with appearance:none and drew the box, the circle, the dot, and the check mark in CSS. They are still real input elements of type radio and checkbox, so the mockup keeps genuine form controls, and now they take the outline and the ring exactly as specified.

**Selected state versus the boundary rule.** Two rules pull against each other for a checked control: "The boundary of every interactive control uses --line-strong," and "--brand-tint: selected states." I resolved it by splitting the two surfaces. The choice row keeps its --line-strong boundary at all times and fills with --brand-tint when selected. Only the small box or circle inside flips to a --brand fill, because a check mark or dot needs contrast against its own background and the tint is far too pale to carry a white mark. That is my reading of the intent, not a line I can point to.

**Choice rows rather than bare radios.** Each option is a full bordered row with a 48px minimum height. That satisfies "Tap targets are at least 44px in both directions" and makes the whole row clickable rather than just the 20px circle. Sizing comes from the scale.

**The :has() selector.** The selected tint uses .choice:has(input:checked), which needs no JavaScript. In a browser without :has the row simply keeps its white fill and the checked dot still shows, so the selected state never depends on that one selector alone. That is the same idea as the color-alone rule: the shape carries the meaning, the tint is reinforcement.

**Damage diagram.** This is the one piece of imagery, and it is inline SVG per the brief. I drew a plain top view of a car in outline, filled with --canvas and --surface and stroked in --ink-soft, then laid the eight damage checkboxes around it on a CSS grid whose cells match the physical positions: front across the top, rear across the bottom, driver side at the left, passenger side at the right, corners in the corners. Someone can find the spot they were hit by looking rather than reading. The SVG is aria-hidden and every area is also a plain worded checkbox, so nothing is lost without the picture. On narrow screens the grid reflows and the car moves to the top. Choosing to build this rather than a plain checklist is my own call; the shape and colors follow DESIGN.md.

**Vocabulary.** DESIGN.md is specific about US usage: "License plate, not number plate. Windshield, not windscreen. Parking lot, not car park." All three of those words appear on this page, and each is on the US side: "License plate" as a field label, "visible through the windshield on the driver side" in the VIN hint, and "Parking lot" as a location option. Sentence case throughout for headings, labels, and buttons, no title case, and no exclamation marks, per the Writing section. The one all caps element is the "Auto claim" overline, which that section permits.

**Selects.** DESIGN.md gives no dropdown component, so I extended the Input spec to it: same 48px height, same --r-sm radius, same --line-strong border. The chevron is drawn with CSS borders on a wrapper pseudo element rather than an image file, which keeps the page free of any external request and of data URIs. Every select opens on an empty "Select one" option, so nothing is preselected.

**Required versus optional, revisited in place.** Once written out, the optional fields cluster in the later sections, which reads well: the top of the form is the hard requirement, the bottom is whatever the person managed to collect at a chaotic scene. I leaned into that with the section subheads, for example "Fill in whatever you have. Missing details will not hold up your claim." That reassurance is my own writing, based on how these forms are abandoned when someone hits a field they cannot answer.

**No validation attributes that fight an empty mockup.** The form carries novalidate and no required attributes. With no JavaScript and no server, marking fields required would only produce a browser error bubble on submit, which is behavior the mockup is not meant to demonstrate. Requirements are communicated in words instead, through the "Optional" tags.

**Two buttons, one primary.** Submit is the single --brand filled button on the page, per "One primary action per screen." "Save and finish later" is the specified secondary treatment. A ten section form is long enough that people will leave partway through, so an explicit way out matters; making it secondary keeps the visual hierarchy honest.

**Header addition.** I put the claims phone number in the page footer and again in the closing paragraph, not in the 64px header. DESIGN.md fixes the header at "Keystone wordmark left" and 64px tall, and I did not want to load it with a second element it does not describe.

**Type and spacing.** Every size on the page is one of the five type steps, every gap is a step on the 4 to 64 scale, and there are no arbitrary pixel values except inside the SVG path data and the small optical offsets that position the check mark and the dot inside their own boxes. Body text is 16px and labels are 14px, the floors DESIGN.md sets.

**Layout width.** Content maxes out at 880px with --s5 gutters. DESIGN.md does not specify a measure, so this is my judgment: wide enough for a twelve column field grid to pair short inputs like city and state side by side, narrow enough that the prose intro stays near a comfortable line length, which I capped separately at 60 characters.
