# Consulting Page Implementation Plan

## Overview
Create a professional consulting page at `/consulting/index.njk` for Tony Alicea that attracts clients paying $200/hr or 4-figure monthly retainers. The page should align with the existing site design while targeting professional/business audiences.

## Page Structure

### 1. Hero Section (with image + text layout)
- **Layout:** Two-column layout with image on LEFT, text on RIGHT
- **Image:** `assets/tony_reactsummit.jpg` (React Summit speaking photo)
- **Image Size:** Not large (approximately 300-400px wide on desktop)
- **Text Content:** Opening statement about 25 years experience
- **Styling:** Dark theme matching site, with accent colors
- **Responsive:** Stack vertically on mobile, side-by-side on tablet+

**Implementation:**
- Create `.consulting-hero` container with CSS Grid or Flexbox
- Use `flex-direction: row-reverse` to put image on left, text on right
- Add subtle border/shadow around image for professional appearance
- Apply site's dark theme colors

### 2. Hero Text Content (Right side)
```
Title: Tony Alicea  Consulting & Technical Advisory
Subtitle: 25 years of experience in software development, architecture, UX, and teaching 360,000+ developers.

Body paragraphs:
- "I help teams build the right software..."
- "Whether you need architecture help..."
- "If your team is feeling stuck..."
```

### 3. Services Section
Organize into THREE distinct service areas with cards/sections:

#### Service Category 1: Technical Architecture & Senior Engineering
- Bullet list of offerings (JavaScript, Node.js, React, architecture, code review, etc.)

#### Service Category 2: Product & UX Strategy (Normal UI)
- Bullet list of offerings (cognitive load, workflow, information architecture, usability)

#### Service Category 3: Requirements, Planning, & Process (Cascade Methodology)
- Bullet list of offerings (The Why Down, MSP, verification gates, AI-first prototypes)

