# DESIGN.md

Visual identity for Keystone Mutual digital products.
This file is always in context. It says how things should look, not how they should work.

## Color

```
--ink:            #14202E   /* primary text */
--ink-soft:       #4A5A6B   /* secondary text */
--line:           #DCE3EA   /* decorative dividers and rules only */
--line-strong:    #8A8A8A   /* the boundary of any interactive control */
--surface:        #FFFFFF   /* cards, inputs */
--canvas:         #F4F7FA   /* page background */
--brand:          #0B5C4B   /* Keystone green: primary actions, logo */
--brand-hover:    #094A3C
--brand-tint:     #E7F1EE   /* selected states, quiet highlights */
--accent:         #C2610F   /* attention, in-progress status */
--danger:         #A32020   /* errors, destructive actions */
--focus:          #1F6FEB   /* focus ring only */
```

Brand green is for the primary action and the logo. One primary action per screen.
Danger red is for errors and nothing else. Never use it for emphasis.
Focus blue appears only in focus rings. Never as a fill or a text color.

## Type

```
--font:        "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
--t-display:   28px / 1.25 / 650
--t-title:     20px / 1.3  / 600
--t-body:      16px / 1.55 / 400
--t-label:     14px / 1.4  / 550
--t-small:     13px / 1.45 / 400
```

Body text never goes below 16px. Labels never go below 14px.

## Space and shape

```
--s1: 4px   --s2: 8px   --s3: 12px  --s4: 16px
--s5: 24px  --s6: 32px  --s7: 48px  --s8: 64px

--r-sm: 6px    /* inputs, small controls */
--r-md: 10px   /* buttons, cards */
--r-lg: 16px   /* sheets, large panels */

--shadow-card: 0 1px 2px rgba(20,32,46,.06), 0 4px 12px rgba(20,32,46,.05);
--ring: 0 0 0 3px rgba(31,111,235,.35);
```

Spacing uses the scale. No arbitrary pixel values.

## Components

**Button.** Height 48px, horizontal padding `--s5`, radius `--r-md`, label `--t-label` at 16px.
Primary is `--brand` fill with white text. Secondary is `--surface` fill with a `--line-strong` border and `--ink` text. Text buttons are `--brand` text with no fill.

**Input.** Height 48px, radius `--r-sm`, 1px `--line-strong` border, `--surface` fill, `--s3` inner padding.
Label sits above the field, never inside it as a placeholder.
Errors show a `--danger` border and a `--danger` message below the field.

**Focus.** `outline: 2px solid var(--focus)` with `outline-offset: 2px`, plus `--ring` as a soft halo behind it.
The ring on its own is not enough. It computes to roughly 1.6:1 against white, and a focus indicator needs 3:1.
Never replace the outline with a border color change. Native radios and checkboxes ignore it.

**Card.** `--surface` fill, radius `--r-md`, `--shadow-card`, `--s5` padding.

**Header.** Keystone wordmark left, `--surface` background, 1px `--line` bottom border, 64px tall.
The wordmark is the word "Keystone" in `--brand` at `--t-title` weight 650, followed by a `--brand` square of 8px, radius 2px.

## Writing

Keystone Mutual is a United States insurer. US English, US spelling, US conventions throughout.
License plate, not number plate. Windshield, not windscreen. Parking lot, not car park. Color, not colour.
Emergency number is 911. Claims line is 1-800-555-0142. Dates read as July 25, 2026.

Sentence case for headings, labels, and buttons. No title case, no all caps except in a small overline.
No exclamation marks.

## Rules

Every interactive element has a visible focus state.
The boundary of every interactive control uses `--line-strong`. `--line` is for dividers that carry no meaning.
Text on `--brand` is white and passes AA. Never put `--ink` on `--brand`.
Never communicate meaning with color alone. Pair it with a word or an icon.
Tap targets are at least 44px in both directions.
Do not introduce gradients, drop shadows beyond `--shadow-card`, or additional accent colors.
Do not use icon-only buttons for anything a person can get wrong.
