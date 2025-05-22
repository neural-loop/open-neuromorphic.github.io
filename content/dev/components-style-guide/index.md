---
title: 'Components Style Guide'
description: 'Visual reference for common UI components, buttons, cards, and shortcodes used on the VisionInit website.'
layout: 'dev/single' # Use the dev layout
draft: false
exclude_sitemap: true # Exclude this page from the sitemap.xml
tableOfContents:
  startLevel: 2 # Start ToC from H2 headings
  endLevel: 3 # Include up to H3 headings
  ordered: false # Use unordered list (bullets)
---

This style guide provides a reference for developers and site builders working on the VisionInit website. It showcases reusable UI components, partials, shortcodes, and specific element styles like buttons and cards by rendering live examples using a single shortcode processed by the layout.

## Color Palette

Key color variables used throughout the theme are defined in `assets/scss/_variables.scss`.

_(This section uses a table with the `colorswatch` shortcode for visual clarity)_

| Variable Name       | Value     | Swatch                              | Usage Notes                                                     |
| :------------------ | :-------- | :---------------------------------- | :-------------------------------------------------------------- |
| `$primary-color`    | `#636c7a` | {{< colorswatch color="#636c7a" >}} | Links, accents, buttons, active states                          |
| `$secondary-color`  | `#000000` | {{< colorswatch color="#000000" >}} | Overlays, some backgrounds/accents                              |
| `$text-color-dark`  | `#1e1e4b` | {{< colorswatch color="#1e1e4b" >}} | Primary heading color, dark text elements                       |
| `$text-color`       | `#5c5c77` | {{< colorswatch color="#5c5c77" >}} | Standard paragraph text                                         |
| `$text-color-light` | `#8585a4` | {{< colorswatch color="#8585a4" >}} | Lighter text, meta info, helper text                            |
| `$text-lighten`     | `#d6d6e0` | {{< colorswatch color="#d6d6e0" >}} | Very light text (e.g., on page headers, newsletter block)       |
| `$body-color`       | `#ffffff` | {{< colorswatch color="#ffffff" >}} | Main site background                                            |
| `$border-color`     | `#ededf1` | {{< colorswatch color="#ededf1" >}} | Standard borders, dividers                                      |
| `$light`            | `#f8f9fe` | {{< colorswatch color="#f8f9fe" >}} | Light background variant (blockquotes, code, some cards)        |
| `$gray`             | `#f8f8f8` | {{< colorswatch color="#f8f8f8" >}} | Alternate light background (offset boxes, subscription section) |
| `$white`            | `#fff`    | {{< colorswatch color="#fff" >}}    | White text, backgrounds                                         |
| `$black`            | `#000`    | {{< colorswatch color="#000" >}}    | Black text, backgrounds                                         |

---

## Buttons

Button styles are defined in `assets/scss/_buttons.scss`. They use Bootstrap classes with theme overrides.

### Standard Buttons

**Example HTML Structure:**

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline-primary">Outline</button>
<button class="btn btn-light">Light</button>
```

**Live Rendered Output:**
{{< style_guide_render component="buttons" >}}

### Small Buttons (`.btn-sm`)

**Example HTML Structure:**

```html
<button class="btn btn-sm btn-primary">Primary Small</button>
<button class="btn btn-sm btn-outline-primary">Outline Small</button>
<button class="btn btn-sm btn-light">Light Small</button>
```

**Live Rendered Output:**
{{< style_guide_render component="buttons_sm" >}}

### Extra Small Buttons (`.btn-xs`)

**Example HTML Structure:**

```html
<button class="btn btn-xs btn-primary">Primary XS</button>
<button class="btn btn-xs btn-outline-primary">Outline XS</button>
<button class="btn btn-xs btn-light">Light XS</button>
```

**Live Rendered Output:**
{{< style_guide_render component="buttons_xs" >}}

### Special Hero Button

Used on dark/image backgrounds. Add `.text-white.border-white` to `.btn-outline-primary`.

**Example HTML Structure:**

```html
<button class="btn btn-outline-primary text-white border-white">
  Hero Outline
</button>
```

**Live Rendered Output (on dark background):**
{{< style_guide_render component="buttons_hero" >}}

---

## Cards & Boxes

Various card styles are used for different content types.

### Offset Shadow Box (`.offset-shadow-box`)

**Source:** `assets/scss/_common.scss`
**Appearance:** Static offset shadow (bottom-left).
**Common Usage:** Sidebar widgets (blog), Subscription plan cards, Service CTA box.

**Example HTML Structure:**

```html
<div class="offset-shadow-box bg-white p-4">...Content...</div>
```

**Live Rendered Output:**
{{< style_guide_render component="card_offset" >}}

### Hover Shadow Card Link (`.hover-shadow`)

**Source:** `assets/scss/templates/_homepage.scss`
**Appearance:** Interactive offset shadow on hover. Used for clickable cards.
**Common Usage:** Service cards (homepage, `/services/`).

**Example HTML Structure (using `<a>`):**

```html
<a href="#" class="card rounded-0 border hover-shadow ...">
  <i class="fa-solid fa-code feature-icon"></i>
  <h5>Title</h5>
  <p>Description</p>
