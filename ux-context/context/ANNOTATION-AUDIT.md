# Context-impact annotation audit

Reviewed September 8, 2026. Each of the sixteen pages was checked individually against its own design log and assigned context. Only `data-ux` attributes in the generated HTML were changed. Page copy, controls, styles, defects, and original reasoning logs remain unchanged.

## How to read the annotations

- A link is retained when the log attributes the implemented choice to supplied context, or the element directly expresses a requirement from that context.
- A logged interpretation can be debatable or only partly implemented. An annotation records that connection; it does not certify compliance, accuracy, or working behavior.
- A choice can also follow DESIGN.md, the common prompt, or the publishing constraints. An additional UX rationale in the log is evidence of a connection, not proof the context was necessary or the sole cause.
- Missing context is never credited. Repeated instances of the same choice are represented selectively, rather than placing a ring on every label or checkbox.
- Ring placement was narrowed where a container included unrelated decisions. Page-wide layout and absent features are described in this audit when a local ring would be misleading.
- Save messages, start times, and promised submission timestamps are static mockup content. The logs do not establish that saving or submission works.

The user's request to audit and remove unsupported annotations supersedes CLAUDE.md's instruction to retain every `data-ux` attribute. Its protections for the raw page content and logs were followed.

## v0000

[Page](../variants/v0000.html) · [Original design log](../variants/v0000-reasoning.md)

No annotations. No UX.md was supplied. The log explicitly distinguishes DESIGN.md, the PM request, and the model's own judgment. Its safety notice, optional details, and save button cannot be attributed to withheld UX sections.


Annotated elements: 0 before, 0 after.

## v0001

[Page](../variants/v0001.html) · [Original design log](../variants/v0001-reasoning.md)

Keep all five original G1 links. Naming and words explicitly supports the title, other-driver heading, Anyone hurt heading, and submit label; Closing panel and the actions supports the next-steps wording. In particular, Anyone hurt is supported by the log even though it is not a literal glossary-table row.

