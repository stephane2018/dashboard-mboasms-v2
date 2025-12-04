import { Moon, Sun1 } from "iconsax-react"
import { Button } from "@/shared/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Read theme from localStorage or fallback to system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null

    let detectedTheme: "light" | "dark"

    if (savedTheme) {
      // Use saved preference
      detectedTheme = savedTheme
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      detectedTheme = prefersDark ? "dark" : "light"
    }

    setTheme(detectedTheme)

    // Apply theme to document
    if (detectedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Listen for system theme changes (only if user hasn't set a preference)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light"
        setTheme(newTheme)
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)

    // Save to localStorage
    localStorage.setItem("theme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      {theme === "light" ? (
        <Sun1 size={20} variant="Bulk" className="text-post-yellow" />
      ) : (
        <Moon size={20} variant="Bulk" className="text-post-green" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