</a>
```

**Live Rendered Output:**
{{< style_guide_render component="card_hover" >}}

### Service Card

**Partial:** `layouts/partials/components/service-card.html`
**Appearance:** Clickable card using `.hover-shadow`, displays icon, title, description.
**Usage:** Called by layouts like `layouts/services/list.html`.

**(See Live Examples on: [Services Page](/services/))**

### Subscription Card

**Partial:** `layouts/partials/components/subscription-card.html`
**Appearance:** Uses `.offset-shadow-box`, displays plan details.
**Usage:** Called by layouts like `layouts/index.html` (homepage) or pages like `/security-sidekick/`.

**Live Rendered Output:**
{{< style_guide_render component="card_subscription" >}}

### Portfolio Card (Wide)

**Partial:** `layouts/partials/components/portfolio-card-wide.html`
**Appearance:** Wide card (image left, text right), static shadow, `object-fit: contain` image.
**Usage:** Called by `layouts/services/single.html` to show related projects.

**(See Live Examples on individual service pages, e.g., [Custom Web Dev](/services/custom-web-application-development/))**

### Item Card (General Purpose)

**Partial:** `layouts/partials/components/item-card.html`
**Appearance:** Vertical card (image, title, desc, tags, button).
**Usage:** Called by list layouts like `layouts/_default/list.html` (e.g., Blog).

**(See Live Examples on: [Blog Page](/blog/))**

---

## Shortcodes

Reusable content snippets callable within Markdown.

### Accordion

**Shortcode:** `accordion`
**Source:** `layouts/shortcodes/accordion.html`, `assets/scss/templates/_accordion.scss`, `assets/js/accordion.js`
**Function:** Creates collapsible content sections.

**Example Shortcode Usage:**

```go-text-template
{{</* accordion title="Your Question Here?" */>}}
The answer content, supporting **Markdown**, goes inside the shortcode tags.
{{</* /accordion */>}}
```

{{< accordion title="This is an Accordion Example" >}}
This is the content revealed when the accordion is opened. It uses the standard `accordion` shortcode internally.
{{< /accordion >}}
{{< accordion title="Another Accordion Item" >}}
More content can go here. You can put **Markdown** inside the accordion shortcode.
{{< /accordion >}}

### Image

**Shortcode:** `image`
**Source:** `layouts/shortcodes/image.html`
**Function:** Inserts an image with alignment, caption, etc.

**Example Shortcode Usage:**

```go-text-template
{{</* image src="/images/about/..." alt="..." caption="..." align="right" maxWidth="30%" */>}}
```

**(See Live Example on: [About Page](/about/))**

### Color Swatch

**Shortcode:** `colorswatch`
**Source:** `layouts/shortcodes/colorswatch.html`
**Function:** Displays a small colored rectangle.

**Example Shortcode Usage:**

```go-text-template
{{</* colorswatch color="#1796b2" */>}}
```

**Live Rendered Output:**
{{< colorswatch color="#1796b2" >}}

---

## Form Elements (Footer Context)

Styled for the dark background of the footer newsletter/contact block.

**Source:** `assets/scss/templates/_homepage.scss` (`.newsletter-block`), `assets/scss/_common.scss`.

**Example Structure (Inputs, Textarea, Toggle Buttons):**

```html
<form>
  <input type="text" class="form-control form-control-sm" placeholder="Name" />
  <input
    type="email"
    class="form-control form-control-sm"
    placeholder="Email"
  />
  <textarea
    class="form-control form-control-sm"
    rows="4"
    placeholder="Message"
  ></textarea>
  <button type="submit" class="btn btn-light btn-block">Send</button>
</form>
<button class="btn btn-sm btn-light">
  <i class="fa-solid fa-paper-plane"></i> Message
</button>
<button class="btn btn-sm btn-outline-light">
  <i class="fa-solid fa-calendar-check"></i> Schedule
</button>
```

**Live Rendered Output (simulated context):**
{{< style_guide_render component="form_elements" >}}

---

## Key Layout Partials

These structural partials define major page sections. Refer to the source files for details.

- `layouts/partials/header.html` (Navigation)
- `layouts/partials/page-header.html` (Breadcrumbs, Title, OG Preview)
- `layouts/partials/og-preview.html` (OG Image component in header)
- `layouts/partials/footer.html` (Footer columns, CTA, Copyright)
- `layouts/partials/sidebar/*.html` (Blog sidebar widgets)
- `layouts/partials/components/*.html` (Reusable cards - listed above)

---
