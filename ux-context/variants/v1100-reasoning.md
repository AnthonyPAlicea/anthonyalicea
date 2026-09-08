# Reasoning log: car accident report page

Written as I go, in the order the decisions were made.

## Reading the brief first

The PM asked for one page that collects everything needed to open a claim and looks
like it belongs to our product. My two source files pull in different directions and I
want to be explicit about how I resolve that before I write anything.

DESIGN.md is the visual system and it is prescriptive: fixed tokens, fixed component
specs, "Spacing uses the scale. No arbitrary pixel values." UX.md is a set of research
constraints that dictate order and content, and it is equally prescriptive: "Each
finding is a constraint on what gets built, not a note in a report."

So DESIGN.md decides what things look like, UX.md decides what appears and in what
order. Where they conflict I say so and pick, below.

## Page order

The order comes almost entirely from UX.md, not from the usual insurance form order.

1. Safety notice (911)
2. What happens next
3. Saved draft status
4. Photos
5. Who you are
6. When and where
7. Your car and its damage
8. The other driver
9. Injuries
10. Police and witnesses
11. Anything else, in your own words
12. Send

F3 says "say what happens next, on the page, before asking for anything," so the
what-happens-next block sits above the first field. F2 says "photos are the first
substantive step. Written description is optional and comes last," so the camera step
is step 1 of the form and the free-text box is the last step. F1 says never require a
policy number to begin, so identity comes after photos and asks for things a person
carries in their head.

The 911 notice is above all of that, and that is my own judgment rather than anything
in the files. A person may open this page at the roadside sixty seconds after a crash.
Nothing on the page should outrank "is anyone hurt." DESIGN.md gives 911 as the
emergency number in its Writing section, so the number itself is from the file.

## Numbered steps rather than one long form

U1 says treat every person as a first time user and choose "guidance over efficiency.
No shortcuts, no power-user affordances." U4 says the median claimant is 52 and a
meaningful share have reduced vision or tremor. So the form is broken into eight
numbered, titled cards, each with a plain sentence under the title saying why we ask.
More sections, each smaller, each explained. That is a deliberate trade of density for
comprehension, and it is also why the page is long: the brief said one page, not one
screen.

Cards use the DESIGN.md Card spec exactly (surface fill, --r-md, --shadow-card, --s5
padding). The step number badge is a 32px rounded square in --brand-tint with --brand
text. I made it a rounded square using --r-sm rather than a circle because the radius
tokens stop at 16px and a circle would need a value outside the scale.

## Type sizes: where I depart from the smaller end of the scale

DESIGN.md sets --t-body at 16px and --t-small at 13px, and says body never goes below
16px and labels never below 14px. U4 asks for large text.

I read the type block as floors, not as an instruction to use the smallest token
available. So: field labels are 16px at the 550 weight of --t-label (DESIGN.md itself
sets the precedent for this in the Button spec, "label --t-label at 16px"), and help
text under a label is --t-body 16px rather than --t-small 13px, because help text is
the part a first-time user actually needs to read. --t-small is used only for the
overline and the footer, which carry nothing a person must read to finish the report.

## Color: the two places the palette fought back

DESIGN.md says danger red is for errors and nothing else, "Never use it for emphasis."
The 911 notice is emphasis, not an error, so it is not red. I built it as a --surface
card with a 4px --accent left rule (4px is --s1, so still on the scale) and an --accent
phone icon, with the text itself in --ink. --accent is defined as "attention,
in-progress status," which is exactly what that block is.

I also kept --accent out of body-size text. Measured against white it computes to
roughly 4.2:1, which is under the 4.5:1 AA needs for text at these sizes, so accent
appears only as a rule, an icon fill, and a border. That contrast check is my own work,
not something stated in the files, but it follows the spirit of DESIGN.md, which
already does this kind of arithmetic out loud for the focus ring.

--brand on white computes to about 7.9:1, so brand-colored text and white-on-brand
buttons are both safe.

## Focus, radios, and checkboxes

DESIGN.md is unusually specific here: outline 2px solid --focus at 2px offset plus
--ring as a halo, "The ring on its own is not enough," and "Native radios and
checkboxes ignore it."

So every choice is a full-width tile: a label element with a --line-strong border,
--r-sm radius, at least 48px tall, wrapping the native input. The tile carries the
focus treatment via :has(input:focus-visible), which puts a visible 2px outline on
something that definitely renders it, while the input keeps its own outline rule as a
fallback. Checked state tints the tile --brand-tint and turns its border --brand, but
the native control's own dot or check is still there, so meaning is never carried by
color alone (DESIGN.md Rules).

Every control boundary is --line-strong. --line appears only on the header rule, the
footer rule, and dividers, per "the boundary of every interactive control uses
--line-strong. --line is for dividers that carry no meaning."

## No placeholders, no selects

DESIGN.md: "Label sits above the field, never inside it as a placeholder." So there are
no placeholder attributes anywhere. That also keeps the mockup honestly empty.

