---
title: 'Markdown Authors Style Guide'
description: 'Visual reference for standard Markdown element rendering on the VisionInit website.'
layout: 'dev/single' # Use the dev layout
draft: false
exclude_sitemap: true # Exclude this page from the sitemap.xml
tableOfContents:
  startLevel: 2 # Start ToC from H2 headings
  endLevel: 3 # Include up to H3 headings
  ordered: false # Use unordered list (bullets)
---

This style guide demonstrates how standard Markdown elements are rendered visually on the VisionInit website. These styles typically apply within the `.content` CSS class wrapper. Base styles are defined primarily in `assets/scss/_common.scss` and `assets/scss/_typography.scss`.

## Markdown Content Styles

### Headings

Standard HTML headings (`h1` through `h6`) are styled as follows when generated from Markdown.

**Example Markdown:**

```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

**Rendered Output:**

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

---

### Paragraphs & Links

Standard paragraphs provide the base text styling. Links within the content area are styled with the primary color and an underline effect on hover. External links automatically receive an icon via CSS.

**Example Markdown:**

```
This is a standard paragraph defining the base font size, line height, and text color. It can include **bold text** using double asterisks and _italic text_ using single underscores or asterisks. Use `backticks` for inline code.

Content links look like [this internal link](#) which stays on the page. Links to external sites like [the Hugo documentation](https://gohugo.io/){:target="_blank"} automatically get an external link icon. Autodetected links like https://visioninit.dev also work.
```

**Rendered Output:**

This is a standard paragraph defining the base font size, line height, and text color. It can include **bold text** using double asterisks and _italic text_ using single underscores or asterisks. Use `backticks` for inline code.

Content links look like [this internal link](#) which stays on the page. Links to external sites like [the Hugo documentation](https://gohugo.io/){:target="\_blank"} automatically get an external link icon. Autodetected links like https://visioninit.dev also work.

---

### Lists

#### Unordered Lists (`ul`)

Unordered lists within the `.content` area use a custom bullet style.

**Example Markdown:**

```
*   List item one using the default style.
*   List item two, demonstrating wrapping text that continues onto the next line.
*   List item three with **bold text** and a [link to nowhere](#).
*   A nested list example:
  *   Nested item A.
  *   Nested item B with further nesting:
    *   Deeply nested item 1.
    *   Deeply nested item 2.
*   Final top-level item.
```

**Rendered Output:**

- List item one using the default style.
- List item two, demonstrating wrapping text that continues onto the next line.
- List item three with **bold text** and a [link to nowhere](#).
- A nested list example:
- Nested item A.
- Nested item B with further nesting:
- Deeply nested item 1.
- Deeply nested item 2.
- Final top-level item.

#### Ordered Lists (`ol`)

Ordered lists use standard browser numbering, inheriting text styles.

**Example Markdown:**

```
1.  First item in an ordered list.
2.  Second item, showing standard numbering progression.
3.  Third item with a link [like this internal link](#).
  1.  Nested ordered item 3a. This demonstrates indentation.
  2.  Nested ordered item 3b.
4.  Fourth top-level item.
```

**Rendered Output:**

1.  First item in an ordered list.
2.  Second item, showing standard numbering progression.
3.  Third item with a link [like this internal link](#).
4.  Nested ordered item 3a. This demonstrates indentation.
5.  Nested ordered item 3b.
6.  Fourth top-level item.

---

### Blockquotes

Blockquotes provide a visually distinct way to emphasize quoted text.

**Example Markdown:**

```
> This is a blockquote. It's typically used for quoting text from another source. It might have a slightly different background or border to set it apart. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
>
> Blockquotes can span multiple paragraphs if needed. This is the second paragraph within the same blockquote.
```

**Rendered Output:**

> This is a blockquote. It's typically used for quoting text from another source. It might have a slightly different background or border to set it apart. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
>
> Blockquotes can span multiple paragraphs if needed. This is the second paragraph within the same blockquote.

---

### Code Blocks

Preformatted code blocks are used for displaying code snippets. Syntax highlighting styles depend on the Hugo configuration in `config/_default/markup.toml`. The container style is in `assets/scss/_common.scss`.

**Example Markdown (using ````` for the outer block and language hint):**

````
```python
import os

def greet(name):
"""Simple greeting function."""
message = f"Hello, {name}!"
print(message)
return message

if __name__ == "__main__":
user = os.getenv("USER", "World")
greet(user)
``\`
````

**Rendered Output:**

```python
import os

def greet(name):
"""Simple greeting function."""
message = f"Hello, {name}!"
print(message)
return message

if __name__ == "__main__":
user = os.getenv("USER", "World")
greet(user)
```

---

### Tables

Basic table styling is provided for standard Markdown tables.

**Example Markdown:**

```
| Feature         | Status      | Notes                           |
| :-------------- | :---------: | :------------------------------ |
| Authentication  | Implemented | Uses JWT for session management |
| User Profiles   | Pending     | Basic structure in place        |
| Data Export     | Complete    | Supports CSV and JSON formats   |
| API Integration | Partial     | Connected to service A, B pending |
```

**Rendered Output:**

| Feature         |   Status    | Notes                             |
| :-------------- | :---------: | :-------------------------------- |
| Authentication  | Implemented | Uses JWT for session management   |
| User Profiles   |   Pending   | Basic structure in place          |
| Data Export     |  Complete   | Supports CSV and JSON formats     |
| API Integration |   Partial   | Connected to service A, B pending |

---

### Horizontal Rules

Horizontal rules create thematic breaks between sections.

**Example Markdown:**

```
Content above the rule.

---

Content below the rule.

***

Another rule using asterisks.

___

And one using underscores.
```

**Rendered Output:**

Content above the rule.

---

Content below the rule.

---

Another rule using asterisks.

---

And one using underscores.

---