Changes (evidence headings refer to this version's design log):

- `part-4` (Your car and the damage): **unmarked → G1**. Add the glossary wording "Your car". The log's Naming and words section describes applying the glossary; this heading directly uses its preferred term.

Annotated elements: 5 before, 6 after.

## v0010

[Page](../variants/v0010.html) · [Original design log](../variants/v0010-reasoning.md)

Keep W1 on the safety notice (What goes at the very top); W4/W5 on the status (Save state and W5 shows up in four places); W3 on the policy field (Marking optional rather than required); W3/W4 on deferred photos (the same section and Photos are a real file input and explicitly deferrable); W5 on the closing correction promise. No user-model IDs are available.

Changes (evidence headings refer to this version's design log):

- `sec-head` (1 About you): **unmarked → W2**. Add the numbered section heading. The tension I have to resolve before anything else explicitly links numbered cards to recovering after interruption.
- `description-hint` (Write what you remember now, in your own words. It does not have to be complete or tidy. You ca): **unmarked → W5**. Add the description's correction promise. W5 shows up in four places explicitly names this hint.
- `police-report-hint` (These often take a few days to be issued. Send the report without it and add it later.): **unmarked → W3**. Add the optional police-report explanation. Marking optional rather than required explicitly says this document can arrive later.
- `confirm-copy` (This report becomes part of the record for your claim, and the time you send it can matter for ): **unmarked → W5**. Add the legal-record and submission-time explanation. It directly matches the supplied W5 context.
- `btn btn-secondary` (Save and finish later): **unmarked → W2 W4**. Add Save and finish later. One primary action explicitly attributes this secondary action to W2 and W4.

Annotated elements: 5 before, 10 after.

## v0011

[Page](../variants/v0011.html) · [Original design log](../variants/v0011-reasoning.md)

Keep G1 on the title and damage hint (The words); W1/W2 on the safety notice (The 911 notice, above everything explicitly cites both); W4/W5 on the status; W4 on photos; W3 on the policy field. Keep W2/W5/G1 on the numbered next-steps block: What happens after you send this explicitly explains all three. Its operational promises are not established facts about an insurer.

Changes (evidence headings refer to this version's design log):

- `contents-heading` (On this page What happened Was anyone hurt Police Your car The other driver Photos Other damage): **unmarked → W2**. Add the On this page navigation. The one-page instruction versus one decision per screen explicitly explains it as a way to resume after interruption.
- `hint-police-report` (It is usually on the slip the officer hands you. If you do not have it, leave this empty and we): **unmarked → W3**. Add the police-report hint. Part by part, item 3 explicitly attributes its optional status to W3.
- `part-5` (Part 5 of 8 The other driver All of this is optional. Fill in whatever you already have. Do not): **W3 G1 → unmarked**. Move the mixed W3/G1 ring off the entire other-driver section to its heading and opening guidance.
- `h-part-5` (The other driver): **unmarked → G1**. Move G1 to The other driver. Part by part, item 5 explicitly cites the glossary for this heading.
- `p` (All of this is optional. Fill in whatever you already have. Do not go back into traffic and do ): **unmarked → W3**. Move W3 to the paragraph explaining that missing paperwork must not block the report. Part by part, item 5 cites W3.
- `btn btn-secondary` (Finish this later): **unmarked → W2**. Add Finish this later. Sending explicitly cites W2 for this button.
- `fineprint` (We record the time you send this, and that time can matter for your coverage, so send it as soo): **unmarked → W5**. Add the closing record, timestamp, and corrections paragraph. Sending explicitly cites W5.

Annotated elements: 8 before, 13 after.

## v0100

[Page](../variants/v0100.html) · [Original design log](../variants/v0100-reasoning.md)

Keep U2/U3 on the introduction (Vocabulary and Before you start), U1 on the Required explanation (Marking required fields), U2 on the policy hint (Vocabulary), and U4 on the damage controls (Section 3, your vehicle, and the car diagram). The required policy number remains unchanged: explaining a term is separate from deciding whether it must be provided.

Changes (evidence headings refer to this version's design log):

- `p` (If you do not know an answer, leave it blank and keep going. A claims specialist, the person at): **unmarked → U2**. Add the claims-specialist definition. Vocabulary explicitly names this explanation.
- `section-head` (1 About you): **unmarked → U1**. Add the numbered section heading. Shape of the page explicitly attributes this structure to U1.
- `field` (Add photos or documents from this device The most useful shots are the damage on each car up cl): **unmarked → U4**. Add the native photo picker. Section 6, photos explicitly rejects dragging under U4 and specifies a large native control.
- `sec-send` (8 Send your report What happens after you send this: The next screen shows your claim number. W): **U1 → unmarked**. Move U1 from the entire send card, which also includes an attestation and submit control, to the next-steps list.
- `steps-next` (The next screen shows your claim number. We also email it to you if you gave us an email addres): **unmarked → U1**. Move U1 to the explanation of next steps. Section 7, and then section 8, sending describes this guidance for first-time users.

Annotated elements: 5 before, 8 after.

## v0101

[Page](../variants/v0101.html) · [Original design log](../variants/v0101-reasoning.md)

Keep G1 on the title, contact hint, and other-driver heading (What the page is called and how it talks); U1 on the preparation card and other-driver instructions (The shape of the page and Which questions the page asks); U2 on the policy explanation; U1/U4 on visible choice rows (Controls I chose and controls I refused); U1/U2/G1 on next steps (The shape of the page and What happens after you send this). Narrow the introductory U2 claim as listed below.

Changes (evidence headings refer to this version's design log):

- `lede` (Answer what you can and we will open your claim. You do not need an account and you do not need): **U1 U2 U3 → U1 U3**. Remove U2 from the opening reassurance: saying insurance words are unnecessary does not explain a term. Keep U1 for guidance and U3 for the explicit no-account statement. The actual policy-number and deductible explanations already carry U2.
- `lede` (This is one page. Nothing is kept until you send it, so it is best to finish in one sitting. If): **unmarked → U3**. Add the no-save paragraph. The shape of the page explicitly cites U3, together with the no-JavaScript constraint, for omitting save and login. This records the model's interpretation, not a requirement that drafts must be lost.
- `step` (1): **unmarked → U1**. Add the first step marker. Sections are numbered 1 to 9 explicitly explains orientation for first-time users.
- `photos-hint` (Photos let the person handling your claim see what you saw. The most useful ones are the damage): **unmarked → U1 G1**. Add the photo guidance. File input for photos explicitly cites U1; the hint also directly uses the glossary's preferred name for the person handling the claim.

Annotated elements: 9 before, 12 after.

## v0110

[Page](../variants/v0110.html) · [Original design log](../variants/v0110-reasoning.md)

Keep U2 on the claim definition and fault explanation (Vocabulary); U4/W2 on the no-time-limit/interruption paragraph (direct context match); U4/W1 on large choice rows (Focus and Tokens and type); W3/U2 on the policy field (Vocabulary and Required versus optional); U1 on the conditional driver-name question (Part order and a few specific fields). Keep W3/W2 on the optional other-driver section (explicitly paired in that section), W4/W3 on deferred photos, and U3 on the account-free photo link (Photos).

Changes (evidence headings refer to this version's design log):

- `overline` (Part 1 of 8): **unmarked → W2**. Add the first part marker. Reading the brief against the materials explicitly links numbered parts to resuming after interruption.
- `dob-hint` (This is how we find your policy if you do not have your policy number with you.): **unmarked → W3**. Add the date-of-birth lookup hint. Required versus optional explains this substitution for an unavailable insurance card.
- `report-number-hint` (The officer may have handed you a slip of paper or a card with this number on it. If you do not): **unmarked → W3**. Add the optional police-report hint. Required versus optional explicitly includes the police report number among deferred documents.
- `make-hint` (The brand of the car, which is usually the badge on the front.): **unmarked → U2**. Add the definition of make. Vocabulary explicitly says make and model require plain explanations.
- `model-hint` (The name of the particular car, which is usually written on the back.): **unmarked → U2**. Add the definition of model. Vocabulary explicitly names this term.
- `send` (Send your report Nothing has been sent to us yet. If your connection drops before you finish, y): **W5 W4 → unmarked**. Move W4/W5 from the whole send section onto the specific paragraphs; the button and callback promise are separate choices.
- `p` (Nothing has been sent to us yet. If your connection drops before you finish, your answers stay ): **unmarked → W4**. Move W4 to the unsent/offline paragraph. The send block explicitly identifies this line as W4.
- `p` (When you press the button, we record the date and time. That is the official time of your repor): **unmarked → W5**. Move W5 to the submission-time paragraph. The send block explicitly cites W5.
- `p` (You can correct or add to anything in this report after you send it. Most people remember more ): **unmarked → W5**. Move W5 to the correction paragraph. The send block explicitly cites W5.

Annotated elements: 10 before, 17 after.

## v0111

[Page](../variants/v0111.html) · [Original design log](../variants/v0111-reasoning.md)

Keep G1 on the title, Your car, The other driver, and closing descriptions of the claim handler and payments (Vocabulary and The closing block). The latter describes the person's role rather than repeating the exact glossary phrase; the log explicitly supports that choice. Keep U2/U3 on the introduction for the fault reassurance and no-account statement; W4/W5 on the status; W2 on the part marker; W3 on the optional policy number; U1/U4 on the damage choices; W1/W3 on safely skipping other-driver details; W3/W4 on deferred photos; W5 on corrections; U1 on the phone alternative (Footer). The log explicitly supports the unusual U2 interpretation for explaining what a question is for.

Changes (evidence headings refer to this version's design log):

- `hint` (This tells us whether to line up a tow and a rental car for you.): **unmarked → U2**. Add the reason for asking whether the car is drivable. Part 3, your car explicitly extends U2 to explaining questions, not only terms.
- `fieldset` (Which of these is closest? Pick the one that fits best. This does not decide who was at fault, ): **U2 → unmarked**. Move U2 from the full crash-type fieldset to its fault reassurance; U2 does not supply the crash-type options.
- `hint` (Pick the one that fits best. This does not decide who was at fault, and picking one does not pu): **unmarked → U2**. Move U2 to the fault reassurance. Part 4, what happened explicitly attributes this sentence to U2.
- `story-hint` (Write it the way you would tell a friend. Where you were going, which way each car was moving, ): **unmarked → W5**. Add the narrative hint's promise that details can be added later. Part 4, what happened explicitly cites W5.
- `field` (Police report number Optional The officer usually hands you a slip or a card with this number o): **U1 → U1 W3**. Keep U1 for explaining the police-report number and add W3 for allowing it to be missing. Both are explicit in Part 7, police and Required and optional are labeled in words.
- `status status-inline` (Not sent yet. Pressing the button below is what sends it to us.): **unmarked → W4**. Add the repeated Not sent yet message. The closing block identifies this repeated status; it directly matches W4.
- `fineprint` (We stamp your report with the date and time it reaches us, and we show that time on the confirm): **unmarked → W5**. Add the promised submission timestamp. The closing block explicitly identifies this paragraph as W5. It describes a future timestamp rather than showing a live one.

Annotated elements: 16 before, 20 after.

## v1000

[Page](../variants/v1000.html) · [Original design log](../variants/v1000-reasoning.md)

Keep F4 on the saved bar (The saved state), F3 on next steps (The order of the page), F5 on uncertainty and corrections (The running promise about being wrong), F2 on photos, and F1 on the policy field (Step 2, about you). Do not add W1 merely because the page discusses the roadside: this variant received no world model.

Changes (evidence headings refer to this version's design log):

- `lede` (Enough for us to find your policy and reach you. All of it is from memory. None of it is in you): **unmarked → F1**. Add the identity-section explanation. Step 2, about you explicitly links recalled personal details to F1.
- `mobile-hint` (We text you a link back to this report.): **unmarked → F4**. Add the texted return-link hint. The saved state explicitly identifies this as the return mechanism.
- `choices` (I do not know the exact time): **unmarked → F5**. Add the unknown-time choice. Step 3, when and where explicitly cites F5.
- `field-group` (About how fast were you going A range is all we need. Stopped or parked Under 25 mph 25 to 45 m): **unmarked → F5**. Add speed ranges and the unknown option. Step 4, your vehicle explicitly cites F5 for avoiding an exact speed.
- `s6` (Step 6 of 6 What happened This whole step is optional. If you are still at the scene, send the ): **unmarked → F2**. Add the final optional description section. Step 6, what happened explicitly cites the second half of F2.
- `btn btn-secondary` (Text me a link to finish later): **unmarked → F4**. Add the text-a-link button. Submitting explicitly identifies it as the F4 return path.

Annotated elements: 5 before, 11 after.

## v1001

[Page](../variants/v1001.html) · [Original design log](../variants/v1001-reasoning.md)

Keep G1 on the title and Your car (Naming and wording), F3/G1 on next steps (Page order and Naming and wording), F4 on the save strip, F2 on photos, F1 on the policy field, F5 on speed and the closing reassurance. Narrow the other-driver glossary ring to its heading. No world-model link is justified for the local-save wording because that context was withheld.

Changes (evidence headings refer to this version's design log):

- `s5-h` (5 The other driver Fill in whatever you have. Blank lines are normal here, and the person handl): **G1 → unmarked**. Move G1 off the entire other-driver section; the glossary explains wording, not all its field and control choices.
- `s5-h` (The other driver): **unmarked → G1**. Move G1 to The other driver heading. The other driver explicitly cites this glossary replacement.
- `s8-h` (8 What happened, in your own words Optional Only if you feel like writing. Say it the way you w): **unmarked → F2**. Add the final optional description. What happened, in your own words explicitly cites F2.
- `btn btn-secondary` (Save and finish later): **unmarked → F4**. Add Save and finish later. Send block explicitly links it to F4.

Annotated elements: 9 before, 11 after.

## v1010

[Page](../variants/v1010.html) · [Original design log](../variants/v1010-reasoning.md)

Keep F4/W4/W5 on the status, F3 on next steps, F2 on photos and the final description, F5 on the minimal-required-fields sentence, F1/W3 on the optional policy number, W3 on missing registration, and W2 on Finish later. Keep W1 on the state input: Step 3, when and where explicitly gives a one-handed-use reason alongside the publishing rule. That is a logged additional rationale, not evidence that W1 was necessary for this input.

Changes (evidence headings refer to this version's design log):

- `li` (You can add photos, fix details, and change your account of what happened after you send this. ): **unmarked → F5 W5**. Add the next-steps item about correcting answers. What happens next explicitly calls out both F5 and W5 for its fourth item.
- `overline` (Step 3 of 6): **unmarked → W2**. Add the step marker. The conflict I had to resolve first explicitly links these markers to recovering after interruption.
- `opts mt-s3` (I am not sure of the exact time): **unmarked → F5**. Add the unknown-time checkbox. Step 3, when and where explicitly cites F5.
- `group` (Do you need help today? Check anything you need. An adjuster picks this up first. A tow A renta): **unmarked → F3**. Add the tow/rental/ride question. Step 4, your car explicitly attributes this question to F3's concern with the car and the rest of the day.
- `group subgroup` (Which of these is closest to what happened? Another vehicle hit mine from behind I hit the vehi): **unmarked → F2**. Add the crash-scenario choices. Step 5, what happened explicitly describes them as an interpretation of F2's difficulty composing a paragraph.
- `send` (Send your report This report becomes part of the legal record of the accident, and the time it ): **W5 → unmarked**. Move W5 from the full send card to the record and correction paragraphs. The secondary button keeps its separate W2 link.
- `p` (This report becomes part of the legal record of the accident, and the time it arrives can matte): **unmarked → W5**. Move W5 to the legal-record and arrival-time explanation. Step 6 and the send block explicitly cites W5.
- `quiet` (After you send it you can add photos, fill in blanks, and change your account of what happened.): **unmarked → F5 W5**. Move W5 to the correction promise and add F5 for reassurance about errors. Both context entries support this statement; the log ties send-stage fear of mistakes to F5.

Annotated elements: 10 before, 16 after.

## v1011

[Page](../variants/v1011.html) · [Original design log](../variants/v1011-reasoning.md)

Keep F4/W4/W5 on the status, G1 on the title, next-step wording, phone hint, and other-driver heading; F3 on the opening next steps; F2 on photos; W1 on the one-handed photo guidance; F1/W3 on the optional policy field; W2 on the numbered heading; F5 on the unknown-time choice. These match the named sections of the log. No user-model IDs can be added even when the resulting design also suits that model.

Changes (evidence headings refer to this version's design log):

- `card-note` (Sending this report does not decide who was at fault and does not commit you to a repair. If yo): **unmarked → F5 W5**. Add the opening correction promise. I don't know on every factual question explicitly cites both F5 and W5 for this repetition.
- `field` (I need help getting my car towed Check this and the call you get will start with the tow.): **unmarked → F3**. Add the tow request. The tow checkbox explicitly links this added control to F3.
- `s8-h` (8 Anything you want to tell us (optional) Skip this if you are still at the roadside. Most peop): **unmarked → F2**. Add the final optional narrative section. Photos are section 1 explicitly cites the second half of F2.
- `send-h` (Send your report Send it as soon as you can, even with blanks in it. We stamp it with the date ): **F5 W5 → unmarked**. Move F5/W5 off the full send section; annotate its specific record, correction, and save messages separately.
- `p` (Send it as soon as you can, even with blanks in it. We stamp it with the date and time it arriv): **unmarked → W5**. Move W5 to the arrival-time explanation. What is faked, and what a real build would do identifies this promised timestamp.
- `p` (You can change any answer after you send it. People remember things differently once the adrena): **unmarked → F5 W5**. Move F5/W5 to the correction promise. I don't know on every factual question explicitly cites both.
- `card-note send-saved` (Saved on this phone a moment ago. Nothing has reached us until you send it.): **unmarked → F4 W4**. Add the closing saved/not-sent message. It directly expresses F4 and W4; Saved state and the timestamp explains the same two requirements.

Annotated elements: 12 before, 17 after.

## v1100

[Page](../variants/v1100.html) · [Original design log](../variants/v1100-reasoning.md)

Keep F3 on next steps, U2 on the claim-number definition and fault reassurance (What happens next, four items rather than three), F4 on saved status, F2 on photos, F1 on identity, F4/U3 on the texted resume link (Saving), F5 on uncertainty in the time/location section and final correction promise, and U4 on damage controls. Keep U2 even on the erroneous "not a legal statement" sentence: the log explicitly credits the user model for that reassurance. Attribution is not endorsement.

Changes (evidence headings refer to this version's design log):

- `p` (That is the person at Keystone who takes your accident from here. They set up the repair shop, ): **unmarked → U2**. Add the claims-specialist explanation. What happens next, four items rather than three explicitly cites this definition.
- `form` (1 Photos of the accident Photos do more for your claim than anything you can write. If you are ): **U1 → unmarked**. Move U1 off the whole form. The log supports the numbered step pattern, not attribution of every field to U1.
- `step-head` (1 Photos of the accident): **unmarked → U1**. Move U1 to the first numbered heading. Numbered steps rather than one long form explains this pattern.
- `fieldset` (How bad does it look to you? Your best impression is all we want here. Nobody at Keystone expec): **unmarked → F5**. Add the damage-severity question. Step 4, the car and the damage explicitly explains avoiding a dollar estimate under F5.
- `fieldset` (About how fast were you going? A rough band is fine. Nobody can judge this accurately and we do): **unmarked → F5**. Add the speed ranges and unknown choice. Step 4, the car and the damage explicitly cites F5.
- `s8` (8 Anything else, in your own words This part is optional and it is deliberately last. Plenty of): **F2 → unmarked**. Move F2 from the whole last section to its narrative field: the section also contains a later callback-time question.
- `field` (What happened (optional) Write it the way you would say it out loud. There is no right format, ): **unmarked → F2**. Move F2 to the optional narrative field. Step 8, the words cites F2, but also acknowledges the subsequent callback question. This is partial compliance with "comes last."
- `btn btn-secondary` (Save and finish later): **unmarked → F4**. Add Save and finish later. Send explicitly links the secondary action to F4.

Annotated elements: 12 before, 16 after.

## v1101

[Page](../variants/v1101.html) · [Original design log](../variants/v1101-reasoning.md)

Keep G1 on the title, confirmation wording, and other-driver heading; F1/U3/F4 on the introductory promises; F3 on next steps; U2/G1 on the deductible explanation; U2 on fault reassurance; F4 on saving; F2 on photos; U1/U4 on the numbered card heading; F1 on the policy field; F5 on speed and corrections. Keep U4 on the short state input: Steps 2 to 6 explicitly cites it alongside the publishing constraint.

Changes (evidence headings refer to this version's design log):

- `p` (The person handling your claim will call, usually sooner. You do not have to chase us.): **unmarked → G1**. Add the person handling your claim wording. Language explicitly names this replacement.
- `small pad-top-3` (If you could not take photos, or it was not safe to, keep going. We can work without them.): **unmarked → F5**. Add the permission to skip photos. Step 1, photos explicitly cites fear of omission under F5.
- `group` (How bad is the damage to your car? A rough sense is all we need. We are not asking you to guess): **unmarked → F5 U2**. Add the damage-severity question. Steps 2 to 6 explicitly cites both F5 and U2 for using descriptions instead of a dollar estimate.
- `card` (7 What happened, in your own words Last, and optional. If you would rather tell the person hand): **unmarked → F2**. Add the final optional narrative. Step 7 and the send block explicitly cites F2.

Annotated elements: 14 before, 18 after.

## v1110

[Page](../variants/v1110.html) · [Original design log](../variants/v1110-reasoning.md)

Keep U2 on the claim definition; W1/U4 on the safety notice (Above the first question and Calling: U4 explains leaving 911 as plain text); F3 on next steps; F4/W4 on saved state; F2 on photos; F1/U3 on contact details (Step by step, item 2 explicitly discusses avoiding an account); F5 on time; W2 on a numbered card; U1/U4 on visible radio rows (No dropdowns anywhere and Radios and checkboxes); U2 on the police-report explanation; F1/W3 on the final policy field; W5/W4 on the send section. W5 remains valid although the model explains a future timestamp instead of printing one.

Changes (evidence headings refer to this version's design log):

- `li` (A claims specialist calls you at the number you give below. That is a person at Keystone who lo): **unmarked → U2**. Add the claims-specialist explanation. Vocabulary explicitly names this definition.
- `muted` (Only your name and phone number are required. Leave anything else blank if you do not know it o): **unmarked → F1 W3 F5**. Add the two-required-fields statement. What is required explicitly attributes this rule to these three entries.
- `s10` (Step 10 of 11 What happened, in your own words Tell us what happened Only if you feel up to it.): **unmarked → F2 W5**. Add the optional narrative near the end and its correction guidance. Page order and Step by step, item 10 explicitly cite F2 and W5. The policy-number section still follows, so F2 is only partly met.

Annotated elements: 12 before, 15 after.

## v1111

[Page](../variants/v1111.html) · [Original design log](../variants/v1111-reasoning.md)

Keep G1 on the title and confirmation, G1/U2 on deductible, F3 on next steps, F4/W4/W5 on status, F5/W3 on the three-needed-fields rule, F2 on photos and the optional final description, W2 on the step marker, W3 on the optional document photo, F1 on identity, F5 on unknown time, and W5 on the send card. Keep U1 on native date/time inputs: Date and time use native inputs explicitly credits familiarity with the phone's controls. W1 also supports the 640px single-column layout (Measure and column); that page-wide choice is documented here rather than ringed around every element.

Changes (evidence headings refer to this version's design log):

- `main` (If anyone is hurt, call 911 first Get yourself and anyone else somewhere safe before you do any): **W1 → unmarked**. Remove the whole-page W1 ring. Measure and column supports the layout attribution, which is recorded below, but a ring around the entire page obscures which choices it explains. Show W1 on the specific choice controls instead.
- `fieldset` (How should the person handling your claim reach you? A phone call A text message An email): **U4 → U4 W1**. Keep U4 and add W1 to the contact choice rows. Controls: radios and text inputs explicitly cites both for large rows that can be used one-handed.
- `diagram` (Front Rear Driver side Passenger side): **U4 → unmarked**. Move U4 from the decorative SVG to the complete damage-choice group. The log credits U4 for avoiding small clickable diagram targets, not for drawing a car.
- `fieldset` (Where is the damage? Pick as many as you need. Front Rear Driver side Passenger side Front Rear): **unmarked → U4**. Move U4 to the damage group containing the illustration and separate checkbox rows. The car diagram is a picture, not a control explicitly explains this choice.
- `s5-h` (Your car): **unmarked → G1**. Add Your car. Vocabulary explicitly names this glossary replacement.
- `note` (We are not asking what the repair will cost. Nobody is expected to know that from the roadside,): **unmarked → F5**. Add the explanation that a repair-cost estimate is not requested. What I am not asking for explicitly cites F5.
- `s6-h` (The other driver): **unmarked → G1**. Add The other driver. Vocabulary explicitly names this glossary replacement.
- `note` (Most people remember more once they have calmed down, and some of it comes out differently the ): **unmarked → F5 W5**. Add the narrative correction message. It directly matches F5's correction rule and W5's account of remembering differently after the crash.

Annotated elements: 17 before, 20 after.

## Shared overlay wording

The empty-state sentence previously claimed everything on an unannotated page was the AI's industry default. v0000 also received the common prompt, DESIGN.md, and publishing constraints. The message now states only that no UX.md annotations exist and names those other inputs for v0000.

## Verification

- All sixteen files parsed and all annotation IDs checked against the context bits for that variant.
- Removing data-ux attributes from the before and after HTML produces byte-for-byte identical UTF-8 content.
- Every variant retains exactly one overlay script include and one overlay stylesheet include.
- The shared overlay was executed against all sixteen annotation sets in a mock DOM. Card creation, per-ID snippets, numeric positioning, the empty state, teardown, and repeated toggles passed. This does not replace a rendered layout check.
- Source context, original reasoning logs, index.html, CLAUDE.md, and the user's backup were checked by SHA-256 and are unchanged.
