# Kyle Palaniuk Personal Site

A Next.js personal website with smooth animations, custom cursor, and private family section.

## Tech Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** (styling)
- **Framer Motion** (animations)
- **Clerk** (authentication for family section)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Clerk
1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your API keys to `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Deploy to Vercel
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel
```

## Connecting Your Domain (kyle.palaniuk.net)

### In Vercel:
1. Go to your project → Settings → Domains
2. Add `kyle.palaniuk.net`
3. Vercel will show you the required DNS records

### In Bluehost:
1. Log into Bluehost → Domains → palaniuk.net → DNS
2. Add a CNAME record:
   - **Host**: `kyle`
   - **Points to**: `cname.vercel-dns.com`
   - **TTL**: 14400 (or leave default)
3. Wait 5-30 minutes for propagation

## Project Structure
```
kyle-site/
├── app/
│   ├── layout.tsx          # Root layout with Clerk provider
│   ├── page.tsx            # Home page
│   ├── about/page.tsx      # About + Community
│   ├── music/page.tsx      # StronGnome, performances
│   ├── professional/page.tsx # Business, services
│   ├── contact/page.tsx    # Contact form/links
│   └── family/             # Protected family section
│       ├── layout.tsx      # Auth wrapper
│       └── page.tsx        # Family hub
├── components/
│   ├── Navigation.tsx      # Animated nav
│   ├── CustomCursor.tsx    # Mouse effect
│   ├── Hero.tsx            # Home hero section
│   ├── SmoothScroll.tsx    # Scroll animations
│   └── Footer.tsx
├── public/                 # Images, assets
└── styles/
    └── globals.css         # Tailwind + custom styles
```

## Customization

### Adding Content
Most content is in the page files under `app/`. Edit directly or use Cursor with Claude to help.

### Changing Colors
Edit the CSS variables in `styles/globals.css` or the Tailwind config.

### Adding Family Members
1. Go to Clerk Dashboard → Users
2. Invite family members via email
3. They'll have access to `/family` routes

---

Built with 🎺 for Kyle Palaniuk
