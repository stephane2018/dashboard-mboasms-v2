"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ArrowLeft2, Sms } from "iconsax-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useT } from "@/core/hooks";
import { API_URL as API_BASE_URL } from "@/core/config/constante";

export default function ForgotPasswordPage() {
  const { resolvedTheme } = useTheme();
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const logoSrc =
    resolvedTheme === "dark"
      ? "/icones/logo-white.svg"
      : "/icones/logo.svg";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(t("auth.forgotPasswordError"));
      }
    } catch {
      // Show success anyway to avoid email enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src={logoSrc} alt="MboaSMS" width={140} height={45} className="h-9 w-auto" />
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <Sms size="28" variant="Bulk" color="currentColor" className="text-emerald-500" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                {t("auth.forgotPasswordSentTitle")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("auth.forgotPasswordSentDesc")}
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mt-4"
              >
                <ArrowLeft2 size="16" color="currentColor" />
                {t("auth.backToLogin")}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-foreground">
                  {t("auth.forgotPassword")}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("auth.forgotPasswordDesc")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-xl"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20"
                >
                  {loading ? t("common.loading") : t("auth.forgotPasswordSubmit")}
                </Button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft2 size="16" color="currentColor" />
                  {t("auth.backToLogin")}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
