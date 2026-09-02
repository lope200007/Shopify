---
name: designing-converting-landings
description: Use when building or improving a product landing page for paid traffic — dropshipping, direct response, single-product pages, or when asked to analyze a competitor or marketplace page and turn it into a page that converts.
---

# Designing Converting Landings

A landing page for paid traffic has one job: take a stranger who clicked an ad
and get them to buy, in one session, on a phone. It is not a website.

## Before writing any HTML, get these four answers

You cannot write a converting page without them. Ask if they are missing.

1. **Who clicks the ad** — the specific person and the moment they feel the problem
2. **What the offer is** — price, shipping, guarantee, what arrives in the box
3. **The mechanism** — *why* this product works, in one sentence a stranger believes
4. **The top objection** — the real reason they close the tab

## Page structure

Order matters more than wording. Each block earns the scroll to the next.

| Block | Job |
|---|---|
| Above the fold | Promise + product visible + price + CTA. No carousel, no menu. |
| Problem | Name the pain in their words. They should feel *seen*, not sold. |
| Mechanism | Why this works. The differentiator that isn't "quality". |
| Demonstration | Product in use. Video or sequence, not a catalogue shot. |
| Proof | Reviews, UGC, numbers you can substantiate. |
| Objections | Answer the top 3 explicitly. Size, shipping time, "will it work for me". |
| Offer | Price framing, bundles, what's included, shipping. |
| Risk reversal | Guarantee, returns. Removes the last reason to wait. |
| Final CTA | Repeat the offer. Never end on a footer. |

Repeat the CTA after mechanism, after proof, and at the end. A user ready to
buy at 40% scroll must not have to hunt.

## Mobile first, literally

Paid social traffic is overwhelmingly phones. Design the 390px view first and
let the desktop view be the adaptation, not the reverse.

- Tap targets ≥ 44px, CTA reachable with a thumb
- Body text ≥ 16px (iOS zooms on focus below that)
- One column. Multi-column layouts collapse into confusing stacks.
- Test the page at 390px wide before calling it done

## Speed is conversion

Every second of load is paid traffic you already bought and lost.

- Images compressed and correctly sized; `width`/`height` on every `<img>` to
  stop layout shift; `loading="lazy"` below the fold
- The hero image is the LCP element — never lazy-load it
- No jQuery, no carousel library, no icon font. Inline CSS. Vanilla JS if any.

## Reading a reference page (competitor or marketplace)

Extract the **structure and the argument**: block order, which objection they
answer first, how they frame the offer, what proof they lean on, where the CTAs
sit.

**Never copy their copy, images, reviews, or brand assets.** That is copyright
infringement and it gets pages taken down and ad accounts banned. Marketplaces
also prohibit scraping in their terms — read pages manually or use an official
API.

## Claims that get stores shut down

A page that converts and gets banned is worth nothing. These are not style
preferences — they are illegal in the EU, UK and US, and violate Shopify and
Meta policy:

- **Fake urgency** — countdown timers that reset, "only 3 left" when stock is unlimited
- **Fabricated reviews** or testimonials, invented star ratings
- **Invented statistics** — never write "increases X by 47%" unless given a real source
- **Health, medical or income claims** — "cures", "burns fat", "earn €5k/month"
- **Fake anchor pricing** — a "was €99" price never actually charged

Real scarcity, real reviews and real guarantees convert fine. Use those.

## Output

One self-contained HTML file: semantic markup, inline `<style>`, mobile-first,
no external dependencies, real copy in the target language (not lorem ipsum),
and `<!-- comments -->` marking each block so it can be split into Shopify
sections later.

**Next step:** to put this on a store, use the `converting-landings-to-liquid`
skill.
