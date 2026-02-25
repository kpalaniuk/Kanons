import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center px-6 py-16">

      {/* Branding */}
      <div className="text-center mb-10">
        <a href="/" className="inline-block mb-6">
          <span className="font-display text-2xl text-cream hover:text-terracotta transition-colors">
            Kyle Palaniuk
          </span>
        </a>
        <h1 className="font-display text-3xl text-cream mb-2">Sign in</h1>
        <p className="text-cream/40 text-sm">Workshop &amp; personal tools access</p>
      </div>

      {/* Clerk Sign-In — fully styled to match Kanons */}
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#FFB366',         // terracotta
            colorBackground: '#f8f7f4',      // cream
            colorText: '#0a0a0a',            // midnight
            colorTextSecondary: 'rgba(10,10,10,0.55)',
            colorInputBackground: '#ffffff',
            colorInputText: '#0a0a0a',
            colorNeutral: '#0a0a0a',
            borderRadius: '0.75rem',
            fontFamily: 'Inter, sans-serif',
            fontFamilyButtons: 'Space Grotesk, sans-serif',
            fontSize: '0.9375rem',
          },
          elements: {
            // Card
            card: 'shadow-2xl border-0 rounded-2xl',
            // Hide Clerk's default header (we have our own above)
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            header: 'hidden',
            // Form fields
            formFieldLabel: 'text-midnight font-medium text-sm',
            formFieldInput: 'border border-midnight/15 focus:border-terracotta rounded-xl bg-white text-midnight placeholder:text-midnight/30',
            // Primary button
            formButtonPrimary:
              'bg-midnight hover:bg-ocean text-cream font-display font-medium rounded-xl transition-colors shadow-none',
            // Social buttons (Google etc.)
            socialButtonsBlockButton:
              'border border-midnight/10 bg-white hover:bg-cream text-midnight font-medium rounded-xl transition-colors',
            socialButtonsBlockButtonText: 'font-medium text-midnight',
            // Divider
            dividerLine: 'bg-midnight/10',
            dividerText: 'text-midnight/30 text-xs',
            // Footer (the "Secured by Clerk" bit)
            footer: 'opacity-30 hover:opacity-60 transition-opacity',
            footerActionLink: 'text-ocean hover:text-terracotta',
            // Internal links
            identityPreviewEditButton: 'text-terracotta',
            formResendCodeLink: 'text-terracotta hover:text-ocean',
            // Alerts/errors
            alertText: 'text-midnight text-sm',
            formFieldErrorText: 'text-red-500 text-xs',
          },
        }}
      />

      {/* Back to home */}
      <a
        href="/"
        className="mt-8 text-xs text-cream/25 hover:text-cream/60 transition-colors"
      >
        ← Back to kyle.palaniuk.net
      </a>

    </div>
  )
}
