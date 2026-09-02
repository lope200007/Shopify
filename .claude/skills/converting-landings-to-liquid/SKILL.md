---
name: converting-landings-to-liquid
description: Use when turning an HTML landing page into Shopify theme sections, building or editing .liquid section files, working with section schema settings and blocks, or integrating a custom page into a theme like Dawn.
---

# Converting Landings to Liquid

Turns a static HTML landing into Shopify sections the merchant can edit in the
theme editor without touching code. One HTML block becomes one section file.

Platform facts below were verified against shopify.dev in September 2026.

## The split

Each visual block of the landing becomes its own file in `sections/`:

```
sections/
  landing-hero.liquid
  landing-problem.liquid
  landing-proof.liquid
  landing-offer.liquid
```

Then the merchant assembles them in the theme editor. Rule of thumb: **anything
the merchant might want to reword, reorder or hide is a section; anything
repeated inside a section is a block.**

## Anatomy of a section

```liquid
<section class="landing-proof">
  <h2>{{ section.settings.heading | escape }}</h2>

  <div class="landing-proof__grid">
    {% for block in section.blocks %}
      <figure {{ block.shopify_attributes }}>
        {% if block.settings.image %}
          <img src="{{ block.settings.image | image_url: width: 600 }}"
               alt="{{ block.settings.name | escape }}"
               width="600" height="600" loading="lazy">
        {% endif %}
        <blockquote>{{ block.settings.quote }}</blockquote>
      </figure>
    {% endfor %}
  </div>
</section>

{% schema %}
{
  "name": "Landing proof",
  "tag": "section",
  "class": "shopify-section--landing-proof",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "What buyers say" }
  ],
  "blocks": [
    {
      "type": "testimonial",
      "name": "Testimonial",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Photo" },
        { "type": "text", "id": "name", "label": "Name" },
        { "type": "richtext", "id": "quote", "label": "Quote" }
      ]
    }
  ],
  "max_blocks": 12,
  "presets": [{ "name": "Landing proof" }]
}
{% endschema %}
```

## Schema attributes

| Attribute | Notes |
|---|---|
| `name` | Required. Title shown in the theme editor. |
| `tag` | `article`, `aside`, `div`, `footer`, `header`, `section`. Defaults to `div`. |
| `class` | Appended to the generated `shopify-section` class. |
| `limit` | Accepts **only 1 or 2**. Caps how many times the section can be used. |
| `settings` | Section-level. IDs unique within the section. |
| `blocks` | Repeatable modules. Types and names must be unique. |
| `max_blocks` | Ceiling is **50 blocks per section**. |
| `presets` | **Required to add the section from the theme editor.** Omit it and the section is invisible to the merchant. |
| `default` | For statically rendered sections, same shape as presets. |
| `locales` | Translations, read with `'sections.name.key' | t`. |
| `enabled_on` / `disabled_on` | Mutually exclusive. Never both. |

## Setting types

Basic: `text`, `textarea`, `number`, `checkbox`, `radio`, `range`, `select`

Specialized: `richtext`, `inline_richtext`, `html`, `liquid`, `image_picker`,
`video`, `video_url`, `url`, `link_list`, `color`, `color_background`,
`color_scheme`, `color_palette`, `font_picker`, `product`, `product_list`,
`collection`, `collection_list`, `blog`, `article`, `article_list`, `page`,
`metaobject`, `metaobject_list`, `text_alignment`

Two that reject invalid schemas:

- **`range` requires `min`, `max` and `default`.** None of `min`, `max`, `step`,
  `default` may be a string — `"min": "0"` fails validation.
- **`select` requires an `options` array** of `{ "value", "label" }` pairs.

## Hard limits

- **50 blocks** per section
- **25 sections** per JSON template or section group
- `limit` accepts only `1` or `2`

## Mistakes that break the theme editor

| Mistake | Result |
|---|---|
| No `presets` | Merchant cannot add the section at all |
| `{{ block.shopify_attributes }}` missing | Editor can't target blocks; live preview and reordering break |
| Liquid inside `{% schema %}` | Schema is plain JSON. Liquid is not evaluated. |
| Two `{% schema %}` tags in one file | Invalid — exactly one per section |
| Trailing comma in schema JSON | Whole section fails to load |
| Hardcoded text left in markup | Merchant can't edit it; defeats the point |

`{{ block.shopify_attributes }}` goes on the **outermost element of each block**
inside the `for` loop. Sections get their wrapper attributes automatically;
blocks do not.

## Output escaping

- Plain text into markup → `| escape`
- `richtext` and `inline_richtext` already return HTML → do **not** escape
- Images → `| image_url: width: N`, always with `width`, `height` and `alt`

## Dawn conventions

Dawn is the reference theme; match it so the merchant isn't surprised.

- BEM-ish class names scoped to the section: `.landing-proof__grid`
- Section-specific CSS in `assets/section-landing-proof.css`, loaded with
  `{{ 'section-landing-proof.css' | asset_url | stylesheet_tag }}`
- Never edit Dawn's own files to make a custom section work — add files
- Keep JavaScript out unless required; prefer CSS

## Verifying before handing it over

1. Schema must be **valid JSON** — parse it, don't eyeball it
2. Every `settings` and `blocks` id is referenced somewhere in the markup
3. Every `for block in section.blocks` loop outputs `block.shopify_attributes`
4. `presets` present
5. Run `shopify theme check` if the CLI is available
