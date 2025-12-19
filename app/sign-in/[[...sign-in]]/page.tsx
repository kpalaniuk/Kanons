import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-sand">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-midnight mb-2">Family Login</h1>
          <p className="text-midnight/60">Sign in to access the family hub</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-cream shadow-lg',
              headerTitle: 'font-display text-midnight',
              headerSubtitle: 'text-midnight/60',
              formButtonPrimary: 'bg-terracotta hover:bg-ocean',
            }
          }}
        />
      </div>
    </div>
  )
}
