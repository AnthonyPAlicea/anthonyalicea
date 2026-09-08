# Reasoning: report a crash, one page

## What the page is

The PM asked for one page that collects everything needed to open a claim. So this is a single long form, not a wizard. I am writing it as one document with numbered parts so a person can see how much is left, since a single scroll with no progress cue is the main thing that makes long forms feel bottomless. No JavaScript is allowed anyway, so a real multi step flow was never on the table.

## Naming and words

The page is called "Report a crash". UX.md's glossary says say "report" and not "First Notice of Loss, FNOL, claim submission", and say "crash" and not "loss event, incident, occurrence". The primary button is "Send my report" for the same reason. Section 5 is titled "The other driver" straight from the glossary row that rejects "third party". Section 6 is "Anyone hurt" rather than "Injuries", following UX.md's closing line: "When there is a choice between the industry word and the word a person on the roadside would use, use theirs."

In the closing panel I wrote "what you pay toward the repair" rather than the word deductible, per the glossary row for "what you pay". I never use the word deductible on the page, so I never owe the reader the definition UX.md requires alongside it. The same panel says "the person handling your claim" instead of adjuster, again from the glossary.

## Tokens and the shell

I transcribed the DESIGN.md color, type, space, and radius blocks into CSS custom properties verbatim so nothing drifts. Everything on the page pulls from those variables, including the 4px accent rule on the emergency callout, which uses `--s1` rather than a loose 4px, because DESIGN.md says "Spacing uses the scale. No arbitrary pixel values."

Header is built to the DESIGN.md Components spec: "Keystone wordmark left, `--surface` background, 1px `--line` bottom border, 64px tall", with the wordmark as the word Keystone in brand green at title size weight 650 followed by an 8px brand square at 2px radius. I made the header sticky. That is my own call: the page is long, and the claims phone line stays reachable while someone scrolls. I put the claims line 1-800-555-0142 from DESIGN.md's Writing section on the right of the header, since a person filling out a crash report is the single most likely person to want to call instead.

Page background is `--canvas`, content sits in `--surface` cards at `--r-md` with `--shadow-card` and `--s5` padding, exactly the Card spec.

## Emergency callout, first thing on the page

Before any field, a callout says to call 911 if anyone is hurt. DESIGN.md's Writing section fixes the emergency number as 911. I used `--accent` for it, not `--danger`, because DESIGN.md says "Danger red is for errors and nothing else. Never use it for emphasis" and describes accent as "attention". The callout carries a warning triangle in inline SVG and the words "If it is an emergency" so the meaning does not rest on the orange, per the rule "Never communicate meaning with color alone. Pair it with a word or an icon."

## What you will need

My own judgment, not from the materials: a short list of what to have handy before starting. On a long form the worst outcome is someone getting to part 7, discovering they need a police report number, and abandoning. The list is plain HTML, in a quieter card than the form sections.

## Field pattern

DESIGN.md's Input spec says 48px tall, `--r-sm`, 1px `--line-strong` border, `--surface` fill, `--s3` inner padding, and "Label sits above the field, never inside it as a placeholder." I took that further and used no placeholder attributes at all. Where a field needs an example or a nudge, it is a hint line between the label and the input, wired with `aria-describedby`, so it survives being read aloud and does not vanish the moment someone types.

Optional fields are labeled with the word "Optional" rather than marking required fields with an asterisk. Most fields here are required, so marking the minority is less visual noise, and a word beats a symbol whose key is somewhere else on the page.

State is a two letter text input with a hint and uppercase styling, per the publishing rule against writing out a list of states.

## Radios and checkboxes

DESIGN.md's Focus spec warns that "Native radios and checkboxes ignore" the outline. So I set `appearance: none` on both and rebuilt them: a `--line-strong` boundary as the Rules section demands for interactive controls, a brand fill plus white inner ring when checked, and a CSS drawn check mark for checkboxes. Because they are no longer native replaced controls, they take `outline: 2px solid var(--focus)` with `outline-offset: 2px` and the `--ring` halo, which is what the Focus spec asks for.

Each choice sits in a bordered row that is its own label, minimum 48px tall, which satisfies "Tap targets are at least 44px in both directions" and gives a much bigger hit area than a 20px circle. When a row is checked its background goes to `--brand-tint`, which DESIGN.md assigns to "selected states". That is done with `:has()`, so if a browser lacks it the control still reads correctly from the filled radio itself.

I avoided select menus everywhere. A select always has something selected, and the brief requires no preselected choices, so radio groups in fieldsets with legends are both more honest to the requirement and easier to answer on a phone.

## Part 1, policy and contact

Policy number first, because it is the key that finds everything else, and the hint tells the person where to look for it rather than assuming they know. Name is split into first and last so it maps to a record. Phone and email both, with hints that say what each is actually for, since asking for two contact methods without a reason reads as data harvesting. "Best way to reach you" closes the part, worded around the person handling the claim rather than around our routing rules.

## Part 2, when and where

Native date and time inputs. They are real controls, they are empty by default, and the browser handles the format, which keeps me out of trouble with the US date convention DESIGN.md sets out. The section note gives permission to estimate, because a person who cannot remember whether it was 4:10 or 4:25 will otherwise stall there.

Address is street, then city, state, and ZIP on one row at wider widths. The place type is a radio grid: street, highway, intersection, parking lot, driveway, somewhere else. DESIGN.md's Writing section is explicit that we say parking lot, not car park, and windshield, not windscreen, so both appear in their US forms.

