---
version: alpha
name: Wayfare
description: Minimal, editorial travel guide for restaurants and attractions — quiet white canvas, photography-led, one deep green accent.
colors:
  primary: "#1F5C4F"
  on-primary: "#FFFFFF"
  primary-hover: "#174A3F"
  secondary: "#A8461F"
  on-secondary: "#FFFFFF"
  surface: "#FFFFFF"
  surface-muted: "#F6F5F2"
  on-surface: "#1A1A1A"
  on-surface-variant: "#5F5F5F"
  outline: "#E4E2DD"
  error: "#B3261E"
  on-error: "#FFFFFF"
typography:
  display:
    fontFamily: Newsreader
    fontSize: 3.5rem
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 2.25rem
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 1.75rem
    fontWeight: 500
    lineHeight: 1.25
  title-md:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.04em
rounded:
  sm: 4px
  md: 8px
  lg: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 96px
components:
  page:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  section-muted:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    padding: 96px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 12px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 12px
    height: 44px
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 12px
    height: 44px
  card-place:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 0px
  card-meta:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-sm}"
  badge-attraction:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 6px
  badge-restaurant:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 6px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 14px
    height: 48px
  divider:
    backgroundColor: "{colors.outline}"
    height: 1px
  alert-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
---

## Overview

Wayfare is a calm, editorial travel guide that recommends restaurants and attractions. It should feel like a well-made printed magazine: photographs do the talking, text stays brief, and the white space around them makes the page feel unhurried. The audience is curious travelers who are planning a trip, either on the go or ahead of time.

Principles:
- **Content first.** Photography and place names carry the page. The UI chrome stays nearly invisible.
- **Generous white space.** When in doubt, add space instead of a border, box or color.
- **One accent.** Deep green (`primary`) is the only strong interactive color. Terracotta (`secondary`) only tags restaurants.
- **Quiet confidence.** Use few font weights and no gradients, decorative shapes or loud badges.

## Colors

- `surface`: the default white canvas for almost every page.
- `surface-muted`: a warm off-white used to separate large page sections (e.g. "Nearby", the footer). Never use it for small boxes.
- `on-surface`: near-black for headings and body text.
- `on-surface-variant`: muted grey for metadata such as distance, price level, opening hours and captions.
- `primary`: deep forest green for links, primary buttons, the active nav state and the attractions category.
- `primary-hover`: a darker green used only for hover and pressed states on `primary` elements.
- `secondary`: terracotta, used only to mark restaurants and food (category badge, map pin). It is not a second CTA color.
- `on-primary` / `on-secondary` / `on-error`: white text on filled color.
- `outline`: hairline dividers and input borders. Use it sparingly; space should be the first separator.
- `error`: form validation and failed actions only.

## Typography

There are two families: **Newsreader**, an editorial serif, for headings, and **Inter** for all UI and reading text.

- `display`: hero headline on the home page and city pages. Use at most one per page.
- `headline-lg`: page title (e.g. a place's name on its detail page).
- `headline-md`: section titles ("Where to eat", "Things to see").
- `title-md`: card titles and place names in lists.
- `body-lg`: intro paragraphs and editorial descriptions.
- `body-md`: default text, form fields.
- `body-sm`: metadata, captions, alerts.
- `label-md`: buttons, badges, tabs. Can be uppercase in badges only.

Keep reading text at 60–72 characters per line. Never use more than three type styles in a single card.

## Layout

- 12-column grid, max content width 1200px, with 720px for article-style text.
- Gutters: `spacing.md` on mobile, `spacing.lg` on desktop. Side page margin is at least 16px on mobile and 48px on desktop.
- Breakpoints: 640px, 1024px, 1280px. Design mobile-first.
- Vertical rhythm: `spacing.2xl` between major sections on desktop (`spacing.xl` on mobile), `spacing.lg` between a section title and its content, and `spacing.md` inside cards.
- Place grids are 1 column on mobile, 2 on tablet and 3 on desktop. Do not pack 4+ columns.
- Stay low-density: show fewer items with more space, and add "See all" links instead of long grids.

## Elevation & Depth

The design is essentially flat. Hierarchy comes from space, type and imagery, not shadows.
- Cards have no shadow and no border at rest. The image edge defines the card.
- On hover, a card may lift with a very soft shadow (`0 8px 24px rgba(0,0,0,0.06)`) and its image may scale 1.02×.
- Only overlays (modals, dropdowns, the map's place popover) use a persistent shadow, `0 12px 32px rgba(0,0,0,0.10)`.
- The sticky header uses a white background and an `outline` hairline, never a shadow.

## Shapes

- `rounded.lg`: card images and photo galleries; softens the photography.
- `rounded.md`: alerts, modals, the map container.
- `rounded.sm`: small thumbnails and tooltips.
- `rounded.full`: buttons, inputs, search bar, badges, avatars. Pills read as friendly and light.
- Icons: 1.5px outline icons (e.g. Lucide) at 20px with rounded caps. Never use filled or multicolor icons.

## Components

- **page**: the base white canvas with `body-md` text.
- **section-muted**: full-width band for secondary sections; always pad generously.
- **button-primary / button-primary-hover**: the main action ("Save place", "Get directions"). Use one per view. 44px minimum touch height.
- **button-ghost**: secondary actions ("Share", "See all"), shown as green text on white with no fill.
- **card-place**: image on top (4:3 or 3:2), then `title-md` name. No inner padding around the image. Text sits below it with `spacing.sm` gaps.
- **card-meta**: the single metadata line under a card title, e.g. "Bistro · $$ · 0.8 km". Use `on-surface-variant`.
- **badge-attraction / badge-restaurant**: category pills placed on the card image's top-left corner. Use one badge per card.
- **input**: pill-shaped search and form fields with an `outline` border. The focus state uses a 2px `primary` ring.
- **divider**: 1px `outline` line. Use only between list rows, never between sections.
- **alert-error**: inline error messages after failed form submits or loads.

## Do's and Don'ts

- Do let photos run large; use high-quality images with consistent aspect ratios in each grid.
- Do separate content with space first, `surface-muted` bands second and `divider` last.
- Do keep one `button-primary` per screen; everything else uses `button-ghost` or plain links.
- Do use `secondary` only for restaurant and food signals so the color stays meaningful.
- Don't add borders or shadows to cards at rest.
- Don't put text over photos unless it sits on a dark scrim with at least 4.5:1 contrast.
- Don't use more than two font weights in one component, or any bold body text.
- Don't introduce new accent colors for ratings, deals or tags; use `on-surface` text and icons instead.
- Don't shrink section spacing below `spacing.xl` to fit more content above the fold.
