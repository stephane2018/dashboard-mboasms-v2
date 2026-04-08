"use client"

import { useState, useEffect } from "react"
import { useT } from "@/core/hooks"
import { motion, AnimatePresence } from "framer-motion"
import { Shield } from "lucide-react"
import Link from "next/link"

const STORAGE_KEY = "mboasms_cookies_accepted"

export function CookieConsent() {
  const { t } = useT()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY)
    if (!accepted) {
      // Show after welcome modal has had time to display
      const timer = setTimeout(() => setIsVisible(true), 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    setIsVisible(false)
    localStorage.setItem(STORAGE_KEY, "true")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[90]"
        >
          <div className="bg-card border border-border/60 rounded-2xl shadow-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {t('cookies.title')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {t('cookies.description')}{" "}
                  <Link href="/conditions" className="text-primary hover:underline font-medium">
                    {t('cookies.privacyPolicy')}
                  </Link>
                  . {t('cookies.question')}{" "}
                  <a
                    href="mailto:support@mboasms.com"
                    className="text-primary hover:underline font-medium"
                  >
                    support@mboasms.com
                  </a>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={accept}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    {t('cookies.accept')}
                  </button>
                  <button
                    onClick={accept}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
                  >
                    {t('cookies.refuse')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
