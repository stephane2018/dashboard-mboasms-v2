"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-purple-300 animate-gradient-xy" />

      {/* Floating circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />

      {/* SVG Wave Animation */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-20"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#ffffff"
          fillOpacity="0.3"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                    M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                    M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </path>
      </svg>

      {/* Additional decorative elements */}
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '4s' }} />
    </div>
  )
}
