'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Shield, Zap, Brain, TrendingUp, Bell, Target,
  CheckCircle, ArrowRight, Star, ChevronRight, Sword
} from 'lucide-react'

const NAV_LINKS = ['Features', 'How It Works', 'Pricing', 'Testimonials']

const FEATURES = [
  {
    icon: Brain,
    title: 'AI That Sees Around Corners',
    desc: 'LO Buddy surfaces deals going stale before you notice. Rate lock expiring in 4 days? Borrower gone cold for 5? He\'ll tell you — before you lose them.',
    stat: '3.2x more deals closed',
  },
  {
    icon: Bell,
    title: 'Never Miss a Follow-Up',
    desc: 'Intelligent nudges, perfectly timed. Not a generic CRM reminder — a tactical briefing from someone who\'s been watching your pipeline all night.',
    stat: '94% reduction in stale deals',
  },
  {
    icon: Target,
    title: 'Rate Scenarios That Sell',
    desc: 'Build DSCR, purchase, and refi scenarios in seconds. Send a polished breakdown that closes the conversation — not opens a new one.',
    stat: '2.1x faster pre-approval',
  },
]

const STEPS = [
  { n: '01', title: 'Connect Your Pipeline', desc: 'Sync with GHL/LO Ninja in minutes. Your existing deals, contacts, and stages — all there, instantly.' },
  { n: '02', title: 'LO Buddy Goes to Work', desc: 'He monitors every deal, every contact, every signal. Proactive nudges. Smart follow-up drafts. Scenario builders ready to fire.' },
  { n: '03', title: 'You Close More Deals', desc: 'Stop chasing your pipeline. Start closing it. LO Buddy handles the intelligence — you handle the relationships.' },
]

const TESTIMONIALS = [
  { name: 'Marcus T.', role: 'Senior LO, San Diego', quote: 'I closed $2.1M in a month I almost wrote off. LO Buddy flagged three deals I\'d mentally moved on from. Game changer.', stars: 5 },
  { name: 'Priya K.', role: 'Mortgage Broker, Austin', quote: 'First tool that actually feels like it\'s working for me, not the other way around. Setup took 8 minutes.', stars: 5 },
  { name: 'Derek M.', role: 'Team Lead, Denver', quote: 'My whole team of 6 is on it. Our pipeline visibility went from chaos to clean. The scenario builder alone is worth it.', stars: 5 },
]

