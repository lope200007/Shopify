---
name: spending-credits-last
description: Use when a task could consume paid API credits or a metered third-party service — supplier lookups, product research, competitor data — or when a call fails with a quota, billing or 402 error.
---

# Spending Credits Last

A paid API call is the **last** step of research, never the first. Most
candidates die on free evidence; paying to learn what a free source already
told you is pure waste.

## The order

```
1. What we already bought   → npm run linkfox -- list
2. Free public sources      → WebSearch / WebFetch
3. Own reasoning + skills   → researching-product-market, ecommerce-advisor
4. Paid API                 → only for finalists that survived 1-3
```

Never call a paid API for a candidate that has not already passed the free
filters. If a product fails on margin arithmetic or is obviously saturated,
that verdict costs nothing and no supplier data will rescue it.

## Free sources that answer most questions

| Question | Free source |
|---|---|
| Is anyone profitably selling this? | Meta Ad Library — ads running unchanged for months |
| Is demand rising or a dying fad? | Google Trends |
| What do buyers complain about? | Marketplace reviews, read directly |
| Who are the competitors and how do they pitch? | Their pages, read directly |
| Does the arithmetic even work? | `researching-product-market` — costs nothing |

These are reachable with WebSearch and WebFetch. No key, no quota.

## What the paid API alone can answer

For linkfox specifically, one thing that is genuinely not public: **supplier-side
sales data on 1688** — wholesale price, order count and units sold over 7 and 30
days. That is worth 9 credits *for a finalist*. It is not worth 9 credits for a
hunch.

## Never pay twice

`npm run linkfox -- search '<params>'` checks the permanent archive before
calling out. linkfox's own cache expires after 24 hours; the archive does not.
An identical question is always free, however old.

So: **make queries broad and reusable.** One search on a category, sorted by
sales volume, returns many products and can be mined repeatedly. Five narrow
searches for five product names cost five times as much and age into
uselessness.

Check `npm run linkfox -- report` to see spend and reuse rate.

## When credits run out (402)

1. **Never buy a plan automatically.** `onboarding.py` can place real orders
   against a real payment method. That decision belongs to the user, always,
   and only when they ask for it in words.
2. Say plainly that credits are exhausted and what it would take to continue.
3. Fall back to the free path and keep working — a 402 stops one lookup, not
   the research.

## Never circumvent metering

Do not fake credits, forge responses, spoof headers, share keys across
accounts, or otherwise evade a provider's billing. It is fraud, it gets the
account terminated, and it puts the user's business at risk. Reusing data the
user already paid for is legitimate; making the meter lie is not.

## The general rule

This applies to any metered service, not just linkfox: exhaust what is free
and what is already bought before spending, keep purchased data forever, and
let the user decide every purchase.