Weather and road conditions are checkboxes and marked optional. Adjusting fault later often turns on rain or a dark road, so it is worth asking, but nobody should be blocked by it.

## Part 3, what happened

The free text box comes before the mechanical questions in this part, because that is what a person arrives wanting to say. The hint gives them a shape to fill in: direction of travel, what they saw, what happened after. The section note says this is what the person handling the claim reads first, which is both true and an argument for writing more.

Who was driving includes "Nobody, it was parked", because a parked car being hit is a very common report and a two option question would trap those people. Occupant count asks them to count the driver, since that ambiguity produces bad data.

## Part 4, your car and the damage

Year, make, model, plate, and the plate's state, again as a two letter text input per the publishing rule. I ask for the car even though the policy number implies it, because policies carry more than one car and picking the wrong one delays everything.

Damage is a checkbox grid of body areas rather than a text box. It is faster on a phone, it produces something a person handling the claim can sort on, and it includes "Not sure yet" so a person standing in the dark is not forced to guess. A free text box under it catches the things a diagram cannot: airbags, leaks, warning lights, a door that will not open.

Drivable, towed, and where the car is now are three separate questions because they drive three different next actions, and people answer them differently than you would expect. Somebody whose car is drivable may still have had it towed.

## Part 5, the other driver

Nearly every field here is optional. That is deliberate and it is my own call: a person who did not get the other driver's insurance card should not be stopped from filing at all, and the alternative is people inventing plausible looking numbers to get past a required field. The section note tells them to skip the part if no other car was involved, and where to put a second or third driver, since single vehicle crashes and pileups both exist and neither fits a fixed set of fields.

"Did the other driver stay at the scene" is asked plainly, with "No, they left" as an option, because a hit and run changes how the claim is handled and people do not always volunteer it. Its hint points them to part 7 for the police question rather than adding a branch here, since there is no JavaScript to reveal one.

## Part 6, anyone hurt

The lead question is answerable three ways, including "Not sure", because adrenaline hides a lot at the roadside. The section note nudges people to say something even when it seems minor and explains why, rather than just insisting. Who was hurt is a checkbox list that includes a person walking or biking, which a car focused list would miss.

"Did anyone get medical care" replaces the usual ambulance yes or no. Checked out at the scene, taken by ambulance, and went in on their own later are genuinely different, and the last one is the case people forget to report.

## Part 7, police, witnesses, photos

Three related but separate things share a part because none of them is big enough for its own, and all three are evidence rather than facts about the crash. Divider rules between them use `--line`, which DESIGN.md reserves for "decorative dividers and rules only", while every control boundary on the page uses `--line-strong` per the Rules section.

The photo field is a real multiple file input, empty, styled only as far as CSS allows. I styled `::file-selector-button` to match the secondary button spec so the native control does not stick out. The hint lists which shots are actually useful, because "add photos" produces one blurry bumper and nothing else. The section note says blurry ones still count, which is true and lowers the bar to acting.

The final open box catches the overflow: extra drivers, a dash camera recording, anything the fields did not anticipate.

## Closing panel and the actions

The "What happens next" panel sits in `--brand-tint`, which DESIGN.md lists for "selected states, quiet highlights", so it reads as calm rather than as another alert. It uses UX.md's language directly: the confirmation screen is described as a "we got it" screen from the glossary row for "we got it", and the person who calls is "the person handling your claim", not an adjuster. I wrote "what you pay toward the repair" instead of deductible.

I deliberately did not invent a service level, like a callback within one business day, because nothing in the materials states one and a claims page is the wrong place to make up a promise. The 1-800-555-0142 number and 911 are the only facts I asserted, both from DESIGN.md's Writing section.

One primary action, "Send my report", in brand green with white text, per "One primary action per screen" and the Button spec. Next to it a secondary in surface fill with a `--line-strong` border for saving and finishing later, which a form this long needs. Below both, a plain sentence about the report being true as best they know, which is the honest version of an attestation, plus a way to correct it later.

## Voice and mechanics across the whole page

Sentence case for every heading, label, and button, and the only uppercase is the small "Part n of 7" overline, which is the exception DESIGN.md allows. No exclamation marks anywhere. US spelling and US words throughout: license plate, windshield, parking lot, color. No em dashes or en dashes anywhere in the page text, per the publishing rule.

No placeholder attributes, no value attributes, no checked or selected attributes, so every control ships empty. No JavaScript, no external requests, no web fonts. The type stack names Inter first and falls back to system-ui, so a machine with Inter installed gets it and nothing is fetched. The one drawing on the page, the warning triangle, and the small circle icon in the closing panel are inline SVG in currentColor.

Layout is one column on a phone, since a person may well be filling this in on the roadside, and pairs up to two or three columns only above 640px where the fields are genuinely short. Text blocks are capped near 62ch for readability. Every field is a real label bound to a real control, radio groups are fieldsets with legends, and each section is a landmark labeled by its own heading.

## Two layout fixes at the end

Column widths are fractions, not pixels, so nothing arbitrary creeps into the layout: city gets twice the width of state and ZIP, year gets less than make and model, plate gets twice the width of the state on it.

Because some fields in a row carry a hint line and their neighbors do not, the inputs in a row would otherwise sit at different heights. Each field in a multi column row is a flex column with the control pushed to the bottom, so the input boxes line up across the row while the labels stay put at the top.