**Styling:**
- Use existing `.card` pattern or create `.service-card` components
- Border, padding, rounded corners matching site style
- Yellow accent (#FFE53E) for service titles or icons
- Blue links (#9da2ff) for any call-to-action

### 4. Pricing/Ways to Work Section
Display four engagement options in a grid layout:

1. **Hourly Consulting** ($200/hour)
   - Tagline: "Perfect for teams who need expert help on demand."
   - Use cases list (architectural questions, code review, UX walkthroughs, etc.)
   - "No minimum hours. Straightforward and flexible."

2. **Product & UX Flow Audit** ($3,000 fixed / 10-hour project)
   - Deliverables list (information architecture review, workflow breakdown, recommendations, improvement plan)
   - "Great fit for teams with confusing workflows or grown-chaotically products"

3. **Technical Advisory (Monthly Retainer)** (Starting at $4,000/month, 6-8 hrs/week)
   - Services list (architectural guidance, code reviews, mentorship, technical direction, etc.)
   - "Most popular option  ideal for teams without a full-time architect"

4. **Cascade Methodology Engagement** (Starts at $6,000 for 2-week engagement)
   - What's included (The Why Down, MSP, Entropy Tolerance, Verification Gates, etc.)
   - Outcome statement about having a complete end-to-end playbook

**Styling:**
- 2x2 grid on desktop, 1 column on mobile
- Use card styling with borders/shadows
- Pricing prominently displayed
- Each card has consistent structure (title, price, description, highlights)

### 5. Who I Work With Section
A simple list/bullets section describing ideal clients:
- SaaS teams building or rewriting apps
- Startups needing architecture or UX expertise
- Engineering teams adopting AI-assisted development
- Companies modernizing legacy JavaScript/Node/React
- Teams without a dedicated architect or UX strategist
- Organizations struggling with clarity, flow, or direction

Closing statement: "If your team values clarity, simplicity, and deep understanding  we'll be a great fit."

### 6. Contact/CTA Section
- Heading: "Get in Touch"
- Introductory text: "If you're interested in working together, reach out and tell me a little about your team and your goals."
- **[PLACEHOLDER FOR NETLIFY FORM]** - Replace with actual Netlify form
  - Form fields: Name, Email, Company, Team Size, Brief Description of Needs
  - Submit button with professional styling
- Follow-up text: "I'll follow up quickly, ask a few clarifying questions, and  if it's the right fit  we can schedule a short discovery call."

## Technical Implementation Details

### Template Setup
- **Base Template:** Extend `page.njk`
- **File Location:** `/consulting/index.njk`
- **Page Title:** "Consulting & Technical Advisory | Tony Alicea"
- **Page Description:** For meta tags (hiring focus)

### Styling Approach
- **Primary CSS:** Add custom `<style>` block in page template or create `/assets/consulting.css`
- **CSS Variables:** Leverage existing variables from `main.css`:
  - `--color-background: #222222`
  - `--color-text: #f8f9fa`
  - `--color-link: #9da2ff`
  - `--color-article-h2: #FFE53E` (yellow for accents)
  - `--color-small-background: rgba(0, 56, 109, 0.5)`

### Component Styling

#### Hero Section `.consulting-hero`
```css
.consulting-hero {
    display: flex;
    gap: 2rem;
    align-items: center;
    margin-bottom: 3rem;
}

.consulting-hero__image {
    flex: 0 0 300px;  /* Fixed width on desktop */
    border-radius: 12px;
    border: 1px solid #444;
    overflow: hidden;
}

.consulting-hero__image img {
    width: 100%;
    height: auto;
    display: block;
}

.consulting-hero__content h2 {
    color: var(--color-text);
    font-family: 'Raleway', sans-serif;
    font-weight: 900;
    font-size: 2rem;
    margin-bottom: 1rem;
}

.consulting-hero__content p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
}

@media (max-width: 768px) {
    .consulting-hero {
        flex-direction: column;
    }

    .consulting-hero__image {
        flex: 0 0 auto;
        max-width: 100%;
    }
}
```

#### Service Cards `.service-card`
```css
.service-card {
    border: 1px solid #444;
    border-radius: 12px;
    padding: 1.5rem;
    background-color: rgba(0, 56, 109, 0.2);  /* Optional subtle background */
}

.service-card h3 {
    color: var(--color-article-h2);  /* Yellow accent */
    font-family: 'Raleway', sans-serif;
    margin-bottom: 1rem;
}

.service-card ul {
    list-style: none;
    padding-left: 0;
    line-height: 1.8;
}

.service-card li:before {
    content: "� ";
    color: var(--color-link);
    font-weight: bold;
    margin-right: 0.5rem;
}
```

#### Pricing Cards `.pricing-card`
```css
.pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.pricing-card {
    border: 1px solid var(--color-article-h2);  /* Yellow border for emphasis */
    border-radius: 12px;
    padding: 1.5rem;
    background-color: rgba(255, 229, 62, 0.05);  /* Very subtle yellow tint */
}

.pricing-card h3 {
    color: var(--color-text);
    font-family: 'Raleway', sans-serif;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
}

.pricing-card .price {
    color: var(--color-article-h2);
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.pricing-card .price-details {
    font-size: 0.9rem;
    color: #ccc;
    margin-bottom: 1rem;
}

.pricing-card ul {
    list-style: none;
    padding-left: 0;
    font-size: 0.95rem;
    line-height: 1.7;
}

.pricing-card li:before {
    content: " ";
    color: var(--color-link);
    margin-right: 0.5rem;
}

.pricing-card p {
    font-style: italic;
    font-size: 0.9rem;
    color: #ccc;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #444;
}
```

#### Contact Section `.contact-section`
```css
.contact-section {
    margin-top: 3rem;
    padding: 2rem;
    border: 1px solid #444;
    border-radius: 12px;
    background-color: rgba(0, 56, 109, 0.3);
}

.contact-section h2 {
    color: var(--color-text);
    font-family: 'Raleway', sans-serif;
    margin-bottom: 1rem;
}

.contact-section > p {
    font-size: 1.05rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.contact-section form {
    display: grid;
    gap: 1rem;
}

.contact-section input,
.contact-section textarea {
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid #444;
    border-radius: 6px;
    padding: 0.75rem;
    color: var(--color-text);
    font-family: inherit;
}

.contact-section input::placeholder,
.contact-section textarea::placeholder {
    color: #999;
}

.contact-section button {
    background-color: var(--color-article-h2);
    color: #222;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 1.5rem;
    font-weight: bold;
    cursor: pointer;
    font-family: 'Raleway', sans-serif;
    font-size: 1rem;
}

.contact-section button:hover {
    opacity: 0.9;
}

@media (max-width: 768px) {
    .contact-section {
        padding: 1.5rem;
    }

    .contact-section h2 {
        font-size: 1.5rem;
    }

    .contact-section > p {
        font-size: 0.95rem;
    }
}
```

#### Services Grid `.services-grid`
```css
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

@media (max-width: 768px) {
    .services-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .service-card {
        padding: 1rem;
    }

    .service-card h3 {
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .service-card ul {
        line-height: 1.6;
    }

    .service-card li:before {
        margin-right: 0.35rem;
    }
}
```

#### Who I Work With Section `.client-types`
```css
.client-types {
    margin-bottom: 3rem;
}

.client-types ul {
    list-style: none;
    padding-left: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.client-types li {
    padding: 1rem;
    border-left: 3px solid var(--color-article-h2);
    padding-left: 1rem;
}

.client-types li:before {
    content: "";
}

@media (max-width: 768px) {
    .client-types ul {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .client-types li {
        padding: 0.75rem;
        font-size: 0.95rem;
    }
}
```

### Responsive Breakpoints

#### Mobile (< 480px) - Small Phones
- Hero section: Vertical stack, image at top
  - Image width: 100%, max-height: 250px
  - Text padding reduced to 1rem
  - H2 font-size: 1.5rem
  - P font-size: 0.95rem

- Services: Single column, full width
  - Card padding: 1rem
  - H3 font-size: 1.1rem
  - Gaps reduced to 1rem

- Pricing cards: Stack vertically
  - Card padding: 1rem
  - Price font-size: 1.25rem
  - Full width with side gutters from main layout

- Contact form: Single column
  - Input/textarea padding: 0.65rem
  - Font-size: 0.95rem
  - Button: Full width or auto width (whichever looks better)

- Who I Work With: Single column layout
  - Font-size: 0.9rem
  - List items have left border accent

#### Tablet (480px - 768px)
- Hero section: Stack vertically but larger image
  - Image width: 100%, max-height: 300px
  - Text larger (1rem font-size)

- Services: Single column or 2-column if space allows
  - Card padding: 1.25rem
  - Gaps: 1.25rem

- Pricing cards: 2 columns stacked
  - auto-fit minmax(280px, 1fr)
  - Card padding: 1.25rem

- Contact form: Standard grid layout
  - Input/textarea padding: 0.75rem

- Who I Work With: 2-column layout
  - Balanced column widths

#### Desktop (769px - 1024px)
- Hero section: Side-by-side
  - Image: 300px fixed width on left
  - Text flows on right
  - Gap: 2rem

- Services: 2-3 column layout
  - auto-fit minmax(300px, 1fr)
  - Gaps: 1.5rem

- Pricing cards: 2x2 grid OR responsive columns
  - auto-fit minmax(280px, 1fr) allows flexibility
  - Cards maintain consistent sizing

- Contact form: Full width, standard grid

- Who I Work With: 2-3 column layout
  - Balanced distribution

#### Large Desktop (1025px+)
- Hero section: Side-by-side with comfortable spacing
  - Image: 350-400px fixed width
  - Text: Flexible width
  - Gap: 2-3rem

- Services: 3-column layout
  - Fixed column count: 3
  - Gap: 1.5rem

- Pricing cards: 2x2 grid
  - Fixed grid-template-columns: repeat(2, 1fr)
  - Minimum width ~350px per card

- Contact form: Fixed width (inherit from main 700px layout)
  - Max-width: 100% to respect main content width

- Who I Work With: 3-column layout
  - Balanced and organized presentation

### Responsive CSS Strategy

**Use mobile-first approach:**
```css
/* Base styles for mobile */
.consulting-hero {
    flex-direction: column;
}

.services-grid {
    grid-template-columns: 1fr;
}

/* Tablet and up */
@media (min-width: 768px) {
    .consulting-hero {
        flex-direction: row-reverse;
    }

    .services-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .services-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

**Key responsive utilities:**
- Use `repeat(auto-fit, minmax())` for flexible card grids
- Adjust font-sizes: desktop 1rem/1.1rem body, mobile 0.9-0.95rem
- Reduce gaps and padding on mobile: 1rem or less
- Ensure touch targets are >= 44px height on mobile
- Test form inputs on mobile (ensure adequate size for typing)
- Verify image aspect ratios display correctly at all sizes

### Testing Checklist for Responsive Design
- [ ] Mobile (375px): Hero stacks, cards in single column, form is usable
- [ ] Tablet (768px): Hero side-by-side, cards in 2 columns, balanced layout
- [ ] Desktop (1024px): Full 3-column services, 2x2 pricing grid
- [ ] Desktop (1440px): All elements have room to breathe, no overcrowding
- [ ] Touch targets: All clickable elements >= 44x44px
- [ ] Images: Scale appropriately at all breakpoints
- [ ] Text: Readable at all sizes (no text overflow)
- [ ] Forms: Inputs are full width and easy to interact with on mobile
- [ ] Horizontal scroll: No horizontal scrolling at any viewport
- [ ] Links: Sufficient color contrast and spacing

### Form Implementation
- **Option A: Netlify Forms** (As specified in spec)
  - Add `<form netlify>` attribute to form element
  - Ensure form has `name` attribute
  - Netlify will automatically create backend for form submissions

- **Option B: Flodesk** (Current site pattern)
  - Create new Flodesk form ID
  - Add form container div with unique ID
  - Add initialization script to page head
  - Match existing form styling from site

**Recommendation:** Use Netlify Forms as specified in spec, but can be replaced with Flodesk to match site pattern

## File Structure
```
consulting/
   index.njk (main page)

assets/
   tony_reactsummit.jpg (already exists)

Optional:
   assets/consulting.css (if moving styles out of template)
```

## Frontmatter for index.njk
```yaml
---
layout: page.njk
title: Consulting & Technical Advisory
description: Hire Tony Alicea for technical architecture, product strategy, and team mentorship
permalink: /consulting/
tags: []
---
```

## Content Organization

### Heading Hierarchy
- H1: Page title (in layout or hero)
- H2: Section headings (Services, Pricing, Who I Work With, Get in Touch)
- H3: Subsection headings (individual service types, pricing option titles)

### Section Order
1. Hero (Image + Introduction) - with P emoji prefix
2. Services Overview (3 categories of what Tony does)
3. Pricing/Ways to Work (4 engagement options)
4. Who I Work With (ideal client profile)
5. Contact/CTA Section (form + follow-up messaging)

## Visual Design Guidelines

### Color Palette (from existing site)
- **Background:** #222222
- **Text:** #f8f9fa
- **Links:** #9da2ff (blue)
- **Accents:** #FFE53E (yellow) - Use for service titles, pricing highlights, important elements
- **Borders:** #444 (dark gray)
- **Subtle backgrounds:** rgba(0, 56, 109, 0.2-0.3) (dark blue tint)

### Typography
- **Headings:** Raleway, Weight 900, uppercase or title-case
- **Body:** Noto Sans, Regular, 1.6 line-height for readability
- **Small text:** 0.9rem for secondary information

### Spacing
- **Page margins:** Content centered to 700px width on desktop (existing layout)
- **Section spacing:** 2-3rem between major sections
- **Card padding:** 1.5rem
- **Gap between cards:** 1.5rem

### Visual Elements
- Subtle borders (1px solid #444)
- Rounded corners (12px on major elements, 6px on form inputs)
- Hover effects (opacity change on buttons)
- Icon bullets (� for lists,  for benefits)
- Professional, clean aesthetic (no heavy animations)

## Next Steps
1. Create `/consulting/index.njk` with page structure
2. Add frontmatter with proper layout and metadata
3. Implement semantic HTML with appropriate headings and structure
4. Add custom CSS styling (inline `<style>` block or separate file)
5. Integrate Netlify form or Flodesk form for contact section
6. Test responsive design across breakpoints
7. Review alignment with site's visual design language
8. Optimize images (tony_reactsummit.jpg aspect ratio and size)
