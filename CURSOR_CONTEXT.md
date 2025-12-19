# Cursor Context: Kyle Palaniuk Personal Website

## Project Overview
This is Kyle Palaniuk's personal website built with Next.js 14, Tailwind CSS, Framer Motion, and Clerk authentication. It showcases his work in business (COO at SDMC), music (StronGnome band), and community involvement (GH Sessions, FC Balboa coaching).

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom color palette
- **Animation**: Framer Motion for scroll animations and interactions
- **Auth**: Clerk for family member authentication
- **Fonts**: Cormorant Garamond (display) + Outfit (body)

## Color Palette
- `sand`: #F5F0E8 (warm background)
- `midnight`: #1A1A2E (primary dark)
- `terracotta`: #C4785A (accent warm)
- `ocean`: #2D5A7B (accent cool)
- `sunset`: #E8A87C (secondary warm)
- `cream`: #FAF7F2 (light background)

## Site Structure
```
/ (home) - Hero + intro + section previews
/about - Bio + community involvement (GH Sessions, coaching, Granada House)
/music - StronGnome, performances, embedded music
/professional - SDMC COO role, Granada House ecosystem, services
/contact - Contact form, socials, email
/family/* - Protected family hub (requires Clerk auth)
/sign-in - Clerk sign-in
/sign-up - Clerk sign-up
```

## Key Components
- `Navigation.tsx` - Animated sticky nav with mobile menu
- `CustomCursor.tsx` - Custom cursor effect (desktop only)
- `AnimatedSection.tsx` - Scroll-triggered fade animations
- `Footer.tsx` - Site footer with links

## Design Notes
- Custom cursor with trailing circle effect
- Smooth scroll-triggered animations on sections
- Grain texture overlay for warmth
- Mobile-first responsive design
- Warm, professional-but-approachable tone

## Content Placeholders to Fill
1. **Images**: Add headshot, band photos, event photos to `/public`
2. **Music links**: Update Spotify/Apple Music/YouTube URLs in `/app/music/page.tsx`
3. **Show dates**: Update `upcomingShows` array in music page
4. **Social links**: Update LinkedIn/Instagram URLs in footer and contact
5. **Contact form**: Add Formspree form ID in contact page
6. **Family links**: Add actual links in family hub

## Common Tasks

### Add a new page
1. Create folder in `/app/[page-name]/`
2. Add `page.tsx` with content
3. Add to navigation in `components/Navigation.tsx`

### Add images
1. Place in `/public/images/`
2. Use Next.js Image component: `import Image from 'next/image'`

### Protect a route
1. Add to `/app/[route]/layout.tsx` with auth check
2. Remove from `publicRoutes` in `middleware.ts`

### Modify animations
- Edit Framer Motion variants in components
- Adjust delays in `AnimatedSection` component
- Tweak timing in `globals.css` keyframes

## Kyle's Preferences
- Functional simplicity over complex features
- Warm, professional tone
- Systems that can be maintained conversationally via AI
- Direct links over embedded dashboards
- Mobile-friendly design

## Commands
```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Start production server
vercel         # Deploy to Vercel
```

## Environment Variables Needed
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```
