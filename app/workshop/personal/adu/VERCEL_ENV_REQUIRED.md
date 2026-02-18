# Vercel Environment Variables Required

The ADU Cash Flow app requires these environment variables to be set in Vercel:

## Required Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://mqxmvwbzghbzqmeamqtu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xeG12d2J6Z2hienFtZWFtcXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzcyMTksImV4cCI6MjA4Njk1MzIxOX0.ZYArZYLixUyQzMHTHoTLYgaitcIaUvlVJsiYRfGbtNw
```

## How to Add in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add both variables above
4. Make sure they're available for all environments (Production, Preview, Development)
5. Redeploy the app after adding the variables

## Note

These are also in `.env.local` for local development. They are NOT sensitive (they're anon/public keys meant for client-side use).
