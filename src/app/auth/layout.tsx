import { AnimatedBackground } from "./_components/AnimatedBackground"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="w-full relative z-10">
        {children}
      </div>
    </div>
  )
}
