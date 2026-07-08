# How I Built Aria's Atelier

A short writeup of the process, the tools I used, and the decisions behind the project.

---

## 1. The idea

I wanted to build a **concept boutique** for haute horlogerie — a site that feels like
stepping into a quiet, high-end watch gallery rather than a normal e-commerce page. The
goal was atmosphere: deep near-black backgrounds, warm gold accents, elegant serif
typography, and slow, deliberate motion. Everything was meant to feel *curated*.

The fictional boutique is set in Banjarbaru, and the catalogue features six real
maisons — Rolex, Omega, Audemars Piguet, Cartier, Patek Philippe, and Jaeger-LeCoultre.

## 2. Design first — the Figma blueprint

Before writing any code, I laid the whole thing out in **Figma**:

- **Moodboard & palette** — I settled on a restrained scheme: near-black inks
  (`#0a0908`), warm creams for light sections, and a signature gold (`#c2a35f`). Keeping
  the palette tight is what makes it read as "luxury" instead of busy.
- **Typography** — I paired three typefaces: **Playfair Display** for headlines,
  **Cormorant Garamond** for display/italic accents, and **Inter** for clean body and
  UI text.
- **Wireframes** — I blocked out each page (home, maisons, individual maison, watch
  detail, gallery, contact) and worked out the grid, spacing rhythm, and the
  letter-spaced "overline" labels that repeat throughout.
- **Components** — cards, nav, footer, and the watch "stage" were designed as reusable
  blocks in Figma first, so the code could mirror them one-to-one.

That Figma blueprint became my source of truth — the CSS design tokens in the project
are basically the Figma styles translated into variables.

## 3. Turning the design into a system

I converted the Figma styles into a small **design-token system** in
[`globals.css`](../src/app/globals.css): CSS custom properties for every ink, cream, and
gold shade, plus the font and letter-spacing scales. Tailwind reads these through its
`@theme` block, so I can write classes like `bg-ink` or `text-gold` and stay perfectly
on-brand across the whole site.

## 4. Building it

The site is a **Next.js (App Router) + TypeScript** project. A few things I'm happy
with:

- **Data-driven catalogue** — every timepiece lives as a typed entry in
  [`watches.ts`](../src/data/watches.ts) (reference, price, specs, and a `dialStyle`
  object). The pages are generated from this data, so adding a watch is just adding an
  object.
- **Parametric watch dials** — instead of relying only on photos, I wrote a
  `WatchDial` renderer that draws each dial as SVG from the `dialStyle` values (dial
  colour, bezel, hands, markers, accent). That's what gives every model its own look
  programmatically.
- **Static generation** — the individual watch and maison pages use
  `generateStaticParams`, so all ~40 pages are pre-rendered as static HTML for fast
  loads.
- **Motion** — page transitions and scroll reveals use the **Motion** library, wrapped
  in a small set of primitives (`Reveal`, etc.) so animation stays consistent.
- **Component architecture** — the UI is split into focused components
  (`site-nav`, `watch-card`, `watch-stage`, `collection-view`, `maison-card`,
  `ambient`, and more) under [`src/components`](../src/components).

## 5. Tools I used

| Area | Tool |
| --- | --- |
| Design / blueprint | **Figma** |
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript** |
| UI library | **React 19** |
| Styling | **Tailwind CSS v4** + custom CSS design tokens |
| Animation | **Motion** |
| Icons | **lucide-react** |
| Image processing | **sharp** |
| Fonts | Playfair Display, Cormorant Garamond, Inter (via `next/font`) |
| Hosting | **Vercel** (connected to this GitHub repo) |
| AI assistance | **Claude** — used for pair-programming |

### On AI assistance

I used **Claude** as a coding assistant while building this — mostly to speed up
scaffolding components, debug tricky layout/animation issues, and sanity-check
TypeScript. The design direction, the Figma blueprint, the data, and the decisions about
how everything should look and behave were mine; Claude was a tool in the workflow, the
same way I used Figma and Tailwind.

## 6. Deploying

The project is pushed to GitHub and deployed on **Vercel**. Because the repo is
connected, every push automatically rebuilds and redeploys the live site — so the
deployed link always reflects the latest commit.

---

*Aria's Atelier is a non-commercial student project. See
[DISCLAIMER.md](../DISCLAIMER.md) for copyright details.*
