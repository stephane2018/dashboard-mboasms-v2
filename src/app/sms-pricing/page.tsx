"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, SearchNormal1, Global, Wallet } from "iconsax-react"
import { Button } from "@/shared/ui/button"
import { useSmsCountryPrices } from "@/core/hooks/useSmsCountryPrices"
import { useAuthContext } from "@/core/providers/auth-provider"
import { useUserStore } from "@/core/stores/userStore"
import { createInternationalRecharge } from "@/core/services/recharge.service"
import { InternationalRechargeModal, type InternationalRechargeFormData } from "@/shared/common/international-recharge-modal"
import Header from "@/shared/landing_components/components/layout/Header"
import Footer from "@/shared/landing_components/components/layout/Footer"
import { toast } from "sonner"

function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

const PAGE_SIZE = 250

export default function PricingPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const [isRechargeOpen, setIsRechargeOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<{ countryName: string; countryCode: string; pricePerSms: number } | null>(null)

  const router = useRouter()
  const { isConnected } = useAuthContext()
  const user = useUserStore((state) => state.user)
  const { pricesQuery } = useSmsCountryPrices({ page, size: PAGE_SIZE })
  const { data: rawData, isLoading } = pricesQuery
  const countries = Array.isArray(rawData) ? rawData : (rawData as any)?.content ?? []
  const totalElements: number = (rawData as any)?.totalElements ?? countries.length
  const totalPages: number = (rawData as any)?.totalPages ?? Math.ceil(totalElements / PAGE_SIZE)

  const filtered = useMemo(() => {
    if (!search) return countries
    return countries.filter(
      (c: any) =>
        c.countryName.toLowerCase().includes(search.toLowerCase()) ||
        c.countryCode.toLowerCase().includes(search.toLowerCase())
    )
  }, [countries, search])

  const handleCountryClick = (country: any) => {
    if (!isConnected) {
      router.push("/auth/login")
      return
    }

    setSelectedCountry({
      countryName: country.countryName,
      countryCode: country.countryCode,
      pricePerSms: country.pricePerSms,
    })
    setIsRechargeOpen(true)
  }

  const handleRechargeSubmit = async (data: InternationalRechargeFormData) => {
    if (!user?.companyId) {
      toast.error("Erreur", {
        description: "ID entreprise manquant. Veuillez compléter votre profil.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createInternationalRecharge({
        qteMessage: data.qteMessage,
        amount: data.amount,
        enterpriseId: user.companyId,
        paymentMethod: data.paymentMethod,
        debitPhoneNumber: data.debitPhoneNumber,
        debitBankAccountNumber: data.debitBankAccountNumber,
        couponCode: data.couponCode,
      })
      toast.success("Recharge internationale créée", {
        description: "Votre demande de recharge a été créée avec succès.",
      })
    } catch (error: any) {
      toast.error("Erreur", {
        description: error?.message || "Une erreur s'est produite lors de la recharge.",
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />

      <section className="py-12 md:py-20 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-6xl">
          {/* Back + Header */}
          <div className="mb-10">
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size="16" color="currentColor" />
              Retour
            </Link>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                  <Global size="16" color="currentColor" variant="Bold" />
                  Tarifs internationaux
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Prix SMS par pays
                </h1>
                <p className="text-muted-foreground text-lg">
                  {totalElements} pays disponibles avec des tarifs compétitifs
                </p>
              </div>

              {/* Search */}
              <div className="w-full md:w-80">
                <div className="relative">
                  <SearchNormal1 size="18" color="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un pays..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Country Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-10">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-card border border-border rounded-xl h-20"></div>
                </div>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((country: any) => (
                <div
                  key={country.id}
                  className="group flex flex-col gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{countryCodeToFlag(country.countryCode)}</span>
                      <div>
                        <div className="font-medium text-foreground text-sm">{country.countryName}</div>
                        <div className="text-xs text-muted-foreground">{country.countryCode}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary text-lg">{country.pricePerSms}</div>
                      <div className="text-xs text-muted-foreground">/ SMS</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full rounded-lg text-xs"
                    onClick={() => handleCountryClick(country)}
                  >
                    <Wallet size="14" color="currentColor" className="mr-1.5" />
                    Recharger
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Aucun pays trouvé</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Précédent
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                      page === i
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* International Recharge Modal */}
      <InternationalRechargeModal
        isOpen={isRechargeOpen}
        onClose={() => {
          setIsRechargeOpen(false)
          setSelectedCountry(null)
        }}
        onSubmit={handleRechargeSubmit}
        isLoading={isSubmitting}
        selectedCountry={selectedCountry}
      />

      <Footer />
    </div>
  )
}
