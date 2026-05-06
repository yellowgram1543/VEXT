---
name: Technical Playfulness
colors:
  surface: '#faf9fb'
  surface-dim: '#dadadc'
  surface-bright: '#faf9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f6'
  surface-container: '#eeedf0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e3e2e4'
  on-surface: '#1a1c1e'
  on-surface-variant: '#42474d'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f3'
  outline: '#73777e'
  outline-variant: '#c2c7ce'
  surface-tint: '#42617d'
  primary: '#42617d'
  on-primary: '#ffffff'
  primary-container: '#a7c7e7'
  on-primary-container: '#34536f'
  inverse-primary: '#aacaea'
  secondary: '#6b5779'
  on-secondary: '#ffffff'
  secondary-container: '#f1d6ff'
  on-secondary-container: '#705b7d'
  tertiary: '#7b572d'
  on-tertiary: '#ffffff'
  tertiary-container: '#ebbb88'
  on-tertiary-container: '#6c4a21'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cde5ff'
  primary-fixed-dim: '#aacaea'
  on-primary-fixed: '#001d32'
  on-primary-fixed-variant: '#294964'
  secondary-fixed: '#f3daff'
  secondary-fixed-dim: '#d7bde5'
  on-secondary-fixed: '#251432'
  on-secondary-fixed-variant: '#533f60'
  tertiary-fixed: '#ffddbb'
  tertiary-fixed-dim: '#eebe8a'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#614018'
  background: '#faf9fb'
  on-background: '#1a1c1e'
  surface-variant: '#e3e2e4'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
  h2:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  cell-gap: 12px
  container-padding: 32px
---

## Brand & Style

This design system is a high-contrast fusion of technical utility and gamified engagement. It adopts the structural clarity of a computational notebook and filters it through a neo-brutalist lens, resulting in a UI that feels both authoritative and approachable. 

The personality is "Serious Play"—where the raw, unrefined aesthetic of brutalism meets the friendly, tactile nature of modern educational platforms. It is designed for developers, students, and power users who value information density but crave a UI with character. The emotional response is one of confidence and kinetic energy; every interaction feels physical, reinforced by heavy strokes and rigid shadows that mimic the "press" of a mechanical button.

## Colors

The palette utilizes a "Candy-Brutalist" approach. The background remains a clean, cool neutral to ensure long-form readability, while the functional colors are pulled from a pastel yet saturated spectrum. 

- **Primary & Secondary:** Used for "Cells" and major UI blocks, providing a soft distinction between different types of content (e.g., input vs. output).
- **Accent:** Reserved for high-priority navigation, active states, and branding elements.
- **Dark:** This is the structural glue. Every border, shadow, and text element uses this color to maintain a high-contrast, "ink-on-paper" feel.
- **Highlight:** Used sparingly for alerts, errors, or to draw immediate attention to specific data points.

## Typography

The typographic hierarchy distinguishes between action and information. **Space Grotesk** is used for headings to provide a technical, slightly futuristic edge that aligns with the neo-brutalist aesthetic. **Inter** handles the heavy lifting for body copy, ensuring maximum legibility in dense layouts. **JetBrains Mono** is utilized for all code-related content and metadata, nodding to the system's "notebook" lineage. All headings are strictly bold to stand up against the 3px borders of the UI components.

## Layout & Spacing

This design system employs a **Fixed-Width "Cell" Model** inspired by Jupyter Notebooks. Content is organized into distinct vertical containers (cells) that span the width of a central column. 

- **The Grid:** A centered 12-column layout for desktop, but the primary interaction happens within a max-width container (800px-1000px) to mimic the reading experience of a document.
- **Rhythm:** Spacing follows a strict 4px base unit. 
- **Cell Structure:** Elements are separated by "cell-gap" units, creating a clear vertical stack. Internal padding within cells should be generous (md to lg) to balance the heavy visual weight of the borders.

## Elevation & Depth

Depth in this design system is purely structural and faux-physical. There are no Z-axis blurs or environmental lighting effects.

1.  **The Hard Shadow:** All interactive or elevated elements (cards, buttons, inputs) feature a 4px right, 4px down offset shadow using the **Dark** color.
2.  **The "Active" Shift:** To simulate a physical click, elements should translate 4px to the right and 4px down upon interaction (active/pressed state). During this state, the shadow is removed, making the element appear to have been pushed into the page.
3.  **Flat Stacking:** Hierarchy is achieved through the thickness of the borders and the use of the **Secondary** or **Highlight** background colors to pull an element forward visually.

## Shapes

The shape language is "Chunky and Friendly." While brutalism often favors sharp corners, this design system softens the edge with a 10px border radius. This specific radius, combined with a thick 3px border, creates the "Duolingo-style" tactile quality.

- **Containers:** All cards and cells must use the standard 10px radius and 3px dark border.
- **Inner Elements:** Nested elements (like inner tags or chips) should use a slightly reduced radius (4px-6px) to maintain visual nested harmony.
- **Icons:** Should be monolinear, matching the 3px stroke weight where possible to feel integrated with the UI.

## Components

- **Buttons:** Large, bold, and colored with **Primary** or **Accent**. They feature the 4px hard shadow. The text is always uppercase or bolded to ensure it commands attention.
- **Cells (Notebook style):** Large containers with a white or light-gray background, a 3px border, and the signature hard shadow. They often include a "gutter" on the left for line numbers or execution status.
- **Input Fields:** Flat white background, 3px dark border. On focus, the border color remains the same, but the background can shift to a very light version of the **Primary** color.
- **Chips/Badges:** Small rounded containers with a 2px border (slightly thinner) and no shadow, used for categorization or tags.
- **Checkboxes/Radios:** Oversized squares or circles with 3px borders. When checked, they fill with the **Accent** color and a "Dark" checkmark/dot.
- **Progress Bars:** Flat tracks with a **Dark** border and a solid color fill (no gradients). The fill should have a sharp vertical termination.