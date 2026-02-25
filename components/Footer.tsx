'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const socialLinks = [
  { href: 'https://linkedin.com/in/kylepalaniuk', label: 'LinkedIn' },
  { href: 'https://instagram.com/kyle_theukrainian', label: 'Instagram' },
  // Add more as needed
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  // Hide footer on client portal and underwriting pages
  if (pathname?.startsWith('/clients') || pathname?.startsWith('/underwriting') || pathname?.startsWith('/view/')) return null

  return (
    <footer className="bg-midnight text-cream py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl mb-4">Kyle Palaniuk</h3>
            <p className="text-cream/60 text-sm leading-relaxed">
              Building businesses, bands, and community in San Diego.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-cream/40">
              Navigate
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-cream/70 hover:text-terracotta transition-colors text-sm">
                About
              </Link>
              <Link href="/music" className="text-cream/70 hover:text-terracotta transition-colors text-sm">
                Music
              </Link>
              <Link href="/professional" className="text-cream/70 hover:text-terracotta transition-colors text-sm">
                Professional
              </Link>
              <Link href="/contact" className="text-cream/70 hover:text-terracotta transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-cream/40">
              Connect
            </h4>
            <nav className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 hover:text-terracotta transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="mailto:kyle@palaniuk.net"
                className="text-cream/70 hover:text-terracotta transition-colors text-sm"
              >
                kyle@palaniuk.net
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/40 text-xs">
            © {currentYear} Kyle Palaniuk. San Diego, CA.
          </p>
          <p className="text-cream/40 text-xs">
            Built with 🎺
          </p>
        </div>
      </div>
    </footer>
  )
}