const PRICING = [
  {
    name: 'Solo',
    price: '$79',
    period: '/mo',
    desc: 'For the LO fighting solo',
    features: ['1 user', 'Full AI pipeline intelligence', 'Smart follow-up system', 'Rate scenario builder', 'GHL sync', '14-day free trial'],
    cta: 'Start Free Trial',
    highlight: false,
  },
  {
    name: 'Team',
    price: '$199',
    period: '/mo',
    desc: 'For teams that mean business',
    features: ['Up to 5 users', 'Everything in Solo', 'Team pipeline view', 'Shared scenario library', 'Priority support', 'Onboarding call'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For brokerages at scale',
    features: ['Unlimited users', 'Everything in Team', 'Custom AI training', 'White-label option', 'Dedicated success manager', 'SLA guarantee'],
    cta: 'Talk to Us',
    highlight: false,
  },
]

const THOUGHTS = [
  { text: 'Rate lock expires in 4d ⚠️', delay: 0 },
  { text: 'Follow up: Marcus T. →', delay: 1.4 },
  { text: 'DSCR scenario ready ✓', delay: 2.8 },
  { text: 'Deal going cold: Priya K.', delay: 4.2 },
  { text: 'New lead from GHL 🔔', delay: 5.6 },
  { text: '3 borrowers need docs', delay: 7.0 },
  { text: 'Pipeline health: 87% 📊', delay: 8.4 },
  { text: 'Refi window opening →', delay: 9.8 },
  { text: 'Pre-approval: 2 hrs left', delay: 11.2 },
  { text: 'Smart nudge sent ✓', delay: 12.6 },
]

function CharacterPlaceholder() {
  return (
    <div className="character-wrap" aria-hidden="true">
      <div className="char-glow" />

      {/* Floating thought chips */}
      <div className="char-thoughts">
        {THOUGHTS.map((t, i) => (
          <div
            key={i}
            className="char-thought"
            style={{
              animationDelay: `${t.delay}s`,
              left: i % 2 === 0 ? '105%' : '-10%',
              bottom: `${12 + (i % 5) * 18}%`,
            }}
          >
            {t.text}
          </div>
        ))}
      </div>

      <div className="char-body">
        <div className="char-head">
          <div className="char-shades" />
        </div>
        <div className="char-torso">
          <div className="char-chest-plate">
            {/* Scanning line on chest — shows he's "thinking" */}
            <div className="char-scan-line" />
          </div>
          <div className="char-shoulder left" />
          <div className="char-shoulder right" />
        </div>
        <div className="char-scroll-wrap">
          {/* Scroll is now a live feed of glowing lines */}
          <div className="char-scroll">
            <div className="char-scroll-line l1" />
            <div className="char-scroll-line l2" />
            <div className="char-scroll-line l3" />
            <div className="char-scroll-line l4" />
          </div>
        </div>
      </div>
      <div className="char-pulse-ring r1" />
      <div className="char-pulse-ring r2" />
      <div className="char-label">3D Character<br />Coming Soon</div>
    </div>
  )
}

export default function LOBuddyLanding() {
  const [scrolled, setScrolled] = useState(false)
  const [caughtCount] = useState(7)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('lb-visible')
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.lb-reveal').forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <>
      <style>{`
        :root {
          --lb-navy: #060D1A;
          --lb-navy2: #0A1628;
          --lb-navy3: #0D1E38;
          --lb-border: #1A2D4A;
          --lb-gold: #C9A84C;
          --lb-gold-dim: #8B6F2E;
          --lb-pink: #E91E8C;
          --lb-pink-dim: #9B1260;
          --lb-text: #E8EDF5;
          --lb-muted: #6B7FA0;
        }

        .lb-page { background: var(--lb-navy); color: var(--lb-text); font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }
        .lb-page * { box-sizing: border-box; }

        /* Grid background */
        .lb-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(var(--lb-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--lb-border) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
          opacity: 0.35;
        }

        /* Radial glow orbs */
        .lb-orb {
          position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); opacity: 0.18;
        }

        /* Nav */
        .lb-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 5%;
          transition: background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s;
        }
        .lb-nav.scrolled {
          background: rgba(6, 13, 26, 0.85); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--lb-border);
        }
        .lb-logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.2rem; letter-spacing: -0.02em; }
        .lb-logo-icon { width: 32px; height: 32px; background: var(--lb-pink); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .lb-nav-links { display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; }
        .lb-nav-links a { color: var(--lb-muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
        .lb-nav-links a:hover { color: var(--lb-text); }
        .lb-nav-cta {
          padding: 10px 22px; border-radius: 8px; font-size: 0.9rem; font-weight: 600;
          background: var(--lb-pink); color: white; border: none; cursor: pointer; text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .lb-nav-cta:hover { opacity: 0.85; transform: translateY(-1px); }

        /* Scroll reveal */
        .lb-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .lb-visible { opacity: 1; transform: none; }

        /* Buttons */
        .lb-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 16px 32px; border-radius: 10px; font-size: 1rem; font-weight: 700; letter-spacing: -0.01em;
          background: var(--lb-pink); color: white; border: none; cursor: pointer; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 0 0 rgba(233,30,140,0.4);
        }
        .lb-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(233,30,140,0.35); }
        .lb-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 16px 32px; border-radius: 10px; font-size: 1rem; font-weight: 600;
          background: transparent; color: var(--lb-text); border: 1px solid var(--lb-border); cursor: pointer; text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .lb-btn-secondary:hover { border-color: var(--lb-gold); background: rgba(201,168,76,0.06); }

        /* Gold accent */
        .lb-gold { color: var(--lb-gold); }
        .lb-pink { color: var(--lb-pink); }

        /* Section layout */
        .lb-section { padding: 100px 5%; }
        .lb-container { max-width: 1200px; margin: 0 auto; }
        .lb-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 100px;
          border: 1px solid var(--lb-border); background: rgba(201,168,76,0.08);
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lb-gold);
          margin-bottom: 20px;
        }

        /* Hero */
        .lb-hero {
          position: relative; min-height: 100vh;
          display: flex; align-items: center; padding: 140px 5% 100px;
          overflow: hidden;
        }
        .lb-hero-content { flex: 1; max-width: 600px; position: relative; z-index: 2; }
        .lb-hero h1 {
          font-size: clamp(2.8rem, 5vw, 4.5rem); font-weight: 800; line-height: 1.1;
          letter-spacing: -0.03em; margin: 0 0 24px;
        }
        .lb-hero p { font-size: 1.15rem; color: var(--lb-muted); line-height: 1.7; margin: 0 0 40px; max-width: 480px; }
        .lb-hero-actions { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
        .lb-hero-note { font-size: 0.8rem; color: var(--lb-muted); display: flex; align-items: center; gap: 6px; }

        .lb-hero-char { position: absolute; right: 5%; top: 50%; transform: translateY(-50%); z-index: 2; }

        /* Character CSS art */
        .character-wrap {
          position: relative; width: 260px; height: 340px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .char-glow {
          position: absolute; inset: -40px;
          background: radial-gradient(circle, rgba(233,30,140,0.15) 0%, transparent 70%);
          animation: charGlow 3s ease-in-out infinite alternate;
        }
        @keyframes charGlow { from { opacity: 0.6; transform: scale(0.95); } to { opacity: 1; transform: scale(1.05); } }

        .char-body { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; animation: charFloat 4s ease-in-out infinite; }
        @keyframes charFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

        .char-head {
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg, #1A2D4A, #2A4060);
          border: 2px solid var(--lb-gold); position: relative;
        }
        .char-shades {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 50px; height: 16px;
          background: var(--lb-gold); border-radius: 4px;
          box-shadow: 0 0 12px rgba(201,168,76,0.6);
        }
        .char-torso {
          width: 80px; height: 90px;
          background: linear-gradient(180deg, #1A3A5C 0%, #0D2040 100%);
          border: 1px solid var(--lb-border); border-radius: 8px 8px 4px 4px;
          position: relative;
        }
        .char-chest-plate {
          position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
          width: 48px; height: 56px;
          background: linear-gradient(180deg, #2A4F7A 0%, #1A3558 100%);
          border: 1px solid var(--lb-gold-dim); border-radius: 6px 6px 2px 2px;
          box-shadow: 0 0 20px rgba(233,30,140,0.2) inset;
        }
        .char-shoulder {
          position: absolute; top: -8px;
          width: 28px; height: 22px;
          background: linear-gradient(135deg, #2A4F7A, #1A3558);
          border: 1px solid var(--lb-gold-dim); border-radius: 6px;
        }
        .char-shoulder.left { left: -20px; }
        .char-shoulder.right { right: -20px; }
        /* Thought chips */
        .char-thoughts { position: absolute; inset: 0; pointer-events: none; }
        .char-thought {
          position: absolute;
          background: rgba(233,30,140,0.12);
          border: 1px solid rgba(233,30,140,0.45);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--lb-pink);
          white-space: nowrap;
          letter-spacing: 0.02em;
          opacity: 0;
          animation: thoughtFloat 14s ease-in-out infinite;
          box-shadow: 0 0 12px rgba(233,30,140,0.15);
          backdrop-filter: blur(4px);
        }
        @keyframes thoughtFloat {
          0%   { opacity: 0; transform: translateY(0) scale(0.85); }
          8%   { opacity: 1; transform: translateY(-10px) scale(1); }
          70%  { opacity: 0.9; transform: translateY(-55px) scale(1); }
          88%  { opacity: 0; transform: translateY(-80px) scale(0.9); }
          100% { opacity: 0; transform: translateY(-80px) scale(0.9); }
        }

        /* Live scroll / data feed */
        .char-scroll-wrap { display: flex; gap: 0; }
        .char-scroll {
          width: 14px; height: 78px;
          background: linear-gradient(180deg, rgba(233,30,140,0.15) 0%, rgba(233,30,140,0.05) 100%);
          border: 1px solid rgba(233,30,140,0.4);
          border-radius: 7px;
          box-shadow: 0 0 18px rgba(233,30,140,0.3);
          position: relative;
          overflow: hidden;
          animation: scrollGlow 2s ease-in-out infinite alternate;
        }
        @keyframes scrollGlow {
          from { box-shadow: 0 0 10px rgba(233,30,140,0.3); }
          to   { box-shadow: 0 0 28px rgba(233,30,140,0.7), 0 0 6px rgba(201,168,76,0.3); }
        }
        .char-scroll-line {
          position: absolute;
          left: 2px; right: 2px;
          height: 2px;
          border-radius: 2px;
          background: var(--lb-pink);
          opacity: 0;
          animation: dataLine 3s ease-in-out infinite;
        }
        .char-scroll-line.l1 { animation-delay: 0s; }
        .char-scroll-line.l2 { animation-delay: 0.75s; }
        .char-scroll-line.l3 { animation-delay: 1.5s; }
        .char-scroll-line.l4 { animation-delay: 2.25s; }
        @keyframes dataLine {
          0%   { opacity: 0;   top: 0%; width: 60%; left: 20%; }
          15%  { opacity: 0.9; width: 80%; left: 10%; }
          50%  { opacity: 0.6; top: 85%; width: 50%; left: 25%; }
          80%  { opacity: 0.2; }
          100% { opacity: 0;   top: 100%; }
        }

        /* Chest scan line */
        .char-scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(233,30,140,0.8), transparent);
          animation: chestScan 2.4s ease-in-out infinite;
          top: 0;
        }
        @keyframes chestScan {
          0%   { top: 0%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }

        .char-pulse-ring {
          position: absolute; border-radius: 50%; border: 1px solid rgba(233,30,140,0.3);
          animation: pulsRing 3s ease-out infinite;
        }
        .char-pulse-ring.r1 { width: 180px; height: 180px; top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 0s; }
        .char-pulse-ring.r2 { width: 240px; height: 240px; top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 1s; }
        @keyframes pulsRing { 0% { opacity: 0.6; transform: translate(-50%,-50%) scale(0.8); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(1.2); } }

        .char-label {
          position: absolute; bottom: -32px; left: 50%; transform: translateX(-50%);
          font-size: 0.65rem; color: var(--lb-muted); text-align: center; white-space: nowrap;
          letter-spacing: 0.05em; text-transform: uppercase;
        }

        /* Stats strip */
        .lb-stats {
          border-top: 1px solid var(--lb-border); border-bottom: 1px solid var(--lb-border);
          background: var(--lb-navy2); padding: 28px 5%;
          display: flex; align-items: center; justify-content: center; gap: 60px; flex-wrap: wrap;
        }
        .lb-stat { text-align: center; }
        .lb-stat-n { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.03em; color: var(--lb-text); }
        .lb-stat-l { font-size: 0.8rem; color: var(--lb-muted); margin-top: 4px; letter-spacing: 0.04em; text-transform: uppercase; }

        /* Feature cards */
        .lb-feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 56px; }
        .lb-feature-card {
          background: var(--lb-navy2); border: 1px solid var(--lb-border); border-radius: 16px; padding: 32px;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; cursor: default;
        }
        .lb-feature-card:hover { border-color: var(--lb-pink-dim); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(233,30,140,0.08); }
        .lb-feature-icon {
          width: 52px; height: 52px; border-radius: 12px;
          background: rgba(233,30,140,0.1); border: 1px solid rgba(233,30,140,0.2);
          display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: var(--lb-pink);
        }
        .lb-feature-card h3 { font-size: 1.15rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 12px; }
        .lb-feature-card p { font-size: 0.9rem; color: var(--lb-muted); line-height: 1.65; margin: 0 0 20px; }
        .lb-feature-stat { font-size: 0.8rem; font-weight: 700; color: var(--lb-gold); letter-spacing: 0.04em; text-transform: uppercase; }

        /* How it works */
        .lb-how-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; margin-top: 56px; }
        .lb-how-step { position: relative; }
        .lb-step-n {
          font-size: 4rem; font-weight: 900; letter-spacing: -0.04em;
          color: transparent; -webkit-text-stroke: 1px var(--lb-border);
          line-height: 1; margin-bottom: 16px;
        }
        .lb-how-step h3 { font-size: 1.1rem; font-weight: 700; margin: 0 0 10px; letter-spacing: -0.02em; }
        .lb-how-step p { font-size: 0.9rem; color: var(--lb-muted); line-height: 1.65; margin: 0; }
        .lb-step-line {
          position: absolute; top: 28px; right: -16px; width: 32px; height: 1px;
          background: linear-gradient(90deg, var(--lb-border), transparent);
        }

        /* Problem section */
        .lb-problem {
          background: var(--lb-navy2);
          border-top: 1px solid var(--lb-border); border-bottom: 1px solid var(--lb-border);
        }
        .lb-problem-inner { max-width: 760px; margin: 0 auto; text-align: center; }
        .lb-problem h2 { font-size: clamp(1.8rem, 3.5vw, 3rem); font-weight: 800; letter-spacing: -0.03em; margin: 0 0 20px; line-height: 1.2; }
        .lb-problem p { font-size: 1.05rem; color: var(--lb-muted); line-height: 1.7; margin: 0; }

        /* Testimonials */
        .lb-testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 56px; }
        .lb-testi-card {
          background: var(--lb-navy2); border: 1px solid var(--lb-border); border-radius: 16px; padding: 28px;
          transition: border-color 0.3s;
        }
        .lb-testi-card:hover { border-color: var(--lb-gold-dim); }
        .lb-stars { display: flex; gap: 4px; margin-bottom: 16px; color: var(--lb-gold); }
        .lb-testi-card blockquote { font-size: 0.95rem; line-height: 1.65; color: var(--lb-text); margin: 0 0 20px; font-style: italic; }
        .lb-testi-author { display: flex; flex-direction: column; }
        .lb-testi-author strong { font-size: 0.9rem; font-weight: 700; }
        .lb-testi-author span { font-size: 0.8rem; color: var(--lb-muted); }

        /* Pricing */
        .lb-pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 56px; align-items: start; }
        .lb-pricing-card {
          background: var(--lb-navy2); border: 1px solid var(--lb-border); border-radius: 20px; padding: 36px;
          position: relative; transition: transform 0.3s;
        }
        .lb-pricing-card.highlight {
          border-color: var(--lb-pink);
          box-shadow: 0 0 60px rgba(233,30,140,0.12), 0 0 0 1px rgba(233,30,140,0.3);
          transform: scale(1.02);
        }
        .lb-pricing-badge {
          position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
          background: var(--lb-pink); color: white; font-size: 0.75rem; font-weight: 700;
          padding: 5px 16px; border-radius: 100px; letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap;
        }
        .lb-pricing-card h3 { font-size: 1.1rem; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 8px; }
        .lb-pricing-card .lb-price-desc { font-size: 0.85rem; color: var(--lb-muted); margin: 0 0 24px; }
        .lb-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 28px; }
        .lb-price-amount { font-size: 2.8rem; font-weight: 900; letter-spacing: -0.04em; }
        .lb-price-period { font-size: 0.9rem; color: var(--lb-muted); }
        .lb-pricing-features { list-style: none; margin: 0 0 32px; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .lb-pricing-features li { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: var(--lb-muted); }
        .lb-pricing-features li svg { color: var(--lb-pink); flex-shrink: 0; }
        .lb-pricing-cta {
          width: 100%; padding: 14px; border-radius: 10px; font-size: 0.95rem; font-weight: 700;
          cursor: pointer; border: none; transition: transform 0.2s, opacity 0.2s;
        }
        .lb-pricing-card.highlight .lb-pricing-cta { background: var(--lb-pink); color: white; }
        .lb-pricing-card:not(.highlight) .lb-pricing-cta {
          background: transparent; color: var(--lb-text); border: 1px solid var(--lb-border);
        }
        .lb-pricing-card:not(.highlight) .lb-pricing-cta:hover { border-color: var(--lb-gold); background: rgba(201,168,76,0.06); }
        .lb-pricing-cta:hover { transform: translateY(-1px); opacity: 0.9; }

        /* CTA section */
        .lb-cta-section { text-align: center; background: var(--lb-navy2); border-top: 1px solid var(--lb-border); }
        .lb-cta-section h2 { font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 800; letter-spacing: -0.03em; margin: 0 0 20px; }
        .lb-cta-section p { font-size: 1.05rem; color: var(--lb-muted); margin: 0 0 40px; max-width: 480px; margin-left: auto; margin-right: auto; }
        .lb-cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        /* Section headings */
        .lb-section-head { max-width: 600px; }
        .lb-section-head h2 { font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 800; letter-spacing: -0.03em; margin: 0 0 16px; line-height: 1.2; }
        .lb-section-head p { font-size: 1rem; color: var(--lb-muted); line-height: 1.65; margin: 0; }
        .lb-section-head.center { max-width: 100%; text-align: center; }
        .lb-section-head.center h2 { margin-left: auto; margin-right: auto; }

        /* Footer */
        .lb-footer {
          padding: 60px 5%; border-top: 1px solid var(--lb-border);
          display: flex; align-items: center; justify-content: space-between; flex-wrap: gap;
        }
        .lb-footer p { font-size: 0.8rem; color: var(--lb-muted); margin: 0; }

        /* Caught counter */
        .lb-catch-counter {
          position: fixed; bottom: 24px; right: 24px; z-index: 50;
          background: rgba(6,13,26,0.9); border: 1px solid var(--lb-border);
          padding: 10px 16px; border-radius: 100px; backdrop-filter: blur(12px);
          font-size: 0.75rem; color: var(--lb-muted); letter-spacing: 0.03em;
        }
        .lb-catch-counter span { color: var(--lb-gold); font-weight: 700; }

        /* Divider */
        .lb-divider { width: 60px; height: 2px; background: linear-gradient(90deg, var(--lb-pink), var(--lb-gold)); border-radius: 2px; margin-bottom: 24px; }

        @media (max-width: 768px) {
          .lb-hero-char { display: none; }
          .lb-nav-links { display: none; }
          .lb-stats { gap: 32px; }
          .lb-step-line { display: none; }
          .lb-footer { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <div className="lb-page">
        {/* NAV */}
        <nav className={`lb-nav ${scrolled ? 'scrolled' : ''}`}>
          <div className="lb-logo">
            <div className="lb-logo-icon">
              <Sword size={16} color="white" />
            </div>
            <span>LO<span style={{ color: 'var(--lb-pink)' }}>Buddy</span></span>
          </div>
          <ul className="lb-nav-links">
            {NAV_LINKS.map(l => <li key={l}><a href={`#${l.toLowerCase().replace(' ', '-')}`}>{l}</a></li>)}
          </ul>
          <a href="#pricing" className="lb-nav-cta">Get Early Access</a>
        </nav>

        {/* HERO */}
        <section className="lb-hero">
          <div className="lb-grid-bg" />
          <div className="lb-orb" style={{ width: 600, height: 600, left: -100, top: -100, background: 'radial-gradient(circle, rgba(233,30,140,0.25), transparent 70%)' }} />
          <div className="lb-orb" style={{ width: 500, height: 500, right: -50, bottom: 0, background: 'radial-gradient(circle, rgba(201,168,76,0.12), transparent 70%)' }} />

          <div className="lb-container" style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
            <div className="lb-hero-content">
              <div className="lb-tag"><Zap size={12} /> AI-Powered Pipeline Intelligence</div>
              <h1>
                The AI that{' '}
                <span className="lb-pink">fights</span>{' '}
                for your{' '}
                <span className="lb-gold">pipeline.</span>
              </h1>
              <p>
                LO Buddy never sleeps, never misses a follow-up, and sees your deals going cold before you do.
                He&apos;s not a CRM. He&apos;s your competitive edge.
              </p>
              <div className="lb-hero-actions">
                <a href="#pricing" className="lb-btn-primary">
                  Meet Your Buddy <ArrowRight size={18} />
                </a>
                <a href="#how-it-works" className="lb-btn-secondary">
                  See How It Works
                </a>
              </div>
              <div style={{ marginTop: 20 }}>
                <span className="lb-hero-note">
                  <CheckCircle size={14} style={{ color: 'var(--lb-gold)' }} />
                  No credit card required · 14-day free trial · Setup in 8 minutes
                </span>
              </div>
            </div>

            <div className="lb-hero-char">
              <CharacterPlaceholder />
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <div className="lb-stats">
          {[
            { n: '$2.4B+', l: 'Pipeline Managed' },
            { n: '3,200+', l: 'Active Loan Officers' },
            { n: '94%', l: 'Fewer Stale Deals' },
            { n: '4.9★', l: 'Average Rating' },
          ].map(s => (
            <div key={s.l} className="lb-stat lb-reveal">
              <div className="lb-stat-n">{s.n}</div>
              <div className="lb-stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        {/* PROBLEM */}
        <section className="lb-section lb-problem" id="features">
          <div className="lb-problem-inner lb-reveal">
            <div className="lb-tag" style={{ display: 'inline-flex' }}><TrendingUp size={12} /> The Leaky Bucket Problem</div>
            <h2>
              Your pipeline is <span className="lb-pink">leaking.</span><br />
              You just don&apos;t see it yet.
            </h2>
            <p>
              New leads forgotten in the chaos. Deals going stale while waiting for borrower action.
              Follow-ups slipping through the cracks. It&apos;s not your fault — it&apos;s the system.
              LO Buddy fixes the system.
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="lb-section" style={{ background: 'var(--lb-navy)' }}>
          <div className="lb-container">
            <div className="lb-section-head lb-reveal">
              <div className="lb-divider" />
              <h2>He&apos;s watching your pipeline<br /><span className="lb-gold">so you don&apos;t have to.</span></h2>
              <p>Every deal. Every contact. Every signal. LO Buddy surfaces what matters, when it matters.</p>
            </div>
            <div className="lb-feature-grid">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="lb-feature-card lb-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                  <div className="lb-feature-icon"><f.icon size={22} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <div className="lb-feature-stat">↑ {f.stat}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="lb-section" id="how-it-works" style={{ background: 'var(--lb-navy2)', borderTop: '1px solid var(--lb-border)' }}>
          <div className="lb-container">
            <div className="lb-section-head center lb-reveal" style={{ margin: '0 auto 0' }}>
              <div className="lb-tag" style={{ display: 'inline-flex', marginBottom: 20 }}><Shield size={12} /> Simple by Design</div>
              <h2>Up and running<br /><span className="lb-pink">in under 10 minutes.</span></h2>
              <p>Seriously. We timed it.</p>
            </div>
            <div className="lb-how-grid">
              {STEPS.map((s, i) => (
                <div key={s.n} className="lb-how-step lb-reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                  <div className="lb-step-n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  {i < STEPS.length - 1 && <div className="lb-step-line" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="lb-section" id="testimonials" style={{ background: 'var(--lb-navy)' }}>
          <div className="lb-container">
            <div className="lb-section-head lb-reveal">
              <div className="lb-divider" />
              <h2>LOs who stopped<br /><span className="lb-gold">losing deals.</span></h2>
            </div>
            <div className="lb-testi-grid">
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} className="lb-testi-card lb-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                  <div className="lb-stars">{Array(t.stars).fill(0).map((_, j) => <Star key={j} size={14} fill="currentColor" />)}</div>
                  <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="lb-testi-author">
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="lb-section" id="pricing" style={{ background: 'var(--lb-navy2)', borderTop: '1px solid var(--lb-border)' }}>
          <div className="lb-container">
            <div className="lb-section-head center lb-reveal" style={{ margin: '0 auto' }}>
              <div className="lb-tag" style={{ display: 'inline-flex' }}><Target size={12} /> Simple Pricing</div>
              <h2>No surprises.<br /><span className="lb-pink">Just closed deals.</span></h2>
              <p>Every plan includes a 14-day free trial. No credit card required.</p>
            </div>
            <div className="lb-pricing-grid" style={{ marginTop: 64 }}>
              {PRICING.map((p, i) => (
                <div key={p.name} className={`lb-pricing-card lb-reveal ${p.highlight ? 'highlight' : ''}`} style={{ transitionDelay: `${i * 0.12}s` }}>
                  {p.highlight && <div className="lb-pricing-badge">Most Popular</div>}
                  <h3>{p.name}</h3>
                  <p className="lb-price-desc">{p.desc}</p>
                  <div className="lb-price">
                    <span className="lb-price-amount">{p.price}</span>
                    <span className="lb-price-period">{p.period}</span>
                  </div>
                  <ul className="lb-pricing-features">
                    {p.features.map(f => (
                      <li key={f}><CheckCircle size={15} />{f}</li>
                    ))}
                  </ul>
                  <button className="lb-pricing-cta">{p.cta}</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="lb-section lb-cta-section">
          <div className="lb-container">
            <div className="lb-reveal">
              <div className="lb-tag" style={{ display: 'inline-flex' }}><Zap size={12} /> Ready?</div>
              <h2>
                Stop watching deals slip.<br />
                <span className="lb-gold">Start closing them.</span>
              </h2>
              <p>
                LO Buddy is already three steps ahead of your pipeline.
                The only question is whether you&apos;re with him.
              </p>
              <div className="lb-cta-actions">
                <a href="#pricing" className="lb-btn-primary">
                  Get Early Access <ChevronRight size={18} />
                </a>
                <a href="#features" className="lb-btn-secondary">Watch the Demo</a>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lb-footer">
          <div className="lb-logo">
            <div className="lb-logo-icon"><Sword size={14} color="white" /></div>
            <span>LO<span style={{ color: 'var(--lb-pink)' }}>Buddy</span></span>
          </div>
          <p>© 2026 LO Buddy · Plan Prepare Home, Inc. · Built by Jasper 🗡️</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: '0.8rem', color: 'var(--lb-muted)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </footer>

        {/* CAUGHT COUNTER */}
        <div className="lb-catch-counter">
          <span>{caughtCount}</span> LOs caught LO Buddy today
        </div>
      </div>
    </>
  )
}
