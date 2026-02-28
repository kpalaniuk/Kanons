export interface JournalEntry {
  date: string        // display date
  isoDate: string     // for sorting
  time?: string       // optional time context
  location?: string   // where kyle was
  mood?: string       // optional tag
  body: string        // the entry — markdown-ish, preserve voice
}

export const journalEntries: JournalEntry[] = [
  // ── Newest first ──────────────────────────────────────────────────────────

  {
    date: 'February 28, 2026',
    isoDate: '2026-02-28',
    time: 'Late night',
    location: 'Rooftop deck',
    body: `Sitting outside. Stars, moon, sky.

When I think about attention — when I think about remembering and being focused on certain things — I realize how important it is that your attention and your focus are literally your entire existence.

—

Tonight was kind of an accident. Paige had booked a babysitter — Ellie Day, our friend's daughter, earning some money, watching the kids — thinking I had rehearsals. But rehearsal got over at like 6. I came home and realized I had a free night. All I wanted to do was go to bed. But I went out anyway.

I went to support my friend Ryan Barber and the Riches.

I was half into it, half not. Kind of going through the motions. And then the universe just opened a door.

Met some hilarious people. Ended up at another spot — the whole will-we-get-in-or-not thing. Got in. Ran into someone I knew. He was with this other guy — a brand founder, company ambassador for this insane product. AI and coffee making. Wild brand. Turns out Claudia is an influencer for them. We ended up deep in a conversation about AI. Couldn't have scripted it.

—

Our world is just so unpredictable. So amazing.

I love it. I just love being alive. I'm so grateful that I'm here.

That's it — that's really all. It's gratefulness and noticing what's going on. Just noticing the details, making them a thing.

—

I'm grateful for tonight. Grateful for my wife.

*Big pause.*

There's something about her that I just can't explain. I love her so much. It just constantly scares me — the way I love my kids.

I love Meta so much I can't even keep up with it. It's scary.

Bohdi — there's this crazy bond, this whole thing. Hard to even talk about.

I love my family so much.

Okay. I'm gonna stop now. This is just getting boring.

*(It's not boring. None of it is boring.)*`,
  },

  {
    date: 'February 21, 2026',
    isoDate: '2026-02-21',
    time: '8:30–9:00 PM',
    location: 'Home',
    body: `Kids are in bed.

It was a hard day — Bohdi and Meta aren't getting along much right now. But I'm holding it with perspective. I think it's a phase. It'll pass.

The day had real highlights though. Granada House hosted an event — rented the space to Allie, a realtor with a great team I have history with. New potential referral partner. Made some solid connections. Optimistic about working with her team going forward.

Ended the night watching San Diego FC. Second season. Winning 2-0 at halftime against Montreal. Good mood. Winding down. Picking a movie.`,
  },

  {
    date: 'February 15, 2026',
    isoDate: '2026-02-15',
    time: 'Sunday night',
    location: 'Home',
    body: `Kids still up late — no school tomorrow (Presidents' Day). Pickleball will be rained out. Trying to organize a music meetup.

Productive day: booked Cabo flights, cleaned up the task queue, spent time researching Ireland/Scotland trip options.

Spent time thinking about LO Buddy — the vision of bridging the gap between human and CRM. That gap matters.

Big music news: Seth is joining Well Well Well on Rhodes for the Pappy & Harriet's gig. Replacing the backing tracks with live keys. Big deal venue. It's going to be something.`,
  },

  {
    date: 'February 12, 2026',
    isoDate: '2026-02-12',
    time: '~12:34 AM',
    body: `Dear God,

I used to pray out loud with you when I was a kid — with my mom and dad. Then I switched to doing it inside my head. It was a little different, but it still worked. Intent focus was the main thing. Sharing it was another secondary force, I guess — of resonance.

Today was kind of weird. I was presented with a mindset that was a little challenging but higher level. Like a different force, a different energy state. Originally perceived as really uncomfortable. I felt like I was being punished in a way. But I embraced it and took everything I could to just forge forward — to create a path of optimistic success. Just listening a lot. Trying to be open.

Then the next challenge: just getting through it, getting back to normal. But things didn't get back to normal. They kept resonating forward and feedbacking through — into a crux point where I had to really temper my own feelings. To stick with my identity. To respect everybody, especially Paige. To go with my gut and still let everything out.

And then finally it ended with love. Beautiful, just calm resonance.

I'm so grateful for that gift of today.

Thank you for that gift, God. May you bless everybody the same tomorrow. And if I get that gift, I hope I can see it and experience it and thank you.

Good night.`,
  },

  {
    date: 'February 11, 2026',
    isoDate: '2026-02-11',
    time: 'Late night',
    location: 'Home',
    body: `Massive day.

LO Buddy meeting with Brad and Chad crushed it — got the green light to build independently. Jazz rehearsal and Well Well Well rehearsal both went great tonight. Pushed through mental fatigue and brought it anyway.

—

Bohdi made valentines for his friends. Wrote 15 different positive, creative messages. I was blown away by his writing ability and creativity. This feels like a breakthrough moment — he has a real talent for positive expression, for written creativity. That deserves to be nurtured.

Meta — I threw her on the bed and tickled her all night. The best thing for her ever.

—

The most profound thing today wasn't work. It was seeing Bohdi's creativity emerge.

I really need a win right now. I'm pulling hard for it all to come together.

But tonight — the most profound thing of all the stuff we're working on is just that I'm so stoked about Bode.`,
  },
]
