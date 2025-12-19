# Cursor Handoff: Kyle Palaniuk Personal Website

## Project Status
**Working**: Site runs at localhost:3000, Clerk auth configured, custom cursor works
**Needs Work**: Design quality, scroll animations, overall polish

---

## Tech Stack (Current)
- Next.js 14.2.21 (App Router)
- Tailwind CSS
- Framer Motion (installed but animations underwhelming)
- Clerk v5 for auth
- Fonts: Cormorant Garamond (display) + Outfit (body)

---

## Design Reference
Kyle wants the site to feel like **https://azizkhaldi.com/**:
- Smooth scroll-triggered animations
- Animated sticky navigation
- Custom cursor effect ✓ (working)
- Clean typography
- Professional but warm feel
- Lines/elements that follow scrolling

---

## Color Palette (in tailwind.config.ts)
```
sand: #F5F0E8 (warm background)
midnight: #1A1A2E (primary dark)
terracotta: #C4785A (accent warm)
ocean: #2D5A7B (accent cool)
sunset: #E8A87C (secondary warm)
cream: #FAF7F2 (light background)
```

---

## Site Structure
```
/ (home) - Hero + intro + section previews
/about - Bio + community (GH Sessions, FC Balboa coaching, Granada House)
/music - StronGnome band, performances, embedded music
/professional - SDMC COO role, Granada House ecosystem
/contact - Contact form, socials
/family/* - Protected (requires Clerk login)
```

---

## Kyle's Background (for content)
- **Day job**: COO at SDMC (San Diego Mortgage Couple)
- **Music**: Trumpet & vocals with StronGnome (collaborators: Seth, Jaime)
- **Community**: GH Sessions (jazz nights), FC Balboa soccer coach, Granada House Podcast
- **Ventures**: GH Group, GH Sessions, GH Design (Paige's interior design)
- **Personal**: Two kids, '91 Westfalia van, based in San Diego
- **Tagline**: "Building businesses, bands, and community in San Diego"

---

## Current Issues to Fix

### 1. Design Quality
The current design feels generic/basic. Needs:
- More visual interest and depth
- Better spacing and rhythm
- Stronger typography hierarchy
- Background textures or gradients that feel intentional
- Cards/sections that feel more designed

### 2. Scroll Animations
The `AnimatedSection` component exists but animations are underwhelming:
- Need smoother, more noticeable scroll-triggered reveals
- Staggered animations for lists/grids
- Parallax effects where appropriate
- Consider GSAP or ScrollTrigger if Framer Motion isn't enough

### 3. Navigation
- Should feel more polished on scroll
- Background blur/transparency transition could be smoother
- Mobile menu needs refinement

### 4. Hero Section
- Needs more visual impact
- The decorative circles are too subtle
- Consider animated elements or more dynamic composition

---

## File Locations

**Pages** (edit content here):
- `app/page.tsx` - Home
- `app/about/page.tsx` - About + Community
- `app/music/page.tsx` - Music
- `app/professional/page.tsx` - Professional
- `app/contact/page.tsx` - Contact
- `app/family/page.tsx` - Family hub (protected)

**Components**:
- `components/Navigation.tsx` - Header/nav
- `components/CustomCursor.tsx` - Mouse effect ✓
- `components/AnimatedSection.tsx` - Scroll animations (needs improvement)
- `components/Footer.tsx` - Footer

**Styles**:
- `app/globals.css` - Global styles, CSS variables, animations
- `tailwind.config.ts` - Colors, fonts, custom animations

**Config**:
- `middleware.ts` - Clerk route protection
- `.env.local` - Clerk API keys (already configured)

---

## Kyle's Preferences
- Functional simplicity over complex features
- Warm, professional-but-approachable tone
- Mobile-friendly
- Prefers direct links over embedded dashboards
- Likes systems he can maintain conversationally via AI

---

## Immediate Priorities
1. **Improve hero section** - More visual impact, better animations
2. **Fix scroll animations** - Make them noticeable and smooth
3. **Refine typography** - Better hierarchy, spacing
4. **Add visual depth** - Gradients, textures, shadows that feel intentional
5. **Polish navigation** - Smoother transitions

---

## Commands
```bash
npm run dev    # Dev server at localhost:3000
npm run build  # Production build
vercel         # Deploy (once ready)
```

---

## Deployment Plan
- Domain: kyle.palaniuk.net (subdomain of palaniuk.net on Bluehost)
- Hosting: Vercel
- DNS: CNAME record pointing `kyle` to `cname.vercel-dns.com`

---

## Session Context
This project started in a Claude.ai conversation where we:
1. Discussed architecture (public pages + private family section)
2. Chose Next.js + Clerk + Framer Motion stack
3. Built initial scaffolding
4. Worked through dependency issues (Clerk v5 + Next.js compatibility)
5. Got the site running locally

Now handing off to Cursor for iterative design improvements and content work.

---

## First Prompt Suggestion
"Look at the current home page (app/page.tsx) and globals.css. The design feels too basic compared to the reference site azizkhaldi.com. Let's improve the hero section first — I want more visual impact, smoother animations, and better scroll-triggered reveals. Show me what you'd change."
