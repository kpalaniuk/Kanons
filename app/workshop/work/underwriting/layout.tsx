export default function UnderwritingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Skip the workshop's max-w and padding constraints for full-screen chat
  return <>{children}</>
}