I used no select elements at all. That is my judgment from U4: dropdowns are the worst
control for tremor and for one-handed phone use, and every choice on this page is short
enough to be radios or checkboxes. The one place a dropdown is traditional is the state
field, and our publishing rule already says to use a two-letter text input instead.

## Saving

F4 says save continuously and make the saved state visible. There is no JavaScript on
this page, so I show the state rather than implement it: a persistent strip above the
form with a "Saved" chip and a plain sentence saying answers are kept on this device,
that an interruption will not lose them, and that nothing reaches Keystone until the
send button is pressed. U3 says nobody wants an account, so the return path is a text
message link tied to the phone number they are already giving us in step 2, not a
login. I say that in the help text on the phone field so the promise and the field sit
together.

## Header and intro

The header is the DESIGN.md Header spec with nothing added: wordmark left, --surface,
1px --line bottom rule, 64px. The wordmark is exactly what the spec describes, the word
"Keystone" in --brand at 20px weight 650 followed by an 8px --brand square at 2px
radius. I wanted to put the claims phone number in the top right and did not, because
the spec describes the header contents and I would rather be recognizably the product
than clever. The number appears twice lower down instead, in the 911 notice and the
footer.

The overline above the h1 is the one all caps element DESIGN.md permits, and it is one
of only two places I use 13px text.

The lede says "about ten minutes" and "you do not need your policy number to start."
Both are there for F1: the abandonment cause is people believing they cannot start
without a document they do not have, so the denial has to be visible before the first
field, not buried on the field itself.

## What happens next, four items rather than three

F3 says roughly a third of calls to the claims line ask only this question, so the
block is a full card, not a sentence. Four items: the claim number, the specialist
call, the damage inspection, and fault.

The fourth item is there because of U2, not F3. U2 records that "many believed a claim
would raise their rate regardless of fault," so fault anxiety is in the room whether we
mention it or not. I answer the process question, that we work it out later from the
photos and the police report, and say plainly that the form is not a legal statement. I
deliberately did not promise anything about rates, because that is not a promise a
front end can make and the page would be lying.

Insurance terms in this block are explained where they appear, per U2's "no term
appears without a plain explanation next to it, the first time and every time." Claim
number is "simply the file number for your accident." Claims specialist is "the person
at Keystone who takes your accident from here." I avoided deductible, liability, and
comprehensive entirely rather than write a glossary, because a glossary is a second
thing to read and U1 rules out anything that assumes a person will go hunting.

Each item has a small stroke icon in a --brand-tint tile. The icons are decorative and
aria-hidden. They exist because four dense paragraphs with no visual anchor is exactly
what a frightened person skips, but every icon sits beside a heading that carries the
same meaning in words, per the DESIGN.md rule against meaning in icon or color alone.

## Step 1, photos

F2 puts the camera first, so step 1 is a file input with accept="image/*" and multiple,
which on a phone offers the camera directly. The help text names four shots in plain
words, including "the parts that look fine," which is my own knowledge of how damage
claims work rather than anything in the files.

Photos are marked optional and I say "blurry photos are still useful." F5 says people
stall because they fear an error will cost them the claim, and a required upload at the
roadside is the sharpest possible version of that fear.

## Step 2, identity

Name, mobile number, email, date of birth, and then policy number last and optional.
F1 says "identify people by something they carry in their head," and name plus date of
birth is the pair that actually finds a policy record. The policy number field stays,
because a few people do have it and removing it would leave them hunting for somewhere
to put it, but it is last, marked optional, and its help text says in so many words
that leaving it blank changes nothing about the claim.

Only three fields on the whole page are required: name, mobile number, and the date of
the accident. I used the real required attribute rather than faking it, and marked each
one with the word "(required)" beside the label, because DESIGN.md says never
communicate meaning with color alone and the same principle rules out a bare asterisk,
which U1 says we cannot assume will be recognized. Optional fields say "(optional)" for
the same reason.

## Step 3, when and where

The time field is paired with a real checkbox, "I am not sure of the exact time." F5
names time as one of the three things people stall on, so the way out is a control and
not a note. The same idea repeats as an "I am not sure" option in every choice group
below.

The location help text offers an example of a non-address answer, because a person on a
highway shoulder often cannot name the road. That is my judgment.

State is a two-letter text input with maxlength 2, per our publishing rule against
writing out a list of states. The hint sits below the row rather than inside the field,
since placeholders are ruled out by DESIGN.md.

Road and light conditions are standard first-report data and are checkboxes, including
an "I am not sure" tile.

## Step 4, the car and the damage

This is where F5 does the most work. It names time, speed, and damage estimates as the
three stalling points, so:

Speed is a band, not a number, with "I was parked or stopped" and "I am not sure" as
real options, and the help text says out loud that nobody can judge this accurately.
Damage severity is asked in plain sight words, from "scuffs and scratches" up to "heavy
damage, or the airbags went off," with no dollar figure anywhere on the page. I wrote
"nobody at Keystone expects a number, and this answer is not an estimate of anything"
because F5 says people believe a wrong number will be held against them, and the only
thing that removes that belief is being told directly.

