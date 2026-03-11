"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, SearchNormal1, Global } from "iconsax-react"
import { Button } from "@/shared/ui/button"
import { useSmsCountryPrices } from "@/core/hooks/useSmsCountryPrices"
import Header from "@/shared/landing_components/components/layout/Header"
import Footer from "@/shared/landing_components/components/layout/Footer"

function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

export default function PricingPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const pageSize = 20
  const { pricesQuery } = useSmsCountryPrices()
  const { data: allCountries, isLoading } = pricesQuery

  const filtered = useMemo(() => {
    const countries = allCountries || []
    if (!search) return countries
    return countries.filter(
      (c) =>
        c.countryName.toLowerCase().includes(search.toLowerCase()) ||
        c.countryCode.toLowerCase().includes(search.toLowerCase())
    )
  }, [allCountries, search])

  const totalElements = filtered.length
  const totalPages = Math.ceil(totalElements / pageSize)
  const paginatedCountries = filtered.slice(page * pageSize, (page + 1) * pageSize)

  // Reset page when search changes
  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
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
                    onChange={(e) => handleSearch(e.target.value)}
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
            ) : paginatedCountries.length > 0 ? (
              paginatedCountries.map((country) => (
                <div
                  key={country.id}
                  className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
                >
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
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i;
                  } else if (page < 3) {
                    pageNum = i;
                  } else if (page > totalPages - 4) {
                    pageNum = totalPages - 7 + i;
                  } else {
                    pageNum = page - 3 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                        page === pageNum
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
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

      <Footer />
    </div>
  )
}
