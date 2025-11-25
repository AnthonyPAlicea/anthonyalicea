# Course Listing Implementation Plan

## Overview
Transform the current course listing from a vertical stacked layout to a responsive card-based grid layout matching the design from dontimitate.dev. The new design will use vanilla CSS instead of Tailwind, with course cards that feature images, pricing, duration, and descriptions.

## Current State Analysis
- **Current location**: `includes/courses.njk` - Contains 9 course articles in a vertical list
- **Current styling**: `assets/main.css` - Has `.course` styles (padding, border, border-radius)
- **Template engine**: Eleventy with Nunjucks
- **Site framework**: Eleventy (static site generator)
- **Available images**: Asset files exist in `/assets/` (htmlcss.png, jsadv.png, jsframeworks.png, nodejs.png, react.png, aidev.png, normalui.png, rightsoftware.png, teamdynamics.png)

## Target Design (from dontimitate.dev)
- Responsive grid layout: 1 column on mobile, 2 columns on tablet, 3 columns on desktop
- Fixed card width: max-width 350px
- Card structure:
  - Image section: 350px width × 196px height (object-cover)
  - Content section: padding 1.5rem (24px)
  - Title section: flex layout with course title on left, duration badge on right
  - Description: text below title
  - Price section: Current price (bold) + strikethrough original price
- Hover effect: Background color transition
- Border and rounded corners (8px)
- Semantic HTML with `<article>`, `<h3>`, `<a>` tags

## Implementation Steps

### 1. Update HTML Structure in `includes/courses.njk`
**Action**: Refactor course items to match semantic card layout
- Convert `<section class="course-list">` to use CSS Grid
- Update each course `<article>` with new class: `course-card`
- Restructure content:
  - Create image wrapper with border-bottom
  - Move link to wrap image
  - Create content wrapper (div with class `course-card__content`)
  - Create header section with title and duration badge
  - Keep description and pricing

**Key changes**:
- Add `course-card__header` div with flex layout
- Add `course-card__title` for the h3
- Add `course-card__duration` for the duration badge
- Add `course-card__description` for paragraph
- Add `course-card__pricing` for price section with two spans

### 2. Update CSS in `assets/main.css`
**Action**: Add new course card styles while maintaining existing `.course` styles for backward compatibility

**New CSS classes to add**:
- `.course-list`: Grid container
  - `display: grid`
  - `grid-template-columns: 1fr` (mobile)
  - `gap: 2rem` (gap between cards)
  - `max-width: 1200px` (container max-width)
  - `margin: 0 auto` (center)
  - `justify-items: center` (center cards)

- `.course-card`: Individual card
  - `width: 100%`
  - `max-width: 350px`
  - `border: 1px solid #444`
  - `border-radius: 8px`
  - `overflow: hidden`
  - `transition: background-color 0.2s ease-in-out`
  - `display: flex`
  - `flex-direction: column`

- `.course-card:hover`: Hover state
  - `background-color: var(--color-course-background)`

- `.course-card__image-wrapper`: Image container
  - `position: relative`
  - `border-bottom: 1px solid #444`
  - `height: 196px`
  - `overflow: hidden`

- `.course-card__image-wrapper a`: Image link
  - `display: block`
  - `width: 100%`
  - `height: 100%`

- `.course-card__image`: Image element
  - `width: 100%`
  - `height: 100%`
  - `object-fit: cover`

- `.course-card__content`: Content wrapper
  - `padding: 1.5rem`
  - `flex: 1`
  - `display: flex`
  - `flex-direction: column`

- `.course-card__header`: Header with title and badge
  - `display: flex`
  - `justify-content: space-between`
  - `align-items: flex-start`
  - `gap: 0.75rem`
  - `margin-bottom: 0.5rem`

- `.course-card__title`: Title
  - `flex: 1`
  - `margin: 0`
  - Font properties from existing headings

- `.course-card__title a`: Title link
  - `text-decoration: none`
  - `font-weight: 600`
  - `font-size: 1.125rem`
  - `color: var(--color-text)`

- `.course-card__title a:hover`: Title link hover
  - `text-decoration: underline`

- `.course-card__duration`: Duration badge
  - `flex-shrink: 0`
  - `background-color: var(--color-course-background)`
  - `color: var(--color-text)`
  - `padding: 0.25rem 0.75rem`
  - `border-radius: 6px`
  - `font-size: 0.875rem`
  - `font-weight: 600`
  - White-space: nowrap

- `.course-card__description`: Description text
  - `margin: 0.5rem 0 1rem 0`
  - `font-size: 0.95rem`
  - `line-height: 1.5`
  - `flex: 1`

- `.course-card__pricing`: Pricing section
  - `display: flex`
  - `gap: 1rem`
  - `align-items: center`

- `.course-card__price`: Current price
  - `font-weight: 700`
  - `color: var(--color-text)`

- `.course-card__original-price`: Original price
  - `color: var(--color-text)`
  - Opacity: 0.6
  - `text-decoration: line-through`

**Responsive breakpoints**:
- Mobile (0-767px): 1 column
- Tablet (768px-1149px):
  - `grid-template-columns: repeat(2, 1fr)`
  - `justify-items: unset`
  - `margin: 0 auto`

- Desktop (1150px+):
  - `grid-template-columns: repeat(3, 1fr)`
  - `justify-items: unset`

### 3. Update Image References
**Action**: Map course titles to correct image files from `/assets/`

Expected mappings:
- React ’ react.png
- JavaScript: The Weird Parts ’ jsweirdparts.png
- HTML and CSS ’ htmlcss.png
- Node.js ’ nodejs.png
- AI-Assisted Development ’ aidev.png
- Modern JavaScript Frameworks ’ jsframeworks.png
- Advanced ES.Next ’ jsadv.png
- Building the Right Software ’ rightsoftware.png
- Team Dynamics ’ teamdynamics.png

### 4. Add Pricing and Duration Data
**Action**: Extract and add pricing/duration info to course markup

Note: Some courses currently lack duration/pricing. Options:
- Use data attributes to store this information
- Extract from course links and manually add
- Create a data file if Eleventy supports it

For Phase 1: Add available pricing/duration as found in spec examples

### 5. Test Responsiveness
**Action**: Verify layout on different screen sizes
- Mobile: 1 card per row, full-width minus margins
- Tablet: 2 cards per row
- Desktop: 3 cards per row
- Ensure proper spacing and alignment

### 6. Color and Styling Consistency
**Action**: Use existing CSS variables from site
- `--color-text` for text
- `--color-course-background` for badge backgrounds
- `--color-link` for hover states
- Maintain dark theme consistency (current color scheme)

## Success Criteria
- [ ] Cards display in responsive grid layout
- [ ] Images load correctly with proper aspect ratio (350×196px)
- [ ] Hover effect transitions smoothly
- [ ] Duration badges display correctly (if available)
- [ ] Pricing displays correctly (current/original)
- [ ] Layout matches Astro example visually in vanilla CSS
- [ ] Fully responsive on mobile, tablet, desktop
- [ ] No breaking changes to existing course styles
- [ ] Eleventy site builds without errors

## Files to Modify
1. `includes/courses.njk` - HTML structure
2. `assets/main.css` - New CSS classes and responsive breakpoints

## Notes
- Maintain backward compatibility with existing `.course` class for other uses
- Use semantic HTML (article, h3, a tags)
- Follow existing Eleventy site patterns
- Leverage existing color variables
- Test with real course data before deployment
