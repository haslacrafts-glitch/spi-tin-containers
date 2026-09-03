---
name: Industrial Precision
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5b403b'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8f706a'
  outline-variant: '#e3beb7'
  surface-tint: '#b62410'
  primary: '#730900'
  on-primary: '#ffffff'
  primary-container: '#9e1000'
  on-primary-container: '#ffaa9b'
  inverse-primary: '#ffb4a6'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#363738'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c4e4f'
  on-tertiary-container: '#bfbfc0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a6'
  on-primary-fixed: '#3f0300'
  on-primary-fixed-variant: '#900e00'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for the manufacturing and industrial sectors, evoking a sense of structural integrity, reliability, and high-performance engineering. The aesthetic merges **Corporate Modernism** with **Industrial Brutalism**, utilizing heavy-weighted typography and a strict adherence to a grid.

The target audience consists of operations managers, engineers, and supply chain directors who require high-density information environments that remain legible and authoritative under pressure. The emotional response is one of "ordered power"—a feeling that the software is as durable and precise as the machinery it monitors.

**Key Stylistic Pillars:**
- **Rigid Structure:** Visible or implied grid lines and consistent alignment.
- **High Information Density:** Minimal decorative whitespace; focus on functional layout.
- **Material Honesty:** Use of "raw" UI elements—unblurred surfaces, clear borders, and high-contrast indicators.

## Colors

The palette is anchored by **Bold Industrial Red**, a color signifying action, urgency, and mechanical power. This is balanced by a grayscale spectrum ranging from deep charcoal to architectural whites, ensuring the interface feels grounded and professional.

- **Primary Red (#9e1000):** Used for critical actions, brand accents, and active states. It must always maintain a 4.5:1 contrast ratio against background surfaces.
- **Secondary Charcoal (#262626):** Used for navigation sidebars, headers, and primary text to provide a sophisticated, heavy-duty feel.
- **Functional Grays:** A systematic range of neutrals used for borders, subtle backgrounds, and disabled states to keep the focus on the primary data.

## Typography

The design system utilizes a dual-font strategy to balance corporate reliability with technical precision.

- **IBM Plex Sans:** The primary workhorse. Its industrial origins and technical glyphs make it perfect for data-heavy interfaces and body copy. It provides the "human" yet structured feel required for complex software.
- **JetBrains Mono:** Reserved for labels, data values, serial numbers, and status chips. The monospaced nature ensures that columns of numbers align perfectly, aiding in rapid scanning of technical specifications.

**Guidelines:**
- Use `headline-lg` for dashboard titles.
- Use `label-sm` in all-caps for table headers and metadata descriptors.
- Tighten letter-spacing on larger headlines to increase visual impact.

## Layout & Spacing

This design system uses a **Fluid-Fixed Hybrid Grid**. The sidebar remains fixed for navigation efficiency, while the main content area utilizes a 12-column fluid grid to maximize the utility of wide-screen industrial monitors.

- **Grid:** 12 columns with 16px gutters.
- **Rhythm:** An 8px baseline grid is used for vertical spacing, with 4px increments for tight internal component spacing.
- **Responsive Behavior:** 
  - **Desktop (1024px+):** 12 columns, 32px margins.
  - **Tablet (768px - 1023px):** 8 columns, 24px margins.
  - **Mobile (Up to 767px):** 4 columns, 16px margins. Content stacks vertically; sidebars transform into bottom sheets or hidden drawers.

## Elevation & Depth

To maintain a "flat and functional" industrial aesthetic, the design system minimizes the use of shadows. Instead, it relies on **Tonal Layering** and **High-Contrast Outlines**.

- **Surface Tiers:** Backgrounds use `surface`, while cards and containers use `surface-variant` or pure white with a 1px `outline` border (#d1d1d1).
- **Depth through Borders:** Elevation is communicated by border-weight shifts (e.g., 2px borders for active states) rather than soft shadows.
- **Active States:** Elements that are "raised" or "active" receive a 2px solid stroke of the `primary` red color.
- **Shadow Exceptions:** Only used for floating elements like Modals or Context Menus. Use a sharp, low-blur shadow (0px 4px 8px rgba(0,0,0,0.1)) to maintain a crisp look.

## Shapes

The shape language is "Soft-Mechanical." We avoid the friendly roundness of consumer apps in favor of a precision-machined look.

- **Standard Elements (Buttons, Inputs):** 4px (0.25rem) corner radius. This provides just enough softness to be modern while retaining a rectangular, efficient silhouette.
- **Large Containers (Cards, Modals):** 8px (0.5rem) corner radius.
- **Data Indicators (Chips):** Can be pill-shaped only if they represent status tags (e.g., "Active", "Error"), otherwise follow the 4px standard.

## Components

### Buttons
- **Primary:** Solid Red (#9e1000) with White text. 4px radius. No gradient.
- **Secondary:** Solid Charcoal (#262626) or 1px Charcoal outline with Charcoal text.
- **State:** On hover, primary red darkens by 10%. On press, it scales slightly (98%) to provide tactile feedback.

### Input Fields
- **Style:** 1px border (#d1d1d1). Label uses `label-md` (JetBrains Mono) placed above the field.
- **Focus State:** 2px border of `primary` red.

### Chips & Tags
- **Technical Tags:** Monospaced text, light gray background, 2px radius.
- **Status Tags:** Use `primary-container` (Pale Red) for alerts and neutral grays for idle states.

### Cards
- No shadows. Use a 1px border (#d1d1d1) and a 4px corner radius. Header areas within cards should have a subtle gray background (`surface-variant`) to separate them from the content.

### Lists & Tables
- High-density. 8px padding between rows.
- Use zebra-striping with `surface-variant` for readability in large data sets.
- Column headers must be `label-sm` (Monospaced, Uppercase).