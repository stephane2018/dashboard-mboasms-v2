"use client"

export function Check({ className = "text-primary" }: { className?: string }) {
  return (
    <div className={`w-5 h-5 rounded-full bg-current/10 flex items-center justify-center mr-3 shrink-0 ${className}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}