The damage location question is a grid of eleven checkbox tiles next to a small top
down car drawn in inline SVG, in --brand-tint with an --ink-soft outline. The drawing is
aria-hidden and carries no information the tiles do not: every zone is named in words.
It is there because "front left corner" versus "driver side" is ambiguous in prose and
a shape resolves it instantly. I did not make the drawing clickable, which was
tempting, because U4 rules out small targets and DESIGN.md rules out icon-only controls
for anything a person can get wrong.

"Can the car still be driven" is here rather than lower down because the tow is the
most time-critical thing on the page. The what-happens-next block promises we will call
about a tow first and points at step 4 by number, so the promise and the question stay
connected.

I used --ink-soft rather than --line-strong for the car outline. --line-strong is
defined in DESIGN.md as the boundary of an interactive control, and this drawing is not
interactive, so borrowing that color would have implied something false.

## Step 5, the other driver

The step opens with checkboxes rather than fields, including "No other vehicle was
involved" and "The other driver left before I got their details," and the intro tells
those people to skip to step 6. With no JavaScript I cannot hide the fields, so the
escape route has to be stated in words at the top, which is also the more robust
pattern for U4's one-handed and low-vision readers.

Every field in this step is blank-tolerant by design and the intro says so. The license
plate gets its own help line calling it the most useful thing on the page, because it
is the one item that lets us find everything else, and a person who knows that is more
likely to go back and photograph it.

Their policy number is asked for here while ours is optional in step 2, which looks
inconsistent but is not: F1 is about the barrier to starting your own report, and the
other driver's card was in your hand five minutes ago or it was not.

## Step 6, injuries

Yes, no, and "I am not sure yet." The prompt says "even slightly" and the intro says
aches often turn up the next morning, which is my own knowledge, not from the files.
U2 found people believe reporting things works against them, so the line "telling us
now commits you to nothing and costs you nothing" is there to counter that directly.

## Step 7, police and witnesses

Deliberately low pressure. "Not having one is common and it does not weaken your claim"
answers the fear F5 describes, and the witness field says "please do not go looking for
a witness now," because a form should not send someone walking around a crash scene.

I left out any question about tickets or citations. That is a judgment call against
completeness: it raises exactly the fear F5 documents, at the moment a person is least
able to handle it, and the specialist can ask on the call once there is a human on the
line.

## Step 8, the words

F2 is explicit that "written description is optional and comes last," so it is step 8,
labeled optional, and the intro says plenty of people send the report without writing
anything here. The help text removes the format anxiety: no right format, spelling does
not matter, leave out what you are unsure of.

The best-time-to-call question is tucked in here because it is the last thing that
matters before sending and it belongs with the promise of a call.

## Send

DESIGN.md says one primary action per screen, so there is exactly one --brand button,
"Send my report." "Save and finish later" is the Secondary spec, surface fill with a
--line-strong border and --ink text, which keeps it clearly available for F4 without
competing.

Directly above the buttons is the F5 sentence in full: every answer can be changed
later, here is the number, and getting something wrong today does not cost you your
claim. It repeats what the top of the page said, on purpose, because the moment of
pressing send is when the fear returns.

Below the buttons, one line repeating what happens immediately after, which is F3
again at the point of action.

## One late correction

I had built the saved-draft strip with the same heavy --accent left rule as the 911
notice, and side by side they read as equally urgent, which is wrong: one is a safety
instruction and the other is a reassurance. I took the rule off the saved strip and
left it as a quiet --surface panel with a --line border, keeping the --accent check
icon so the "in-progress status" meaning DESIGN.md assigns to that color is still
carried. The accent rule now appears exactly once on the page, on the 911 notice.

I did not reach for --brand for the saved state, even though a green tick is the
obvious convention, because DESIGN.md says brand green is for the primary action and
the logo, and the only primary action here is the send button.

## Things I checked at the end

No JavaScript, no external requests of any kind, no fonts loaded (the font stack names
Inter and falls back to system-ui, exactly as DESIGN.md writes it, but nothing is
fetched). The only imagery is inline SVG.

Every control is empty: no value attributes on any text field, no placeholders, nothing
checked or selected. Radios and checkboxes do carry value attributes, since that is
what identifies a choice in HTML and it cannot prefill anything, but no choice is
preselected.

No em dashes or en dashes anywhere in the page. No exclamation marks, per DESIGN.md.
Sentence case on every heading, label, and button. US spelling and US terms throughout:
license plate, windshield, parking lot, 911, and the claims number written as
1-800-555-0142.

No list of US states anywhere. Both state fields are two-character text inputs.

Tap targets: inputs and buttons are 48px tall, choice tiles are at least 48px, so
nothing falls under the 44px minimum in DESIGN.md Rules. Nothing on the page depends on
hover, nothing is timed, there is no drag interaction, and there are no small close
buttons, per U4.
