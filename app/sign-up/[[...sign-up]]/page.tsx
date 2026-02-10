import { redirect } from 'next/navigation'

// Sign-up is disabled — only pre-approved users via Clerk dashboard
export default function SignUpPage() {
  redirect('/sign-in')
}
